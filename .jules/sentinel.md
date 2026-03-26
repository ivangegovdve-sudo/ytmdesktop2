## 2024-05-15 - [CRITICAL] Disable nodeIntegration in main views to prevent RCE
**Vulnerability:** `nodeIntegration: true` was enabled in `createView` and `createPopup` in `src/main/utils/view.ts` and not explicitly disabled for `createYoutubeView` in `src/main/utils/windowManager.ts`. Since `contextIsolation` was also set to `false`, this would allow any remote code (like an XSS on YouTube Music) full access to Node APIs, leading to RCE.
**Learning:** In Electron, views that load remote content MUST have `nodeIntegration: false`.
**Prevention:** Always ensure `nodeIntegration` is `false` (which is the default in newer Electron versions, but explicitly disabling it is best when migrating or overriding defaults) and use `contextIsolation: true` with a safe preload script.

## 2026-03-26 - Unvalidated Protocol Execution in shell.openExternal
**Vulnerability:** Calling `shell.openExternal(url)` without validating the URL protocol securely.
**Learning:** Using `url.startsWith('http')` is insecure, as it can be bypassed or fail to properly handle complex URLs, leading to potential protocol spoofing or remote code execution.
**Prevention:** Always validate external URLs using the native `URL` constructor within a `try/catch` block, ensuring the protocol is strictly `'http:'` or `'https:'`.
