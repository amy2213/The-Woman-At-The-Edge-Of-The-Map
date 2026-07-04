import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gunzipSync, brotliDecompressSync } from 'node:zlib';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const indexPath = path.join(root, 'content', 'book-content.json');
const index = JSON.parse(await readFile(indexPath, 'utf8'));

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function decode(reference, raw) {
  if (reference.compression === 'gzip') return gunzipSync(raw);
  if (reference.compression === 'brotli') return brotliDecompressSync(raw);
  if (!reference.compression || reference.compression === 'none') return raw;
  throw new Error(`Unsupported compression: ${reference.compression}`);
}

const sections = [];
for (const sectionReference of index.sections) {
  const pieces = [];
  let sectionMeta = null;

  for (const fileReference of sectionReference.files) {
    const filePath = path.join(root, 'content', fileReference.file);
    const raw = await readFile(filePath);
    const actualHash = sha256(raw);
    if (actualHash !== fileReference.sha256) {
      throw new Error(`Hash mismatch for ${fileReference.file}: expected ${fileReference.sha256}, found ${actualHash}`);
    }

    const decoded = decode(fileReference, raw);
    const payload = JSON.parse(decoded.toString('utf8'));

    if (fileReference.format === 'full-section') {
      if (payload.id !== sectionReference.id) throw new Error(`Section ID mismatch in ${fileReference.file}`);
      sectionMeta = {
        id: payload.id,
        title: payload.title,
        slug: payload.slug,
        order: payload.order,
        label: payload.label,
        accent: payload.accent,
        source_page: payload.source_page,
      };
      pieces.push(...payload.pieces);
    } else if (fileReference.format === 'piece-shard') {
      if (payload.section_id !== sectionReference.id) throw new Error(`Shard section mismatch in ${fileReference.file}`);
      pieces.push(...payload.pieces);
    } else {
      throw new Error(`Unsupported payload type: ${fileReference.format}`);
    }
  }

  sectionMeta ??= {
    id: sectionReference.id,
    title: sectionReference.title,
    slug: sectionReference.slug,
    order: sectionReference.order,
    label: sectionReference.label,
    accent: sectionReference.accent,
    source_page: sectionReference.source_page,
  };

  pieces.sort((a, b) => a.order - b.order);
  if (pieces.length !== sectionReference.piece_count) {
    throw new Error(`${sectionReference.id} has ${pieces.length} works; expected ${sectionReference.piece_count}`);
  }
  sections.push({ ...sectionMeta, pieces });
}

sections.sort((a, b) => a.order - b.order);
const assembled = {
  schema_version: index.schema_version,
  source_lock: index.source_lock,
  book: index.book,
  sections,
};

const pretty = `${JSON.stringify(assembled, null, 2)}\n`;
const assembledHash = sha256(Buffer.from(pretty, 'utf8'));
if (assembledHash !== index.assembled_sha256) {
  throw new Error(`Assembled content hash mismatch: expected ${index.assembled_sha256}, found ${assembledHash}`);
}

export { index, assembled, assembledHash };
