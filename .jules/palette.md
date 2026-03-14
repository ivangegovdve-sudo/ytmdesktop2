## 2024-05-18 - [Missing ARIA Labels on Icon Buttons in Toolbar]
**Learning:** Many interactive icon-only buttons in `src/renderer/src/views/youtube/toolbar-options.vue` and `src/renderer/src/views/youtube/toolbar.vue` are lacking accessible names (`aria-label`). Screen reader users will hear "button" without knowing the action.
**Action:** Adding `aria-label` attributes to these buttons will improve accessibility.
