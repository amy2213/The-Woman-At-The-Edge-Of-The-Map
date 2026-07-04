# Phase 2 Content Architecture and Routing

## Status

- **Phase:** 2
- **Status:** IN PROGRESS
- **Started:** July 4, 2026
- **Working branch:** `redesign/source-lock-v7`
- **Live site:** Unchanged
- **Source authority:** locked KDP Ready v7 Final Pass manuscript

## Objective

Replace the current single-file website architecture with a source-controlled, data-driven static reading site that preserves every manuscript detail while supporting direct links, normal browser history, responsive layouts, accessibility, and future updates.

## Architecture decision

The redesigned site will use a **static site generator built with dependency-light Node.js scripts** rather than a client-only single-page application.

This decision provides:

- one stable URL per work
- searchable and shareable pages
- normal back and forward behavior
- strong accessibility and SEO
- fast GitHub Pages hosting
- no runtime framework dependency
- deterministic builds from the locked manuscript data

The source data will remain separate from HTML, CSS, and JavaScript. Generated pages are outputs, not editing surfaces.

## Proposed repository structure

```text
/
  content/
    book-manifest.json
    book.schema.json
    book-content.json
  design/
    PHASE_1_DESIGN_SYSTEM.md
    PHASE_1_LOCK.md
  architecture/
    PHASE_2_CONTENT_ARCHITECTURE.md
  src/
    templates/
      layout.html
      landing.html
      map.html
      section.html
      reading.html
      archive.html
      coda.html
    styles/
      tokens.css
      base.css
      layout.css
      reader.css
      sections.css
    scripts/
      navigation.js
      progress.js
      accessibility.js
  scripts/
    validate-content.mjs
    build.mjs
  docs/
    generated GitHub Pages site
  package.json
```

## Canonical routes

| Page | Generated route |
|---|---|
| Landing | `/` |
| Map and complete contents | `/map/` |
| Front matter | `/front-matter/` |
| Section overview | `/sections/{section-slug}/` |
| Individual work | `/read/{piece-slug}/` |
| Coda overview | `/sections/coda/` |
| Content note | `/content-note/` or accessible inline panel |

A generated `404.html` will redirect valid legacy or mistyped GitHub Pages paths without trapping the reader in a broken client-side route.

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
- ordered piece references
- source page reference

### Piece

Each work contains:

- permanent ID
- title
- slug
- section ID
- section order
- global order
- format type
- source page start and end
- content blocks
- previous and next piece IDs
- optional archive metadata
- optional interface-only reading-time estimate

### Format types

Approved format values:

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

## Source fidelity rules

1. The DOCX remains the authority.
2. Piece titles and ordering must match `book-manifest.json`.
3. Paragraph and stanza breaks must match the DOCX.
4. Intentional profanity, capitalization, punctuation, and grammar remain untouched.
5. Web interface copy must be stored separately from manuscript text.
6. No manuscript correction may be made during migration without a logged change request.
7. Each migrated piece receives a content hash after normalization.
8. The validator must reject duplicate IDs, duplicate slugs, missing global order values, and incorrect piece counts.
9. The validator must reject `This Past Year` from canonical content.
10. Coda must remain a separate seventh top-level section.

## Navigation rules

- Global previous and next navigation follows canonical global order 1 through 94.
- Section pages follow canonical section order.
- A reader can move from the final work of one section to the opening work of the next.
- The final Part VI work leads to the Coda overview or first Coda work, depending on reader preference settings.
- The final Coda work ends at a dedicated closing screen, not an abrupt contents dump.
- Browser history and direct URLs must work without JavaScript.
- JavaScript may enhance progress tracking but may not be required to read the book.

## Reader progress

Reader progress is optional and local-only.

Approved local storage values:

- last piece ID
- last section ID
- completed piece IDs
- optional preferred text size
- optional reduced-decoration preference

No account, analytics profile, or external database is required.

## Build workflow

1. Validate source-lock metadata.
2. Validate `book-content.json` against `book.schema.json`.
3. Confirm seven sections and 94 works.
4. Confirm canonical global order.
5. Calculate previous and next relationships.
6. Render landing, map, section, reading, archive, and Coda templates.
7. Generate sitemap, metadata, and `404.html`.
8. Output the finished site to `docs/`.
9. Run link and accessibility checks.

## Phase 2 work packages

### 2.1 Schema and validation

- define the formal JSON schema
- create source-lock checks
- validate canonical counts and order
- prohibit duplicate slugs and excluded works

### 2.2 Content extraction model

- define paragraph, stanza, line, metadata, dialogue, and list blocks
- preserve inline formatting runs
- assign permanent IDs and slugs
- record DOCX page references

### 2.3 Routing and build contract

- define generated paths
- define previous and next behavior
- define legacy-path handling
- define generated output structure

### 2.4 Template contract

Define data requirements for:

- landing page
- map overview
- section page
- standard poem page
- long prose page
- archive page
- letter page
- Coda page
- closing page

### 2.5 Migration readiness

- create an exemplar migrated work
- test schema validation
- test preserved line and paragraph breaks
- confirm no manuscript text is stored in presentation templates

## Deliverables

- [x] Record Phase 1 owner approval
- [x] Establish static-generation architecture
- [x] Establish route contract
- [x] Establish canonical content entities
- [x] Establish block and formatting model
- [x] Establish source-fidelity rules
- [x] Establish navigation rules
- [x] Establish build workflow
- [x] Create formal JSON schema
- [x] Create automated validator
- [x] Create package-level validation command
- [ ] Create complete `book-content.json`
- [ ] Migrate one exemplar from each major format
- [ ] Validate exemplar content
- [ ] Create build-script foundation
- [ ] Generate first data-driven preview
- [ ] Review architecture output
- [ ] Lock Phase 2

## Phase 2 acceptance criteria

Phase 2 may be locked when:

1. The content schema can represent every work type in the manuscript.
2. Validation catches count, order, slug, section, source-lock, and excluded-piece errors.
3. At least one poem, one long prose work, one archive work, one letter, and one Coda work validate successfully.
4. Direct route generation is demonstrated.
5. Manuscript data is fully separated from presentation templates.
6. The architecture can generate the full site without manual duplication of 94 pages.
