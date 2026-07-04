# ADR-001: Section-scoped reading routes

- **Status:** Accepted
- **Date:** July 4, 2026
- **Phase:** 2

## Context

The manuscript contains multiple works titled **Before You Read**, each belonging to a different section. The canonical manifest therefore contains repeated piece slugs such as `before-you-read`.

A route shaped as `/read/{piece-slug}/` would collide and would pressure the project to invent non-manuscript titles merely to satisfy a technical shortcut. That is backwards.

## Decision

Individual reading routes will include both the section slug and piece slug:

```text
/read/{section-slug}/{piece-slug}/
```

Examples:

```text
/read/part-ii-seekers-and-shadows/before-you-read/
/read/part-iii-the-reckoning/before-you-read/
/read/part-iv-the-myth/before-you-read/
```

## Consequences

- Manuscript titles remain untouched.
- Piece slugs need only be unique within their own section.
- Permanent piece IDs remain globally unique.
- Direct links are clear and human-readable.
- Validators check uniqueness using the combined section and piece route.
- Global previous and next navigation continues to use permanent piece IDs and global order.

## Superseded wording

Any earlier Phase 2 reference to `/read/{piece-slug}/` is superseded by this decision.
