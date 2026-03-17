## 2024-05-19 - Added ARIA labels and native button support to ControlBar

**Learning:** Window control buttons (Minimize, Maximize, Close) in this app were implemented as `div` tags with `click` handlers, lacking `aria-label`s and native keyboard focus/interaction support.
**Action:** Always verify if interactive icon-only elements (especially global controls like window management) are using native `<button>` tags with appropriate `aria-label`s to ensure they are accessible to screen readers and keyboard users.
