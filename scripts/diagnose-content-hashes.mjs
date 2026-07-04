import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gunzipSync, brotliDecompressSync } from 'node:zlib';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const reportDir = path.join(root, 'verification');
await mkdir(reportDir, { recursive: true });

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function decode(reference, raw) {
  if (reference.compression === 'gzip') return gunzipSync(raw);
  if (reference.compression === 'brotli') return brotliDecompressSync(raw);
  if (!reference.compression || reference.compression === 'none') return raw;
  throw new Error(`Unsupported compression: ${reference.compression}`);
}

const report = {
  generatedAt: new Date().toISOString(),
  status: 'diagnostic',
  indexError: null,
  fileCount: 0,
  mismatchedFileCount: 0,
  unreadableOrInvalidFileCount: 0,
  files: [],
  expectedAssembledSha256: null,
  actualAssembledSha256: null,
  assembledMatches: false,
  sectionCount: 0,
  pieceCount: 0,
};

let index;
try {
  index = JSON.parse(await readFile(path.join(root, 'content', 'book-content.json'), 'utf8'));
  report.expectedAssembledSha256 = index.assembled_sha256;
} catch (error) {
  report.indexError = error instanceof Error ? error.stack ?? error.message : String(error);
}

const sections = [];
if (index) {
  for (const sectionReference of index.sections ?? []) {
    const pieces = [];
    let sectionMeta = null;

    for (const fileReference of sectionReference.files ?? []) {
      const fileRecord = {
        file: fileReference.file,
        expectedSha256: fileReference.sha256,
        actualSha256: null,
        hashMatches: false,
        bytes: null,
        compression: fileReference.compression ?? 'none',
        format: fileReference.format,
        readError: null,
        decodeError: null,
        parseError: null,
        payloadSummary: null,
      };

      try {
        const raw = await readFile(path.join(root, 'content', fileReference.file));
        fileRecord.bytes = raw.length;
        fileRecord.actualSha256 = sha256(raw);
        fileRecord.hashMatches = fileRecord.actualSha256 === fileReference.sha256;

        let decoded;
        try {
          decoded = decode(fileReference, raw);
        } catch (error) {
          fileRecord.decodeError = error instanceof Error ? error.message : String(error);
        }

        if (decoded) {
          let payload;
          try {
            payload = JSON.parse(decoded.toString('utf8'));
          } catch (error) {
            fileRecord.parseError = error instanceof Error ? error.message : String(error);
          }

          if (payload) {
            fileRecord.payloadSummary = {
              id: payload.id ?? payload.section_id ?? null,
              pieceCount: Array.isArray(payload.pieces) ? payload.pieces.length : null,
            };
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
              if (Array.isArray(payload.pieces)) pieces.push(...payload.pieces);
            } else if (fileReference.format === 'piece-shard') {
              if (Array.isArray(payload.pieces)) pieces.push(...payload.pieces);
            }
          }
        }
      } catch (error) {
        fileRecord.readError = error instanceof Error ? error.message : String(error);
      }

      report.files.push(fileRecord);
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
  report.fileCount = report.files.length;
  report.mismatchedFileCount = report.files.filter((file) => file.actualSha256 && !file.hashMatches).length;
  report.unreadableOrInvalidFileCount = report.files.filter((file) => file.readError || file.decodeError || file.parseError).length;
  report.sectionCount = sections.length;
  report.pieceCount = sections.reduce((total, section) => total + section.pieces.length, 0);

  if (!report.unreadableOrInvalidFileCount) {
    const assembled = {
      schema_version: index.schema_version,
      source_lock: index.source_lock,
      book: index.book,
      sections,
    };
    const pretty = `${JSON.stringify(assembled, null, 2)}\n`;
    report.actualAssembledSha256 = sha256(Buffer.from(pretty, 'utf8'));
    report.assembledMatches = report.actualAssembledSha256 === index.assembled_sha256;
  }
}

await writeFile(path.join(reportDir, 'hash-diagnostics.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(report, null, 2));
