## 2024-05-18 - Missing ARIA Labels and Non-Semantic Buttons
**Learning:** Found multiple instances where icon-only controls were implemented using `div` tags with `click` handlers instead of semantic `button` elements, and lacked accessible names (`aria-label`) and hover tooltips (`title`). This pattern was prominent in window control bars and toolbar option areas.
**Action:** When working on toolbars and control components in this application, proactively check for interactive `div` elements and convert them to `button` elements. Always ensure that icon-only buttons include both `aria-label` and `title` attributes for full accessibility and visual usability.
## 2024-03-18 - [Dynamic ARIA labels for Toggle Buttons]
**Learning:** Hardcoded `aria-label` attributes on dynamic media toggle buttons (like Play/Pause) fail to update screen readers when the playback state changes, creating an inaccurate accessibility experience.
**Action:** When working with toggle buttons, always bind the `aria-label` and `title` dynamically to the reactive state (e.g., `:aria-label="playing ? 'Pause' : 'Play'"`). For simple toggles like Like/Dislike, ensure `aria-pressed` is correctly bound to the true/false state.
## 2024-05-18 - Explicit Accessibility Bindings in Vue Form Components
**Learning:** Found instances where `<label>` elements in Vue form components were detached from their associated `<input>` elements, hindering screen reader accessibility and click-to-focus behavior.
**Action:** When creating or updating form components, ensure explicit accessibility bindings by linking `<label>` elements to `<input>` elements using `:for` and `:id` attributes (e.g., using a unique identifier like `configKey`) to enable proper screen reader association and click-to-focus behavior.
