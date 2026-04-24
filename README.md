# Iyan-Kim

A compact single-page personal site for links and portfolio work at `studio.iyan-kim.dev`.

## Structure

- `index.html`: Home hero, portfolio shell, SEO/social metadata
- `styles.css`: Dark theme, navigation, responsive layout, language switcher, modal and card states
- `script.js`: Active navigation indicator, data loading, rendering, filters, language switching, modal interactions
- `scripts/portfolio-data.js`: Portfolio data loader, sorting, card creation, thumbnail cache merge
- `scripts/prepare_portfolio_thumbnails.py`: Refreshes thumbnail cache from product URLs
- `data/projects/portfolio-items.json`: Project data source
- `data/projects/thumbnail-cache.json`: Auto-resolved thumbnail cache
- `assets/favicon.svg`: Site favicon
- `assets/og-image.png`: Open Graph / share thumbnail
- `assets/project-placeholder.svg`: Fallback image for missing thumbnails

## Links

- Add to VCC: `vcc://vpm/addRepo?url=https://raw.githubusercontent.com/Yunhyuk-Jeong/iyan-vpm/main/vpm.json`
- Add to ALCOM: `vcc://vpm/addRepo?url=https://raw.githubusercontent.com/Yunhyuk-Jeong/iyan-vpm/main/vpm.json`
- GitHub: `https://github.com/Yunhyuk-Jeong`
- BOOTH: `https://milktank-booth.booth.pm/`

## Portfolio Data

Edit `data/projects/portfolio-items.json` to manage the portfolio cards and modal content.

Each project object supports:

```json
{
  "date": "2026-04-24",
  "address": "https://example.com/item",
  "shopName": "Studio Name",
  "productName": "Project Name",
  "tag": "VRChat Gimmick",
  "platform": "VRChat",
  "category": "Gimmick",
  "builtWith": "Unity",
  "description": {
    "ko": "프로젝트 설명",
    "en": "Project summary",
    "ja": "プロジェクト説明"
  }
}
```

Notes:
- `date` is used for automatic newest-first sorting. Leave it blank to keep file order.
- `description` is multilingual and supports `ko`, `en`, `ja`.
- Supported tags currently map to filters: `VRChat Gimmick`, `Unity Tool`.
- `platform`, `category`, and `builtWith` are used directly in the modal meta chips.
- Thumbnail URLs are not stored in the source JSON. They are resolved into `data/projects/thumbnail-cache.json`.
- `run-local-server.bat` refreshes the thumbnail cache before starting the local server.
