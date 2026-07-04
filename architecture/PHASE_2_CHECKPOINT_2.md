# Phase 2 Checkpoint 2

## Status

- **Phase:** 2, content architecture and routing
- **Checkpoint:** Full manuscript extraction draft
- **Date:** July 4, 2026
- **Live site:** Unchanged

## Completed

The locked DOCX extraction pipeline was implemented, syntax-checked, and run against the approved manuscript.

The pipeline:

- verifies the locked manuscript SHA-256 before extraction
- requires exactly 7 sections and 94 works
- requires section counts of 19, 10, 16, 19, 15, 12, and 3
- ignores empty Heading 2 formatting artifacts
- excludes `This Past Year` from canonical output
- preserves text, manual line breaks, italic runs, and bold runs
- separates paragraphs, stanzas, lists, dialogue, archive metadata, and letters
- assigns permanent piece IDs and section-scoped slugs
- calculates normalized content hashes
- generates a work-level extraction audit
- flags ambiguous format decisions for human review

## Extraction result

- **Sections extracted:** 7
- **Works extracted:** 94
- **Excluded title present:** No
- **Works automatically extracted without format flags:** 78
- **Works requiring format review:** 16

### Draft format distribution

| Format | Count |
|---|---:|
| Poem | 56 |
| Prose | 12 |
| Hybrid | 1 |
| List | 3 |
| Archive | 13 |
| Dialogue | 1 |
| Letter | 8 |

These format labels control presentation only. They do not alter manuscript text.

## Integrity records

- **Generated draft SHA-256:** `771a6895edd75513ea233291a084e8ee52f1e65f5cd607e9c5ee8b57286fa73d`
- **Extraction audit SHA-256:** `55039793641a68e85e39772d72da199f6eedfb8159309d438413d5db1ba31aab`

The full draft remains a review artifact until all flagged format decisions and source boundaries are checked. It is not yet promoted to canonical `book-content.json`.

## Review queue

The 16 flags consist of:

- 5 repeated `Before You Read` route confirmations
- 3 short-line poem classifications requiring confirmation
- 1 hybrid-versus-prose classification
- 7 archive-style pieces that do not begin with conventional metadata labels

The archive flags do not mean text is missing. They mean the visual template must not invent metadata that the manuscript does not contain.

## Next work package

1. Resolve the 16 format flags against the source manuscript.
2. Add source page ranges to the complete dataset.
3. compare all 94 extracted titles and bodies to the locked manifest and DOCX.
4. Promote the reviewed draft to `content/book-content.json`.
5. Run the full canonical validator.
6. Generate the first complete 94-work preview.
7. Perform browser, mobile, accessibility, and link QA before Phase 2 lock.
