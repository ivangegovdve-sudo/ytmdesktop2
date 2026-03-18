## 2024-05-18 - Missing ARIA Labels and Non-Semantic Buttons
**Learning:** Found multiple instances where icon-only controls were implemented using `div` tags with `click` handlers instead of semantic `button` elements, and lacked accessible names (`aria-label`) and hover tooltips (`title`). This pattern was prominent in window control bars and toolbar option areas.
**Action:** When working on toolbars and control components in this application, proactively check for interactive `div` elements and convert them to `button` elements. Always ensure that icon-only buttons include both `aria-label` and `title` attributes for full accessibility and visual usability.

## 2023-10-27 - Icon-only buttons with dynamic aria-labels
**Learning:** Icon-only toggles (like Play/Pause or Stay on Top) often use static generic ARIA labels instead of communicating the *current* state and expected action.
**Action:** When creating toggle buttons, use dynamic `aria-label` and `title` attributes (e.g., `:aria-label="playing ? 'Pause' : 'Play'"`) to ensure screen readers and mouse tooltips clearly explain the action the button will perform if clicked.
