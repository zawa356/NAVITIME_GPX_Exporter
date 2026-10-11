# Browser store publication preparation

**Status:** preparation only. No store submission, store approval, or public release has taken place.

## Publication strategy
- First development commits use milestone series 0.0.1, 0.0.2, etc. The version in the initial extension package is 0.0.1.
- First planned public user-facing build is 0.1.0, after automated tests, manual browser acceptance and a release decision.
- GitHub is the source of truth for documentation, CI and binaries. Store approvals are separate processes and can complete in different order.

## Firefox (addons.mozilla.org)
- Ensure stable `browser_specific_settings.gecko.id` and currently valid Firefox `data_collection_permissions` declaration.
- Complete listing information, icon, screenshots, description, privacy policy URL and support URL.
- Obtain Mozilla signing / pass reviewer submission. An unsigned development ZIP is **not** a normal public installation package.
- Test a signed installation on a current Firefox release.

## Chrome Web Store
- Register a developer account and complete payment/identity requirements as applicable.
- Complete single-purpose description and required privacy disclosures, minimal host/content-script access rationale and privacy policy URL.
- Validate MV3 and no remote code. Brand usage must not imply endorsement by NAVITIME.
- Obtain actual review approval; unpacked loads are only for development.

## Edge Add-ons
- Register Microsoft Partner Center / Edge Add-ons developer account.
- Prepare Edge-compatible package, listing, supported languages, screenshots and privacy links.
- Confirm Edge-specific policy requirements and await review.

## Proposed listing copy (draft; review required)
**Product:** NAVITIME GPX Exporter (unofficial)

**Japanese summary:** NAVITIME ツーリングサポーターのWeb版で表示中の実走行ログと保存済みルートをGPX 1.1として保存する非公式拡張機能です。実走行ログの座標・時刻・標高を保持し、保存済みルートでは時刻・標高を補完せず経路形状を保持します。位置情報を開発者サーバーへ送信しません。

**English summary:** An independent browser extension that exports the currently viewed NAVITIME Touring Supporter recorded ride or saved planned route to GPX 1.1. Location data stays in the user's browser and saved file.

**Disclaimer:** NAVITIME GPX Exporter is not developed, provided, supported, or endorsed by NAVITIME JAPAN Co., Ltd.

## Policy and privacy points
- Explain why this extension reads the currently displayed NAVITIME site.
- No password/cookie reads, location uploads, analytics, ads, or persistent extension tracking.
- No permission to unrelated sites. Never request permissions for future services before implementation.
- Display official NAVITIME trademark or logos **only** when permitted; create original iconography.
- Do not publish real user ride coordinates in screenshots or demonstrations.
- Review service terms, legal constraints and current store rules before actual submission.
- Provide [Privacy Policy](PRIVACY_POLICY.md), [Security](SECURITY.md), [Release Checklist](RELEASE_CHECKLIST.md).

## Version and support disclosures

As of development package **0.0.2**, saved planned routes are under acceptance testing. The eventual store description must distinguish recorded GPS tracks (which include source timestamps/elevation) from calculated saved routes (which have neither). The extension does not support arbitrary NAVITIME services, batch export, or unrestricted navigation-path sniffing. Future integrations of unsubscribed products require test contributors and policy validation.

## Submission prerequisites
- [ ] Manual tests of BOTH recorded-ride and saved-route exports on all 3 target browsers
- [ ] Code/diagnostic privacy review
- [ ] Browser icons and graphics with original branding
- [ ] Published privacy policy URL available to reviewers
- [ ] Contact/support process
- [ ] Store metadata and language review
- [ ] User-authorized official account registrations and submission actions

## Artwork automation (development 0.0.3)
- The selected app icon is tracked as a binary PNG in `artwork/icon-source.png`.
- Both Manifest V3 variants declare `icons` (16/32/48/96/128px) and `action.default_icon` (16/32/48px).
- On each `npm run build`, ImageMagick creates and packages these images automatically. The CI `extension-builds` artifact also contains `store-assets/icon-512.png` for listing use.
- The browser and marketplace package inspect the icon metadata automatically. **Separate listing metadata, screenshots, privacy declarations, credentials and publishing are not automatically submitted** by the current CI.
- The 512px listing image is an enlargement from the optimized 128px approved source; replace with higher-resolution approved artwork before publication if listing sharpness is unsatisfactory.
- See [BRANDING.md](BRANDING.md) for the manifest, build and asset-verification contracts.
