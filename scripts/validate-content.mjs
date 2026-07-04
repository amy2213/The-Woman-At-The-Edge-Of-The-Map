import { createHash } from 'node:crypto';
import { assembled, assembledHash, index } from './assemble-content.mjs';

const EXPECTED = Object.freeze({
  sourceSha256: '0f595f0080e7584f6fde1d42edc607bdf123ab40207b3c9eb54a0c21c7f45072',
  title: 'The Woman at the Edge of the Map',
  subtitle: 'Poems, Memories, Mythic Files',
  author: 'Amy Laird',
  sectionCounts: [19, 10, 16, 19, 15, 12, 3],
});

const errors = [];
const fail = (message) => errors.push(message);
const hashBlocks = (blocks) => createHash('sha256').update(JSON.stringify(blocks), 'utf8').digest('hex');

if (assembled.source_lock.sha256 !== EXPECTED.sourceSha256) fail('Locked source hash mismatch.');
if (assembled.book.title !== EXPECTED.title) fail('Book title mismatch.');
if (assembled.book.subtitle !== EXPECTED.subtitle) fail('Book subtitle mismatch.');
if (assembled.book.author !== EXPECTED.author) fail('Book author mismatch.');
if (assembled.sections.length !== 7) fail(`Expected 7 sections, found ${assembled.sections.length}.`);

const pieces = assembled.sections.flatMap((section) => section.pieces);
if (pieces.length !== 94) fail(`Expected 94 works, found ${pieces.length}.`);
if (pieces.some((piece) => piece.title === 'This Past Year')) fail('Excluded work “This Past Year” is present.');

const ids = new Set();
const routes = new Set();
const orders = [];
for (const [sectionIndex, section] of assembled.sections.entries()) {
  if (section.order !== sectionIndex + 1) fail(`Section order mismatch: ${section.title}`);
  if (section.pieces.length !== EXPECTED.sectionCounts[sectionIndex]) {
    fail(`${section.title} has ${section.pieces.length} works; expected ${EXPECTED.sectionCounts[sectionIndex]}.`);
  }

  for (const [pieceIndex, piece] of section.pieces.entries()) {
    if (piece.order !== pieceIndex + 1) fail(`Section order mismatch for ${piece.id}.`);
    if (ids.has(piece.id)) fail(`Duplicate piece ID: ${piece.id}`);
    ids.add(piece.id);

    const route = `${section.slug}/${piece.slug}`;
    if (routes.has(route)) fail(`Duplicate route: ${route}`);
    routes.add(route);
    orders.push(piece.global_order);

    if (!Array.isArray(piece.blocks) || piece.blocks.length === 0) fail(`No content blocks: ${piece.id}`);
    if (piece.source.page_end < piece.source.page_start) fail(`Invalid page range: ${piece.id}`);
    if (hashBlocks(piece.blocks) !== piece.source.normalized_sha256) fail(`Block hash mismatch: ${piece.id}`);

    const expectedPrevious = piece.global_order === 1 ? null : `piece-${String(piece.global_order - 1).padStart(3, '0')}`;
    const expectedNext = piece.global_order === 94 ? null : `piece-${String(piece.global_order + 1).padStart(3, '0')}`;
    if (piece.previous_id !== expectedPrevious) fail(`Previous ID mismatch: ${piece.id}`);
    if (piece.next_id !== expectedNext) fail(`Next ID mismatch: ${piece.id}`);
  }
}

const expectedOrders = Array.from({ length: 94 }, (_, index) => index + 1);
if (JSON.stringify(orders) !== JSON.stringify(expectedOrders)) fail('Global order is not contiguous from 1 through 94.');
if (assembled.sections[6].title !== 'Coda' || assembled.sections[6].slug !== 'coda') fail('Coda is not the seventh top-level section.');

if (errors.length) {
  console.error('Canonical content validation failed:');
  errors.forEach((error, index) => console.error(`${index + 1}. ${error}`));
  process.exit(1);
}

const formats = pieces.reduce((accumulator, piece) => {
  accumulator[piece.format] = (accumulator[piece.format] ?? 0) + 1;
  return accumulator;
}, {});

console.log(JSON.stringify({
  status: 'passed',
  assembled_sha256: assembledHash,
  sections: assembled.sections.length,
  pieces: pieces.length,
  routes: routes.size,
  formats,
  source_files: index.sections.reduce((total, section) => total + section.files.length, 0),
}, null, 2));
