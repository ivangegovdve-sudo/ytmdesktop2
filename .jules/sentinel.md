## 2024-05-15 - [CRITICAL] Disable nodeIntegration in main views to prevent RCE
**Vulnerability:** `nodeIntegration: true` was enabled in `createView` and `createPopup` in `src/main/utils/view.ts` and not explicitly disabled for `createYoutubeView` in `src/main/utils/windowManager.ts`. Since `contextIsolation` was also set to `false`, this would allow any remote code (like an XSS on YouTube Music) full access to Node APIs, leading to RCE.
**Learning:** In Electron, views that load remote content MUST have `nodeIntegration: false`.
**Prevention:** Always ensure `nodeIntegration` is `false` (which is the default in newer Electron versions, but explicitly disabling it is best when migrating or overriding defaults) and use `contextIsolation: true` with a safe preload script.
## 2024-05-24 - Strict Protocol Validation for shell.openExternal
**Vulnerability:** URL validation in `setWindowOpenHandler` used `url.startsWith("http")` before passing URLs to `shell.openExternal`.
**Learning:** `startsWith("http")` allows bypassing protocol restrictions by using custom, potentially malicious protocols that start with "http" (e.g. `http-malicious://...`). This could lead to arbitrary command execution or unexpected protocol handler launching.
**Prevention:** Always parse the URL using the native `URL` constructor and check that the `protocol` property is strictly `http:` or `https:`.
