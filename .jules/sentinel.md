## 2024-05-24 - Ensure `bypassCSP` is `false` for privileged schemes
**Vulnerability:** The application was registering `http` and `https` custom schemes with `bypassCSP: true`. This disables Content Security Policy (CSP) enforcement globally for these protocols, which significantly weakens the app's defense-in-depth against Cross-Site Scripting (XSS) and other injection attacks.
**Learning:** Overly permissive custom protocol configurations can negate other security mechanisms like CSP.
**Prevention:** Avoid using `bypassCSP: true` when registering custom schemes or privileges in Electron unless explicitly required for a highly specific and isolated use case.
