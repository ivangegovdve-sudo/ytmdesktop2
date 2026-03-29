## 2026-03-29 - File Input UX Improvements
**Learning:** File input fields without selected files appeared completely empty, offering no visual feedback. Additionally, long file paths caused layout overflow in flex containers because they weren't explicitly truncated.
**Action:** Always provide clear 'empty state' fallback text (e.g., 'No file selected' with muted/italic styling). Apply `min-w-0` on flex children with `truncate` inner spans to properly handle long path strings, and add a `:title` attribute to ensure the full path remains accessible via native tooltip.
