# ADR-002: Section-sharded canonical content

- **Status:** Accepted
- **Date:** July 4, 2026
- **Phase:** 2

## Context

The reviewed canonical manuscript contains 94 works and hundreds of structured content blocks. Keeping every work inside one hand-edited JSON file would make source review, Git diffs, and future corrections unnecessarily difficult.

The build still needs one deterministic book object, but the repository does not need one enormous human-edited file pretending to be convenient.

## Decision

`content/book-content.json` is the canonical root index. It stores:

- source-lock metadata
- book and front-matter metadata
- the required section and piece totals
- one content-file reference and SHA-256 hash for each section
- the SHA-256 hash of the deterministically assembled full book object

The seven section files live at:

```text
content/sections/section-1.json
content/sections/section-2.json
content/sections/section-3.json
content/sections/section-4.json
content/sections/section-5.json
content/sections/section-6.json
content/sections/section-7.json
```

The assembly script verifies every section hash, combines the files in canonical order, and verifies the final assembled hash before validation or site generation.

## Consequences

- The content remains one canonical dataset, stored in reviewable section-sized files.
- A change to one section produces a focused Git diff.
- Corrupted, missing, reordered, or substituted section files fail validation.
- The build process receives the same full object the original monolithic design expected.
- Coda remains the separate seventh section.
- Manuscript text remains outside presentation templates.
