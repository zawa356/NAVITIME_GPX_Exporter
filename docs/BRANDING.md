# Icon artwork and browser-store integration

The icon is original project artwork selected for NAVITIME GPX Exporter. It depicts a GPS route, location markers, and a download-to-file symbol. It is **not** a NAVITIME company logo, product mark, or an assertion of affiliation.

## Source of truth

- `artwork/icon-source.png`: optimized 128×128 PNG derived from the approved generated image; committed as an actual binary Git object.
- `scripts/build.cjs`: generates 16×16, 32×32, 48×48, 96×96, and 128×128 PNG assets automatically using ImageMagick. The 128×128 source is scaled for the 512×512 store asset; use a higher-resolution master if future storefront artwork needs additional sharpness.
- `manifests/firefox.json` and `manifests/chromium.json`: `icons` registers all generated sizes, and `action.default_icon` registers the toolbar icons. Browser installers automatically display them; no editing the packaged manifest is necessary.
- `dist/firefox/icons/`, `dist/chrome/icons/`, `dist/edge/icons/`: automatically populated on every build.
- `dist/store-assets/icon-512.png`: optional store-listing artwork, produced in the same build.
- `scripts/verify-icons.cjs`: fails CI if a referenced icon file is missing, has an invalid PNG header, or has an unexpected pixel dimension.
- `.github/workflows/ci.yml`: uploads the browser ZIPs and the 512px storefront artwork to GitHub Actions as build artifacts.

## Commands

```sh
npm run ci
# → dist/firefox/icons/icon-16.png etc.
# → dist/chrome/icons/icon-128.png
# → dist/edge/icons/icon-128.png
# → dist/store-assets/icon-512.png
```

The asset generation requires `magick` or `convert` (ImageMagick); GitHub-hosted Linux CI runs the same commands. No image manipulation dependency is downloaded at runtime by the extension.

## What automatic registration does, and does not do

The manifest icon fields automatically provide the browser extension's installed icon and toolbar icon. These fields are also exposed to add-on stores that inspect the uploaded extension package. A **store listing page** can still require separate developer-console metadata (screenshots, descriptions, privacy disclosures, and sometimes listing artwork). The 512px PNG is provided as a build artifact to make that step straightforward, but this build process **does not create an AMO/Chrome Web Store/Edge listing or submit it automatically**. A separate, authenticated publishing workflow will be needed if automated store submissions are later approved.

Do not add the NAVITIME official trademark, site screenshots with users' routes, or private GPX/HAR data to these assets. Ensure a review of marketplace image requirements before first public `0.1.0`.

## Development milestone history

- 0.0.112: Optimized approved artwork committed as binary PNG source.
- 0.0.113–0.0.118: Automatic multi-resolution rendering, manifest registration, version change to 0.0.3, CI image validation and store asset upload.
- 0.0.119: README preview and integration guidance.
