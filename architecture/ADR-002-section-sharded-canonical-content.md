# ADR-002: Hash-verified canonical content files

- **Status:** Accepted
- **Date:** July 4, 2026
- **Phase:** 2

## Context

The reviewed canonical manuscript contains 94 works and hundreds of structured content blocks. Keeping every work inside one hand-edited JSON file would make source review, Git diffs, and future corrections unnecessarily difficult.

The build still needs one deterministic book object, but the repository does not need one enormous human-edited file pretending to be convenient.

## Decision

`content/book-content.json` is the canonical root index. It stores source-lock metadata, book metadata, ordered content-file references, a SHA-256 hash for every source file, and the SHA-256 hash of the deterministically assembled full book object.

The content uses two storage forms:

1. Complete compressed section files for Parts I through IV
2. Reviewable JSON section shards for Parts V, VI, and Coda

The choice of storage form does not change the content model. The assembly script verifies every file hash, decompresses when required, rebuilds the seven canonical sections, sorts all works by canonical order, and verifies the final assembled hash before validation or site generation.

## Canonical guarantees

- The assembled dataset contains exactly seven sections and 94 works.
- Coda remains the separate seventh section.
- Piece IDs remain globally unique.
- Reading routes remain unique within their section.
- Every work retains source page references, format classification, content blocks, and previous and next IDs.
- Manuscript text remains outside presentation templates.
- A missing, altered, substituted, or reordered content file causes the build to fail.

## Consequences

- A future correction can be reviewed within a focused section file.
- Large early sections do not create unwieldy repository diffs.
- Later section shards remain directly readable in GitHub.
- The build receives the same deterministic book object regardless of the storage form used by a source file.
- The mixed storage model is an implementation detail, not a second source of truth.
