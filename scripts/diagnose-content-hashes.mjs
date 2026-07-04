import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gunzipSync, brotliDecompressSync } from 'node:zlib';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const index = JSON.parse(await readFile(path.join(root, 'content', 'book-content.json'), 'utf8'));

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function decode(reference, raw) {
  if (reference.compression === 'gzip') return gunzipSync(raw);
  if (reference.compression === 'brotli') return brotliDecompressSync(raw);
  return raw;
}

const files = [];
const sections = [];
for (const sectionReference of index.sections) {
  const pieces = [];
  let sectionMeta = null;
  for (const fileReference of sectionReference.files) {
    const raw = await readFile(path.join(root, 'content', fileReference.file));
    const actualSha256 = sha256(raw);
    files.push({
      file: fileReference.file,
      expectedSha256: fileReference.sha256,
      actualSha256,
      matches: actualSha256 === fileReference.sha256,
      bytes: raw.length,
      compression: fileReference.compression ?? 'none',
      format: fileReference.format,
    });
    const payload = JSON.parse(decode(fileReference, raw).toString('utf8'));
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
      pieces.push(...payload.pieces);
    } else {
      pieces.push(...payload.pieces);
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
const actualAssembledSha256 = sha256(Buffer.from(pretty, 'utf8'));
const report = {
  generatedAt: new Date().toISOString(),
  fileCount: files.length,
  mismatchedFileCount: files.filter((file) => !file.matches).length,
  files,
  expectedAssembledSha256: index.assembled_sha256,
  actualAssembledSha256,
  assembledMatches: actualAssembledSha256 === index.assembled_sha256,
  sectionCount: sections.length,
  pieceCount: sections.reduce((total, section) => total + section.pieces.length, 0),
};
await mkdir(path.join(root, 'verification'), { recursive: true });
await writeFile(path.join(root, 'verification', 'hash-diagnostics.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(report, null, 2));
