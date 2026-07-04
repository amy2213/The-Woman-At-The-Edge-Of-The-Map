import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import process from 'node:process';

const file = new URL('../content/migration-exemplars.json', import.meta.url);
const data = JSON.parse(await readFile(file, 'utf8'));

const EXPECTED_SOURCE = '0f595f0080e7584f6fde1d42edc607bdf123ab40207b3c9eb54a0c21c7f45072';
const EXPECTED_IDS = ['piece-001', 'piece-006', 'piece-052', 'piece-086', 'piece-094'];
const EXPECTED_FORMATS = new Set(['poem', 'prose', 'archive', 'letter']);
const errors = [];

function hashBlocks(blocks) {
  const normalized = JSON.stringify(blocks ?? []);
  return createHash('sha256').update(normalized, 'utf8').digest('hex');
}

if (data?.source_lock?.sha256 !== EXPECTED_SOURCE) {
  errors.push('Source lock hash does not match the approved manuscript.');
}

if (!Array.isArray(data?.pieces) || data.pieces.length !== 5) {
  errors.push('Exactly five migration exemplars are required.');
}

const ids = data.pieces?.map((piece) => piece.id) ?? [];
if (JSON.stringify(ids) !== JSON.stringify(EXPECTED_IDS)) {
  errors.push(`Exemplar IDs are incorrect or out of order: ${ids.join(', ')}`);
}

const routeKeys = new Set();
for (const piece of data.pieces ?? []) {
  const route = `${piece.section_slug}/${piece.slug}`;
  if (routeKeys.has(route)) errors.push(`Duplicate exemplar route: ${route}`);
  routeKeys.add(route);

  if (!EXPECTED_FORMATS.has(piece.format)) {
    errors.push(`Unsupported exemplar format: ${piece.format}`);
  }

  if (!Array.isArray(piece.blocks) || piece.blocks.length === 0) {
    errors.push(`No blocks found for ${piece.title}.`);
  }

  const expectedHash = piece?.source?.normalized_sha256;
  const actualHash = hashBlocks(piece.blocks);
  if (expectedHash !== actualHash) {
    errors.push(`Normalized content hash mismatch for ${piece.title}.`);
  }
}

const hasCoda = data.pieces?.some((piece) => piece.section_slug === 'coda' && piece.id === 'piece-094');
if (!hasCoda) errors.push('The Coda exemplar is missing.');

if (errors.length) {
  console.error('Exemplar validation failed:');
  errors.forEach((error, index) => console.error(`${index + 1}. ${error}`));
  process.exit(1);
}

console.log('Exemplar validation passed: poem, prose, archive, letter, and Coda formats are represented.');
