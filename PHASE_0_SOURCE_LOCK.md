# Phase 0 Source Lock

## Project

- **Book:** The Woman at the Edge of the Map
- **Subtitle:** Poems, Memories, Mythic Files
- **Author:** Amy Laird
- **Current phase:** Phase 0, content lock and redesign preparation
- **Phase status:** In progress
- **Live site status:** Unchanged

## Approved source of truth

The sole controlling manuscript for the website redesign is:

`The_Woman_at_the_Edge_of_the_Map_2026_04_kdp_ready_v7_finalpass(1)(1).docx`

- **Source label:** KDP Ready v7 Final Pass, April 2026
- **Page count:** 124
- **SHA-256:** `0f595f0080e7584f6fde1d42edc607bdf123ab40207b3c9eb54a0c21c7f45072`
- **Locked:** July 4, 2026

This manuscript controls wording, punctuation, paragraph and stanza order, titles, section assignments, front matter, and inclusion or exclusion from the canonical reading sequence. No website copy may override it unless a later change request is explicitly approved and logged.

## Locked structure

| Order | Section | Pieces |
|---:|---|---:|
| 1 | Part I: The Edge | 19 |
| 2 | Part II: Seekers and Shadows | 10 |
| 3 | Part III: The Reckoning | 16 |
| 4 | Part IV: The Myth | 19 |
| 5 | Part V: The Return | 15 |
| 6 | Part VI: Personal Letters, Closings, and Artifacts | 12 |
| 7 | Coda | 3 |

**Canonical total: 94 pieces across seven top-level sections.**

## Front matter locked from source

- Title
- Subtitle
- Author
- Content note
- Copyright and rights statement
- Printed-in-the-USA statement
- First-edition statement
- Dedication
- Contents

The source also contains an embedded grayscale cover image on page 2. Its use in the redesigned website is not yet approved and remains a Phase 1 design decision.

## Confirmed current-site variances

1. **Coda structure is wrong.** The existing site nests the three Coda works inside Part VI. The source defines Coda as a separate top-level closing section.
2. **“This Past Year” is not in the locked source.** It must be removed from the canonical reading sequence unless later approved as clearly labeled web-only bonus material.
3. **Part VI count is wrong.** The source has 12 Part VI pieces, followed by 3 Coda pieces. The current site reports 16 pieces under Part VI.
4. **Front matter is incomplete online.** The redesigned structure must account for the full locked front matter rather than only the title screen and content note.
5. **Content and presentation are coupled.** The current site stores the manuscript and visual interface in a single `index.html`. The redesign will separate canonical content data from presentation code.

## Repository protection

- **Preserved snapshot branch:** `archive/pre-redesign-2026-07-04`
- **Working branch:** `redesign/source-lock-v7`
- **Default branch:** `main`
- **Rule:** No redesign changes will be written directly to `main` before approval and QA.

## Phase 0 deliverables

- [x] Approve redesign strategy
- [x] Declare source-of-truth manuscript
- [x] Compute and record immutable source hash
- [x] Preserve current website in an archive branch
- [x] Create isolated redesign working branch
- [x] Extract canonical section and piece order
- [x] Confirm canonical counts
- [x] Record known current-site variances
- [x] Generate machine-readable manifest
- [x] Generate section-level source records with paragraph and run formatting
- [ ] Complete body-level automated comparison against the existing website content
- [ ] Produce final discrepancy register
- [ ] Lock Phase 0 and authorize Phase 1 design system work

## Change-control rule

Any future manuscript update must include:

1. The replacement source file
2. A new SHA-256 value
3. A dated change request
4. A list of affected sections or pieces
5. Regenerated source records and manifest

No silent copy changes are permitted during design or development.
