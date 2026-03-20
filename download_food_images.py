import os
import time
import urllib.parse
import urllib.request


def ensure_dir(path: str) -> None:
    if not os.path.isdir(path):
        os.makedirs(path, exist_ok=True)


def url_for(sub: str, idx: int) -> str:
    # Remote placeholder service (HTTPS) -> downloaded and stored locally.
    # Use stable per-item text to avoid missing/broken references.
    text = urllib.parse.quote(f"{sub} {idx}")
    bg = {
        "chinese": "1d4ed8",
        "chaat": "a21caf",
        "snacks": "059669",
        "sweets": "ea580c",
    }[sub]
    return f"https://placehold.co/600x400/{bg}/ffffff.png?text={text}"


def download(url: str, out_file: str) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        with open(out_file, "wb") as f:
            f.write(data)
        return True
    except Exception:
        return False


def main() -> None:
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    out_dir = os.path.join(root, "assets", "img", "food-local")
    ensure_dir(out_dir)

    subs = ["chinese", "chaat", "snacks", "sweets"]
    total = 0
    ok = 0

    for sub in subs:
        for i in range(1, 401):
            total += 1
            food_id = f"food-{sub}-{i}"
            out_file = os.path.join(out_dir, f"{food_id}.png")
            if os.path.exists(out_file) and os.path.getsize(out_file) > 0:
                ok += 1
                continue

            if download(url_for(sub, i), out_file):
                ok += 1
            else:
                # One retry after short delay
                time.sleep(0.2)
                if download(url_for(sub, i), out_file):
                    ok += 1
            # Gentle pacing to avoid rate limiting
            time.sleep(0.03)

    print(f"Downloaded {ok}/{total} images into {out_dir}")


if __name__ == "__main__":
    main()

