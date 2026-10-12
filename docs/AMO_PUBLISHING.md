# AMO publication through GitHub Actions (v0.1.0)

**State:** Automated build, validation and Mozilla submission workflow has been implemented. **No AMO submission, GitHub Release creation, or reviewer approval is implied by merging this workflow.** The workflow is **manual** to prevent accidentally submitting during routine pushes or PRs.

## Before first submission

1. Log in to the AMO Developer Hub and open [API credentials](https://addons.mozilla.org/developers/addon/api/key/). Generate an API key **JWT issuer** and **JWT secret**.
2. In this GitHub repository, open **Settings → Secrets and variables → Actions → New repository secret**, and save:
   - `AMO_JWT_ISSUER`: the JWT issuer/API key.
   - `AMO_JWT_SECRET`: the JWT secret.
   
   The JWT secret is never entered in this chat or committed. Only the **AMO sign step** of the workflow receives these secrets as environment variables.
3. **Check the add-on ID before submitting:** `manifests/firefox.json` has `browser_specific_settings.gecko.id = navitime-gpx-exporter@zawa356.github.io`. If you already created an add-on entry on AMO (not just a developer account), confirm its registered GUID/extension ID is exactly this. If you only registered the developer account, `web-ext sign --channel listed` can create a new listed add-on from `amo/metadata.json`. If an existing add-on uses a different ID, **stop** and reconcile it rather than accidentally creating a duplicate.
4. AMO listing privacy/support URLs must be **publicly accessible**. At the time this workflow was authored, the GitHub repository was private; switch the repository public or host the privacy policy at a separate public URL before store review. Confirm name/trademark usage and original artwork comply with review policy.
5. Review the [release checklist](RELEASE_CHECKLIST.md): Chrome/Edge saved-route acceptance, newer-version regression, various error scenarios, independent basemap alignment and GPX XSD validation still have incomplete evidence. The initial GitHub 0.1.0 release is therefore flagged as **prerelease**, not a blanket declaration of passed QA.

## Run workflow

Open the repository's **Actions → Release / AMO → Run workflow**. Select the `main` branch, version `0.1.0`, then choose one of:

| Destination | Effect |
| --- | --- |
| `github` (default) | Build+test+lint, upload artifacts, create/reuse GitHub prerelease `v0.1.0`. **Does not contact AMO.** |
| `github-and-amo` | Same build+tests; authenticated `web-ext sign` upload to AMO v5 **listed** channel, then create/reuse GitHub prerelease. |

Use `github` first to inspect the packaged deliverables and source bundle. When credentials, add-on ID and listing information have been verified, use `github-and-amo`. Submitting the **same** version to AMO twice may be rejected as duplicate; do not blindly retry after ambiguous network failure. Check Developer Hub status first.

## What CI does

1. Checkout the precise `main` commit and install Node.js 22 and ImageMagick.
2. Run all existing JavaScript tests, syntax checks, icon checks and three-browser ZIP builds.
3. Verify the requested version equals `package.json`, both manifests and the packaged extension manifests; verify Gecko ID, privacy declaration and MIT metadata.
4. Validate `dist/firefox` with **Mozilla web-ext 10.7.0** before any remote upload.
5. Package *human-readable* source code, original artwork, release documentation and build scripts into a separate ZIP for Mozilla reviewers.
6. Upload Firefox/Chrome/Edge ZIPs, the reviewer source bundle and 512px icon as GitHub Actions artifacts.
7. Only in `github-and-amo` mode, verify that the JWT issuer/secret were configured and use `web-ext sign --channel listed --amo-metadata amo/metadata.json --upload-source-code ... --approval-timeout 0`. This is an **AMO API v5 submission**, with validation/review remaining under Mozilla's control. Approval may take time and the run does not wait for approval.
8. Use `gh release create v0.1.0 --prerelease` to produce a GitHub prerelease (or check an existing one for the same commit). Assets include source code, **unsigned developer ZIPs** and storefront icon. Firefox users should install through the signed AMO listing after approval.

The workflow requires GitHub `contents: write` to create the tag/release. If your repository's GitHub App or tag protection rules forbid creating `v0.1.0`, the workflow will fail clearly. Ask a maintainer with permissions to create the GitHub release/tag; do not force-move an existing tag.

## Credential hygiene and rollback

- API issuer/secret are **repository Secrets**, never Git variables, checked-in config, workflow inputs or pasted into issues. Prefer a production-protected GitHub Environment when rolling out more automated storefronts in the future.
- The upload can be accepted for review before AMO approves public distribution; don't claim publication on successful API submission.
- The content cannot be re-uploaded as another build with the *same* version if AMO already accepted it. For updates, bump application and both manifests together and publish a new tagged release.
- Avoid automatic submission on every push, development `0.0.x` tag and nightly build.
- GitHub release is **prerelease** because outstanding QA items remain documented. Reassess whether to mark final and submit to additional stores only after the remaining test gates.

## Official references
- [Mozilla web-ext sign](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/)
- [AMO add-on API v5](https://mozilla.github.io/addons-server/topics/api/addons.html)
- [AMO external authentication](https://mozilla.github.io/addons-server/topics/api/auth.html)
- [Firefox Manifest data collection disclosure](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings)
