import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, "content", "book-manifest.json");
const CONTENT_PATH = path.join(ROOT, "content", "book-content.json");

const EXPECTED = Object.freeze({
  title: "The Woman at the Edge of the Map",
  subtitle: "Poems, Memories, Mythic Files",
  author: "Amy Laird",
  sourceSha256: "0f595f0080e7584f6fde1d42edc607bdf123ab40207b3c9eb54a0c21c7f45072",
  sections: 7,
  pieces: 94,
  sectionCounts: [19, 10, 16, 19, 15, 12, 3],
  excludedTitles: new Set(["This Past Year"]),
});

const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

async function readJson(filePath) {
  const raw = await readFile(filePath, "utf8");
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid JSON in ${path.relative(ROOT, filePath)}: ${error.message}`);
  }
}

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function normalizedContentHash(piece) {
  const normalized = JSON.stringify(piece.blocks ?? []);
  return createHash("sha256").update(normalized, "utf8").digest("hex");
}

function validateManifest(manifest) {
  if (manifest?.source_lock?.source_sha256 !== EXPECTED.sourceSha256) {
    fail("Manifest source hash does not match the locked DOCX hash.");
  }

  if (manifest?.book?.title !== EXPECTED.title) fail("Manifest title is incorrect.");
  if (manifest?.book?.subtitle !== EXPECTED.subtitle) fail("Manifest subtitle is incorrect.");
  if (manifest?.book?.author !== EXPECTED.author) fail("Manifest author is incorrect.");

  const sections = manifest?.sections;
  if (!Array.isArray(sections)) {
    fail("Manifest sections must be an array.");
    return;
  }

  if (sections.length !== EXPECTED.sections) {
    fail(`Expected ${EXPECTED.sections} sections; found ${sections.length}.`);
  }

  const allPieces = sections.flatMap((section) => section.pieces ?? []);
  if (allPieces.length !== EXPECTED.pieces) {
    fail(`Expected ${EXPECTED.pieces} pieces; found ${allPieces.length}.`);
  }

  const expectedOrders = Array.from({ length: EXPECTED.pieces }, (_, index) => index + 1);
  const actualOrders = allPieces.map((piece) => piece.global_order);
  if (JSON.stringify(actualOrders) !== JSON.stringify(expectedOrders)) {
    fail("Global piece order must be contiguous from 1 through 94.");
  }

  const slugSet = new Set();
  for (const piece of allPieces) {
    if (EXPECTED.excludedTitles.has(piece.title)) {
      fail(`Excluded work found in canonical manifest: ${piece.title}`);
    }

    if (slugSet.has(piece.slug)) {
      fail(`Duplicate piece slug found: ${piece.slug}`);
    }
    slugSet.add(piece.slug);
  }

  sections.forEach((section, index) => {
    const expectedCount = EXPECTED.sectionCounts[index];
    const actualCount = section.pieces?.length ?? 0;
    if (actualCount !== expectedCount) {
      fail(`${section.title ?? `Section ${index + 1}`} should contain ${expectedCount} pieces; found ${actualCount}.`);
    }
  });

  const coda = sections[6];
  if (coda?.title !== "Coda" || coda?.slug !== "coda") {
    fail("Coda must remain the separate seventh top-level section.");
  }
}

function validateContent(content, manifest) {
  if (content?.source_lock?.sha256 !== EXPECTED.sourceSha256) {
    fail("Book content source hash does not match the locked DOCX hash.");
  }

  const sections = content?.sections;
  if (!Array.isArray(sections)) {
    fail("book-content.json must contain a sections array.");
    return;
  }

  if (sections.length !== EXPECTED.sections) {
    fail(`book-content.json must contain ${EXPECTED.sections} sections.`);
  }

  const pieces = sections.flatMap((section) => section.pieces ?? []);
  if (pieces.length !== EXPECTED.pieces) {
    fail(`book-content.json must contain ${EXPECTED.pieces} pieces; found ${pieces.length}.`);
  }

  const ids = new Set();
  const slugs = new Set();
  const orders = new Set();

  for (const piece of pieces) {
    if (!piece.id) fail(`Piece without ID: ${piece.title ?? "untitled"}`);
    if (ids.has(piece.id)) fail(`Duplicate piece ID: ${piece.id}`);
    ids.add(piece.id);

    if (!piece.slug) fail(`Piece without slug: ${piece.title ?? piece.id}`);
    if (slugs.has(piece.slug)) fail(`Duplicate piece slug: ${piece.slug}`);
    slugs.add(piece.slug);

    if (orders.has(piece.global_order)) fail(`Duplicate global order: ${piece.global_order}`);
    orders.add(piece.global_order);

    if (EXPECTED.excludedTitles.has(piece.title)) {
      fail(`Excluded work found in canonical content: ${piece.title}`);
    }

    if (!Array.isArray(piece.blocks) || piece.blocks.length === 0) {
      fail(`Piece has no content blocks: ${piece.title ?? piece.id}`);
    }

    if (piece.source?.page_end < piece.source?.page_start) {
      fail(`Invalid source page range for ${piece.title ?? piece.id}.`);
    }

    const calculatedHash = normalizedContentHash(piece);
    if (piece.source?.normalized_sha256 && piece.source.normalized_sha256 !== calculatedHash) {
      fail(`Normalized content hash mismatch for ${piece.title ?? piece.id}.`);
    }
  }

  const expectedOrders = Array.from({ length: EXPECTED.pieces }, (_, index) => index + 1);
  const actualOrders = [...orders].sort((a, b) => a - b);
  if (JSON.stringify(actualOrders) !== JSON.stringify(expectedOrders)) {
    fail("book-content.json global order must be contiguous from 1 through 94.");
  }

  const manifestTitles = manifest.sections.flatMap((section) => section.pieces).map((piece) => piece.title);
  const contentTitles = pieces.map((piece) => piece.title);
  if (JSON.stringify(contentTitles) !== JSON.stringify(manifestTitles)) {
    fail("book-content.json titles or order do not match book-manifest.json.");
  }
}

async function main() {
  const manifest = await readJson(MANIFEST_PATH);
  validateManifest(manifest);

  if (await exists(CONTENT_PATH)) {
    const content = await readJson(CONTENT_PATH);
    validateContent(content, manifest);
  } else {
    warn("content/book-content.json has not been generated yet; manifest validation only.");
  }

  for (const warning of warnings) {
    console.warn(`WARNING: ${warning}`);
  }

  if (errors.length > 0) {
    console.error("\nContent validation failed:\n");
    errors.forEach((error, index) => console.error(`${index + 1}. ${error}`));
    process.exitCode = 1;
    return;
  }

  console.log(`Validation passed: ${EXPECTED.sections} sections and ${EXPECTED.pieces} canonical pieces.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
