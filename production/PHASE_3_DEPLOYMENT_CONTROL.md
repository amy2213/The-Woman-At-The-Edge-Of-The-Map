# Phase 3 Deployment Control

## Status

- **Phase:** 3, production build and launch
- **Checkpoint:** 3, public deployment preparation
- **Status:** PREPARED, NOT EXECUTED
- **Date prepared:** July 4, 2026
- **Workflow:** `.github/workflows/deploy-pages.yml`
- **Working branch:** `redesign/phase-3-production`
- **Production environment:** `github-pages`
- **Live website:** Unchanged

## Publication method

The redesigned website will be published through GitHub's supported Pages artifact workflow:

1. `actions/configure-pages@v5`
2. `actions/upload-pages-artifact@v3`
3. `actions/deploy-pages@v5`

The workflow packages only the verified `docs/` output. It does not publish the repository root, source manuscript, scripts, verification logs, or development records.

## Trigger control

The deployment workflow has only one trigger:

- `workflow_dispatch`

It does not run on:

- pushes
- pull requests
- merges
- schedules
- successful verification runs

Creating or merging the workflow cannot replace the live site by itself. A human must manually start the workflow and provide all required release inputs.

## Required release inputs

A deployment run requires:

- **Release ref:** the branch, tag, or commit to check out
- **Expected commit:** the complete 40-character SHA authorized for release
- **Confirmation:** the exact word `DEPLOY`

The workflow resolves the checked-out commit and compares it to the authorized SHA. Any mismatch stops the run before the production artifact is built or uploaded.

## Predeployment gates

Before GitHub Pages receives an artifact, the workflow must pass:

- canonical content validation
- production build using the Pages base URL
- release-image rendering
- release-contract verification
- internal-link verification
- desktop browser verification
- mobile browser verification
- keyboard and skip-link verification
- metadata verification
- horizontal-overflow verification
- browser-console verification
- automated accessibility verification

The verified output and predeployment logs are retained as workflow evidence.

## Deployment controls

- The deploy job cannot begin unless the complete build-and-verification job succeeds.
- The deploy job uses the protected `github-pages` environment.
- Only one production deployment may run at a time.
- An in-progress production deployment is not automatically cancelled by another request.
- The Pages job receives only the minimum required `pages: write` and `id-token: write` permissions.
- The deploy job checks out the same resolved commit verified by the build job.
- The packaged Pages artifact includes `.nojekyll` and no repository source files.

## Postdeployment smoke test

After deployment, the workflow checks the public URL for:

- redesigned landing page
- reading map
- Part I section page
- representative poem route
- representative prose route
- Coda route
- closing page
- `robots.txt`
- `sitemap.xml`
- custom `404.html`
- base and reader CSS
- SVG favicon
- PNG favicon
- Apple touch icon
- social-sharing image

The smoke test retries for up to approximately two minutes to allow GitHub Pages propagation. A failed smoke test marks the deployment workflow failed and preserves the failure evidence for review.

## Evidence retained

Each authorized deployment creates two evidence packages:

1. **Predeployment evidence**
   - content validation log
   - production build log
   - release-asset log
   - release-contract log
   - internal-link log
   - browser and accessibility verification logs
   - browser report and screenshots

2. **Live deployment evidence**
   - public smoke-test log
   - structured smoke-test JSON report
   - deployed release SHA
   - GitHub Pages deployment URL and workflow record

## Execution sequence

The workflow is being prepared inside draft pull request #2. It remains inert while the pull request is open.

The authorized release sequence is:

1. Complete Checkpoint 3 preparation and verification.
2. Obtain Amy Laird's explicit approval to release the redesigned website.
3. Mark pull request #2 ready and merge it into `main`.
4. Record the resulting `main` merge commit SHA.
5. Manually run **Deploy Verified Release to GitHub Pages** from `main`.
6. Enter the merge commit as both the release ref or resolved ref and the exact expected commit.
7. Enter `DEPLOY` as the confirmation.
8. Allow the workflow to rebuild, verify, package, deploy, and smoke test the release.
9. Review the public site and workflow evidence.
10. Record final owner approval and create the Phase 3 lock.

No deployment is authorized merely by the existence of this file or workflow.

## Rollback control

If a released site must be rolled back, the same manual workflow may deploy a previously verified commit only after explicit owner authorization. The protected pre-redesign branch remains available as historical recovery evidence:

`archive/pre-redesign-2026-07-04`

A rollback must be documented with the selected commit SHA, reason, workflow run, smoke-test result, and owner approval. Production should not become a roulette wheel simply because Git makes time travel look easy.
