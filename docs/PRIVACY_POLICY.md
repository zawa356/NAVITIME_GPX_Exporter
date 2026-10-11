# Privacy policy / プライバシーポリシー

Last updated: 2026-10-11

NAVITIME GPX Exporter is an **independent, unofficial** browser extension. It is not developed, sponsored, or endorsed by NAVITIME JAPAN Co., Ltd.

## Data handled
- With your action, the extension reads the current Touring Supporter ride page's record title, date, and logged route coordinates, timestamps and altitude from the NAVITIME service on which you are already authenticated.
- It transforms the selected single ride into a GPX file and requests a browser download.
- Information is processed locally in your browser. The extension does **not** upload the track to the developer or other analytics, advertising, or telemetry servers.
- No account password, cookie, or authorization token is read directly or stored by the extension. Same-origin requests automatically use the browser's existing session to contact NAVITIME.
- The extension does **not** persist GPS history to extension storage.
- The locally downloaded GPX file remains under your control, subject to your browser and operating system download settings.

## Permissions
The extension uses `activeTab` and a site-specific content script restricted to `https://web.moto.touring.navitime.jp/*`. It does not request your full browsing history or arbitrary website access.

## Diagnostics
An optional copyable diagnostic contains only a generic error code, operation phase, optional HTTP status, application version, and browser family. It excludes coordinates, account credentials, raw API responses, ride titles and IDs. Copying diagnostics is initiated by you.

## Third-party service
The extension fetches ride data directly from the NAVITIME website. NAVITIME's own privacy policy and terms apply to your use of that service. Its undocumented APIs may change without notice.

## Contact and updates
Please use the GitHub Issues page of `zawa356/NAVITIME_GPX_Exporter` for support and privacy questions. Do not attach HAR archives, raw API responses or private GPX files to public issues.

## 日本語要約
本拡張機能は表示中のツーリングサポーター走行履歴を取得し、ブラウザ内でGPXに変換します。GPS座標やログイン情報を開発者のサーバーへ送信せず、外部解析・広告・利用統計の収集も行いません。取得データを拡張機能の永続ストレージへ保存しません。診断情報は利用者の操作によってのみコピーされ、位置情報や認証情報は含みません。出力ファイルには詳細な移動履歴が含まれるため、共有時は注意してください。
