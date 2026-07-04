# Phase 3 Checkpoint 1

## Status

- **Phase:** 3, production build and launch
- **Checkpoint:** 1, production artifact foundation
- **Status:** COMPLETE
- **Date:** July 4, 2026
- **Working branch:** `redesign/phase-3-production`
- **Draft pull request:** #2
- **Verification run:** `28714923288`
- **Verification job:** `85154515247`
- **Production artifact ID:** `8084113012`
- **Artifact SHA-256:** `79b6084aa508a484ed6e243f575d13268d1f49592e7af8ddc582e7f4d25920e4`
- **Live website:** Unchanged

## Production build foundation

The generated site now targets `docs/` by default rather than the Phase 2 temporary preview directory. Both the output directory and public base URL remain configurable at build time.

Default production metadata targets:

`https://amy2213.github.io/The-Woman-At-The-Edge-Of-The-Map/`

No deployment occurred during this checkpoint.

## Generated release

The verified artifact contains:

- 1 landing page
- 1 map page
- 7 section overview pages
- 94 canonical reading pages
- 1 closing page
- 1 production 404 page
- production CSS assets
- `.nojekyll`
- `robots.txt`
- `sitemap.xml`
- `sitemap.txt`
- `release-manifest.json`
- `build-report.json`

### Page counts

- **Core canonical HTML pages:** 104
- **Support HTML pages:** 1
- **Total generated HTML files:** 105

## Production metadata

Every canonical generated page now includes:

- a unique document title
- a page description
- author metadata
- robots index and follow instructions
- a canonical production URL
- Open Graph locale, type, site name, title, description, and URL
- Twitter summary-card title and description

Approved favicon and social-sharing image assets remain open Phase 3 tasks.

## Release identity

The production release manifest confirms:

- **Source manuscript SHA-256:** `0f595f0080e7584f6fde1d42edc607bdf123ab40207b3c9eb54a0c21c7f45072`
- **Canonical assembled SHA-256:** `6d0c60c1120fa5c9f631e4a6692a92de858ae7a385a511ca5c53d1898da301f5`
- **Sections:** 7
- **Works:** 94
- **Core pages:** 104
- **Total HTML pages:** 105

## Verification result

The Phase 3 production workflow completed successfully.

Passed checks:

- canonical manuscript validation
- complete production build
- required release-file contract
- exact source and assembled hashes
- exact section, work, and page counts
- 1,198 internal links
- representative landing, map, section, poem, prose, archive, letter, Coda, and closing routes
- desktop viewport checks
- mobile viewport checks
- keyboard-first skip-link behavior
- visible focus behavior
- canonical metadata presence
- browser-console checks
- horizontal-overflow checks
- WCAG automated scanning

### Browser QA totals

- **Representative pages:** 9
- **Viewports:** 2
- **Total browser cases:** 18
- **Failures:** 0
- **Serious or critical accessibility violations:** 0
- **Console errors:** 0
- **Missing canonical links:** 0

## Checkpoint decision

Checkpoint 1 is accepted as a verified production-artifact foundation. It does not authorize public deployment.

Phase 3 proceeds to Checkpoint 2: visual release review, approved favicon and social-sharing assets, and final production presentation corrections before deployment.