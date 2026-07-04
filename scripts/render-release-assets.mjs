import { readFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const outputDirectory = process.env.SITE_OUTPUT_DIR || 'docs';
const assetsDirectory = path.resolve(process.cwd(), outputDirectory, 'assets');
await mkdir(assetsDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function renderSvg(sourceName, outputName, width, height) {
  const svg = await readFile(path.join(assetsDirectory, sourceName), 'utf8');
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden}svg{display:block;width:${width}px;height:${height}px}</style></head><body>${svg}</body></html>`);
  await page.evaluate(() => document.fonts?.ready);
  await page.locator('svg').screenshot({ path: path.join(assetsDirectory, outputName), omitBackground: false });
  await page.close();
}

try {
  await renderSvg('social-share.svg', 'social-share.png', 1200, 630);
  await renderSvg('favicon.svg', 'favicon-512.png', 512, 512);
  await renderSvg('favicon.svg', 'apple-touch-icon.png', 180, 180);
  await renderSvg('favicon.svg', 'favicon-32x32.png', 32, 32);
  await renderSvg('favicon.svg', 'favicon-16x16.png', 16, 16);
} finally {
  await browser.close();
}

const outputs = [
  'social-share.png',
  'favicon-512.png',
  'apple-touch-icon.png',
  'favicon-32x32.png',
  'favicon-16x16.png',
];

const files = [];
for (const filename of outputs) {
  const metadata = await stat(path.join(assetsDirectory, filename));
  files.push({ filename, bytes: metadata.size });
}

console.log(JSON.stringify({ status: 'passed', output_directory: outputDirectory, files }, null, 2));
