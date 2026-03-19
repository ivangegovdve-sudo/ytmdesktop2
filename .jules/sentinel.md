## 2024-05-15 - [CRITICAL] Disable nodeIntegration in main views to prevent RCE
**Vulnerability:** `nodeIntegration: true` was enabled in `createView` and `createPopup` in `src/main/utils/view.ts` and not explicitly disabled for `createYoutubeView` in `src/main/utils/windowManager.ts`. Since `contextIsolation` was also set to `false`, this would allow any remote code (like an XSS on YouTube Music) full access to Node APIs, leading to RCE.
**Learning:** In Electron, views that load remote content MUST have `nodeIntegration: false`.
**Prevention:** Always ensure `nodeIntegration` is `false` (which is the default in newer Electron versions, but explicitly disabling it is best when migrating or overriding defaults) and use `contextIsolation: true` with a safe preload script.
## 2024-05-18 - [CRITICAL] Enable sandbox in main views to prevent RCE
**Vulnerability:** `sandbox: false` was set in `createAppWindow`, `createView`, and `createPopup` across the application. Disabling the sandbox allows the renderer process full access to system resources if an attacker bypasses context isolation or exploits an RCE vulnerability.
**Learning:** In Electron, views and windows loading remote content MUST have `sandbox: true` to enforce Chromium's OS-level sandbox and contain the blast radius of any successful exploit.
**Prevention:** Always ensure `sandbox` is set to `true` in `webPreferences` for all `BrowserWindow` and `WebContentsView` instances.
