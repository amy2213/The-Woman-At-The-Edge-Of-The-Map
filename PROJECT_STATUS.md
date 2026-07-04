# Project Status

## The Woman at the Edge of the Map website redesign

- **Current phase:** Phase 3, production build and launch
- **Phase 0:** LOCKED July 4, 2026
- **Phase 1:** LOCKED by owner approval July 4, 2026
- **Phase 2:** LOCKED by owner approval July 4, 2026
- **Phase 3:** IN PROGRESS, started July 4, 2026
- **Phase 3 control record:** `production/PHASE_3_PRODUCTION_PLAN.md`
- **Phase 3 working branch:** `redesign/phase-3-production`
- **Phase 2 lock record:** `architecture/PHASE_2_LOCK.md`
- **Phase 2 merge commit:** `2f69f284544d5b31f74c4d39ab1a9dac188ad468`
- **Protected archive:** `archive/pre-redesign-2026-07-04`
- **Default branch:** `main`
- **Live website:** Existing release remains unchanged pending Phase 3 production approval
- **Source authority:** KDP Ready v7 Final Pass manuscript and `content/book-manifest.json`
- **Canonical assembled content SHA-256:** `6d0c60c1120fa5c9f631e4a6692a92de858ae7a385a511ca5c53d1898da301f5`

## Locked decisions

- Creative direction: **The Living Map**
- Foundation: bright ivory and white surfaces with ink-blue text
- Primary accents: sea glass, horizon blue, coral, sage, lavender gray, and restrained saffron
- Literary font: Newsreader
- Interface font: Inter
- Archive font: IBM Plex Mono
- Architecture: dependency-light Node.js static generation
- Canonical structure: six parts plus a separate Coda
- Canonical piece count: 94
- Core generated page count: 104
- `This Past Year`: excluded from the canonical reading sequence
- Former dark brown, black, sepia, rust, and gold presentation: retired

## Phase 2 completion

Phase 2 established and verified the complete canonical content system, permanent work records, static route architecture, structured content blocks, previous and next navigation, full-site generation, internal-link validation, responsive rendering, keyboard operation, and accessibility compliance.

The final GitHub Actions verification passed every required step before the Phase 2 pull request was merged into `main`.

## Current Phase 3 checkpoint

**Checkpoint 1: Production artifact foundation**

Current work includes:

- promoting generated output to the production `docs/` target
- adding canonical and social metadata
- generating sitemap, robots, `.nojekyll`, 404, and release-manifest files
- creating the repeatable Phase 3 verification workflow
- preserving the existing public release until the production artifact is reviewed and approved

## Current release rule

The public website must not be switched to the redesigned build until the production output is generated, all required verification passes, representative screens are reviewed, the live deployment is tested, direct reading routes work, assets load correctly, and Amy Laird approves the release.