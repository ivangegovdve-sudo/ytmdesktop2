## 2024-05-15 - [CRITICAL] Disable nodeIntegration in main views to prevent RCE
**Vulnerability:** `nodeIntegration: true` was enabled in `createView` and `createPopup` in `src/main/utils/view.ts` and not explicitly disabled for `createYoutubeView` in `src/main/utils/windowManager.ts`. Since `contextIsolation` was also set to `false`, this would allow any remote code (like an XSS on YouTube Music) full access to Node APIs, leading to RCE.
**Learning:** In Electron, views that load remote content MUST have `nodeIntegration: false`.
**Prevention:** Always ensure `nodeIntegration` is `false` (which is the default in newer Electron versions, but explicitly disabling it is best when migrating or overriding defaults) and use `contextIsolation: true` with a safe preload script.
## 2026-03-25 - [CRITICAL] Fix URL protocol validation in setWindowOpenHandler
**Vulnerability:** Weak URL checking (`url.startsWith("http")`) allows dangerous protocols like `http-malicious://` to execute arbitrary commands/binaries via `shell.openExternal`.
**Learning:** String-based matching for URLs can easily bypass validation, leading to RCE if `shell.openExternal` is involved.
**Prevention:** Always parse URLs properly using the native `URL` constructor and strictly validate the `protocol` property.
