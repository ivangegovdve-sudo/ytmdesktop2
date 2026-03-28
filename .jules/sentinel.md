## 2024-05-15 - [CRITICAL] Disable nodeIntegration in main views to prevent RCE
**Vulnerability:** `nodeIntegration: true` was enabled in `createView` and `createPopup` in `src/main/utils/view.ts` and not explicitly disabled for `createYoutubeView` in `src/main/utils/windowManager.ts`. Since `contextIsolation` was also set to `false`, this would allow any remote code (like an XSS on YouTube Music) full access to Node APIs, leading to RCE.
**Learning:** In Electron, views that load remote content MUST have `nodeIntegration: false`.
**Prevention:** Always ensure `nodeIntegration` is `false` (which is the default in newer Electron versions, but explicitly disabling it is best when migrating or overriding defaults) and use `contextIsolation: true` with a safe preload script.
## 2026-03-28 - Secure URL validation in shell.openExternal
**Vulnerability:** Checking URL protocols with `url.startsWith("http")` allows bypassing by attackers.
**Learning:** `startsWith("http")` permits insecure local execution or protocol spoofing if URL structures are manipulated. Native URL parsing ensures strictly valid protocols.
**Prevention:** Always use `new URL(url).protocol` inside a `try/catch` block before invoking `shell.openExternal`.
