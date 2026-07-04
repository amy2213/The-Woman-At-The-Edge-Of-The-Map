import { readFile, writeFile, mkdir, rm, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'docs-preview');
const data = JSON.parse(await readFile(path.join(root, 'content', 'migration-exemplars.json'), 'utf8'));
const layout = await readFile(path.join(root, 'src', 'templates', 'layout.html'), 'utf8');
const readingTemplate = await readFile(path.join(root, 'src', 'templates', 'reading.html'), 'utf8');

const SECTION_TITLES = {
  'part-i-the-edge': 'Part I: The Edge',
  'part-iv-the-myth': 'Part IV: The Myth',
  'part-vi-personal-letters-closings-and-artifacts': 'Part VI: Personal Letters, Closings, and Artifacts',
  'coda': 'Coda',
};

const SECTION_LABELS = {
  'part-i-the-edge': 'Part I',
  'part-iv-the-myth': 'Part IV',
  'part-vi-personal-letters-closings-and-artifacts': 'Part VI',
  'coda': 'Coda',
};

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
      return `<div class="dialogue">${block.lines.map((line) => `<p><strong>${escapeHtml(line.speaker)}:</strong> ${renderRuns(line.runs)}</p>`).join('')}</div>`;
    case 'list':
      return `${block.ordered ? '<ol>' : '<ul>'}${block.items.map((item) => `<li>${renderRuns(item)}</li>`).join('')}${block.ordered ? '</ol>' : '</ul>'}`;
    case 'divider':
      return '<hr>';
    default:
      throw new Error(`Unsupported block type: ${block.type}`);
  }
}

function applyTemplate(template, values) {
  return Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{{${key}}}`, value), template);
}

function pageLayout({ title, description, pageClass, rootPrefix, content }) {
  return applyTemplate(layout, {
    TITLE: escapeHtml(title),
    META_DESCRIPTION: escapeHtml(description),
    PAGE_CLASS: escapeHtml(pageClass),
    ROOT_PREFIX: rootPrefix,
    CONTENT: content,
  });
}

await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, 'assets'), { recursive: true });
for (const filename of ['tokens.css', 'base.css', 'reader.css']) {
  await copyFile(path.join(root, 'src', 'styles', filename), path.join(output, 'assets', filename));
}

const cards = [];
for (const piece of data.pieces) {
  const routeDir = path.join(output, 'read', piece.section_slug, piece.slug);
  await mkdir(routeDir, { recursive: true });
  const rootPrefix = '../../../';
  const blocks = piece.blocks.map(renderBlock).join('\n');
  const reading = applyTemplate(readingTemplate, {
    FORMAT: escapeHtml(piece.format),
    PIECE_ID: escapeHtml(piece.id),
    ROOT_PREFIX: rootPrefix,
    SECTION_TITLE: escapeHtml(SECTION_TITLES[piece.section_slug] ?? piece.section_slug),
    SECTION_LABEL: escapeHtml(SECTION_LABELS[piece.section_slug] ?? ''),
    PIECE_TITLE: escapeHtml(piece.title),
    SOURCE_PAGES: piece.source.page_start === piece.source.page_end
      ? String(piece.source.page_start)
      : `${piece.source.page_start}–${piece.source.page_end}`,
    BLOCKS: blocks,
    GLOBAL_ORDER: String(piece.global_order),
  });

  const html = pageLayout({
    title: piece.title,
    description: `${piece.title}, from The Woman at the Edge of the Map by Amy Laird.`,
    pageClass: `reading-page format-${piece.format}`,
    rootPrefix,
    content: reading,
  });
  await writeFile(path.join(routeDir, 'index.html'), html, 'utf8');

  cards.push(`<a class="prototype-card" href="read/${escapeHtml(piece.section_slug)}/${escapeHtml(piece.slug)}/index.html"><small>${escapeHtml(piece.format)} · #${piece.global_order}</small><strong>${escapeHtml(piece.title)}</strong><span>${escapeHtml(SECTION_TITLES[piece.section_slug] ?? '')}</span></a>`);
}

const indexContent = `<section class="prototype-index"><p class="section-label">Phase 2 migration test</p><h1>Data-driven reading prototypes</h1><p>Five source-locked works demonstrate the content model across poetry, long prose, archival material, letters, and the Coda. These pages are generated from JSON rather than embedded manuscript text.</p><div class="prototype-grid">${cards.join('')}</div></section>`;
await writeFile(path.join(output, 'index.html'), pageLayout({
  title: 'Phase 2 prototype index',
  description: 'Phase 2 data-driven reading prototypes.',
  pageClass: 'prototype-index-page',
  rootPrefix: '',
  content: indexContent,
}), 'utf8');

await writeFile(path.join(output, 'build-report.json'), JSON.stringify({
  generated_at: new Date().toISOString(),
  exemplar_count: data.pieces.length,
  routes: data.pieces.map((piece) => `/read/${piece.section_slug}/${piece.slug}/`),
}, null, 2), 'utf8');

console.log(`Generated ${data.pieces.length} exemplar reading pages in ${output}.`);
