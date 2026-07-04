# Phase 2 Checkpoint 1

## Status

- **Phase:** 2, content architecture and routing
- **Checkpoint:** Migration exemplars and data-driven preview foundation
- **Date:** July 4, 2026
- **Live site:** Unchanged

## Source inspection completed

The locked DOCX was parsed directly for migration work.

- 1,914 document paragraphs inspected
- 7 non-empty section headings confirmed
- 94 non-empty work headings confirmed
- 2 empty Heading 2 paragraphs ignored as formatting artifacts
- Inline italic and bold runs preserved where present
- Blank paragraphs treated as structural stanza boundaries rather than manuscript text
- Manual line breaks inside paragraphs preserved as line breaks, not converted into new paragraphs

## Source-locked exemplars

Five representative works were migrated from the locked manuscript into structured JSON:

| Piece ID | Work | Format | Canonical order |
|---|---|---|---:|
| `piece-001` | The Edge, Lived | poem | 1 |
| `piece-006` | The Quilt | long prose | 6 |
| `piece-052` | FILE: BLACKBOX.5A | archive | 52 |
| `piece-086` | To My Future Self | letter | 86 |
| `piece-094` | The Ordinary Miracle | Coda poem | 94 |

Each exemplar includes:

- permanent piece ID
- section-scoped route data
- canonical order
- format type
- source page reference
- ordered content blocks
- inline formatting runs
- normalized SHA-256 content hash

## Validation result

The exemplar validator completed successfully:

```text
Exemplar validation passed: poem, prose, archive, letter, and Coda formats are represented.
```

The validation checks:

- locked manuscript hash
- required exemplar IDs and order
- section-scoped route uniqueness
- required format coverage
- non-empty content blocks
- normalized content hashes
- presence of the Coda exemplar

## Data-driven preview result

The preview generator completed successfully and produced five reading pages plus an index from JSON and reusable templates.

Generated routes:

```text
/read/part-i-the-edge/the-edge-lived/
/read/part-i-the-edge/the-quilt/
/read/part-iv-the-myth/file-blackbox-5a/
/read/part-vi-personal-letters-closings-and-artifacts/to-my-future-self/
/read/coda/the-ordinary-miracle/
```

The manuscript text is not embedded in the templates. Templates receive structured blocks at build time.

## Rendering coverage demonstrated

The build foundation now handles:

- paragraphs
- manual line breaks inside paragraphs
- stanzas
- individual poetry lines
- inline italics
- archive metadata
- poem, prose, archive, letter, and Coda presentation classes
- escaped HTML output
- responsive reading measures
- skip navigation and visible focus treatment

## Current limitation

Automated browser screenshot capture was blocked by the execution environment's browser-navigation policy. Structural generation, output paths, HTML escaping, and content hashes were validated. Visual browser review remains required before Phase 2 lock and before any merge to `main`.

## Next work package

1. Add the DOCX extraction and normalization script.
2. Generate the full 94-work draft content dataset.
3. Produce an extraction audit with paragraph, stanza, and formatting counts for every work.
4. Review ambiguous formats such as dialogue, lists, and hybrid pieces.
5. Run the full canonical validator.
6. Generate the first complete-site preview.
