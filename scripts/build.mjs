import { readFile, writeFile, mkdir, rm, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assembled } from './assemble-content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'docs-full-preview');

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
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

function shell({ title, description, pageClass, accent = 'horizon', rootPrefix, content }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <title>${escapeHtml(title)} | The Woman at the Edge of the Map</title>
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

const landing = `<section class="landing-shell">
  <p class="landing-eyebrow">Poems · Memories · Mythic Files</p>
  <h1>The Woman at the Edge of the Map</h1>
  <p class="landing-subtitle">Poems, Memories, Mythic Files</p>
  <p class="landing-author">Amy Laird</p>
  <blockquote class="landing-dedication">${escapeHtml(assembled.book.dedication)}</blockquote>
  <div class="button-row"><a class="button button-primary" href="${routeFor(pieces[0])}">Begin at the Edge</a><a class="button" href="map/index.html">Explore the Map</a></div>
  <details class="content-note"><summary>Content note</summary><p>${escapeHtml(assembled.book.content_note.replace(/^Content note:\s*/i, ''))}</p></details>
</section>`;
await writeFile(path.join(output, 'index.html'), shell({ title: assembled.book.title, description: `${assembled.book.title} by ${assembled.book.author}.`, pageClass: 'landing-page', rootPrefix: '', content: landing }), 'utf8');

const cards = assembled.sections.map((section) => `<a class="section-card" style="--card-accent:var(--color-${section.accent})" href="../sections/${section.slug}/index.html"><span class="section-card-number">${escapeHtml(section.label.replace('Part ', ''))}</span><span><strong>${escapeHtml(section.title.replace(/^Part [IVX]+:\s*/, ''))}</strong><small>${escapeHtml(descriptors[section.id])}</small></span><small>${section.pieces.length} works</small></a>`).join('');
const map = `<section class="map-shell"><p class="map-eyebrow">The reading journey</p><h1>Seven destinations.<br>One unfinished map.</h1><p class="map-intro">The path moves through memory, shadow, reckoning, myth, return, preserved letters, and the quiet place where survival becomes living.</p><div class="section-grid">${cards}</div></section>`;
await mkdir(path.join(output, 'map'), { recursive: true });
await writeFile(path.join(output, 'map', 'index.html'), shell({ title: 'The Map', description: 'Complete contents and reading map.', pageClass: 'map-page', rootPrefix: '../', content: map }), 'utf8');

for (const section of assembled.sections) {
  const dir = path.join(output, 'sections', section.slug);
  await mkdir(dir, { recursive: true });
  const list = section.pieces.map((piece) => `<li><a href="../../read/${section.slug}/${piece.slug}/index.html"><span class="piece-order">${String(piece.order).padStart(2, '0')}</span><span class="piece-title">${escapeHtml(piece.title)}</span><span class="piece-format">${escapeHtml(piece.format)}</span></a></li>`).join('');
  const content = `<section class="section-shell"><header class="section-header"><p class="section-eyebrow">${escapeHtml(section.label)} · ${section.pieces.length} works</p><h1>${escapeHtml(section.title.replace(/^Part [IVX]+:\s*/, ''))}</h1><p class="section-intro">${escapeHtml(descriptors[section.id])}</p></header><ol class="piece-list">${list}</ol></section>`;
  await writeFile(path.join(dir, 'index.html'), shell({ title: section.title, description: descriptors[section.id], pageClass: 'section-page', accent: section.accent, rootPrefix: '../../', content }), 'utf8');
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
  await writeFile(path.join(dir, 'index.html'), shell({ title: piece.title, description: `${piece.title}, from ${assembled.book.title} by ${assembled.book.author}.`, pageClass: `reading-page format-${piece.format}`, accent: piece.section.accent, rootPrefix, content }), 'utf8');
}

await mkdir(path.join(output, 'closing'), { recursive: true });
const closing = `<section class="closing-shell"><p class="section-eyebrow">Coda complete</p><h1>The map stays open.</h1><p>You have reached the end of the canonical reading sequence.</p><div class="button-row"><a class="button" href="../map/index.html">Return to the Map</a><a class="button button-primary" href="../index.html">Return home</a></div></section>`;
await writeFile(path.join(output, 'closing', 'index.html'), shell({ title: 'Closing', description: 'Closing page.', pageClass: 'closing-page', accent: 'saffron', rootPrefix: '../', content: closing }), 'utf8');

const sitemap = ['/', '/map/', ...assembled.sections.map((section) => `/sections/${section.slug}/`), ...pieces.map((piece) => `/read/${piece.section.slug}/${piece.slug}/`), '/closing/'];
await writeFile(path.join(output, 'sitemap.txt'), `${sitemap.join('\n')}\n`, 'utf8');
await writeFile(path.join(output, 'build-report.json'), JSON.stringify({ status: 'passed', generated_pages: 1 + 1 + assembled.sections.length + pieces.length + 1, reading_pages: pieces.length, section_pages: assembled.sections.length, routes: sitemap.length }, null, 2), 'utf8');
console.log(`Generated ${pieces.length} reading pages and ${assembled.sections.length} section pages in ${output}.`);
