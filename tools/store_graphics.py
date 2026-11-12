#!/usr/bin/env python3
"""Turns the recorded store screenshots into Play listing graphics in store-kit/graphics.

    ./gradlew recordRoborazziStoreDebug --tests '*StoreListingScreenshots*' --tests '*StoreGraphics*'
    python3 tools/store_graphics.py

Phone screenshots get a caption above a framed screenshot (1080 x 1920, no transparency, as
Google Play asks). The icon and feature graphic are copied as 24-bit PNGs.
"""
import pathlib

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
SHOTS = ROOT / "app/build/outputs/roborazzi"
OUT = ROOT / "store-kit/graphics"
FONTS = ROOT / "app/src/main/res/font"

# (recorded file, caption, look)
SCREENS = [
    ("listing-1-today", "Today's meals and workout\non one screen", "iron"),
    ("listing-2-plan", "Plan the week,\nor fill it in one tap", "iron"),
    ("listing-3-recipe", "Recipes with real portions\nand protein swaps", "iron"),
    ("listing-4-shopping", "One shopping list\nfor the whole household", "iron"),
    ("listing-5-gym", "Log every set,\nwith form tips for each move", "iron"),
    ("listing-6-glam-today", "Two looks: dark fantasy\nor Y2K glam", "glam"),
    ("listing-7-glam-plan", "Gym days and rest days\nright on your week", "glam"),
    ("listing-8-setup", "Set up in a minute.\nAdd your household.", "glam"),
]

LOOKS = {
    "iron": {"top": (44, 22, 18), "bottom": (12, 9, 8), "text": (240, 230, 214), "font": "cinzel_700.ttf", "size": 64},
    "glam": {"top": (255, 214, 236), "bottom": (233, 213, 255), "text": (176, 18, 110), "font": "fredoka_600.ttf", "size": 66},
}

W, H = 1080, 1920
SCALE = 0.78
RADIUS = 40


def gradient(top, bottom):
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    for y in range(H):
        t = y / (H - 1)
        draw.line([(0, y), (W, y)], fill=tuple(round(a + (b - a) * t) for a, b in zip(top, bottom)))
    return img


def rounded(img, radius):
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, img.width - 1, img.height - 1], radius=radius, fill=255)
    return mask


def frame(name, caption, look):
    style = LOOKS[look]
    canvas = gradient(style["top"], style["bottom"])
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.truetype(str(FONTS / style["font"]), style["size"])
    draw.multiline_text((W // 2, 190), caption, font=font, fill=style["text"], anchor="mm", align="center", spacing=18)

    shot = Image.open(SHOTS / f"{name}.png").convert("RGB")
    shot = shot.resize((round(shot.width * SCALE), round(shot.height * SCALE)), Image.LANCZOS)
    x, y = (W - shot.width) // 2, 340
    shadow = Image.new("L", (shot.width + 80, shot.height + 80), 0)
    ImageDraw.Draw(shadow).rounded_rectangle([40, 40, shot.width + 40, shot.height + 40], radius=RADIUS, fill=110)
    shadow = shadow.filter(ImageFilter.GaussianBlur(24))
    canvas.paste((0, 0, 0), (x - 40, y - 28), shadow)
    canvas.paste(shot, (x, y), rounded(shot, RADIUS))
    return canvas


def main():
    for i, (name, caption, look) in enumerate(SCREENS, start=1):
        out = OUT / "screenshots" / f"{i:02d}-{name.split('-', 2)[-1]}.png"
        frame(name, caption, look).save(out)
        print("wrote", out.relative_to(ROOT))
    Image.open(SHOTS / "play-icon-512.png").convert("RGB").save(OUT / "icon-512.png")
    Image.open(SHOTS / "play-feature-graphic.png").convert("RGB").save(OUT / "feature-graphic-1024x500.png")
    print("wrote icon and feature graphic")


if __name__ == "__main__":
    main()
