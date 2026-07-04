# The Woman at the Edge of the Map

**Poems, Memories, Mythic Files**  
*Amy Laird · First Edition, 2026*

## Read the live collection

**[Open The Woman at the Edge of the Map](https://amy2213.github.io/The-Woman-At-The-Edge-Of-The-Map/)**

Explore the full collection through the **[Reading Map](https://amy2213.github.io/The-Woman-At-The-Edge-Of-The-Map/map/)**.

> *For every version of me that got me this far. And for the ones who never made it.*

## About the collection

*The Woman at the Edge of the Map* is a 94-piece literary collection of poetry, memoir fragments, personal letters, archival documents, and mythic prose.

The canonical reading sequence moves through six parts and a separate Coda:

1. **[Part I: The Edge](https://amy2213.github.io/The-Woman-At-The-Edge-Of-The-Map/sections/part-i-the-edge/)** · 19 pieces  
   Memory, survival, masking, and the cost of passing.

2. **[Part II: Seekers and Shadows](https://amy2213.github.io/The-Woman-At-The-Edge-Of-The-Map/sections/part-ii-seekers-and-shadows/)** · 10 pieces  
   Ritual, identity, prophecy, and the internal wilderness.

3. **[Part III: The Reckoning](https://amy2213.github.io/The-Woman-At-The-Edge-Of-The-Map/sections/part-iii-the-reckoning/)** · 16 pieces  
   Grief, anger, memory, and the body's accounting.

4. **[Part IV: The Myth](https://amy2213.github.io/The-Woman-At-The-Edge-Of-The-Map/sections/part-iv-the-myth/)** · 19 pieces  
   Testimonies, case files, ritual documents, and the self as archive.

5. **[Part V: The Return](https://amy2213.github.io/The-Woman-At-The-Edge-Of-The-Map/sections/part-v-the-return/)** · 15 pieces  
   Choice, diagnosis, incarceration, recovery, and reclaimed language.

6. **[Part VI: Personal Letters, Closings, and Artifacts](https://amy2213.github.io/The-Woman-At-The-Edge-Of-The-Map/sections/part-vi-personal-letters-closings-and-artifacts/)** · 12 pieces  
   Letters unsent and sent, personal reckonings, closings, and artifacts.

7. **[Coda](https://amy2213.github.io/The-Woman-At-The-Edge-Of-The-Map/sections/coda/)** · 3 pieces  
   *The Woman Who Stayed*, *Terms of Engagement*, and *The Ordinary Miracle*.

## The Living Map website

The collection is presented as **The Living Map**, a responsive static literary website designed around movement, memory, and return.

The production site includes:

- 94 canonical works
- seven top-level reading destinations, including the separate Coda
- 104 core generated pages
- unique page titles and descriptions
- previous and next reading navigation
- a full reading map
- responsive desktop and mobile layouts
- keyboard navigation and skip links
- Open Graph and social-sharing metadata
- favicon and Apple touch icon assets
- a custom 404 page, sitemap, and robots file

## Local development

This project uses a dependency-light Node.js static-generation workflow.

```bash
npm test
npm run build
npm run render:assets
npm run check:links
```

The generated production site is written to `docs/` by default.

## Production deployment

The live website is deployed through a guarded, manual-only GitHub Pages workflow:

`.github/workflows/deploy-pages.yml`

A release must pass content validation, production build checks, internal-link verification, browser testing, mobile testing, keyboard testing, metadata checks, accessibility checks, and a live postdeployment smoke test.

## Content note

Suicide, abuse, and incarceration.

## Copyright

Copyright © 2026 Amy Laird. All rights reserved.
