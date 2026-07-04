# Phase 2 Lock

## Status

- **Phase:** 2, content architecture and routing
- **Status:** LOCKED
- **Approved by:** Amy Laird
- **Locked:** July 4, 2026
- **Successor phase:** Phase 3, production build and launch
- **Merged pull request:** #1, Phase 2 verification and review
- **Main merge commit:** `2f69f284544d5b31f74c4d39ab1a9dac188ad468`
- **Final verification run:** `28714172112`
- **Final verification job:** `85152571171`

## Source authority

The locked source remains:

- **File:** `The_Woman_at_the_Edge_of_the_Map_2026_04_kdp_ready_v7_finalpass(1)(1).docx`
- **SHA-256:** `0f595f0080e7584f6fde1d42edc607bdf123ab40207b3c9eb54a0c21c7f45072`
- **Source pages:** 124
- **Canonical sections:** 7
- **Canonical works:** 94
- **Canonical assembled content SHA-256:** `6d0c60c1120fa5c9f631e4a6692a92de858ae7a385a511ca5c53d1898da301f5`

The source DOCX controls wording, punctuation, capitalization, order, section assignment, front matter, and inclusion or exclusion decisions. No manuscript wording was edited during Phase 2.

## Locked architecture

Phase 2 permanently establishes:

- a dependency-light Node.js static-generation system
- canonical manuscript data stored separately from templates, styles, and scripts
- seven top-level sections consisting of Parts I through VI and a separate Coda
- 94 permanent work records with stable IDs, slugs, source-page references, format classifications, and structured content blocks
- canonical previous and next reading relationships across the complete work order
- direct, shareable static reading routes that do not require client-side JavaScript
- normal browser history and cross-section navigation
- local-only optional reading progress with no account or external database requirement
- deterministic content validation and hash verification
- generated landing, map, section, reading, archive, letter, Coda, and closing-page templates
- a production-capable build containing 104 HTML pages

## Canonical content decisions

The following content decisions are locked:

- `This Past Year` is excluded from the canonical reading sequence.
- Coda remains a separate seventh top-level section.
- Part VI contains 12 works.
- Coda contains 3 works.
- The complete canonical reading sequence contains 94 works.
- Format classifications control presentation only and do not authorize rewriting.
- Interface copy remains separate from manuscript text.

## Verification evidence

The final Phase 2 verification completed successfully after the last contrast correction.

The successful workflow verified:

- source-lock metadata and canonical content hashes
- all 7 sections and all 94 works
- unique permanent IDs, slugs, routes, and global order values
- correct section and cross-section previous and next navigation
- exclusion of `This Past Year`
- separate Coda structure
- successful generation of all 104 HTML pages
- internal links across the complete generated site
- representative desktop rendering
- representative mobile rendering
- keyboard navigation and visible focus behavior
- skip-link operation
- horizontal-overflow checks
- browser-console checks
- automated accessibility checks, including the corrected text contrast rules

All steps in the final verification job passed.

## Phase 2 deliverables accepted

- [x] Formal canonical schema and source-lock rules
- [x] Complete canonical content dataset
- [x] All 94 works migrated and validated
- [x] Structured support for poem, prose, list, archive, dialogue, and letter formats
- [x] Stable routes and reading relationships
- [x] Data-driven static build system
- [x] Full 104-page generated preview
- [x] Internal-link validation
- [x] Responsive desktop and mobile verification
- [x] Keyboard and accessibility verification
- [x] Final presentation defects corrected
- [x] Phase 2 branch merged into `main`
- [x] Owner approval recorded

## Transfer to Phase 3

Phase 3 is responsible for production output and public release. Its work includes generating the verified site into the final GitHub Pages source, completing production metadata and release assets, configuring deployment, testing the public URL, and locking the launched release.

Phase 3 may refine production packaging and deployment without reopening Phase 2, provided the locked manuscript, canonical structure, routes, design system, accessibility baseline, and reading order remain unchanged.

## Change control

Any change to manuscript wording, canonical work count, work order, section assignment, Coda separation, permanent IDs, source authority, or route contract requires an explicit Phase 2 change request.

Routine production fixes that preserve the locked architecture and content model do not reopen Phase 2.