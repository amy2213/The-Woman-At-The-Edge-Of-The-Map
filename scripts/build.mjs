import { readFile, writeFile, mkdir, rm, copyFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { assembled, assembledHash } from './assemble-content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outputDirectory = process.env.SITE_OUTPUT_DIR || 'docs';
const output = path.resolve(root, outputDirectory);
const siteBaseUrl = new URL(process.env.SITE_BASE_URL || 'https://amy2213.github.io/The-Woman-At-The-Edge-Of-The-Map/');
if (!siteBaseUrl.pathname.endsWith('/')) siteBaseUrl.pathname += '/';
const siteBasePath = siteBaseUrl.pathname;

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeXml(value = '') {
  return escapeHtml(value);
}

function absoluteUrl(route = '') {
  return new URL(String(route).replace(/^\/+/, ''), siteBaseUrl).toString();
}

function renderRuns(runs = []) {
  return runs.map((run) => {
    let text = escapeHtml(run.text).replaceAll('\n', '<br>');
    if (run.small_caps) text = `<span class="small-caps">${text}</span>`;
    if (run.bold) text = `<strong>${text}</strong>`;
    if (run.italic) text = `<em>${text}</em>`;
    return text;
  }).join('');
}

function renderBlock(block) {
  switch (block.type) {
    case 'paragraph':
      return `<p class="prose-paragraph">${renderRuns(block.runs)}</p>`;
    case 'stanza':
      return `<div class="stanza">${block.lines.map((line) => `<p class="poetry-line">${renderRuns(line.runs)}</p>`).join('')}</div>`;
    case 'metadata':
      return `<dl class="archive-metadata">${block.entries.map((entry) => `<dt>${escapeHtml(entry.label)}</dt><dd>${escapeHtml(entry.value)}</dd>`).join('')}</dl>`;
    case 'dialogue':
      return `<div class="dialogue">${block.lines.map((line) => `<p><strong>${escapeHtml(line.speaker)}:</strong><br>${renderRuns(line.runs)}</p>`).join('')}</div>`;
    case 'list': {
      const tag = block.ordered ? 'ol' : 'ul';
      return `<${tag} class="literary-list">${block.items.map((item) => `<li>${renderRuns(item)}</li>`).join('')}</${tag}>`;
    }
    case 'divider':
      return '<hr>';
    default:
      throw new Error(`Unsupported block type: ${block.type}`);
  }
}

function shell({ title, description, pageClass, accent = 'horizon', rootPrefix, canonicalPath = '', content, contentType = 'website' }) {
  const canonical = absoluteUrl(canonicalPath);
  const documentTitle = title === assembled.book.title ? title : `${title} | ${assembled.book.title}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="author" content="${escapeHtml(assembled.book.author)}">
  <meta name="robots" content="index,follow">
  <title>${escapeHtml(documentTitle)}</title>
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:locale" content="en_US">
  <meta property="og:type" content="${escapeHtml(contentType)}">
  <meta property="og:site_name" content="${escapeHtml(assembled.book.title)}">
  <meta property="og:title" content="${escapeHtml(documentTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(documentTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${rootPrefix}assets/tokens.css">
  <link rel="stylesheet" href="${rootPrefix}assets/base.css">
  <link rel="stylesheet" href="${rootPrefix}assets/reader.css">
  <link rel="stylesheet" href="${rootPrefix}assets/sections.css">
</head>
<body class="${escapeHtml(pageClass)}" data-accent="${escapeHtml(accent)}">
  <a class="skip-link" href="#main">Skip to main content</a>
  <header class="site-header">
    <a class="wordmark" href="${rootPrefix}index.html">The Woman at the Edge of the Map</a>
    <nav class="header-actions" aria-label="Primary"><a href="${rootPrefix}map/index.html">The Map</a></nav>
  </header>
  <main id="main">${content}</main>
</body>
</html>`;
}

const descriptors = {
  'section-1': 'Where memory first reaches the border and names what happened.',
  'section-2': 'Searching, shadow work, and the figures that appear when certainty fails.',
  'section-3': 'The point where survival stories meet their evidence.',
  'section-4': 'Recovered files, invented systems, testimony, and mythic counter-language.',
  'section-5': 'Return, recognition, work, family, and the life built after impact.',
  'section-6': 'Letters, closings, and preserved artifacts addressed across time.',
  'section-7': 'Three final works in the quiet after the map opens.',
};

const pieces = assembled.sections.flatMap((section) => section.pieces.map((piece) => ({ ...piece, section })));
const byId = new Map(pieces.map((piece) => [piece.id, piece]));
const routeFor = (piece, prefix = '') => `${prefix}read/${piece.section.slug}/${piece.slug}/index.html`;

await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, 'assets'), { recursive: true });
for (const filename of ['tokens.css', 'base.css', 'reader.css', 'sections.css']) {
  await copyFile(path.join(root, 'src', 'styles', filename), path.join(output, 'assets', filename));
}

const landingDescription = `${assembled.book.subtitle}, a literary collection by ${assembled.book.author}.`;
const landing = `<section class="landing-shell">
  <p class="landing-eyebrow">Poems · Memories · Mythic Files</p>
  <h1>The Woman at the Edge of the Map</h1>
  <p class="landing-subtitle">Poems, Memories, Mythic Files</p>
  <p class="landing-author">Amy Laird</p>
  <blockquote class="landing-dedication">${escapeHtml(assembled.book.dedication)}</blockquote>
  <div class="button-row"><a class="button button-primary" href="${routeFor(pieces[0])}">Begin at the Edge</a><a class="button" href="map/index.html">Explore the Map</a></div>
  <details class="content-note"><summary>Content note</summary><p>${escapeHtml(assembled.book.content_note.replace(/^Content note:\s*/i, ''))}</p></details>
</section>`;
await writeFile(path.join(output, 'index.html'), shell({ title: assembled.book.title, description: landingDescription, pageClass: 'landing-page', rootPrefix: '', canonicalPath: '', content: landing }), 'utf8');

const cards = assembled.sections.map((section) => `<a class="section-card" style="--card-accent:var(--color-${section.accent})" href="../sections/${section.slug}/index.html"><span class="section-card-number">${escapeHtml(section.label.replace('Part ', ''))}</span><span><strong>${escapeHtml(section.title.replace(/^Part [IVX]+:\s*/, ''))}</strong><small>${escapeHtml(descriptors[section.id])}</small></span><small>${section.pieces.length} works</small></a>`).join('');
const map = `<section class="map-shell"><p class="map-eyebrow">The reading journey</p><h1>Seven destinations.<br>One unfinished map.</h1><p class="map-intro">The path moves through memory, shadow, reckoning, myth, return, preserved letters, and the quiet place where survival becomes living.</p><div class="section-grid">${cards}</div></section>`;
await mkdir(path.join(output, 'map'), { recursive: true });
await writeFile(path.join(output, 'map', 'index.html'), shell({ title: 'The Map', description: 'Complete contents and reading map for The Woman at the Edge of the Map.', pageClass: 'map-page', rootPrefix: '../', canonicalPath: 'map/', content: map }), 'utf8');

for (const section of assembled.sections) {
  const dir = path.join(output, 'sections', section.slug);
  await mkdir(dir, { recursive: true });
  const list = section.pieces.map((piece) => `<li><a href="../../read/${section.slug}/${piece.slug}/index.html"><span class="piece-order">${String(piece.order).padStart(2, '0')}</span><span class="piece-title">${escapeHtml(piece.title)}</span><span class="piece-format">${escapeHtml(piece.format)}</span></a></li>`).join('');
  const content = `<section class="section-shell"><header class="section-header"><p class="section-eyebrow">${escapeHtml(section.label)} · ${section.pieces.length} works</p><h1>${escapeHtml(section.title.replace(/^Part [IVX]+:\s*/, ''))}</h1><p class="section-intro">${escapeHtml(descriptors[section.id])}</p></header><ol class="piece-list">${list}</ol></section>`;
  await writeFile(path.join(dir, 'index.html'), shell({ title: section.title, description: descriptors[section.id], pageClass: 'section-page', accent: section.accent, rootPrefix: '../../', canonicalPath: `sections/${section.slug}/`, content }), 'utf8');
}

for (const piece of pieces) {
  const dir = path.join(output, 'read', piece.section.slug, piece.slug);
  await mkdir(dir, { recursive: true });
  const rootPrefix = '../../../';
  const previous = piece.previous_id ? byId.get(piece.previous_id) : null;
  const next = piece.next_id ? byId.get(piece.next_id) : null;
  const prevLink = previous ? `<a href="../../../read/${previous.section.slug}/${previous.slug}/index.html"><small>Previous</small>${escapeHtml(previous.title)}</a>` : '<span></span>';
  const nextLink = next ? `<a href="../../../read/${next.section.slug}/${next.slug}/index.html"><small>Next</small>${escapeHtml(next.title)}</a>` : `<a href="../../../closing/index.html"><small>Finish</small>Closing page</a>`;
  const pageRange = piece.source.page_start === piece.source.page_end ? `${piece.source.page_start}` : `${piece.source.page_start}–${piece.source.page_end}`;
  const content = `<article class="reader-shell reader-${escapeHtml(piece.format)}" data-piece-id="${piece.id}">
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../../../map/index.html">The Map</a><span aria-hidden="true">/</span><a href="../../../sections/${piece.section.slug}/index.html">${escapeHtml(piece.section.title)}</a></nav>
    <header class="piece-header"><p class="section-label">${escapeHtml(piece.section.label)}</p><h1>${escapeHtml(piece.title)}</h1><p class="source-reference">Source pages ${pageRange}</p></header>
    <div class="piece-body">${piece.blocks.map(renderBlock).join('\n')}</div>
    <nav class="reader-navigation" aria-label="Reading sequence">${prevLink}${nextLink}</nav>
    <footer class="piece-footer"><p>Canonical position ${piece.global_order} of 94</p><a href="../../../sections/${piece.section.slug}/index.html">Return to section</a></footer>
  </article>`;
  const description = `${piece.title}, from ${assembled.book.title} by ${assembled.book.author}.`;
  await writeFile(path.join(dir, 'index.html'), shell({ title: piece.title, description, pageClass: `reading-page format-${piece.format}`, accent: piece.section.accent, rootPrefix, canonicalPath: `read/${piece.section.slug}/${piece.slug}/`, content, contentType: 'article' }), 'utf8');
}

await mkdir(path.join(output, 'closing'), { recursive: true });
const closing = `<section class="closing-shell"><p class="section-eyebrow">Coda complete</p><h1>The map stays open.</h1><p>You have reached the end of the canonical reading sequence.</p><div class="button-row"><a class="button" href="../map/index.html">Return to the Map</a><a class="button button-primary" href="../index.html">Return home</a></div></section>`;
await writeFile(path.join(output, 'closing', 'index.html'), shell({ title: 'Closing', description: 'The closing page for The Woman at the Edge of the Map.', pageClass: 'closing-page', accent: 'saffron', rootPrefix: '../', canonicalPath: 'closing/', content: closing }), 'utf8');

const notFound = `<section class="closing-shell"><p class="section-eyebrow">Page not found</p><h1>This path leaves the map.</h1><p>The requested page does not exist in the canonical reading sequence.</p><div class="button-row"><a class="button" href="${siteBasePath}map/index.html">Open the Map</a><a class="button button-primary" href="${siteBasePath}index.html">Return home</a></div></section>`;
await writeFile(path.join(output, '404.html'), shell({ title: 'Page Not Found', description: 'The requested page was not found.', pageClass: 'closing-page', accent: 'horizon', rootPrefix: siteBasePath, canonicalPath: '404.html', content: notFound }), 'utf8');

const routePaths = [
  '',
  'map/',
  ...assembled.sections.map((section) => `sections/${section.slug}/`),
  ...pieces.map((piece) => `read/${piece.section.slug}/${piece.slug}/`),
  'closing/',
];
const routeUrls = routePaths.map(absoluteUrl);
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routeUrls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')}\n</urlset>\n`;

await writeFile(path.join(output, '.nojekyll'), '', 'utf8');
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('sitemap.xml')}\n`, 'utf8');
await writeFile(path.join(output, 'sitemap.xml'), sitemapXml, 'utf8');
await writeFile(path.join(output, 'sitemap.txt'), `${routeUrls.join('\n')}\n`, 'utf8');

const releaseManifest = {
  status: 'built',
  site_base_url: siteBaseUrl.toString(),
  output_directory: outputDirectory,
  source_filename: assembled.source_lock.filename,
  source_sha256: assembled.source_lock.sha256,
  canonical_assembled_sha256: assembledHash,
  sections: assembled.sections.length,
  works: pieces.length,
  core_html_pages: routePaths.length,
  support_html_pages: 1,
  total_html_pages: routePaths.length + 1,
  generated_support_files: ['.nojekyll', '404.html', 'robots.txt', 'sitemap.xml', 'sitemap.txt', 'release-manifest.json', 'build-report.json'],
};
await writeFile(path.join(output, 'release-manifest.json'), `${JSON.stringify(releaseManifest, null, 2)}\n`, 'utf8');
await writeFile(path.join(output, 'build-report.json'), `${JSON.stringify({ status: 'passed', ...releaseManifest }, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  status: 'passed',
  output,
  siteBaseUrl: siteBaseUrl.toString(),
  readingPages: pieces.length,
  sectionPages: assembled.sections.length,
  coreHtmlPages: routePaths.length,
  totalHtmlPages: routePaths.length + 1,
}, null, 2));