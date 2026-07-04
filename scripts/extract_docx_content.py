#!/usr/bin/env python3
"""Extract a reviewable content draft from the locked Word manuscript.

This is a migration helper, not an editor. It preserves source text and inline
formatting while flagging format decisions that still require human review.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

from docx import Document
from docx.text.paragraph import Paragraph

LOCKED_SOURCE_SHA256 = "0f595f0080e7584f6fde1d42edc607bdf123ab40207b3c9eb54a0c21c7f45072"
EXPECTED_SECTION_COUNT = 7
EXPECTED_PIECE_COUNT = 94
EXPECTED_SECTION_COUNTS = [19, 10, 16, 19, 15, 12, 3]
EXCLUDED_TITLES = {"This Past Year"}

SECTION_ACCENTS = [
    "horizon",
    "indigo",
    "coral",
    "sage",
    "sea-glass",
    "lavender-gray",
    "saffron",
]

ROMAN_LABELS = ["Part I", "Part II", "Part III", "Part IV", "Part V", "Part VI", "Coda"]

ARCHIVE_PREFIXES = (
    "FILE:",
    "Player Memo:",
    "Operational Report:",
    "Court Exhibit",
    "Testimony Excerpt",
    "Redacted Testimony",
)

LETTER_PREFIXES = (
    "To ",
    "Unsent Letter",
)

LIST_TITLES = {
    "Legend",
    "Ritual Blueprint: How to Reclaim a Room That Hurt You",
    "Inventory of Things I’m Not Sorry For",
}

DIALOGUE_PREFIXES = ("Dialogue:",)

# Explicit decisions from source review. These override heuristics but never alter text.
FORMAT_OVERRIDES = {
    "Abilene": "poem",
    "Twice Without Warning": "poem",
    "The One I Keep in the Basement": "poem",
    "What You Don’t Say Still Counts": "poem",
    "Belle of the Pity Party": "poem",
    "God Doesn’t Knock": "poem",
}


@dataclass(frozen=True)
class PieceRange:
    section_index: int
    section_title: str
    title: str
    heading_index: int
    body_start: int
    body_end: int
    order: int
    global_order: int


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def slugify(value: str) -> str:
    normalized = (
        value.lower()
        .replace("’", "")
        .replace("'", "")
        .replace("“", "")
        .replace("”", "")
        .replace("&", " and ")
    )
    normalized = re.sub(r"[^a-z0-9]+", "-", normalized).strip("-")
    return normalized or "untitled"


def paragraph_runs(paragraph: Paragraph) -> list[dict[str, Any]]:
    runs: list[dict[str, Any]] = []
    for run in paragraph.runs:
        if run.text == "":
            continue
        item: dict[str, Any] = {"text": run.text}
        if run.italic:
            item["italic"] = True
        if run.bold:
            item["bold"] = True
        runs.append(item)
    if not runs and paragraph.text:
        runs.append({"text": paragraph.text})
    return runs


def rich_lines_from_paragraph(paragraph: Paragraph) -> list[dict[str, Any]]:
    """Split manual line breaks into line records while preserving run styling."""
    lines: list[list[dict[str, Any]]] = [[]]
    source_runs = paragraph.runs or []
    if not source_runs and paragraph.text:
        source_runs = [paragraph]

    for run in source_runs:
        text = run.text
        parts = text.split("\n")
        for index, part in enumerate(parts):
            if part:
                item: dict[str, Any] = {"text": part}
                if getattr(run, "italic", False):
                    item["italic"] = True
                if getattr(run, "bold", False):
                    item["bold"] = True
                lines[-1].append(item)
            if index < len(parts) - 1:
                lines.append([])

    return [{"runs": line or [{"text": ""}]} for line in lines]


def trim_blank_paragraphs(paragraphs: list[Paragraph]) -> list[Paragraph]:
    start = 0
    end = len(paragraphs)
    while start < end and not paragraphs[start].text.strip():
        start += 1
    while end > start and not paragraphs[end - 1].text.strip():
        end -= 1
    return paragraphs[start:end]


def split_on_blank(paragraphs: Iterable[Paragraph]) -> list[list[Paragraph]]:
    groups: list[list[Paragraph]] = []
    current: list[Paragraph] = []
    for paragraph in paragraphs:
        if paragraph.text.strip():
            current.append(paragraph)
        elif current:
            groups.append(current)
            current = []
    if current:
        groups.append(current)
    return groups


def paragraph_blocks(paragraphs: Iterable[Paragraph]) -> list[dict[str, Any]]:
    return [
        {"type": "paragraph", "runs": paragraph_runs(paragraph)}
        for paragraph in paragraphs
        if paragraph.text.strip()
    ]


def stanza_blocks(paragraphs: Iterable[Paragraph]) -> list[dict[str, Any]]:
    blocks: list[dict[str, Any]] = []
    for group in split_on_blank(paragraphs):
        lines: list[dict[str, Any]] = []
        for paragraph in group:
            lines.extend(rich_lines_from_paragraph(paragraph))
        blocks.append({"type": "stanza", "lines": lines})
    return blocks


def metadata_prefix(paragraphs: list[Paragraph]) -> tuple[list[dict[str, str]], list[Paragraph]]:
    entries: list[dict[str, str]] = []
    index = 0
    while index < len(paragraphs):
        text = paragraphs[index].text.strip()
        if not text:
            if entries:
                index += 1
                break
            index += 1
            continue
        match = re.match(r"^([A-Za-z][A-Za-z /-]{1,28}):\s*(.+)$", text)
        if not match or len(text) > 180:
            break
        entries.append({"label": match.group(1), "value": match.group(2)})
        index += 1
    return entries, paragraphs[index:]


def dialogue_blocks(paragraphs: list[Paragraph]) -> tuple[list[dict[str, Any]], list[str]]:
    blocks: list[dict[str, Any]] = []
    notes: list[str] = []
    body = trim_blank_paragraphs(paragraphs)

    if body and body[0].text.strip().startswith("Scene:"):
        blocks.append({"type": "paragraph", "runs": paragraph_runs(body[0])})
        body = trim_blank_paragraphs(body[1:])

    turns: list[dict[str, Any]] = []
    speaker: str | None = None
    collected: list[str] = []

    def flush() -> None:
        nonlocal collected, speaker
        if speaker is not None:
            turns.append({"speaker": speaker, "runs": [{"text": "\n".join(collected)}]})
        speaker = None
        collected = []

    for paragraph in body:
        text = paragraph.text.strip()
        if not text:
            continue
        if re.fullmatch(r"[A-Z][A-Z0-9 _-]{1,30}:", text):
            flush()
            speaker = text[:-1]
        elif speaker is None:
            notes.append(f"Unassigned dialogue line: {text[:80]}")
            blocks.append({"type": "paragraph", "runs": paragraph_runs(paragraph)})
        else:
            collected.append(text)
    flush()

    if turns:
        blocks.append({"type": "dialogue", "lines": turns})
    return blocks, notes


def list_blocks(title: str, paragraphs: list[Paragraph]) -> tuple[list[dict[str, Any]], list[str]]:
    body = trim_blank_paragraphs(paragraphs)
    notes: list[str] = []

    if title == "Legend":
        entries: list[dict[str, str]] = []
        for paragraph in body:
            text = paragraph.text.strip()
            if not text:
                continue
            if ":" in text:
                label, value = text.split(":", 1)
                entries.append({"label": label, "value": value.strip()})
            else:
                notes.append(f"Legend line without label separator: {text[:80]}")
        return ([{"type": "metadata", "entries": entries}] if entries else []), notes

    groups = split_on_blank(body)
    if not groups:
        return [], notes

    blocks: list[dict[str, Any]] = []
    first = groups[0]
    ordered = all(re.match(r"^\s*\d+[.)]\s+", p.text) for p in first)
    items: list[list[dict[str, Any]]] = []
    for paragraph in first:
        text = paragraph.text
        cleaned = re.sub(r"^\s*(?:[-•*]|\d+[.)])\s*", "", text)
        items.append([{"text": cleaned}])
    blocks.append({"type": "list", "ordered": ordered, "items": items})

    for group in groups[1:]:
        if all(len(p.text.strip()) < 120 for p in group):
            blocks.append({"type": "stanza", "lines": [line for p in group for line in rich_lines_from_paragraph(p)]})
        else:
            blocks.extend(paragraph_blocks(group))
    return blocks, notes


def detect_format(piece: PieceRange, paragraphs: list[Paragraph]) -> tuple[str, list[str]]:
    title = piece.title
    notes: list[str] = []
    nonblank = [p for p in paragraphs if p.text.strip()]
    texts = [p.text.strip() for p in nonblank]

    if title in FORMAT_OVERRIDES:
        return FORMAT_OVERRIDES[title], notes
    if title in LIST_TITLES:
        return "list", notes
    if title.startswith(DIALOGUE_PREFIXES):
        return "dialogue", notes
    if title.startswith(ARCHIVE_PREFIXES):
        return "archive", notes
    if title.startswith(LETTER_PREFIXES):
        return "letter", notes

    if title == "Before You Read":
        return "prose", notes

    if not texts:
        return "hybrid", ["No non-empty body paragraphs found."]

    poetry_style_count = sum(1 for p in nonblank if p.style.name == "Poetry")
    avg_length = sum(len(text) for text in texts) / len(texts)
    long_line_ratio = sum(1 for text in texts if len(text) >= 180) / len(texts)
    blank_count = sum(1 for p in paragraphs if not p.text.strip())

    if poetry_style_count / len(nonblank) >= 0.5:
        return "poem", notes
    if long_line_ratio >= 0.35 or avg_length >= 170:
        return "prose", notes
    if blank_count >= 2 and avg_length <= 120:
        return "poem", notes
    if avg_length <= 95:
        return "poem", ["Detected from short-line structure; confirm manually."]

    notes.append("Mixed paragraph profile; confirm hybrid versus prose manually.")
    return "hybrid", notes


def build_blocks(format_name: str, title: str, paragraphs: list[Paragraph]) -> tuple[list[dict[str, Any]], list[str]]:
    body = trim_blank_paragraphs(paragraphs)
    if format_name == "prose":
        return paragraph_blocks(body), []
    if format_name in {"poem", "letter", "hybrid"}:
        return stanza_blocks(body), []
    if format_name == "dialogue":
        return dialogue_blocks(body)
    if format_name == "list":
        return list_blocks(title, body)
    if format_name == "archive":
        entries, remainder = metadata_prefix(body)
        blocks: list[dict[str, Any]] = []
        notes: list[str] = []
        if entries:
            blocks.append({"type": "metadata", "entries": entries})
        blocks.extend(stanza_blocks(remainder))
        return blocks, notes
    raise ValueError(f"Unsupported format: {format_name}")


def normalized_hash(blocks: list[dict[str, Any]]) -> str:
    payload = json.dumps(blocks, ensure_ascii=False, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def discover_ranges(paragraphs: list[Paragraph]) -> tuple[list[dict[str, Any]], list[PieceRange]]:
    section_headings = [
        (index, paragraph.text.strip())
        for index, paragraph in enumerate(paragraphs)
        if paragraph.style.name == "Heading 1" and paragraph.text.strip()
    ]
    if len(section_headings) != EXPECTED_SECTION_COUNT:
        raise ValueError(f"Expected {EXPECTED_SECTION_COUNT} sections; found {len(section_headings)}")

    sections: list[dict[str, Any]] = []
    ranges: list[PieceRange] = []
    global_order = 0

    for section_index, (section_start, section_title) in enumerate(section_headings):
        section_end = section_headings[section_index + 1][0] if section_index + 1 < len(section_headings) else len(paragraphs)
        piece_headings = [
            (index, paragraphs[index].text.strip())
            for index in range(section_start + 1, section_end)
            if paragraphs[index].style.name == "Heading 2" and paragraphs[index].text.strip()
        ]
        sections.append({
            "id": f"section-{section_index + 1}",
            "title": section_title,
            "slug": "coda" if section_title == "Coda" else slugify(section_title),
            "order": section_index + 1,
            "label": ROMAN_LABELS[section_index],
            "accent": SECTION_ACCENTS[section_index],
        })

        for order, (heading_index, title) in enumerate(piece_headings, start=1):
            global_order += 1
            body_end = piece_headings[order][0] if order < len(piece_headings) else section_end
            ranges.append(PieceRange(
                section_index=section_index,
                section_title=section_title,
                title=title,
                heading_index=heading_index,
                body_start=heading_index + 1,
                body_end=body_end,
                order=order,
                global_order=global_order,
            ))

    return sections, ranges


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("docx", type=Path, help="Path to the locked DOCX manuscript")
    parser.add_argument("--out", type=Path, default=Path("content/book-content.draft.json"))
    parser.add_argument("--audit", type=Path, default=Path("content/extraction-audit.csv"))
    parser.add_argument("--allow-hash-mismatch", action="store_true", help="Development only")
    args = parser.parse_args()

    if not args.docx.exists():
        parser.error(f"DOCX not found: {args.docx}")

    actual_sha = sha256_file(args.docx)
    if actual_sha != LOCKED_SOURCE_SHA256 and not args.allow_hash_mismatch:
        print(
            f"Source hash mismatch. Expected {LOCKED_SOURCE_SHA256}, found {actual_sha}.",
            file=sys.stderr,
        )
        return 2

    document = Document(args.docx)
    paragraphs = list(document.paragraphs)
    sections, ranges = discover_ranges(paragraphs)

    if len(ranges) != EXPECTED_PIECE_COUNT:
        print(f"Expected {EXPECTED_PIECE_COUNT} works; found {len(ranges)}.", file=sys.stderr)
        return 3

    section_piece_counts = [sum(1 for item in ranges if item.section_index == index) for index in range(len(sections))]
    if section_piece_counts != EXPECTED_SECTION_COUNTS:
        print(
            f"Section counts mismatch. Expected {EXPECTED_SECTION_COUNTS}, found {section_piece_counts}.",
            file=sys.stderr,
        )
        return 4

    output_sections: list[dict[str, Any]] = []
    audit_rows: list[dict[str, Any]] = []

    for section_index, section in enumerate(sections):
        section_pieces: list[dict[str, Any]] = []
        piece_ranges = [item for item in ranges if item.section_index == section_index]
        for piece in piece_ranges:
            body = paragraphs[piece.body_start:piece.body_end]
            format_name, review_notes = detect_format(piece, body)
            blocks, block_notes = build_blocks(format_name, piece.title, body)
            review_notes.extend(block_notes)

            if piece.title in EXCLUDED_TITLES:
                review_notes.append("Excluded title detected and must not enter canonical output.")

            piece_record = {
                "id": f"piece-{piece.global_order:03d}",
                "title": piece.title,
                "slug": slugify(piece.title),
                "order": piece.order,
                "global_order": piece.global_order,
                "format": format_name,
                "source": {
                    "paragraph_start": piece.body_start,
                    "paragraph_end": piece.body_end - 1,
                    "normalized_sha256": normalized_hash(blocks),
                },
                "blocks": blocks,
                "migration": {
                    "status": "review_required" if review_notes else "extracted",
                    "notes": review_notes,
                },
            }
            section_pieces.append(piece_record)

            nonblank = [p for p in body if p.text.strip()]
            audit_rows.append({
                "piece_id": piece_record["id"],
                "section": section["title"],
                "title": piece.title,
                "format": format_name,
                "body_paragraphs": len(body),
                "nonblank_paragraphs": len(nonblank),
                "blank_paragraphs": len(body) - len(nonblank),
                "block_count": len(blocks),
                "italic_runs": sum(1 for p in nonblank for r in p.runs if r.italic),
                "bold_runs": sum(1 for p in nonblank for r in p.runs if r.bold),
                "review_required": bool(review_notes),
                "review_notes": " | ".join(review_notes),
                "normalized_sha256": piece_record["source"]["normalized_sha256"],
            })

        output_sections.append({**section, "pieces": section_pieces})

    output = {
        "schema_version": "1.0-draft",
        "source_lock": {
            "filename": args.docx.name,
            "sha256": actual_sha,
            "label": "KDP Ready v7 Final Pass, April 2026",
            "locked_date": "2026-07-04",
            "page_count": 124,
        },
        "book": {
            "title": "The Woman at the Edge of the Map",
            "subtitle": "Poems, Memories, Mythic Files",
            "author": "Amy Laird",
        },
        "sections": output_sections,
    }

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")

    args.audit.parent.mkdir(parents=True, exist_ok=True)
    with args.audit.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(audit_rows[0].keys()))
        writer.writeheader()
        writer.writerows(audit_rows)

    review_count = sum(1 for row in audit_rows if row["review_required"])
    print(f"Extracted {len(ranges)} works across {len(sections)} sections.")
    print(f"Draft: {args.out}")
    print(f"Audit: {args.audit}")
    print(f"Works requiring format review: {review_count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
