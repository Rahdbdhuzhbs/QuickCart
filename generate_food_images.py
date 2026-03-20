import os
import re


def safe_filename(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"[^a-z0-9\-_.]+", "-", s)
    s = re.sub(r"-{2,}", "-", s).strip("-")
    return s or "item"


def svg_card(title: str, subtitle: str, bg: str) -> str:
    title = (title[:34] + "…") if len(title) > 35 else title
    subtitle = (subtitle[:40] + "…") if len(subtitle) > 41 else subtitle
    # Simple, consistent thumbnail. Works offline.
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="{bg}" stop-opacity=".55"/>
      <stop offset="1" stop-color="#0b0d10" stop-opacity="1"/>
    </linearGradient>
    <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity=".40"/>
    </filter>
  </defs>
  <rect width="900" height="600" fill="#0b0d10"/>
  <rect width="900" height="600" fill="url(#g)"/>
  <g filter="url(#s)" transform="translate(90 86)">
    <rect x="0" y="0" width="720" height="428" rx="34" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.14)"/>
    <text x="48" y="96" fill="rgba(255,255,255,.94)" font-size="42" font-family="Segoe UI, Arial" font-weight="800">{escape_xml(title)}</text>
    <text x="48" y="138" fill="rgba(255,255,255,.72)" font-size="20" font-family="Segoe UI, Arial">{escape_xml(subtitle)}</text>
    <g transform="translate(48 196)" opacity=".92">
      <rect x="0" y="0" width="624" height="156" rx="26" fill="rgba(0,0,0,.25)" stroke="rgba(255,255,255,.10)"/>
      <circle cx="94" cy="78" r="48" fill="rgba(255,255,255,.10)"/>
      <circle cx="184" cy="78" r="48" fill="rgba(255,255,255,.08)"/>
      <circle cx="274" cy="78" r="48" fill="rgba(255,255,255,.06)"/>
      <path d="M360 54h220" stroke="rgba(255,255,255,.22)" stroke-width="10" stroke-linecap="round"/>
      <path d="M360 88h190" stroke="rgba(255,255,255,.18)" stroke-width="10" stroke-linecap="round"/>
      <path d="M360 122h160" stroke="rgba(255,255,255,.14)" stroke-width="10" stroke-linecap="round"/>
    </g>
  </g>
</svg>
"""


def escape_xml(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#039;")
    )


def main() -> None:
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    out_dir = os.path.join(root, "assets", "img", "food-gen")
    os.makedirs(out_dir, exist_ok=True)

    colors = {
        "chinese": "#1d4ed8",
        "chaat": "#a21caf",
        "snacks": "#059669",
        "sweets": "#ea580c",
    }

    # We know IDs and names are generated in app.js (food-<sub>-<n>),
    # so we generate 400 per subcategory.
    for sub, color in colors.items():
        for i in range(1, 401):
            food_id = f"food-{sub}-{i}"
            title = f"{sub.title()} Item {i}"
            subtitle = "QuickKart Food"
            svg = svg_card(title, subtitle, color)
            path = os.path.join(out_dir, f"{safe_filename(food_id)}.svg")
            with open(path, "w", encoding="utf-8") as f:
                f.write(svg)

    print(f"Generated thumbnails in: {out_dir}")


if __name__ == "__main__":
    main()

