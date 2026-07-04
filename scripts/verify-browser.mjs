import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const root = process.cwd();
const outputDirectory = process.env.SITE_OUTPUT_DIR || 'docs';
const siteRoot = path.join(root, outputDirectory);
const reportDir = path.join(root, 'verification');
const screenshotDir = path.join(reportDir, 'screenshots');
await mkdir(screenshotDir, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    let relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    if (!relative || relative.endsWith('/')) relative += 'index.html';
    const candidate = path.resolve(siteRoot, relative);
    if (!candidate.startsWith(siteRoot)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const candidateStat = await stat(candidate);
    if (!candidateStat.isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'content-type': MIME[path.extname(candidate)] ?? 'application/octet-stream' });
    createReadStream(candidate).pipe(response);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Not found');
  }
});

await new Promise((resolve) => server.listen(4173, '127.0.0.1', resolve));
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');

const pages = [
  { name: 'landing', path: '/' },
  { name: 'map', path: '/map/' },
  { name: 'section-edge', path: '/sections/part-i-the-edge/' },
  { name: 'poem', path: '/read/part-i-the-edge/the-edge-lived/' },
  { name: 'prose', path: '/read/part-i-the-edge/the-quilt/' },
  { name: 'archive', path: '/read/part-iv-the-myth/file-blackbox-5a/' },
  { name: 'letter', path: '/read/part-vi-personal-letters-closings-and-artifacts/to-my-future-self/' },
  { name: 'coda', path: '/read/coda/the-ordinary-miracle/' },
  { name: 'closing', path: '/closing/' },
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const browser = await chromium.launch({ headless: true });
const results = [];
const failures = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    for (const target of pages) {
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('pageerror', (error) => consoleErrors.push(error.message));

      const response = await page.goto(`http://127.0.0.1:4173${target.path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(350);
      await page.evaluate(() => document.fonts?.ready);
      await page.addScriptTag({ content: axeSource });

      const structural = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const main = document.querySelector('main#main');
        const skip = document.querySelector('.skip-link');
        const canonical = document.querySelector('link[rel="canonical"]');
        const favicon = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
        const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
        const ogImage = document.querySelector('meta[property="og:image"]');
        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        const twitterCard = document.querySelector('meta[name="twitter:card"]');
        const emptyLinks = [...document.querySelectorAll('a')].filter((link) => !link.textContent.trim() && !link.getAttribute('aria-label')).length;
        return {
          documentTitle: document.title,
          h1: h1?.textContent.trim() ?? '',
          hasMain: Boolean(main),
          skipTargetExists: Boolean(skip && document.querySelector(skip.getAttribute('href'))),
          canonicalUrl: canonical?.href ?? '',
          faviconUrl: favicon?.href ?? '',
          appleTouchIconUrl: appleTouchIcon?.href ?? '',
          ogImageUrl: ogImage?.content ?? '',
          twitterImageUrl: twitterImage?.content ?? '',
          twitterCard: twitterCard?.content ?? '',
          emptyLinks,
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        };
      });

      const axe = await page.evaluate(async () => window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
      }));
      const materialViolations = axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));

      const screenshot = path.join(screenshotDir, `${target.name}-${viewport.name}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });

      await page.keyboard.press('Tab');
      const firstFocus = await page.evaluate(() => {
        const active = document.activeElement;
        if (!active) return null;
        const style = getComputedStyle(active);
        const rect = active.getBoundingClientRect();
        return {
          tag: active.tagName,
          className: active.className,
          text: active.textContent.trim(),
          visible: rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && rect.bottom > 0,
        };
      });

      const record = {
        page: target.name,
        route: target.path,
        viewport: viewport.name,
        status: response?.status() ?? 0,
        structural,
        firstFocus,
        consoleErrors,
        axeViolationCount: axe.violations.length,
        materialAxeViolationCount: materialViolations.length,
        materialAxeViolations: materialViolations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          help: violation.help,
          nodes: violation.nodes.length,
        })),
      };
      results.push(record);

      if (!response?.ok()) failures.push(`${target.name}/${viewport.name}: HTTP ${record.status}`);
      if (!structural.hasMain || !structural.h1) failures.push(`${target.name}/${viewport.name}: missing main or h1`);
      if (!structural.documentTitle) failures.push(`${target.name}/${viewport.name}: document title missing`);
      if (!structural.skipTargetExists) failures.push(`${target.name}/${viewport.name}: skip link target missing`);
      if (!structural.canonicalUrl) failures.push(`${target.name}/${viewport.name}: canonical URL missing`);
      if (!structural.faviconUrl) failures.push(`${target.name}/${viewport.name}: favicon missing`);
      if (!structural.appleTouchIconUrl) failures.push(`${target.name}/${viewport.name}: Apple touch icon missing`);
      if (!structural.ogImageUrl) failures.push(`${target.name}/${viewport.name}: Open Graph image missing`);
      if (!structural.twitterImageUrl) failures.push(`${target.name}/${viewport.name}: Twitter image missing`);
      if (structural.twitterCard !== 'summary_large_image') failures.push(`${target.name}/${viewport.name}: Twitter card is not summary_large_image`);
      if (structural.emptyLinks) failures.push(`${target.name}/${viewport.name}: ${structural.emptyLinks} empty links`);
      if (structural.horizontalOverflow) failures.push(`${target.name}/${viewport.name}: horizontal overflow ${structural.documentWidth}px > ${structural.viewportWidth}px`);
      if (!firstFocus?.visible || firstFocus.className !== 'skip-link') failures.push(`${target.name}/${viewport.name}: first keyboard focus is not the visible skip link`);
      if (consoleErrors.length) failures.push(`${target.name}/${viewport.name}: ${consoleErrors.length} console errors`);
      if (materialViolations.length) failures.push(`${target.name}/${viewport.name}: ${materialViolations.length} serious/critical axe violations`);

      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const report = {
  generatedAt: new Date().toISOString(),
  status: failures.length ? 'failed' : 'passed',
  outputDirectory,
  testedPages: pages.length,
  testedViewports: viewports.length,
  totalCases: results.length,
  failures,
  results,
};
await writeFile(path.join(reportDir, 'browser-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: report.status, totalCases: report.totalCases, failureCount: failures.length, failures }, null, 2));
if (failures.length) process.exit(1);
