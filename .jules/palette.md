## 2024-05-18 - Missing ARIA Labels and Non-Semantic Buttons
**Learning:** Found multiple instances where icon-only controls were implemented using `div` tags with `click` handlers instead of semantic `button` elements, and lacked accessible names (`aria-label`) and hover tooltips (`title`). This pattern was prominent in window control bars and toolbar option areas.
**Action:** When working on toolbars and control components in this application, proactively check for interactive `div` elements and convert them to `button` elements. Always ensure that icon-only buttons include both `aria-label` and `title` attributes for full accessibility and visual usability.
## 2024-03-18 - [Dynamic ARIA labels for Toggle Buttons]
**Learning:** Hardcoded `aria-label` attributes on dynamic media toggle buttons (like Play/Pause) fail to update screen readers when the playback state changes, creating an inaccurate accessibility experience.
**Action:** When working with toggle buttons, always bind the `aria-label` and `title` dynamically to the reactive state (e.g., `:aria-label="playing ? 'Pause' : 'Play'"`). For simple toggles like Like/Dislike, ensure `aria-pressed` is correctly bound to the true/false state.

## 2026-03-20 - Explicit Label Bindings in Vue Components
**Learning:** Vue components that act as wrappers for forms (like SettingsInput, SettingsSelect, SettingsCheckbox) often have an implicit wrapping `<label>` that surrounds the text but doesn't explicitly bind to the input via `for` and `id` attributes. This lack of explicit binding prevents screen readers from properly associating the label with the input, and also fails to provide the helpful click-to-focus behavior for inputs.
**Action:** When creating or modifying Vue form wrapper components, always explicitly bind the `<label>` element to the nested `<input>` or `<select>` element using a unique identifier (like `configKey` for settings) with the `:for` and `:id` attributes to ensure proper screen reader support and click interactions.
## 2026-03-27 - [Accessible Custom Toggle Cards]
**Learning:** Custom UI cards that act as toggle switches (e.g., SectionCard for integrations) often lack semantic accessibility and keyboard support out of the box, relying only on `@click` handlers.
**Action:** When creating or modifying custom toggle components, always ensure they are accessible by adding `role="switch"`, `tabindex="0"`, dynamically bound `:aria-checked` states, and keyboard event handlers (`@keydown.space.prevent` and `@keydown.enter.prevent`) to support screen readers and keyboard navigation.
