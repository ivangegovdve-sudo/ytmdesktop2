## 2024-05-15 - [CRITICAL] Disable nodeIntegration in main views to prevent RCE
**Vulnerability:** `nodeIntegration: true` was enabled in `createView` and `createPopup` in `src/main/utils/view.ts` and not explicitly disabled for `createYoutubeView` in `src/main/utils/windowManager.ts`. Since `contextIsolation` was also set to `false`, this would allow any remote code (like an XSS on YouTube Music) full access to Node APIs, leading to RCE.
**Learning:** In Electron, views that load remote content MUST have `nodeIntegration: false`.
**Prevention:** Always ensure `nodeIntegration` is `false` (which is the default in newer Electron versions, but explicitly disabling it is best when migrating or overriding defaults) and use `contextIsolation: true` with a safe preload script.
## 2025-02-23 - Insecure nodeIntegration and sandbox Configuration
**Vulnerability:** The root window was configured with `sandbox: false` and potentially vulnerable dynamic configuration for `nodeIntegration`.
**Learning:** Hardcoding secure values like `nodeIntegration: false` and `sandbox: true` is crucial for security. Relying on dynamic variables for critical security settings can inadvertently enable insecure features or create compilation errors if the variable relies on bundler-specific objects like `import.meta.env`.
**Prevention:** Always hardcode secure defaults (`nodeIntegration: false`, `sandbox: true`, `contextIsolation: true`) and avoid using dynamically configurable options for core security settings.
