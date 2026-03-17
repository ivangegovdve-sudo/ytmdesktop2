## 2024-03-17 - Fast Math Replaces Date-Fns in Vue Computed Properties
**Learning:** Using `intervalToDuration` from `date-fns` inside a hot Vue computed property (like one that updates every progress tick of a media player) is very heavy and causes unnecessary CPU usage/garbage collection.
**Action:** When formatting basic time durations (like seconds to HH:MM:SS) in a high-frequency reactive context, use simple math and string padding instead of complex date library functions.
