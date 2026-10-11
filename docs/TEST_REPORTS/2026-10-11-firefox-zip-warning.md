# Firefox downloaded ZIP flagged as malware — preliminary investigation

Date: 2026-10-11. **Status: DEFERRED BY USER / unconfirmed root cause.** Do not classify as false positive or advise bypassing Firefox protection until additional evidence is available.

## User report
- While attempting to install the new development 0.0.2 build in Firefox, the browser displayed the Japanese alert `このファイルはウイルスやマルウェアが含まれています。`, with `ファイルを削除` and `ダウンロードを許可`.
- Screenshot does **not show the filename**. It is still unknown whether the blocked item is the outer GitHub Actions `extension-builds.zip` archive, a browser-specific nested ZIP, or some other download. Must ask the user for the blocked basename.
- Earlier 0.0.1 development package had downloaded normally in the same project.

## Evidence gathered
Downloaded both GitHub-generated CI artifacts via authorized repository connector and inspected them locally. No private track data or credentials were involved.

| Property | Previous package 0.0.1 | New package 0.0.2 |
| --- | --- | --- |
| Actions source | previously successful CI artifact | run 38139868187, artifact ID 11701549443 |
| Outer ZIP size | 26,494 bytes | 36,224 bytes |
| Outer archive SHA-256 | `ac5d6ac4c6f85abd358cdad4b9513e150f28aa6ff8941e2df86cd88be62ef2ec` | `8e8aa178e979ef38a969e43cb36fa8f4d2a7071aef28695525dcaab22ee105fe` |
| Browser-specific child ZIPs | 3 | 3 |
| Non-directory files per child | 9 | 13 |
| Native executables/scripts `.exe/.dll/.ps1/.cmd/.bat` | 0 | 0 |
| External npm dependency install | none | none |

0.0.2 nested ZIP SHA-256:
- Chrome and Edge (byte-identical): `1b785007be30a8e25a1026bda602fdaa529fe43ebe590c4feb72658f0d5ee814`
- Firefox: `56267c10d2c55a1cbd23b6d7e3b9fc911cdde49539ed0372644521d50e82fdb2`

Every file in each 0.0.2 ZIP was checked against its corresponding **Git Blob SHA** at the current `main` repository. All files (including each browser's manifest) matched exactly. No unexpected files, path traversal entries, or native binary payloads were observed.

The build pipeline uses official GitHub `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-artifact@v4`; Node 20/22 syntax and unit tests, GNU `zip` packaging and `unzip -t`. Manifest has only `activeTab` permission and content script is scoped to `https://web.moto.touring.navitime.jp/*`. JavaScript source shows no third-party telemetry endpoints, code injection by downloaded remote scripts, or direct cookie harvesting.

**Limits**: this is provenance/structural/static review, **not** a full antivirus scan or a Google Safe Browsing verdict lookup. Identical source and package does not prove the source harmless, and the screenshot alone does not prove a false positive.

## What the warning actually means
Mozilla documentation lists the exact Japanese message as a **Firefox download protection** warning associated with potentially malicious downloads, using Google Safe Browsing. It is not an extension manifest install-permission rejection. The precise detection reason, signature and whether the outer ZIP URL or content triggered the flag remain unknown.

Official references:
- https://support.mozilla.org/ja/kb/where-find-and-manage-downloaded-files-firefox
- https://support.mozilla.org/en-US/kb/how-does-phishing-and-malware-protection-work

## Next investigative action
1. Ask user to identify the **exact blocked filename only**, without permitting it or disabling Safe Browsing.
2. Distinguish outer Actions artifact from nested browser ZIP; compare file digest/provenance and check whether the block is tied to a URL vs content.
3. If needed, use Windows Defender's *detection history* / AV product detection name, without asking for private URLs, cookies or HAR archives.
4. If detection reproducibly targets a verified specific ZIP, use vendor's false-positive reporting channel after reviewing the actual samples and seeking user approval where third-party code upload would occur.
5. A local source checkout and audited developer build can serve as an alternate testing path, but do not recommend bypassing protective warnings blindly.

Do not mark the multi-page Firefox acceptance case passed until the user can safely install and run a verified 0.0.2 build.

## Follow-up from the user — 2026-10-11

- User confirmed that **`extension-builds.zip` (the outer GitHub Actions artifact)** was the Firefox-blocked download.
- The user reports Microsoft Defender scanned the file without a detection.
- The user subsequently reports successfully using the saved-route GPX export in Firefox 0.0.2.
- Per user preference, investigation is **DEFERRED for the development stage**, not declared a Safe Browsing false positive. Do not suggest disabling protection; reassess download reputation/packaging before public distribution.
- See [Firefox saved-route smoke test](2026-10-11-firefox-saved-route-smoke.md). A successful download does not yet establish route point-for-point integrity or GPX XSD validity.
