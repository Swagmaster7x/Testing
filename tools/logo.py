#!/usr/bin/env python3
"""Draws the Yoked logo: the outlines of a male and a female bodybuilder, with sparkles.

    pip install shapely pillow
    python3 tools/logo.py            # writes the launcher drawables and a preview sheet

The artwork is original. Each figure is built from simple body-part shapes (a head, tapered
limbs, a torso) joined into one silhouette, smoothed, and drawn as an outline. He holds a
double-biceps pose; she flexes one arm with the other hand on her hip, tucked in beside him.

Outputs:
  app/src/main/res/drawable/ic_launcher_foreground.xml   the adaptive icon's foreground
  app/src/main/res/drawable/ic_launcher_monochrome.xml   the same in one colour, for themed icons
  app/src/main/res/drawable/ic_logo_mark.xml             the mark on its own, for use inside the app
  store-kit/graphics/logo-preview.png                    how it looks at several sizes
"""
import math
import pathlib

from PIL import Image, ImageDraw
from shapely import affinity
from shapely.geometry import LineString, Point, Polygon
from shapely.ops import unary_union

ROOT = pathlib.Path(__file__).resolve().parent.parent
RES = ROOT / "app/src/main/res/drawable"
PREVIEW = ROOT / "store-kit/graphics/logo-preview.png"

# The adaptive icon canvas is 108 x 108; launchers show the middle 72 and may mask it to a
# circle 66 across, so everything that matters stays inside that circle.
SIZE = 108
SAFE_RADIUS = 33

BACKGROUND = "#120F0D"
HIS = "#F3E4C3"      # bone
HERS = "#FF5FAE"     # hot pink
SPARKLE = "#FFD979"  # gold
SPARKLE_SMALL = "#FFFFFF"
STROKE = 1.25


# ---------- building a figure ----------

def circle(x, y, r):
    return Point(x, y).buffer(r, 32)


def ellipse(x, y, rx, ry):
    return affinity.scale(Point(x, y).buffer(1, 32), rx, ry)


def limb(a, ra, b, rb):
    """A tapered limb: the hull of a circle at each end."""
    return unary_union([circle(a[0], a[1], ra), circle(b[0], b[1], rb)]).convex_hull


def mirrored(shapes):
    return shapes + [affinity.scale(s, -1, 1, origin=(0, 0)) for s in shapes]


def smooth(shape, r):
    """Rounds every corner, inside and out, by about r."""
    return shape.buffer(r, 16).buffer(-2 * r, 16).buffer(r, 16)


def shin(knee, ankle, calf, r_knee, r_calf, r_ankle):
    """A lower leg that swells at the calf and narrows to the ankle, without a lump."""
    return unary_union([limb(knee, r_knee, calf, r_calf), limb(calf, r_calf, ankle, r_ankle)])


def flexed_arm(shoulder, r_shoulder, elbow, r_elbow, wrist, r_wrist, fist, r_fist, biceps, triceps):
    """An arm raised and bent, fist by the head: the biceps pose."""
    return [
        limb(shoulder, r_shoulder, elbow, r_elbow),
        circle(*biceps),
        circle(*triceps),
        limb(elbow, r_elbow, wrist, r_wrist),
        circle(fist[0], fist[1], r_fist),
    ]


def flip(shapes):
    return [affinity.scale(s, -1, 1, origin=(0, 0)) for s in shapes]


def him():
    """A front double-biceps pose. One unit is roughly his height; x is 0 down the middle, y runs down."""
    arm = flexed_arm(
        shoulder=(0.17, 0.188), r_shoulder=0.047, elbow=(0.305, 0.17), r_elbow=0.04,
        wrist=(0.262, 0.066), r_wrist=0.027, fist=(0.25, 0.04), r_fist=0.034,
        biceps=(0.243, 0.144, 0.051), triceps=(0.232, 0.207, 0.04),
    )
    side = arm + [
        Polygon([(0, 0.115), (0.036, 0.115), (0.15, 0.165), (0.15, 0.21), (0, 0.21)]),            # traps
        circle(0.168, 0.188, 0.055),                                                               # shoulder
        Polygon([(0, 0.16), (0.15, 0.17), (0.172, 0.25), (0.145, 0.33), (0.094, 0.43),
                 (0.09, 0.47), (0.108, 0.53), (0, 0.55)]),                                         # chest, lats, waist
        limb((0.074, 0.535), 0.074, (0.098, 0.735), 0.044),                                        # thigh
        limb((0.112, 0.57), 0.062, (0.104, 0.7), 0.046),                                           # quad sweep
        shin((0.098, 0.735), (0.108, 0.93), (0.112, 0.805), 0.042, 0.05, 0.023),
        ellipse(0.132, 0.972, 0.052, 0.023),                                                       # foot
    ]
    middle = [ellipse(0, 0.068, 0.044, 0.055), limb((0, 0.1), 0.035, (0, 0.15), 0.037)]            # head, neck
    return smooth(unary_union(side + flip(side) + middle), 0.017)


def her():
    """One arm flexed, the other hand on her hip. A lighter frame, fuller hips, hair in a bun."""
    flexed = flexed_arm(
        shoulder=(0.14, 0.19), r_shoulder=0.034, elbow=(0.264, 0.178), r_elbow=0.03,
        wrist=(0.226, 0.08), r_wrist=0.021, fist=(0.218, 0.054), r_fist=0.027,
        biceps=(0.205, 0.158, 0.037), triceps=(0.2, 0.204, 0.03),
    )
    on_hip = [
        limb((-0.14, 0.192), 0.034, (-0.232, 0.33), 0.027),                                        # upper arm
        limb((-0.232, 0.33), 0.027, (-0.122, 0.436), 0.02),                                        # forearm
        circle(-0.108, 0.442, 0.025),                                                              # hand
    ]
    side = [
        Polygon([(0, 0.122), (0.028, 0.122), (0.12, 0.168), (0.12, 0.21), (0, 0.21)]),
        circle(0.136, 0.19, 0.041),
        Polygon([(0, 0.165), (0.124, 0.172), (0.132, 0.24), (0.108, 0.31), (0.07, 0.4),
                 (0.068, 0.43), (0.114, 0.525), (0, 0.555)]),
        limb((0.07, 0.54), 0.07, (0.084, 0.742), 0.037),
        limb((0.104, 0.575), 0.054, (0.09, 0.7), 0.04),
        shin((0.084, 0.742), (0.094, 0.935), (0.096, 0.81), 0.035, 0.04, 0.019),
        ellipse(0.112, 0.974, 0.043, 0.02),
    ]
    middle = [
        ellipse(0, 0.074, 0.041, 0.052),
        circle(0, 0.008, 0.029),                                                                   # bun
        limb((0, 0.105), 0.024, (0, 0.15), 0.026),
    ]
    return smooth(unary_union(side + flip(side) + flexed + on_hip + middle), 0.014)


def place(shape, height, cx, top):
    """Scales a figure to [height] tall and puts its middle line at [cx] and the top of its head at [top]."""
    _, miny, _, maxy = shape.bounds
    k = height / (maxy - miny)
    return affinity.translate(affinity.scale(shape, k, k, origin=(0, 0)), cx, top - miny * k)


# ---------- sparkles ----------

def sparkle(cx, cy, r, waist=0.16, steps=10):
    """A four-point star whose sides curve in towards the middle."""
    tips = [(cx, cy - r), (cx + r, cy), (cx, cy + r), (cx - r, cy)]
    pts = []
    for i in range(4):
        a, b = tips[i], tips[(i + 1) % 4]
        # The control point sits near the centre, on the diagonal between the two tips.
        c = (cx + (a[0] + b[0] - 2 * cx) * waist, cy + (a[1] + b[1] - 2 * cy) * waist)
        for s in range(steps):
            t = s / steps
            pts.append(((1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
                        (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]))
    return Polygon(pts)


# ---------- the composition ----------

def compose():
    # They stand on the same floor, she a little shorter. His raised arm passes over her
    # shoulder and her elbow tucks in beside his waist, so the two outlines never cross.
    floor = 75.4
    his_height, her_height = 45.0, 41.5
    his = place(him(), his_height, 43.0, floor - his_height)
    hers = place(her(), her_height, 66.2, floor - her_height)
    sparkles = [
        (sparkle(57.0, 24.6, 4.3), SPARKLE),
        (sparkle(26.6, 52.5, 2.6), SPARKLE),
        (sparkle(81.0, 47.0, 2.9), SPARKLE),
        (sparkle(30.5, 69.0, 1.9), SPARKLE_SMALL),
        (sparkle(79.0, 68.0, 2.1), SPARKLE_SMALL),
        (sparkle(54.9, 82.3, 1.8), SPARKLE_SMALL),
        (sparkle(73.5, 26.0, 1.6), SPARKLE_SMALL),
        (sparkle(40.0, 25.2, 1.4), SPARKLE_SMALL),
    ]
    return fit(his, hers, sparkles)


def fit(his, hers, sparkles, reach=32.4):
    """Centres the whole picture and scales it so nothing passes [reach] from the middle."""
    everything = unary_union([his, hers] + [star for star, _ in sparkles])
    minx, miny, maxx, maxy = everything.bounds
    dx, dy = SIZE / 2 - (minx + maxx) / 2, SIZE / 2 - (miny + maxy) / 2
    centre = (SIZE / 2, SIZE / 2)

    def moved(shape, k):
        return affinity.scale(affinity.translate(shape, dx, dy), k, k, origin=centre)

    k = 1.0
    for _ in range(6):
        now = furthest(moved(his, k), moved(hers, k), [(moved(star, k), c) for star, c in sparkles])
        k *= reach / now
    return moved(his, k), moved(hers, k), [(moved(star, k), c) for star, c in sparkles]


def rings(shape):
    """Every outline of a silhouette: the outside, and any gap such as the space inside a bent arm."""
    return [shape.exterior] + list(shape.interiors)


def furthest(his, hers, sparkles):
    """How far from the centre the artwork reaches, stroke included."""
    c = Point(SIZE / 2, SIZE / 2)
    reach = 0.0
    for shape in (his, hers):
        reach = max(reach, max(c.distance(Point(p)) for p in shape.exterior.coords) + STROKE / 2)
    for star, _ in sparkles:
        reach = max(reach, max(c.distance(Point(p)) for p in star.exterior.coords))
    return reach


# ---------- writing vector drawables ----------

def n(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


def path_data(line, tolerance=0.035):
    simple = line.simplify(tolerance, preserve_topology=False)
    pts = list(simple.coords)
    closed = line.geom_type == "LinearRing" or pts[0] == pts[-1]
    if closed:
        pts = pts[:-1]
    d = "M" + " L".join(f"{n(x)},{n(y)}" for x, y in pts)
    return d + ("Z" if closed else "")


def stroke_path(line, color):
    return (f'    <path\n        android:strokeColor="{color}"\n        android:strokeWidth="{n(STROKE)}"\n'
            f'        android:strokeLineCap="round"\n        android:strokeLineJoin="round"\n'
            f'        android:pathData="{path_data(line)}" />\n')


def fill_path(polygon, color):
    return f'    <path\n        android:fillColor="{color}"\n        android:pathData="{path_data(polygon.exterior, 0.02)}" />\n'


def vector(comment, body, size=SIZE, viewport=(0, 0, SIZE, SIZE)):
    x, y, w, h = viewport
    group_open = "" if (x, y) == (0, 0) else f'    <group android:translateX="{n(-x)}" android:translateY="{n(-y)}">\n'
    group_close = "" if (x, y) == (0, 0) else "    </group>\n"
    return (
        '<?xml version="1.0" encoding="utf-8"?>\n'
        f"<!-- {comment} Drawn by tools/logo.py; edit that, not this. -->\n"
        '<vector xmlns:android="http://schemas.android.com/apk/res/android"\n'
        f'    android:width="{size}dp"\n    android:height="{size}dp"\n'
        f'    android:viewportWidth="{n(w)}"\n    android:viewportHeight="{n(h)}">\n'
        f"{group_open}{body}{group_close}</vector>\n"
    )


def drawable(his, hers, sparkles, one_color=None):
    body = "".join(stroke_path(ring, one_color or HIS) for ring in rings(his))
    body += "".join(stroke_path(ring, one_color or HERS) for ring in rings(hers))
    body += "".join(fill_path(star, one_color or color) for star, color in sparkles)
    return body


# ---------- a preview, drawn the same way ----------

def rgb(hex_color):
    return tuple(int(hex_color[i:i + 2], 16) for i in (1, 3, 5))


def render(his, hers, sparkles, px, background=BACKGROUND, window=(18, 18, 72, 72), one_color=None):
    """The part of the canvas a launcher shows (the middle 72), at px pixels square."""
    ss = 4
    x0, y0, w, _ = window
    k = px * ss / w
    img = Image.new("RGB", (px * ss, px * ss), rgb(background))

    def pt(p):
        return ((p[0] - x0) * k, (p[1] - y0) * k)

    def paint(area, color):
        """Fills a shape (with any holes) exactly, the way the vector drawable is drawn."""
        mask = Image.new("L", img.size, 0)
        draw = ImageDraw.Draw(mask)
        for part in getattr(area, "geoms", [area]):
            draw.polygon([pt(p) for p in part.exterior.coords], fill=255)
            for hole in part.interiors:
                draw.polygon([pt(p) for p in hole.coords], fill=0)
        img.paste(rgb(color), (0, 0), mask)

    for shape, color in ((his, HIS), (hers, HERS)):
        strokes = unary_union([LineString(ring.coords).buffer(STROKE / 2, 8) for ring in rings(shape)])
        paint(strokes, one_color or color)
    for star, color in sparkles:
        paint(star, one_color or color)
    return img.resize((px, px), Image.LANCZOS)


def circle_mask(img):
    """The image as a circular launcher would show it (66 of the 72 across)."""
    mask = Image.new("L", img.size, 0)
    r = img.width * 66 / 72 / 2
    c = img.width / 2
    ImageDraw.Draw(mask).ellipse([c - r, c - r, c + r, c + r], fill=255)
    out = Image.new("RGB", img.size, (60, 60, 60))
    out.paste(img, (0, 0), mask)
    return out


def preview(his, hers, sparkles):
    big = render(his, hers, sparkles, 512)
    sheet = Image.new("RGB", (512 + 24 + 512 + 24 + 192, 512), (60, 60, 60))
    sheet.paste(big, (0, 0))
    sheet.paste(circle_mask(big), (536, 0))
    x = 1072
    y = 0
    for px in (192, 144, 96, 48):
        small = render(his, hers, sparkles, px)
        sheet.paste(small, (x, y))
        y += px + 8
    themed = render(his, hers, sparkles, 96, background="#DDE3EA", one_color="#1C2A3A")
    sheet.paste(themed, (x + 100, 200 + 152))
    PREVIEW.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(PREVIEW)


def main():
    his, hers, sparkles = compose()
    reach = furthest(his, hers, sparkles)
    print(f"artwork reaches {reach:.1f} from the centre (safe circle is {SAFE_RADIUS})")
    print(f"his outline and hers are {his.distance(hers):.2f} apart at the closest")
    preview(his, hers, sparkles)
    assert reach <= SAFE_RADIUS, "the logo sticks out of the safe circle; see the preview"
    assert his.distance(hers) >= STROKE * 1.3, "the two outlines touch; see the preview"

    (RES / "ic_launcher_foreground.xml").write_text(vector(
        "Original artwork: the outlines of a male and a female bodybuilder, with sparkles.",
        drawable(his, hers, sparkles),
    ))
    (RES / "ic_launcher_monochrome.xml").write_text(vector(
        "Original artwork: the Yoked mark in one colour, for themed icons.",
        drawable(his, hers, sparkles, one_color="#FFFFFF"),
    ))
    # The mark alone, cropped to the middle 72 so it fills the space it's given inside the app.
    (RES / "ic_logo_mark.xml").write_text(vector(
        "Original artwork: the Yoked mark, for use inside the app.",
        drawable(his, hers, sparkles),
        size=72,
        viewport=(18, 18, 72, 72),
    ))
    sizes = {name: (RES / name).stat().st_size for name in ("ic_launcher_foreground.xml", "ic_launcher_monochrome.xml", "ic_logo_mark.xml")}
    print("wrote", sizes, "and", PREVIEW.relative_to(ROOT))


if __name__ == "__main__":
    main()
