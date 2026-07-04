import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const outputDirectory = process.env.SITE_OUTPUT_DIR || 'docs';
const docs = path.resolve(process.cwd(), outputDirectory);
const manifest = JSON.parse(await readFile(path.join(docs, 'release-manifest.json'), 'utf8'));

const required = [
  '.nojekyll',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'sitemap.txt',
  'release-manifest.json',
  'build-report.json',
  'index.html',
  'assets/favicon.svg',
  'assets/favicon-16x16.png',
  'assets/favicon-32x32.png',
  'assets/favicon-512.png',
  'assets/apple-touch-icon.png',
  'assets/social-share.svg',
  'assets/social-share.png',
];

for (const file of required) await access(path.join(docs, file));

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const candidate = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(candidate));
    else files.push(candidate);
  }
  return files;
}

function pngDimensions(buffer) {
  const signature = buffer.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') throw new Error('Invalid PNG signature');
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function attribute(html, pattern) {
  return html.match(pattern)?.[1]?.trim() ?? '';
}

const allFiles = await walk(docs);
const htmlFiles = allFiles.filter((file) => file.endsWith('.html'));
const failures = [];
const titles = new Map();
const descriptions = new Map();

for (const file of htmlFiles) {
  const relative = path.relative(docs, file);
  const html = await readFile(file, 'utf8');
  const title = attribute(html, /<title>([^<]+)<\/title>/);
  const description = attribute(html, /<meta name="description" content="([^"]*)">/);
  const canonical = attribute(html, /<link rel="canonical" href="([^"]+)">/);
  const ogImage = attribute(html, /<meta property="og:image" content="([^"]+)">/);
  const twitterImage = attribute(html, /<meta name="twitter:image" content="([^"]+)">/);
  const favicon = attribute(html, /<link rel="icon" href="([^"]+)" type="image\/svg\+xml">/);

  if (!title) failures.push(`${relative}: missing title`);
  if (!description) failures.push(`${relative}: missing description`);
  if (!canonical) failures.push(`${relative}: missing canonical URL`);
  if (!ogImage) failures.push(`${relative}: missing Open Graph image`);
  if (!twitterImage) failures.push(`${relative}: missing Twitter image`);
  if (!favicon) failures.push(`${relative}: missing favicon`);

  if (title) {
    const matches = titles.get(title) ?? [];
    matches.push(relative);
    titles.set(title, matches);
  }
  if (description) {
    const matches = descriptions.get(description) ?? [];
    matches.push(relative);
    descriptions.set(description, matches);
  }
}

for (const [title, files] of titles) {
  if (files.length > 1) failures.push(`duplicate title "${title}": ${files.join(', ')}`);
}
for (const [description, files] of descriptions) {
  if (files.length > 1) failures.push(`duplicate description "${description}": ${files.join(', ')}`);
}

const expectedImages = {
  'assets/social-share.png': [1200, 630],
  'assets/favicon-512.png': [512, 512],
  'assets/apple-touch-icon.png': [180, 180],
  'assets/favicon-32x32.png': [32, 32],
  'assets/favicon-16x16.png': [16, 16],
};
const imageDimensions = {};
for (const [file, expected] of Object.entries(expectedImages)) {
  const dimensions = pngDimensions(await readFile(path.join(docs, file)));
  imageDimensions[file] = dimensions;
  if (dimensions.width !== expected[0] || dimensions.height !== expected[1]) {
    failures.push(`${file}: ${dimensions.width}x${dimensions.height} != ${expected[0]}x${expected[1]}`);
  }
}

if (manifest.status !== 'built') failures.push('release manifest status is not built');
if (manifest.sections !== 7) failures.push(`sections ${manifest.sections} != 7`);
if (manifest.works !== 94) failures.push(`works ${manifest.works} != 94`);
if (manifest.core_html_pages !== 104) failures.push(`core pages ${manifest.core_html_pages} != 104`);
if (manifest.total_html_pages !== 105) failures.push(`total pages ${manifest.total_html_pages} != 105`);
if (htmlFiles.length !== 105) failures.push(`generated HTML files ${htmlFiles.length} != 105`);
if (manifest.source_sha256 !== '0f595f0080e7584f6fde1d42edc607bdf123ab40207b3c9eb54a0c21c7f45072') failures.push('source hash mismatch');
if (manifest.canonical_assembled_sha256 !== '6d0c60c1120fa5c9f631e4a6692a92de858ae7a385a511ca5c53d1898da301f5') failures.push('assembled hash mismatch');

const result = {
  status: failures.length ? 'failed' : 'passed',
  output_directory: outputDirectory,
  html_files: htmlFiles.length,
  unique_titles: titles.size,
  unique_descriptions: descriptions.size,
  required_files: required,
  image_dimensions: imageDimensions,
  failures,
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
