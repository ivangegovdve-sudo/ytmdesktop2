## 2024-05-15 - [CRITICAL] Disable nodeIntegration in main views to prevent RCE
**Vulnerability:** `nodeIntegration: true` was enabled in `createView` and `createPopup` in `src/main/utils/view.ts` and not explicitly disabled for `createYoutubeView` in `src/main/utils/windowManager.ts`. Since `contextIsolation` was also set to `false`, this would allow any remote code (like an XSS on YouTube Music) full access to Node APIs, leading to RCE.
**Learning:** In Electron, views that load remote content MUST have `nodeIntegration: false`.
**Prevention:** Always ensure `nodeIntegration` is `false` (which is the default in newer Electron versions, but explicitly disabling it is best when migrating or overriding defaults) and use `contextIsolation: true` with a safe preload script.
## 2026-03-29 - Prevent Protocol Spoofing in setWindowOpenHandler
**Vulnerability:** Using string.startsWith('http') to validate URLs in setWindowOpenHandler allows protocol spoofing (e.g. 'http-malicious://').
**Learning:** The URL protocol should always be strictly validated using the native URL constructor to ensure only 'http:' and 'https:' are allowed.
**Prevention:** Wrap the URL constructor in a try/catch block and explicitly check if protocol === 'http:' || protocol === 'https:'.
