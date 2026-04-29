from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent.parent
SOURCE_PATH = ROOT / "data" / "projects" / "portfolio-items.json"
CACHE_PATH = ROOT / "data" / "projects" / "thumbnail-cache.json"

OG_IMAGE_PATTERN = re.compile(
    r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
    re.IGNORECASE,
)


def load_json(path: Path, default):
    if not path.exists():
        return default

    with path.open("r", encoding="utf-8-sig") as handle:
        return json.load(handle)


def fetch_og_image(url: str) -> str | None:
    request = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
        },
    )

    with urlopen(request, timeout=20) as response:
        html = response.read().decode("utf-8", errors="ignore")

    match = OG_IMAGE_PATTERN.search(html)
    return match.group(1) if match else None


def main() -> int:
    projects = load_json(SOURCE_PATH, [])
    thumbnail_cache = load_json(CACHE_PATH, {})

    updated_cache: dict[str, str] = {}

    for project in projects:
        address = project.get("address")
        if not address:
            continue

        try:
            resolved_image = fetch_og_image(address)
            if resolved_image:
                updated_cache[address] = resolved_image
                print(f"[ok] {address}")
                continue
        except (HTTPError, URLError, TimeoutError, OSError) as error:
            print(f"[warn] {address} -> {error}")

        if address in thumbnail_cache:
            updated_cache[address] = thumbnail_cache[address]
            print(f"[cache] {address}")

    with CACHE_PATH.open("w", encoding="utf-8") as handle:
        json.dump(updated_cache, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    print(f"Thumbnail cache written to {CACHE_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
