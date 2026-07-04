# Phase 3 Production Build and Launch

## Status

- **Phase:** 3
- **Status:** LOCKED
- **Started:** July 4, 2026
- **Completed:** July 4, 2026
- **Approved to begin by:** Amy Laird
- **Final live-site approval by:** Amy Laird
- **Predecessor:** Phase 2, LOCKED
- **Checkpoint 1 record:** `production/PHASE_3_CHECKPOINT_1.md`
- **Checkpoint 2 record:** `production/PHASE_3_CHECKPOINT_2.md`
- **Deployment control:** `production/PHASE_3_DEPLOYMENT_CONTROL.md`
- **Phase 3 lock:** `production/PHASE_3_LOCK.md`
- **Production URL:** `https://amy2213.github.io/The-Woman-At-The-Edge-Of-The-Map/`
- **Deployed release commit:** `f75bf9bfc1371e825bbc798f32d992c047b3f801`

## Objective

Convert the locked Phase 2 architecture into the final production website, verify the release artifact, deploy it through GitHub Pages, test the public URL, and obtain owner approval before locking Phase 3.

**Objective complete.**

Phase 3 did not reopen the manuscript, canonical reading order, visual direction, route contract, or accessibility baseline.

## Locked inputs

- **Source manuscript:** KDP Ready v7 Final Pass
- **Source SHA-256:** `0f595f0080e7584f6fde1d42edc607bdf123ab40207b3c9eb54a0c21c7f45072`
- **Canonical assembled SHA-256:** `6d0c60c1120fa5c9f631e4a6692a92de858ae7a385a511ca5c53d1898da301f5`
- **Canonical sections:** 7
- **Canonical works:** 94
- **Core generated pages:** 104
- **Design direction:** The Living Map
- **Phase 2 lock:** `architecture/PHASE_2_LOCK.md`

## Production URL

The launched production website is:

`https://amy2213.github.io/The-Woman-At-The-Edge-Of-The-Map/`

The public base URL remains configurable at build time so a future approved custom domain does not require rewriting manuscript or template data.

## Work packages

### 3.1 Production build contract

- [x] Create the Phase 3 production branch.
- [x] Create the Phase 3 control record.
- [x] Change the default generated output from temporary preview storage to `docs/`.
- [x] Keep output and public base URL configurable through build-time environment values.
- [x] Generate `.nojekyll` for predictable GitHub Pages asset handling.
- [x] Generate a production `404.html`.
- [x] Generate `robots.txt`.
- [x] Generate standards-compliant `sitemap.xml`.
- [x] Generate a release manifest containing content and source hashes.

### 3.2 Search and sharing metadata

- [x] Add canonical URLs to every generated page.
- [x] Add Open Graph title, description, URL, content type, and image metadata.
- [x] Add Twitter large-image card metadata.
- [x] Confirm unique page titles and descriptions across repeated work titles.
- [x] Add approved favicon assets.
- [x] Add an approved social-sharing image.

### 3.3 Release verification

- [x] Validate the canonical content source.
- [x] Generate the complete production artifact.
- [x] Confirm all 104 core pages plus release-support files.
- [x] Run the complete internal-link check.
- [x] Run desktop and mobile browser checks.
- [x] Run keyboard and skip-link checks.
- [x] Run automated accessibility checks.
- [x] Confirm no serious or critical accessibility violations.
- [x] Review representative normal-state desktop and mobile screenshots.
- [x] Record Checkpoint 2 visual, metadata, and release-asset evidence.

### 3.4 Deployment preparation and execution

- [x] Confirm GitHub Pages artifact publication method.
- [x] Create a manual-only guarded deployment workflow.
- [x] Require an exact release SHA and typed deployment confirmation.
- [x] Require a full rebuild and verification before artifact upload.
- [x] Add an automated postdeployment live-site smoke test.
- [x] Document deployment, evidence, and rollback controls.
- [x] Obtain Amy Laird's explicit release authorization.
- [x] Merge the approved production branch into `main`.
- [x] Run the manual deployment workflow against the recorded release commit.
- [x] Confirm the production URL returns the redesigned landing page.
- [x] Confirm direct reading routes return HTTP 200.
- [x] Confirm CSS, fonts, metadata, sitemap, robots file, images, and 404 page load correctly.
- [x] Confirm the former root-site experience is no longer being served.

### 3.5 Release evidence and lock

- [x] Record the deployed commit and successful workflow run.
- [x] Complete and review the live-site smoke-test report.
- [x] Obtain Amy Laird's final live-release approval.
- [x] Create `production/PHASE_3_LOCK.md`.
- [x] Update `PROJECT_STATUS.md` to record the launched release.

## Checkpoints

### Checkpoint 1: Production artifact foundation

**COMPLETE.** The `docs/` production artifact, release metadata, sitemap, robots file, 404 page, release manifest, and repeatable Phase 3 verification workflow passed. See `production/PHASE_3_CHECKPOINT_1.md`.

### Checkpoint 2: Visual release review

**COMPLETE.** Nine representative routes were reviewed at desktop and mobile widths. Normal-state screenshots, unique metadata, favicon assets, and the social-sharing image passed release verification. See `production/PHASE_3_CHECKPOINT_2.md`.

### Checkpoint 3: Public deployment

**COMPLETE.** The supported GitHub Pages artifact method, guarded manual deployment workflow, exact-SHA authorization gate, predeployment verification, protected production environment, postdeployment smoke test, evidence retention, and rollback procedure were used successfully. The public site is live at the production URL.

### Checkpoint 4: Phase lock

**COMPLETE.** Amy Laird reviewed the launched website and approved the live release with the statement, “It looks great.” Final release identity, deployment evidence, corrective smoke-test history, rollback controls, and future change-control rules are recorded in `production/PHASE_3_LOCK.md`.

## Final release rule

Phase 3 is locked. Future changes to manuscript content, canonical order, routes, design, accessibility behavior, metadata, release assets, build logic, or deployment behavior require a documented change request, complete verification, authorized deployment, and live review. Apparently even websites deserve boundaries once they finally behave.
