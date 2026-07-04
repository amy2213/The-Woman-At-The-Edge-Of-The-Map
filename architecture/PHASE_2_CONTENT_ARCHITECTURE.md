# Phase 2 Content Architecture and Routing

## Status

- **Phase:** 2
- **Status:** LOCKED
- **Started:** July 4, 2026
- **Locked:** July 4, 2026
- **Approved by:** Amy Laird
- **Lock record:** `architecture/PHASE_2_LOCK.md`
- **Live site:** Unchanged pending Phase 3 deployment
- **Source authority:** locked KDP Ready v7 Final Pass manuscript

## Objective

Replace the former single-file website architecture with a source-controlled, data-driven static reading site that preserves every manuscript detail while supporting direct links, normal browser history, responsive layouts, accessibility, and future updates.

## Architecture decision

The redesigned site uses a **static site generator built with dependency-light Node.js scripts** rather than a client-only single-page application.

This provides:

- one stable URL per work
- searchable and shareable pages
- normal browser back and forward behavior
- strong accessibility and SEO foundations
- fast GitHub Pages hosting
- no runtime framework dependency
- deterministic builds from the locked manuscript data

Source data remains separate from HTML, CSS, and JavaScript. Generated pages are outputs, not editing surfaces.

## Repository structure

```text
/
  content/
    book-manifest.json
    book.schema.json
    book-content.json
    sections/
  design/
    PHASE_1_DESIGN_SYSTEM.md
    PHASE_1_LOCK.md
  architecture/
    PHASE_2_CONTENT_ARCHITECTURE.md
    PHASE_2_CHECKPOINT_3.md
    PHASE_2_LOCK.md
  src/
    templates/
    styles/
    scripts/
  scripts/
    validation and build scripts
  docs/
    final GitHub Pages production site
  package.json
```

## Canonical routes

| Page | Generated route |
|---|---|
| Landing | `/` |
| Map and complete contents | `/map/` |
| Section overview | `/sections/{section-slug}/` |
| Individual work | `/read/{section-slug}/{piece-slug}/` |
| Coda overview | `/sections/coda/` |
| Closing page | `/closing/` |

The final production build must also include a generated `404.html` and legacy-path handling without trapping readers in broken client-side routes.

## Canonical content model

### Book

The root book record contains:

- title
- subtitle
- author
- edition
- source-lock metadata
- front matter
- ordered sections
- global work order

### Section

Each section contains:

- permanent ID
- title
- slug
- order
- Roman numeral or Coda label
- approved interface descriptor
- accent token
- ordered work references
- source-page reference

### Work

Each work contains:

- permanent ID
- title
- slug
- section ID
- section order
- global order
- format type
- source-page start and end
- structured content blocks
- previous and next work IDs
- optional archive metadata
- optional interface-only reading-time estimate

### Approved format types

- `poem`
- `prose`
- `hybrid`
- `archive`
- `dialogue`
- `letter`
- `list`
- `front-matter`

Format controls presentation only. It does not authorize rewriting or restructuring manuscript content.

## Content blocks

The model preserves manuscript structure through ordered blocks:

- `paragraph`
- `stanza`
- `line`
- `metadata`
- `dialogue`
- `list`
- `divider`

Text formatting is stored as inline runs so italics, bold text, deliberate capitalization, and other manuscript styling remain explicit rather than inferred by CSS.

## Source-fidelity rules

1. The locked DOCX remains the authority.
2. Work titles and ordering must match `book-manifest.json`.
3. Paragraph and stanza breaks must match the DOCX.
4. Intentional profanity, capitalization, punctuation, and grammar remain untouched.
5. Web interface copy must be stored separately from manuscript text.
6. No manuscript correction may be made without a logged change request.
7. Each migrated work receives a normalized content hash.
8. Validation rejects duplicate IDs, duplicate slugs, missing global-order values, and incorrect work counts.
9. Validation rejects `This Past Year` from canonical content.
10. Coda remains a separate seventh top-level section.

## Navigation rules

- Global previous and next navigation follows canonical order 1 through 94.
- Section pages follow canonical section order.
- A reader can move from the final work of one section to the opening work of the next.
- The final Part VI work leads into the separate Coda sequence.
- The final Coda work ends at a dedicated closing screen.
- Browser history and direct URLs work without JavaScript.
- JavaScript may enhance progress tracking but is not required to read the book.

## Reader progress

Reader progress is optional and local-only.

Approved local-storage values include:

- last work ID
- last section ID
- completed work IDs
- optional preferred text size
- optional reduced-decoration preference

No account, analytics profile, or external database is required.

## Build workflow

1. Validate source-lock metadata.
2. Validate canonical content against the schema.
3. Confirm seven sections and 94 works.
4. Confirm canonical global order and reading relationships.
5. Verify content and file hashes.
6. Render landing, map, section, reading, archive, letter, Coda, and closing templates.
7. Generate metadata, sitemap, and `404.html` for production.
8. Output the finished production site to `docs/` during Phase 3.
9. Run link, responsive, keyboard, browser, and accessibility checks.

## Completed Phase 2 work packages

### 2.1 Schema and validation

- [x] Define the formal JSON schema.
- [x] Create source-lock checks.
- [x] Validate canonical counts and order.
- [x] Prohibit duplicate slugs and excluded works.

### 2.2 Content migration

- [x] Define paragraph, stanza, line, metadata, dialogue, and list blocks.
- [x] Preserve inline formatting runs.
- [x] Assign permanent IDs and slugs.
- [x] Record source-page references.
- [x] Migrate all 94 works.
- [x] Confirm 94 visible-text matches and zero mismatches.

### 2.3 Routing and generation

- [x] Define generated paths.
- [x] Define previous and next behavior.
- [x] Define section-boundary navigation.
- [x] Define generated output structure.
- [x] Build all 104 static HTML pages.
- [x] Pass the complete internal-link check.

### 2.4 Template system

Data-driven templates are complete for:

- [x] landing page
- [x] map overview
- [x] section overview
- [x] standard poem page
- [x] long prose page
- [x] archive page
- [x] dialogue page
- [x] list page
- [x] letter page
- [x] Coda page
- [x] closing page

### 2.5 Final verification

- [x] Review representative desktop screens.
- [x] Review representative mobile screens.
- [x] Verify keyboard operation and visible focus.
- [x] Verify skip-link behavior.
- [x] Check browser-console errors and horizontal overflow.
- [x] Run automated accessibility scanning.
- [x] Correct the remaining color-contrast defects.
- [x] Pass every step in the final verification workflow.
- [x] Merge the verified Phase 2 work into `main`.
- [x] Obtain owner approval and lock Phase 2.

## Final accepted result

- **Sections:** 7
- **Works:** 94
- **Generated HTML pages:** 104
- **Visible-text mismatches:** 0
- **Final assembled SHA-256:** `6d0c60c1120fa5c9f631e4a6692a92de858ae7a385a511ca5c53d1898da301f5`
- **Verification workflow run:** `28714172112`
- **Merge commit:** `2f69f284544d5b31f74c4d39ab1a9dac188ad468`

Phase 2 is complete and locked. Production generation, GitHub Pages configuration, public deployment, and live-site testing transfer to Phase 3.