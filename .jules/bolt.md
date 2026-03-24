## 2024-05-18 - Avoid heavy date libraries in high-frequency Vue computed properties
**Learning:** Using heavy date formatting libraries like `date-fns` `intervalToDuration` inside high-frequency reactive Vue computed properties (such as media player progress updates that trigger every few milliseconds or seconds) causes severe CPU overhead and excessive garbage collection.
**Action:** Replace heavy date manipulation library calls with fast, simple math and string padding helpers for simple time formatting in any UI element that updates frequently, particularly progress bars or active timers.

## 2024-05-18 - BaseCollection O(N) lookup bottleneck
**Learning:** The Electron main process relies on `BaseCollection.getProvider()` for frequent inter-service communication, which previously used an $O(N)$ `.find()` iteration over an array. As the number of registered providers grows, this causes unnecessary performance overhead during IPC message routing and inter-service calls.
**Action:** When working with core registries that handle heavy traffic or frequent lookups (like IPC service resolution), pre-compute an internal `Map` to guarantee $O(1)$ lookups, even if the array is relatively small.

## 2024-03-15 - Prevent unnecessary re-renders in refIpc
**Learning:** In Vue/Electron architectures, bridging IPC state directly to Vue reactive references (like `refIpc` values) can trigger unnecessary component tree re-renders. IPC payloads frequently provide new object references for structurally identical data. Because Vue's `ref` uses strict equality (`===`) by default, updating the ref with a structurally identical but distinct object reference will cause components watching that ref to unnecessarily re-render.
**Action:** Use deep equality checks (e.g., `lodash.isEqual`) when assigning new values from IPC payloads to Vue `ref`s to verify if the content has actually changed before assigning it and triggering reactivity.

## 2024-05-18 - Deep Equality Checks on Vue Proxies
**Learning:** Synchronous deep traversals over Vue Proxies using `lodash.isEqual` trigger all reactive getter traps, causing severe performance regressions that outweigh the benefits of preventing identical payload re-renders.
**Action:** Always unwrap the Vue proxy first using Vue's `toRaw()` before performing deep equality checks (e.g., `isEqual(toRaw(state.value), newVal)`).
## 2026-03-20 - O(N^2) reduce object spread bottleneck
**Learning:** Using object spread (...l) inside Array.prototype.reduce() creates a new object on every iteration, leading to $O(N^2)$ time and space complexity which can cause measurable startup delays when building registries (like providers and events).
**Action:** Replace reduce object spread patterns with direct property assignment (l[key] = value; return l;) or Object.fromEntries() to ensure $O(N)$ performance.

## 2024-05-18 - Replacing Mutating Reduce with Object.fromEntries
**Learning:** While `Object.fromEntries(array.map(...))` is a great way to avoid (N^2)$ object spread overhead, using it to replace an already (N)$ mutating `Array.prototype.reduce` (e.g., `acc[key] = val; return acc`) actually *decreases* performance. This is because `.map()` allocates a new intermediate array of tuples in memory, increasing garbage collection overhead.
**Action:** When refactoring array aggregations, do not replace a mutating `reduce` with `Object.fromEntries(array.map(...))`. Only use `Object.fromEntries` if the mapping already exists, or if you are specifically eliminating an (N^2)$ spread syntax bottleneck.
