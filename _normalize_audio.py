"""Normalize the two audio product photos to match the gear grid framing."""
import os
from PIL import Image

GEAR = os.path.join(os.path.dirname(__file__), "gear")
ITEMS = ["airpods", "earphones"]
CANVAS = 640
FILL = 0.80
WHITE_THRESH = 244


def content_bbox(img):
    rgba = img.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    mask = Image.new("L", (w, h), 0)
    mpx = mask.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 8 and min(r, g, b) < WHITE_THRESH:
                mpx[x, y] = 255
    return mask.getbbox()


def normalize(name):
    img = Image.open(os.path.join(GEAR, name + ".png")).convert("RGBA")
    flat = Image.new("RGBA", img.size, (255, 255, 255, 255))
    flat.alpha_composite(img)
    product = flat.crop(content_bbox(flat))
    pw, ph = product.size
    scale = int(CANVAS * FILL) / max(pw, ph)
    nw, nh = max(1, round(pw * scale)), max(1, round(ph * scale))
    product = product.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS, CANVAS), (255, 255, 255, 255))
    canvas.alpha_composite(product, ((CANVAS - nw) // 2, (CANVAS - nh) // 2))
    canvas.convert("RGB").save(os.path.join(GEAR, name + ".webp"), "WEBP", quality=90, method=6)
    print(f"{name:12s} product {(pw, ph)} -> {CANVAS}x{CANVAS}")


for n in ITEMS:
    normalize(n)
print("done")
