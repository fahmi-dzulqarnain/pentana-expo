"""Generates the app icons in assets/ from one design: a white "P" on PENTANA green.

Run from the repo root: python3 scripts/make-icons.py
"""
from PIL import Image, ImageDraw, ImageFont

GREEN = (31, 111, 92, 255)  # colors.primary in src/components/theme.ts
WHITE = (255, 255, 255, 255)
FONT = "/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf"


def letter(size: int, scale: float, fg, bg=(0, 0, 0, 0), rounded=0.0) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    if bg[3]:
        draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * rounded), fill=bg)
    font = ImageFont.truetype(FONT, int(size * scale))
    # Centre on the glyph's ink box, not its advance box, so the P sits visually in the middle.
    left, top, right, bottom = draw.textbbox((0, 0), "P", font=font)
    draw.text(((size - (right - left)) / 2 - left, (size - (bottom - top)) / 2 - top), "P", font=font, fill=fg)
    return img


letter(1024, 0.62, WHITE, GREEN).save("assets/icon.png")  # iOS masks the corners itself
letter(1024, 0.62, WHITE, GREEN, rounded=0.22).save("assets/splash-icon.png")
letter(48, 0.66, WHITE, GREEN, rounded=0.22).save("assets/favicon.png")
# Android adaptive icon: the launcher crops to the middle ~66%, so the letter stays small.
letter(512, 0.38, WHITE).save("assets/android-icon-foreground.png")
Image.new("RGBA", (512, 512), GREEN).save("assets/android-icon-background.png")
letter(432, 0.42, WHITE).save("assets/android-icon-monochrome.png")
print("icons written to assets/")
