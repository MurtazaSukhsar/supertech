#!/usr/bin/env python3
"""
Build the Super Tech product catalogue as a print-ready A4 PDF.

Reads the catalogue data exported from `lib/products.ts` (see
scripts/README-catalogue.md) and lays it out as:

    cover -> one section per category -> 4 products per page -> back cover

Run:
    python3 scripts/build-catalogue-pdf.py data.json output.pdf
"""

from __future__ import annotations

import io
import json
import sys
from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas as pdfcanvas

# --- brand -----------------------------------------------------------------
# Sampled from the site's logo and Tailwind theme so print matches web.
NAVY = colors.HexColor("#00267C")
RED = colors.HexColor("#EE0009")
INK = colors.HexColor("#1A1D24")
MUTED = colors.HexColor("#5B6472")
RULE = colors.HexColor("#D8DDE5")
TINT = colors.HexColor("#F4F6F9")

PAGE_W, PAGE_H = A4
MARGIN = 16 * mm
CONTENT_W = PAGE_W - 2 * MARGIN

# 2 x 2 product grid
GUTTER = 8 * mm
CARD_W = (CONTENT_W - GUTTER) / 2
CARD_H = 108 * mm
IMG_H = 52 * mm

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

# Specs are listed in the source in significance order; more than this and the
# card overflows, so the tail is dropped rather than shrunk to unreadable type.
MAX_SPECS = 4


# --- helpers ---------------------------------------------------------------

_IMAGE_CACHE: dict[tuple[str, int], ImageReader | None] = {}


def load_image(rel_path: str, max_px: int = 700) -> ImageReader | None:
    """
    Load a image for ReportLab, downsampled for print.
    Supports local files as well as remote HTTP/HTTPS URLs (like Cloudinary).

    Source images are WebP, which ReportLab cannot embed directly, so each is
    decoded with Pillow. Transparency is flattened onto white to match how the
    product cards render on the site.
    """
    key = (rel_path, max_px)
    if key in _IMAGE_CACHE:
        return _IMAGE_CACHE[key]

    import urllib.request
    import urllib.error

    img = None
    if rel_path.startswith(("http://", "https://")):
        try:
            req = urllib.request.Request(rel_path, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=15) as response:
                img_data = response.read()
                img = PILImage.open(io.BytesIO(img_data))
        except Exception as exc:
            print(f"  ! could not download image {rel_path}: {exc}", file=sys.stderr)
            _IMAGE_CACHE[key] = None
            return None
    else:
        path = PUBLIC / rel_path.lstrip("/")
        if not path.exists():
            print(f"  ! missing image: {rel_path}", file=sys.stderr)
            _IMAGE_CACHE[key] = None
            return None
        try:
            img = PILImage.open(path)
        except Exception as exc:
            print(f"  ! could not read {rel_path}: {exc}", file=sys.stderr)
            _IMAGE_CACHE[key] = None
            return None

    try:
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGBA")
            flat = PILImage.new("RGB", img.size, (255, 255, 255))
            flat.paste(img, mask=img.split()[-1])
            img = flat
        else:
            img = img.convert("RGB")

        if max(img.size) > max_px:
            scale = max_px / max(img.size)
            img = img.resize(
                (max(1, round(img.width * scale)), max(1, round(img.height * scale))),
                PILImage.LANCZOS,
            )

        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=82, optimize=True, progressive=True)
        buf.seek(0)
        reader = ImageReader(buf)
    except Exception as exc:  # noqa: BLE001 - a bad image must not kill the build
        print(f"  ! could not process image {rel_path}: {exc}", file=sys.stderr)
        reader = None

    _IMAGE_CACHE[key] = reader
    return reader


_FADED_CACHE: dict[tuple[str, float], ImageReader | None] = {}


def load_faded_image(rel_path: str, strength: float, max_px: int = 400) -> ImageReader | None:
    """
    Load an image blended toward white, for use as a watermark.

    ReportLab's alpha handling does not apply cleanly to `drawImage`, so the
    fade is baked into the pixels instead: each channel is mixed toward white
    by `1 - strength`. A strength of 0.10 leaves a mark that is visible on a
    white page but never competes with the product photos beside it.
    """
    key = (rel_path, strength)
    if key in _FADED_CACHE:
        return _FADED_CACHE[key]

    path = PUBLIC / rel_path.lstrip("/")
    if not path.exists():
        _FADED_CACHE[key] = None
        return None

    try:
        img = PILImage.open(path)
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGBA")
            flat = PILImage.new("RGB", img.size, (255, 255, 255))
            flat.paste(img, mask=img.split()[-1])
            img = flat
        else:
            img = img.convert("RGB")

        if max(img.size) > max_px:
            scale = max_px / max(img.size)
            img = img.resize(
                (max(1, round(img.width * scale)), max(1, round(img.height * scale))),
                PILImage.LANCZOS,
            )

        white = PILImage.new("RGB", img.size, (255, 255, 255))
        img = PILImage.blend(white, img, strength)

        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=85, optimize=True)
        buf.seek(0)
        reader = ImageReader(buf)
    except Exception as exc:  # noqa: BLE001
        print(f"  ! could not fade {rel_path}: {exc}", file=sys.stderr)
        reader = None

    _FADED_CACHE[key] = reader
    return reader


def fit(c: pdfcanvas.Canvas, text: str, font: str, size: float, max_w: float) -> str:
    """Truncate `text` with an ellipsis so it fits `max_w` at the given font."""
    if c.stringWidth(text, font, size) <= max_w:
        return text
    ell = "..."
    while text and c.stringWidth(text + ell, font, size) > max_w:
        text = text[:-1]
    return text.rstrip() + ell


def wrap(c: pdfcanvas.Canvas, text: str, font: str, size: float,
         max_w: float, max_lines: int) -> list[str]:
    """Greedy word wrap, capped at `max_lines` with an ellipsis on overflow."""
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if c.stringWidth(trial, font, size) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
            if len(lines) == max_lines:
                break
    if cur and len(lines) < max_lines:
        lines.append(cur)
    if len(lines) == max_lines and words:
        joined = " ".join(lines)
        if len(joined) < len(text):
            lines[-1] = fit(c, lines[-1] + " ...", font, size, max_w)
    return lines


# --- page furniture --------------------------------------------------------

def draw_watermark(c: pdfcanvas.Canvas) -> None:
    """
    Faint logo in the bottom-right corner of a content page.

    It sits in the band between the product grid (which bottoms out at 23mm)
    and the footer rule (at 14mm), so it never overlaps a card or the footer
    text. Drawn after the cards so it is never painted over by a card's white
    fill.
    """
    mark = load_faded_image("/images/logo.webp", strength=0.16, max_px=300)
    if not mark:
        return

    h = 7.4 * mm
    iw, ih = mark.getSize()
    w = h * iw / ih
    c.drawImage(
        mark,
        PAGE_W - MARGIN - w,
        15.4 * mm,
        width=w, height=h, mask="auto",
    )


def draw_footer(c: pdfcanvas.Canvas, page_no: int, contact: dict) -> None:
    c.setStrokeColor(RULE)
    c.setLineWidth(0.6)
    c.line(MARGIN, 14 * mm, PAGE_W - MARGIN, 14 * mm)

    c.setFont("Helvetica", 7.5)
    c.setFillColor(MUTED)
    c.drawString(MARGIN, 9.5 * mm, contact["companyName"])
    c.drawRightString(
        PAGE_W - MARGIN, 9.5 * mm,
        f"{contact['phone']}   |   {contact['email']}",
    )
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(PAGE_W / 2, 9.5 * mm, str(page_no))


def draw_cover(c: pdfcanvas.Canvas, contact: dict, categories: list, n_products: int) -> None:
    c.setFillColor(NAVY)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Accent bar
    c.setFillColor(RED)
    c.rect(0, PAGE_H - 6 * mm, PAGE_W, 6 * mm, fill=1, stroke=0)

    # The logo artwork has a baked-in white background, so it needs a white
    # plate to sit on rather than being knocked out of the navy.
    logo = load_image("/images/logo.webp", max_px=1000)
    if logo:
        lw = 84 * mm
        iw, ih = logo.getSize()
        lh = lw * ih / iw
        plate_pad = 7 * mm
        c.setFillColor(colors.white)
        c.roundRect(
            (PAGE_W - lw) / 2 - plate_pad,
            PAGE_H - 54 * mm - lh - plate_pad,
            lw + 2 * plate_pad,
            lh + 2 * plate_pad,
            4 * mm, fill=1, stroke=0,
        )
        c.drawImage(logo, (PAGE_W - lw) / 2, PAGE_H - 54 * mm - lh,
                    width=lw, height=lh, mask="auto")

    c.setFillColor(RED)
    c.rect(PAGE_W / 2 - 26 * mm, PAGE_H - 128 * mm, 52 * mm, 1.8 * mm, fill=1, stroke=0)

    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 30)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 148 * mm, "PRODUCT CATALOGUE")

    c.setFillColor(colors.Color(1, 1, 1, alpha=0.85))
    c.setFont("Helvetica", 12)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 161 * mm, contact["tagline"])

    c.setFont("Helvetica", 10)
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.65))
    c.drawCentredString(
        PAGE_W / 2, PAGE_H - 173 * mm,
        f"{n_products} products across {len(categories)} categories",
    )

    # Contact block
    box_y = 34 * mm
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.08))
    c.roundRect(MARGIN, box_y, CONTENT_W, 44 * mm, 3 * mm, fill=1, stroke=0)

    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(PAGE_W / 2, box_y + 34 * mm, contact["companyName"])

    c.setFont("Helvetica", 9.5)
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.8))
    for i, line in enumerate([
        contact["address"],
        f"Tel / WhatsApp: {contact['phone']}",
        contact["email"],
    ]):
        c.drawCentredString(PAGE_W / 2, box_y + 25 * mm - i * 6.5 * mm, line)


def draw_back_cover(c: pdfcanvas.Canvas, contact: dict) -> None:
    """Closing page: the logo at full size, on the white it was drawn for."""
    c.setFillColor(NAVY)
    c.rect(0, PAGE_H - 6 * mm, PAGE_W, 6 * mm, fill=1, stroke=0)
    c.setFillColor(RED)
    c.rect(0, 0, PAGE_W, 6 * mm, fill=1, stroke=0)

    logo = load_image("/images/logo.webp", max_px=1100)
    if logo:
        lw = 110 * mm
        iw, ih = logo.getSize()
        lh = lw * ih / iw
        c.drawImage(logo, (PAGE_W - lw) / 2, PAGE_H - 118 * mm,
                    width=lw, height=lh, mask="auto")

    c.setFillColor(RED)
    c.rect(PAGE_W / 2 - 26 * mm, PAGE_H - 132 * mm, 52 * mm, 1.8 * mm, fill=1, stroke=0)

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 15)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 148 * mm, contact["companyName"])

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 10.5)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 158 * mm, contact["tagline"])

    # Contact panel
    box_y = 78 * mm
    c.setFillColor(TINT)
    c.roundRect(MARGIN + 18 * mm, box_y, CONTENT_W - 36 * mm, 52 * mm, 3 * mm,
                fill=1, stroke=0)

    rows = [
        ("Address", contact["address"]),
        ("Telephone / WhatsApp", contact["phone"]),
        ("Email", contact["email"]),
        ("Website", "supertechkuwait.com"),
    ]
    y = box_y + 42 * mm
    for label, value in rows:
        c.setFillColor(MUTED)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawCentredString(PAGE_W / 2, y, label.upper())
        c.setFillColor(INK)
        c.setFont("Helvetica", 10)
        c.drawCentredString(PAGE_W / 2, y - 5.5 * mm, value)
        y -= 13 * mm

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8.5)
    c.drawCentredString(PAGE_W / 2, 58 * mm,
                        "Request a quote for any product in this catalogue.")
    c.setFont("Helvetica-Oblique", 7.5)
    c.drawCentredString(PAGE_W / 2, 51 * mm,
                        "Specifications are indicative and may change without notice.")


def draw_section_header(c: pdfcanvas.Canvas, cat: dict, count: int) -> float:
    """Draw a category banner; returns the y coordinate to start cards at."""
    top = PAGE_H - MARGIN
    band_h = 26 * mm

    c.setFillColor(NAVY)
    c.roundRect(MARGIN, top - band_h, CONTENT_W, band_h, 2.5 * mm, fill=1, stroke=0)
    c.setFillColor(RED)
    c.rect(MARGIN, top - band_h, 2.2 * mm, band_h, fill=1, stroke=0)

    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 15)
    c.drawString(MARGIN + 8 * mm, top - 11 * mm, cat["name"].upper())

    c.setFont("Helvetica", 8.5)
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.75))
    desc = fit(c, cat["description"], "Helvetica", 8.5, CONTENT_W - 40 * mm)
    c.drawString(MARGIN + 8 * mm, top - 18.5 * mm, desc)

    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(colors.white)
    c.drawRightString(PAGE_W - MARGIN - 6 * mm, top - 11 * mm, f"{count} items")

    return top - band_h - 8 * mm


# --- product card ----------------------------------------------------------

def draw_card(c: pdfcanvas.Canvas, p: dict, x: float, y_top: float) -> None:
    """Draw one product card with its top-left corner at (x, y_top)."""
    y_bot = y_top - CARD_H

    c.setStrokeColor(RULE)
    c.setLineWidth(0.7)
    c.setFillColor(colors.white)
    c.roundRect(x, y_bot, CARD_W, CARD_H, 2 * mm, fill=1, stroke=1)

    # --- image well
    well_h = IMG_H
    c.setFillColor(TINT)
    c.roundRect(x + 1, y_top - well_h - 1, CARD_W - 2, well_h, 2 * mm, fill=1, stroke=0)

    img = load_image(p["images"][0]) if p.get("images") else None
    if img:
        iw, ih = img.getSize()
        avail_w, avail_h = CARD_W - 14 * mm, well_h - 8 * mm
        scale = min(avail_w / iw, avail_h / ih)
        dw, dh = iw * scale, ih * scale
        c.drawImage(
            img,
            x + (CARD_W - dw) / 2,
            y_top - well_h + (well_h - dh) / 2,
            width=dw, height=dh, mask="auto",
        )
    else:
        c.setFillColor(MUTED)
        c.setFont("Helvetica-Oblique", 8)
        c.drawCentredString(x + CARD_W / 2, y_top - well_h / 2, "image unavailable")

    cur = y_top - well_h - 7 * mm
    pad = 5 * mm
    text_w = CARD_W - 2 * pad

    # --- brand chip
    if p.get("brand"):
        label = p["brand"].upper()
        c.setFont("Helvetica-Bold", 6.5)
        chip_w = c.stringWidth(label, "Helvetica-Bold", 6.5) + 5 * mm
        c.setFillColor(NAVY)
        c.roundRect(x + pad, cur - 1 * mm, chip_w, 4.4 * mm, 1 * mm, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.drawString(x + pad + 2.5 * mm, cur + 0.35 * mm, label)
        cur -= 7 * mm
    else:
        cur -= 1.5 * mm

    # --- name
    c.setFillColor(INK)
    for line in wrap(c, p["name"], "Helvetica-Bold", 9.5, text_w, 2):
        c.setFont("Helvetica-Bold", 9.5)
        c.drawString(x + pad, cur, line)
        cur -= 4.6 * mm
    cur -= 1 * mm

    # --- description
    c.setFillColor(MUTED)
    for line in wrap(c, p["description"], "Helvetica", 7.4, text_w, 3):
        c.setFont("Helvetica", 7.4)
        c.drawString(x + pad, cur, line)
        cur -= 3.6 * mm

    # --- specs
    specs = [(k.strip(), v.strip()) for k, v in (p.get("specs") or {}).items()
             if k.strip() and v.strip()]
    # "Brand" duplicates the chip above, so it is not repeated in the table.
    specs = [s for s in specs if s[0].lower() != "brand"][:MAX_SPECS]

    if specs:
        # Anchored to the bottom of the card rather than flowing from the
        # description. Products carry between 2 and 4 specs, so a flowing
        # layout left a different amount of dead space under every card and
        # the grid read as ragged. Pinning the table to the baseline makes
        # each row line up across the page regardless of spec count.
        row_h = 4.0 * mm
        block_h = len(specs) * row_h
        rule_y = y_bot + pad + block_h + 1.5 * mm

        # Only draw if it clears the description; otherwise fall back to
        # flowing so text can never be overwritten.
        if rule_y > cur - 1 * mm:
            rule_y = cur - 2 * mm

        c.setStrokeColor(RULE)
        c.setLineWidth(0.5)
        c.line(x + pad, rule_y, x + CARD_W - pad, rule_y)

        row_y = rule_y - 4.2 * mm
        key_w = text_w * 0.42
        for k, v in specs:
            if row_y < y_bot + 2 * mm:
                break
            c.setFont("Helvetica-Bold", 6.8)
            c.setFillColor(MUTED)
            c.drawString(x + pad, row_y, fit(c, k, "Helvetica-Bold", 6.8, key_w - 2 * mm))
            c.setFont("Helvetica", 6.8)
            c.setFillColor(INK)
            c.drawString(x + pad + key_w, row_y,
                         fit(c, v, "Helvetica", 6.8, text_w - key_w))
            row_y -= row_h


# --- build -----------------------------------------------------------------

def build(data_path: Path, out_path: Path) -> None:
    data = json.loads(data_path.read_text(encoding="utf-8"))
    contact = data["contactInfo"]
    categories = data["categories"]
    products = data["products"]

    by_cat = {c["slug"]: [p for p in products if p["category"] == c["slug"]]
              for c in categories}

    c = pdfcanvas.Canvas(str(out_path), pagesize=A4)
    c.setTitle("Super Tech - Product Catalogue")
    c.setAuthor(contact["companyName"])
    c.setSubject("Air-conditioning materials, hardware, tools and construction supplies - Kuwait")
    c.setKeywords("hardware, Kuwait, HVAC, AC materials, tools, plumbing, electrical, Shuwaikh")

    # Cover
    draw_cover(c, contact, categories, len(products))
    c.showPage()

    # Product pages start immediately after the cover; each category banner
    # carries its own name and item count, so a separate contents page added
    # a page of navigation to a 20-page document that does not need it.
    current = 2
    for cat in categories:
        items = by_cat[cat["slug"]]
        if not items:
            continue

        idx = 0
        first_page_of_section = True
        while idx < len(items):
            if first_page_of_section:
                y = draw_section_header(c, cat, len(items))
                first_page_of_section = False
            else:
                c.setFillColor(MUTED)
                c.setFont("Helvetica-Bold", 8.5)
                c.drawString(MARGIN, PAGE_H - MARGIN - 4 * mm,
                             cat["name"].upper() + "  (continued)")
                c.setStrokeColor(RULE)
                c.line(MARGIN, PAGE_H - MARGIN - 7 * mm,
                       PAGE_W - MARGIN, PAGE_H - MARGIN - 7 * mm)
                y = PAGE_H - MARGIN - 13 * mm

            for row in range(2):
                if idx >= len(items):
                    break
                row_top = y - row * (CARD_H + GUTTER)
                if row_top - CARD_H < 20 * mm:
                    break
                for col in range(2):
                    if idx >= len(items):
                        break
                    draw_card(c, items[idx], MARGIN + col * (CARD_W + GUTTER), row_top)
                    idx += 1

            # After the cards so a card's white fill can never cover it.
            draw_watermark(c)
            draw_footer(c, current, contact)
            c.showPage()
            current += 1

    draw_back_cover(c, contact)
    c.showPage()

    c.save()
    print(f"wrote {out_path}  ({out_path.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    build(Path(sys.argv[1]), Path(sys.argv[2]))
