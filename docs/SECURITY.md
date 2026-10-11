# Security / セキュリティ

## Reporting
Report general bugs through GitHub Issues, but **do not attach HAR exports, cookies, authentication tokens, GPS files, raw ride JSON, or address-containing screenshots**.
For a suspected private security vulnerability, avoid posting proof-of-concept secrets publicly. Contact the maintainer via GitHub profile channels or private vulnerability reporting if available.

## Scope and safeguards
- Extension uses only same-origin authenticated GET requests to the Touring Supporter site.
- No analytics or data collection endpoint, advertising library, or remote executable code.
- Diagnostics are enumerated safe fields only, excluding raw exceptions and API bodies.
- The user, browser and OS control the exported GPX file; consider it sensitive location history.
- All future adapters must add only required domains and preserve existing validation and privacy constraints.

## Maintenance
Undocumented APIs may change. No guaranteed response time or guaranteed ongoing fixes; review changes against the threat model and the permission surface before release.
