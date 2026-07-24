"""
Normalize gear product photos so every card has consistent framing.

For each item the page uses:
  1. load the high-res .png source
  2. flatten onto white, find the product's bounding box (trim white/transparent)
  3. scale so the product's longest side fills a fixed fraction of a square canvas
  4. paste centered on a white square canvas with uniform margin
  5. export the .webp that setup.html references

Current .webp files are backed up to gear/_orig-webp/ first. The .png
originals are never modified.
"""
import os
from PIL import Image

GEAR = os.path.join(os.path.dirname(__file__), "gear")
BACKUP = os.path.join(GEAR, "_orig-webp")

# items referenced by setup.html
ITEMS = [
    "aoc-monitor", "lg-monitor", "dual-monitor-arm", "pc-case",
    "keyboard", "mouse", "rapoo-webcam", "xiaomi-light-bar", "apc-ups",
]

CANVAS = 640          # square output size
FILL = 0.80           # product's longest side occupies this fraction of canvas
WHITE_THRESH = 244    # pixels with min(R,G,B) >= this are treated as background


def content_bbox(img):
    """Bounding box of the product (non-white, non-transparent pixels)."""
    rgba = img.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    # build a mask: 255 where the pixel is part of the product
    mask = Image.new("L", (w, h), 0)
    mpx = mask.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 8 and min(r, g, b) < WHITE_THRESH:
                mpx[x, y] = 255
    return mask.getbbox()


def normalize(name):
    src = os.path.join(GEAR, name + ".png")
    img = Image.open(src).convert("RGBA")
    # flatten onto white so trimming is predictable
    flat = Image.new("RGBA", img.size, (255, 255, 255, 255))
    flat.alpha_composite(img)

    bbox = content_bbox(flat)
    product = flat.crop(bbox)
    pw, ph = product.size

    target = int(CANVAS * FILL)
    scale = target / max(pw, ph)
    nw, nh = max(1, round(pw * scale)), max(1, round(ph * scale))
    product = product.resize((nw, nh), Image.LANCZOS)

    canvas = Image.new("RGBA", (CANVAS, CANVAS), (255, 255, 255, 255))
    canvas.alpha_composite(product, ((CANVAS - nw) // 2, (CANVAS - nh) // 2))

    out = os.path.join(GEAR, name + ".webp")
    canvas.convert("RGB").save(out, "WEBP", quality=90, method=6)
    print(f"{name:20s} src {img.size}  product {(pw, ph)}  -> {CANVAS}x{CANVAS}")


def main():
    os.makedirs(BACKUP, exist_ok=True)
    for name in ITEMS:
        wp = os.path.join(GEAR, name + ".webp")
        bak = os.path.join(BACKUP, name + ".webp")
        if os.path.exists(wp) and not os.path.exists(bak):
            Image.open(wp).save(bak, "WEBP", quality=95)
    for name in ITEMS:
        normalize(name)
    print("done")


if __name__ == "__main__":
    main()
