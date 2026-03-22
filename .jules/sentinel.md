## 2024-05-15 - [CRITICAL] Disable nodeIntegration in main views to prevent RCE
**Vulnerability:** `nodeIntegration: true` was enabled in `createView` and `createPopup` in `src/main/utils/view.ts` and not explicitly disabled for `createYoutubeView` in `src/main/utils/windowManager.ts`. Since `contextIsolation` was also set to `false`, this would allow any remote code (like an XSS on YouTube Music) full access to Node APIs, leading to RCE.
**Learning:** In Electron, views that load remote content MUST have `nodeIntegration: false`.
**Prevention:** Always ensure `nodeIntegration` is `false` (which is the default in newer Electron versions, but explicitly disabling it is best when migrating or overriding defaults) and use `contextIsolation: true` with a safe preload script.
## 2024-05-24 - [HIGH] Prevent unconfigured window creation in login view
**Vulnerability:** The loginView.webContents.setWindowOpenHandler was returning { action: "allow" } for non-Google HTTP URLs. This allows arbitrary websites loaded during the login flow to open new unconfigured Electron windows, bypassing security restrictions like nodeIntegration: false.
**Learning:** Always explicitly route allowed external URLs via shell.openExternal() and deny default window creation actions.
**Prevention:** Always implement setWindowOpenHandler to deny default actions (return { action: "deny" }) and explicitly route allowed external URLs via shell.openExternal().
