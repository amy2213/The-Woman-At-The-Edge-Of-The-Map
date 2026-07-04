import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawBase = process.env.SITE_BASE_URL || process.argv[2];
if (!rawBase) throw new Error('SITE_BASE_URL is required.');
const baseUrl = new URL(rawBase.endsWith('/') ? rawBase : `${rawBase}/`);
const checks = [
  { name: 'landing', path: '', markers: ['The Woman at the Edge of the Map', 'summary_large_image', 'assets/social-share.png'] },
  { name: 'map', path: 'map/', markers: ['Seven destinations.', 'One unfinished map.'] },
  { name: 'section', path: 'sections/part-i-the-edge/', markers: ['The Edge', 'The Quilt'] },
  { name: 'poem', path: 'read/part-i-the-edge/the-edge-lived/', markers: ['The Edge, Lived', 'Canonical position 1 of 94'] },
  { name: 'prose', path: 'read/part-i-the-edge/the-quilt/', markers: ['The Quilt', 'Canonical position 8 of 94'] },
  { name: 'coda', path: 'read/coda/the-ordinary-miracle/', markers: ['The Ordinary Miracle', 'Canonical position 94 of 94'] },
  { name: 'closing', path: 'closing/', markers: ['The map stays open.', 'Return home'] },
  { name: 'robots', path: 'robots.txt', markers: ['Sitemap:', `${baseUrl.href}sitemap.xml`] },
  { name: 'sitemap', path: 'sitemap.xml', markers: [baseUrl.href, `${baseUrl.href}map/`] },
  { name: '404-file', path: '404.html', markers: ['The map lost this coordinate.', 'Return to the map'] },
];
const assets = [
  { name: 'base-css', path: 'assets/base.css', type: 'text/css' },
  { name: 'favicon-svg', path: 'assets/favicon.svg', type: 'image/svg+xml' },
  { name: 'favicon-32', path: 'assets/favicon-32x32.png', type: 'image/png' },
  { name: 'apple-touch-icon', path: 'assets/apple-touch-icon.png', type: 'image/png' },
  { name: 'social-share', path: 'assets/social-share.png', type: 'image/png' },
];
const results = [];
const failures = [];

async function fetchChecked(url) {
  const response = await fetch(url, { redirect: 'follow' });
  return response;
}

for (const check of checks) {
  const url = new URL(check.path, baseUrl);
  try {
    const response = await fetchChecked(url);
    const body = await response.text();
    results.push({ name: check.name, url: url.href, status: response.status, bytes: Buffer.byteLength(body) });
    if (!response.ok) failures.push(`${check.name}: HTTP ${response.status}`);
    for (const marker of check.markers) {
      if (!body.includes(marker)) failures.push(`${check.name}: missing ${marker}`);
    }
  } catch (error) {
    failures.push(`${check.name}: ${error.message}`);
  }
}

for (const asset of assets) {
  const url = new URL(asset.path, baseUrl);
  try {
    const response = await fetchChecked(url);
    const bytes = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || '';
    results.push({ name: asset.name, url: url.href, status: response.status, contentType, bytes: bytes.length });
    if (!response.ok) failures.push(`${asset.name}: HTTP ${response.status}`);
    if (!contentType.includes(asset.type)) failures.push(`${asset.name}: content type ${contentType || '(missing)'}`);
    if (!bytes.length) failures.push(`${asset.name}: empty response`);
  } catch (error) {
    failures.push(`${asset.name}: ${error.message}`);
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl: baseUrl.href,
  status: failures.length ? 'failed' : 'passed',
  totalChecks: results.length,
  failures,
  results,
};
await mkdir(path.join(process.cwd(), 'verification'), { recursive: true });
await writeFile(path.join(process.cwd(), 'verification', 'live-smoke-test.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: report.status, totalChecks: report.totalChecks, failures }, null, 2));
if (failures.length) process.exit(1);
