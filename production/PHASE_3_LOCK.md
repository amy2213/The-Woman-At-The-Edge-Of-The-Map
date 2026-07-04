# Phase 3 Lock

## Status

- **Phase:** 3, production build and launch
- **Status:** LOCKED
- **Lock date:** July 4, 2026
- **Owner:** Amy Laird
- **Owner release authorization:** Approved before merge and deployment
- **Owner live-site approval:** “It looks great”
- **Production URL:** `https://amy2213.github.io/The-Woman-At-The-Edge-Of-The-Map/`
- **Deployed release commit:** `f75bf9bfc1371e825bbc798f32d992c047b3f801`
- **Phase 3 production merge commit:** `77f1abbaec1fd66c342a7c108e0ce3bd94b02331`
- **Smoke-test correction merge commit:** `f75bf9bfc1371e825bbc798f32d992c047b3f801`
- **Successful deployment workflow:** `Deploy Verified Release to GitHub Pages`, run number 4
- **Successful jobs:** `build-and-verify`, `deploy-and-smoke-test`
- **Release evidence artifacts:** 3

## Locked release identity

The launched website is the verified Living Map release of *The Woman at the Edge of the Map*.

### Canonical source

- **Source manuscript:** KDP Ready v7 Final Pass
- **Source manuscript SHA-256:** `0f595f0080e7584f6fde1d42edc607bdf123ab40207b3c9eb54a0c21c7f45072`
- **Canonical assembled SHA-256:** `6d0c60c1120fa5c9f631e4a6692a92de858ae7a385a511ca5c53d1898da301f5`
- **Canonical sections:** 7
- **Canonical works:** 94
- **Core generated pages:** 104
- **Total generated HTML files including 404:** 105

### Locked design system

- **Creative direction:** The Living Map
- **Foundation:** bright ivory and white surfaces with ink-blue text
- **Primary accents:** sea glass, horizon blue, coral, sage, lavender gray, and restrained saffron
- **Literary font:** Newsreader
- **Interface font:** Inter
- **Archive font:** IBM Plex Mono
- **Architecture:** dependency-light Node.js static generation

## Release verification

Before deployment, the release passed:

- canonical content validation
- complete static production build
- release-image rendering
- release-contract verification
- all internal-link checks
- desktop browser checks
- mobile browser checks
- keyboard and skip-link checks
- metadata checks
- horizontal-overflow checks
- browser-console checks
- automated accessibility checks
- representative visual screenshot review

The release has:

- 105 unique document titles
- 105 unique descriptions
- zero repeated-title metadata collisions
- no serious or critical accessibility violations
- no browser-console errors in the tested routes
- no horizontal-overflow failures in the tested routes
- approved favicon assets
- approved Apple touch icon
- approved 1200 × 630 social-sharing image

## Deployment and live verification

The authorized release was deployed through the guarded manual GitHub Pages workflow.

The workflow required:

- the `main` release ref
- the exact authorized 40-character commit SHA
- the exact typed confirmation `DEPLOY`
- a complete rebuild and verification before artifact upload
- deployment through the protected `github-pages` environment
- a public live-site smoke test after deployment

The final successful run completed both jobs:

1. `build-and-verify`
2. `deploy-and-smoke-test`

The live smoke test confirmed the public availability of:

- the redesigned landing page
- the reading map
- representative section, poem, prose, Coda, and closing routes
- production CSS
- favicon assets
- Apple touch icon
- social-sharing image
- `robots.txt`
- `sitemap.xml`
- the custom 404 page

## Corrective release note

The first deployment successfully published the website, but its postdeployment smoke test produced three false negatives because the test expected stale text:

- `The Quilt` was expected at canonical position 8 instead of its correct position 6.
- The 404 heading was expected as `The map lost this coordinate.` instead of the approved `This path leaves the map.`
- The 404 navigation was expected as `Return to the map` instead of the approved `Open the Map`.

Pull request #3 corrected only those test expectations. It did not change the manuscript, generated website, routes, or design. The corrected workflow then passed fully on deployed commit `f75bf9bfc1371e825bbc798f32d992c047b3f801`.

## Owner approval

Amy Laird reviewed the live website after the successful deployment and stated:

> It looks great

That statement is recorded as final owner approval of the live Phase 3 release.

## Change control

Phase 3 is locked. Future changes must not silently alter the launched release.

Any change to the following requires a new documented change request, verification pass, and authorized deployment:

- manuscript wording or ordering
- canonical work records
- page routes
- navigation behavior
- design tokens or typography
- accessibility behavior
- release metadata
- favicon or sharing assets
- build or deployment workflow
- production URL behavior

Routine documentation updates may be committed without redeploying the website when they do not alter the generated production artifact.

## Rollback

The historical pre-redesign branch remains preserved at:

`archive/pre-redesign-2026-07-04`

Any rollback must use the guarded deployment workflow and record the selected commit, reason, workflow result, live smoke-test result, and owner approval.

## Final decision

Phase 3 is complete and locked. The redesigned Living Map website is launched, publicly available, verified, and approved by Amy Laird.
