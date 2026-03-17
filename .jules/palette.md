## 2024-05-24 - Missing ARIA labels on Icon-only Buttons
**Learning:** Found a pattern where multiple icon-only buttons in custom Vue components (e.g., toolbar options, settings inputs) are lacking `aria-label` attributes, which makes them inaccessible to screen readers.
**Action:** Always verify that every `<button>` element containing only icons/SVGs and no text has an `aria-label` attribute describing its function. Use regex or global search for `<button>` in new components to ensure a11y compliance.
