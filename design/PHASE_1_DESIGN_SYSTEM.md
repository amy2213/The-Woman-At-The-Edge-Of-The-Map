# Phase 1 Design System

## Status

- **Phase:** 1
- **Status:** IN PROGRESS
- **Started:** July 4, 2026
- **Working branch:** `redesign/source-lock-v7`
- **Live site:** Unchanged
- **Source authority:** `content/book-manifest.json` and the locked KDP Ready v7 Final Pass manuscript

## Approved creative direction

### The Living Map

The redesigned website will present the book as a contemporary literary journey through memory, fracture, myth, return, and ordinary life.

The interface will use modern cartographic language without imitating an antique treasure map:

- topographic contour lines
- coordinates and directional marks
- fragmented boundaries
- translucent layers
- horizon lines
- open space
- subtle changes in light across the reading journey

The design must hold the book’s darkness without making the entire experience dark, gothic, antique, or funereal.

## Experience principles

1. **The whole arc matters.** The visual identity must represent survival, intelligence, humor, return, and ordinary life, not only trauma.
2. **Reading comes first.** Typography, spacing, navigation, and contrast must support long-form reading.
3. **Atmosphere without obstruction.** Mapping motifs remain restrained and never compete with the text.
4. **Source fidelity is non-negotiable.** Design may frame the manuscript but may not rewrite it.
5. **The interface becomes lighter as the book progresses.** Changes must be subtle enough to remain cohesive and accessible.
6. **No performative darkness.** Avoid black page fields, sepia overlays, ornate gold borders, gothic flourishes, and faux-aged paper.
7. **No generic wellness aesthetic.** The site should not look like a meditation app, therapy worksheet, or inspirational quote store.

## Core color system

### Foundations

| Token | Hex | Purpose |
|---|---|---|
| Canvas | `#F7F5F0` | Primary warm page background |
| Surface | `#FFFFFF` | Reading panels and raised surfaces |
| Ink | `#182633` | Primary text and strongest interface contrast |
| Slate | `#40505C` | Secondary text |
| Mist | `#DDE9ED` | Soft map layers and section fields |
| Line | `#C8D3D7` | Rules, borders, inactive contours |

### Accents

| Token | Hex | Purpose |
|---|---|---|
| Sea Glass | `#4D8C8A` | Primary interactive accent |
| Horizon | `#668EAC` | Links, progress, geographic marks |
| Coral | `#C87968` | Reckoning and emphasis |
| Saffron | `#D5AE62` | Restrained warmth and arrival |
| Indigo | `#58647F` | Seekers and Shadows |
| Sage | `#788F82` | The Myth and archival records |
| Lavender Gray | `#8C8498` | Letters and artifacts |

### Contrast rules

- Body text uses Ink on Canvas or Surface.
- Slate may be used for secondary text only at compliant sizes.
- Accent colors may not carry meaning without text, shape, or icon support.
- Pure black is reserved for rare print-like emphasis and not used as a full-screen background.
- Gold, sepia, rust, and dark brown are removed from the primary system.

## Typography

### Literary text

**Primary:** Newsreader

Fallback stack:

```css
font-family: "Newsreader", "Iowan Old Style", "Palatino Linotype", Georgia, serif;
```

Use for:

- poems
- prose
- section introductions
- dedication
- long-form reading pages

### Interface and navigation

**Primary:** Inter

Fallback stack:

```css
font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Use for:

- navigation
- buttons
- labels
- reading progress
- section metadata
- accessibility controls

### Archive and FILE pieces

**Primary:** IBM Plex Mono

Fallback stack:

```css
font-family: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace;
```

Use selectively for:

- FILE headers
- recovered-artifact metadata
- testimony labels
- operational reports
- coordinates and map markers

### Type scale

| Role | Desktop | Mobile | Weight |
|---|---:|---:|---:|
| Display title | 64–80px | 40–52px | 500 |
| Section title | 42–52px | 32–40px | 500 |
| Piece title | 34–42px | 28–34px | 500 |
| Reading body | 21px | 19px | 400 |
| Prose body | 20px | 18px | 400 |
| Interface body | 16px | 16px | 400–600 |
| Metadata | 13px | 13px | 500–600 |

Reading line height should remain between 1.65 and 1.9 depending on format. Poetic line breaks must never be reflowed intentionally.

## Spacing system

Base unit: `4px`

Approved scale:

- `4px`
- `8px`
- `12px`
- `16px`
- `24px`
- `32px`
- `48px`
- `64px`
- `96px`
- `128px`

Maximum reading width:

- poetry: `42rem`
- prose: `46rem`
- navigation and section overview: `72rem`

## Layout system

### Desktop

- Persistent but light navigation rail or compact chapter drawer
- Main content centered within a generous page field
- Reading page width capped for comfort
- Previous and next controls placed after the work and available through keyboard shortcuts
- Section breadcrumb remains visible but visually quiet

### Tablet

- Collapsible navigation
- Full-width section cards with reduced map decoration
- Reading width controlled with page padding

### Mobile

- Single-column layout
- Sticky compact header with section and menu access
- Minimum 16px interface text
- Large tap targets of at least 44px
- No fixed bottom controls that cover manuscript text
- Poem line breaks preserved; horizontal overflow handled only when absolutely necessary for special file formats

## Motion

Motion is supportive, not theatrical.

Approved:

- subtle opacity and position transitions under 300ms
- slow contour drift on the landing page at very low contrast
- progress-line movement tied to reader position
- restrained section transitions

Prohibited:

- pulsing instructions
- parallax that interferes with reading
- automatic text animation
- simulated page turning
- dramatic fades between every work
- required motion to understand navigation

All animation must respect `prefers-reduced-motion`.

## Section visual map

| Section | Accent | Visual language | Light level |
|---|---|---|---|
| Part I: The Edge | Horizon blue | incomplete contours, open horizon | neutral-light |
| Part II: Seekers and Shadows | Indigo | overlapping paths, translucent shadow fields | slightly deeper |
| Part III: The Reckoning | Coral | fractured grid, sharp directional marks | high contrast but not dark |
| Part IV: The Myth | Sage | archive labels, coordinates, technical linework | cool and structured |
| Part V: The Return | Sea glass | clearer geometry, widening paths | brighter |
| Part VI: Letters and Artifacts | Lavender gray | layered paper edges, preserved marks | soft and intimate |
| Coda | Saffron and horizon | minimal lines, daylight, open field | brightest and quietest |

## Primary components

### 1. Landing hero

Contains:

- title
- subtitle
- author
- dedication excerpt
- Begin at the Edge action
- Explore the Map action
- discreet content-note access
- abstract living-map background

The grayscale source image will not be used in the hero by default. It may later appear as a secondary editorial image if it supports the final composition.

### 2. Map overview

A seven-destination overview representing the six parts and Coda.

Each destination includes:

- section number
- title
- short approved thematic descriptor
- piece count
- reading progress state

The overview must remain understandable without the decorative map layer.

### 3. Section landing page

Contains:

- Roman numeral or Coda label
- section title
- short interface description
- Before You Read work where present
- ordered list of pieces
- count and estimated reading time
- continue-reading action

### 4. Standard reading page

Contains:

- section breadcrumb
- piece title
- manuscript body
- previous and next navigation
- return to section
- reading progress
- direct-link support

### 5. Long-form prose page

Uses:

- wider prose measure than poems
- paragraph rhythm optimized for sustained reading
- optional unobtrusive position marker
- no modal presentation

### 6. Archive reading page

Uses mono labels and structured metadata while keeping the actual literary body readable. Archive styling may distinguish labels from prose but may not turn the page into a fake government form.

### 7. Coda page

The Coda is a separate top-level destination. It uses reduced navigation, maximum white space, and the quietest visual treatment in the site.

## Navigation model

- Every work receives a stable direct URL.
- Browser back and forward controls must behave normally.
- The current section and piece remain identifiable at all times.
- Previous and next controls follow the canonical manifest order.
- Reader progress may be stored locally but must not require an account.
- “This Past Year” is excluded from canonical navigation.

## Content-note treatment

The content note remains easy to find without dominating the landing page.

Approved pattern:

- short visible label on the landing page
- expandable or dedicated accessible panel
- no forced acknowledgement gate
- no euphemistic rewriting of the source note

## Image policy

- No stock photos of anonymous sad women, roads, prisons, silhouettes, or hands against windows.
- No faux parchment or burned-paper effects.
- No decorative image may imply a literal event not present in the manuscript.
- Abstract mapping, horizon, coordinate, and paper-layer visuals are preferred.
- The source grayscale image remains under review and will be tested only as a secondary editorial element.

## Accessibility requirements

- WCAG 2.2 AA contrast targets
- semantic heading hierarchy
- keyboard-operable navigation
- visible focus states
- reduced-motion mode
- screen-reader labels for controls
- minimum 44px touch targets
- no hover-only information
- text resizing to 200% without loss of content or function
- logical reading order
- correct language metadata

## Representative screens required before Phase 1 lock

1. Landing page
2. Map overview
3. Section overview
4. Standard poem page
5. Long memoir page
6. Archive or FILE page
7. Coda page
8. Mobile menu and mobile reading page

## Phase 1 deliverables

- [x] Lock core creative direction
- [x] Establish color tokens
- [x] Establish typography system
- [x] Establish spacing and reading-width rules
- [x] Establish section visual progression
- [x] Establish navigation model
- [x] Establish accessibility baseline
- [x] Establish motion rules
- [x] Create initial CSS design tokens
- [ ] Build landing-page prototype
- [ ] Build standard reading-page prototype
- [ ] Build archive-page prototype
- [ ] Build Coda prototype
- [ ] Build mobile prototype
- [ ] Review representative screens
- [ ] Lock Phase 1

## Phase 1 acceptance criteria

Phase 1 may be locked when:

1. Representative desktop and mobile screens demonstrate the approved direction.
2. The palette no longer reads as brown, gold, black, sepia, gothic, or gloomy.
3. Standard poetry, long prose, and archive pieces are all comfortable to read.
4. The Coda is visually distinct without becoming a separate brand.
5. Accessibility and responsive behavior are demonstrated, not merely promised.
6. No source manuscript text has been rewritten during prototyping.
