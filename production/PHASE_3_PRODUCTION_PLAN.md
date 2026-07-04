# Phase 3 Production Build and Launch

## Status

- **Phase:** 3
- **Status:** IN PROGRESS
- **Started:** July 4, 2026
- **Approved to begin by:** Amy Laird
- **Working branch:** `redesign/phase-3-production`
- **Base branch:** `main`
- **Predecessor:** Phase 2, LOCKED
- **Live website:** Existing root-site release remains unchanged until production approval

## Objective

Convert the locked Phase 2 architecture into the final production website, verify the release artifact, deploy it through GitHub Pages, test the public URL, and obtain owner approval before locking Phase 3.

Phase 3 does not reopen the manuscript, canonical reading order, visual direction, route contract, or accessibility baseline.

## Locked inputs

- **Source manuscript:** KDP Ready v7 Final Pass
- **Source SHA-256:** `0f595f0080e7584f6fde1d42edc607bdf123ab40207b3c9eb54a0c21c7f45072`
- **Canonical assembled SHA-256:** `6d0c60c1120fa5c9f631e4a6692a92de858ae7a385a511ca5c53d1898da301f5`
- **Canonical sections:** 7
- **Canonical works:** 94
- **Core generated pages:** 104
- **Design direction:** The Living Map
- **Phase 2 lock:** `architecture/PHASE_2_LOCK.md`

## Production URL assumption

Until a custom domain is explicitly approved, production metadata will target the repository GitHub Pages URL:

`https://amy2213.github.io/The-Woman-At-The-Edge-Of-The-Map/`

This value remains configurable at build time so a future custom domain does not require rewriting manuscript or template data.

## Work packages

### 3.1 Production build contract

- [x] Create the Phase 3 production branch.
- [x] Create the Phase 3 control record.
- [ ] Change the default generated output from temporary preview storage to `docs/`.
- [ ] Keep output and public base URL configurable through build-time environment values.
- [ ] Generate `.nojekyll` for predictable GitHub Pages asset handling.
- [ ] Generate a production `404.html`.
- [ ] Generate `robots.txt`.
- [ ] Generate standards-compliant `sitemap.xml`.
- [ ] Generate a release manifest containing content and source hashes.

### 3.2 Search and sharing metadata

- [ ] Add canonical URLs to every generated page.
- [ ] Add Open Graph title, description, URL, and content type metadata.
- [ ] Add Twitter summary metadata.
- [ ] Confirm unique page titles and descriptions.
- [ ] Add approved favicon assets.
- [ ] Add an approved social-sharing image.

### 3.3 Release verification

- [ ] Validate the canonical content source.
- [ ] Generate the complete production artifact.
- [ ] Confirm all 104 core pages plus release-support files.
- [ ] Run the complete internal-link check.
- [ ] Run desktop and mobile browser checks.
- [ ] Run keyboard and skip-link checks.
- [ ] Run automated accessibility checks.
- [ ] Confirm no serious or critical accessibility violations.
- [ ] Review representative screenshots with the owner.

### 3.4 Deployment

- [ ] Confirm GitHub Pages publication method.
- [ ] Configure the deployment workflow or approved branch source.
- [ ] Deploy only the verified release artifact.
- [ ] Confirm the production URL returns the redesigned landing page.
- [ ] Confirm direct reading routes return HTTP 200.
- [ ] Confirm CSS, fonts, metadata, sitemap, robots file, and 404 page load correctly.
- [ ] Confirm the former root-site experience is no longer being served after approval.

### 3.5 Release approval and lock

- [ ] Record the deployed commit and workflow run.
- [ ] Complete a live-site smoke-test report.
- [ ] Obtain Amy Laird's release approval.
- [ ] Merge the production branch into `main`.
- [ ] Create `production/PHASE_3_LOCK.md`.
- [ ] Update `PROJECT_STATUS.md` to record the launched release.

## Checkpoints

### Checkpoint 1: Production artifact foundation

Complete the production output path, release metadata, sitemap, robots file, 404 page, release manifest, and repeatable verification workflow.

### Checkpoint 2: Visual release review

Review the production artifact and representative desktop and mobile screenshots. Correct only release defects that preserve the Phase 1 and Phase 2 locks.

### Checkpoint 3: Public deployment

Deploy the approved artifact, test the public URL and direct routes, and document the live release.

### Checkpoint 4: Phase lock

Record owner approval, final hashes, deployed commit, deployment evidence, and change-control rules.

## Release rule

No production deployment is approved merely because a build exists or a workflow turns green. The release must also be visually reviewed, deployed successfully, tested at the public URL, and approved by Amy Laird. Computers remain tragically unable to determine whether a website actually feels finished.