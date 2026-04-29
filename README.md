# Iyan-Kim

A compact single-page personal site for links and portfolio work at `studio.iyan-kim.dev`.

## Structure

- `index.html`: Main home + portfolio entry page
- `wiki.html`: Separate wiki page with sidebar navigation
- `src/css/site.css`: Shared site styles for home, portfolio, modal, and wiki
- `src/js/i18n.js`: Shared locale loader and translation helpers
- `src/js/main.js`: Main page interactions, portfolio data rendering, filters, language switching
- `src/js/wiki.js`: Wiki sidebar/tab switching
- `src/js/portfolio-data.js`: Portfolio data loader, sorting, card creation, thumbnail cache merge
- `data/locales/<lang>/main.json`: Main page UI strings
- `data/locales/<lang>/wiki/common.json`: Wiki shared UI strings and grouped sidebar labels
- `data/locales/<lang>/wiki/overview.json`: Wiki overview section content
- `data/locales/<lang>/wiki/vpm-tools-overview.json`: VPM tool group overview content
- `data/locales/<lang>/wiki/plane-fit-to-camera-tool.json`: VPM tool wiki content
- `data/locales/<lang>/wiki/ma-blendshape-sync-auto-setup.json`: VPM tool wiki content
- `data/locales/<lang>/wiki/hierarchy-plus-rebone.json`: VPM tool wiki content
- `data/locales/<lang>/wiki/prefab-material-remapper.json`: VPM tool wiki content
- `data/locales/<lang>/wiki/uv-mask-tool.json`: VPM tool wiki content
- `data/locales/<lang>/wiki/tools-overview.json`: Paid / standalone tool group overview content
- `data/locales/<lang>/wiki/vsf-avatar-converter.json`: Tool wiki content
- `data/locales/<lang>/wiki/sdf-generator.json`: Tool wiki content
- `data/locales/<lang>/wiki/notes.json`: Wiki notes section content
- `tools/prepare_portfolio_thumbnails.py`: Refreshes thumbnail cache from product URLs
- `data/projects/portfolio-items.json`: Project data source
- `data/projects/thumbnail-cache.json`: Auto-resolved thumbnail cache
- `assets/favicon.svg`: Site favicon
- `assets/og-image.png`: Open Graph / share thumbnail
- `assets/project-placeholder.svg`: Fallback image for missing thumbnails

## Links

- Add to VCC: `vcc://vpm/addRepo?url=https://raw.githubusercontent.com/Yunhyuk-Jeong/iyan-vpm/main/vpm.json`
- Wiki: `./wiki.html`
- GitHub: `https://github.com/Yunhyuk-Jeong`
- BOOTH: `https://milktank-booth.booth.pm/`

## Portfolio Data

Edit `data/projects/portfolio-items.json` to manage the portfolio cards and modal content.

## UI Text

Edit the locale bundles under `data/locales/<lang>/` to manage page text.

Recommended split:

- `main.json`: home, portfolio, filters, modal, shared tag/category labels
- `wiki/common.json`: sidebar title, home link, wiki nav
- `wiki/overview.json`: overview section header, cards, meta chips
- `wiki/vpm-tools-overview.json`
- `wiki/plane-fit-to-camera-tool.json`
- `wiki/ma-blendshape-sync-auto-setup.json`
- `wiki/hierarchy-plus-rebone.json`
- `wiki/prefab-material-remapper.json`
- `wiki/uv-mask-tool.json`
- `wiki/tools-overview.json`
- `wiki/vsf-avatar-converter.json`
- `wiki/sdf-generator.json`
- `wiki/notes.json`: notes section body and list items

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
