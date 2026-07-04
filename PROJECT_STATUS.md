# Project Status

## The Woman at the Edge of the Map website redesign

- **Current phase:** Phase 3, production build and launch
- **Phase 0:** LOCKED July 4, 2026
- **Phase 1:** LOCKED by owner approval July 4, 2026
- **Phase 2:** LOCKED by owner approval July 4, 2026
- **Phase 3:** IN PROGRESS, started July 4, 2026
- **Current checkpoint:** Checkpoint 3, awaiting release authorization
- **Phase 3 control record:** `production/PHASE_3_PRODUCTION_PLAN.md`
- **Checkpoint 1 record:** `production/PHASE_3_CHECKPOINT_1.md`
- **Checkpoint 2 record:** `production/PHASE_3_CHECKPOINT_2.md`
- **Deployment control:** `production/PHASE_3_DEPLOYMENT_CONTROL.md`
- **Deployment workflow:** `.github/workflows/deploy-pages.yml`
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

## Phase 3 completion to date

### Checkpoint 1: Production artifact foundation

Complete. The production `docs/` target, canonical metadata, sitemap, robots file, `.nojekyll`, 404 page, release manifest, and repeatable Phase 3 verification workflow passed.

### Checkpoint 2: Visual release review

Complete. Nine representative routes were reviewed at desktop and mobile widths. The release has 105 unique document titles, 105 unique descriptions, approved favicon assets, an approved 1200 × 630 social-sharing image, clean normal-state screenshots, successful keyboard checks, no horizontal overflow, no browser-console errors, and no serious or critical accessibility violations.

The verified Checkpoint 2 source commit is `2704e086c56e19f8eb5919b9fd15fda7c5da0aae`. Verification run `28716485973` passed all production checks and generated artifact `8084545538`.

### Checkpoint 3: Deployment preparation

Prepared, not executed. The project now includes:

- GitHub's supported Pages artifact publication method
- a manual-only deployment workflow
- exact 40-character release-SHA validation
- typed `DEPLOY` confirmation
- a fresh production rebuild and complete verification before upload
- a protected `github-pages` deployment environment
- a postdeployment live-site smoke test
- retained predeployment and live-deployment evidence
- a documented rollback procedure

## Current release state

The deployment mechanism is ready, but the pull request remains a draft and the live site has not changed. The remaining sequence is explicit release authorization, merge into `main`, manual deployment against the recorded merge SHA, public smoke testing, live owner approval, and the Phase 3 lock.

## Current release rule

The public website must not be switched to the redesigned build until the production output is generated, all required verification passes, representative screens are reviewed, Amy Laird explicitly authorizes release, the live deployment is tested, direct reading routes work, assets load correctly, and the live result receives final approval.
