import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
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
const changedFiles = [];

for (const sectionReference of index.sections) {
  const pieces = [];
  let sectionMeta = null;

  for (const fileReference of sectionReference.files) {
    const filePath = path.join(root, 'content', fileReference.file);
    let raw = await readFile(filePath);
    let payload = JSON.parse(decode(fileReference, raw).toString('utf8'));

    const payloadPieces = Array.isArray(payload.pieces) ? payload.pieces : [];
    let payloadChanged = false;

    for (const piece of payloadPieces) {
      const expectedPrevious = piece.global_order === 1
        ? null
        : `piece-${String(piece.global_order - 1).padStart(3, '0')}`;
      const expectedNext = piece.global_order === 94
        ? null
        : `piece-${String(piece.global_order + 1).padStart(3, '0')}`;

      if (piece.previous_id !== expectedPrevious) {
        piece.previous_id = expectedPrevious;
        payloadChanged = true;
      }
      if (piece.next_id !== expectedNext) {
        piece.next_id = expectedNext;
        payloadChanged = true;
      }
    }

    if (payloadChanged) {
      if (fileReference.compression && fileReference.compression !== 'none') {
        throw new Error(`Refusing to rewrite compressed canonical file ${fileReference.file}`);
      }
      raw = Buffer.from(`${JSON.stringify(payload)}\n`, 'utf8');
      await writeFile(filePath, raw);
      changedFiles.push(fileReference.file);
    }

    fileReference.sha256 = sha256(raw);

    if (fileReference.format === 'full-section') {
      sectionMeta = {
        id: payload.id,
        title: payload.title,
        slug: payload.slug,
        order: payload.order,
        label: payload.label,
        accent: payload.accent,
        source_page: payload.source_page,
      };
      pieces.push(...payloadPieces);
    } else if (fileReference.format === 'piece-shard') {
      pieces.push(...payloadPieces);
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
index.assembled_sha256 = sha256(Buffer.from(pretty, 'utf8'));
index.storage = 'hash-verified-section-shards';
await writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  status: 'normalized',
  changedFiles,
  assembled_sha256: index.assembled_sha256,
}, null, 2));
