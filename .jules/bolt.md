## 2024-05-18 - Avoid heavy date libraries in high-frequency Vue computed properties
**Learning:** Using heavy date formatting libraries like `date-fns` `intervalToDuration` inside high-frequency reactive Vue computed properties (such as media player progress updates that trigger every few milliseconds or seconds) causes severe CPU overhead and excessive garbage collection.
**Action:** Replace heavy date manipulation library calls with fast, simple math and string padding helpers for simple time formatting in any UI element that updates frequently, particularly progress bars or active timers.

## 2024-05-18 - BaseCollection O(N) lookup bottleneck
**Learning:** The Electron main process relies on `BaseCollection.getProvider()` for frequent inter-service communication, which previously used an $O(N)$ `.find()` iteration over an array. As the number of registered providers grows, this causes unnecessary performance overhead during IPC message routing and inter-service calls.
**Action:** When working with core registries that handle heavy traffic or frequent lookups (like IPC service resolution), pre-compute an internal `Map` to guarantee $O(1)$ lookups, even if the array is relatively small.

## 2024-05-18 - Deep Equality check performance bottleneck in Vue refIpc
**Learning:** Do not blindly apply deep equality checks (e.g., `lodash.isEqual`) on Vue reactive proxies (such as `refIpc` values) to prevent re-renders. Synchronous deep traversals over Vue Proxies trigger all reactive getter traps, causing severe performance regressions that outweigh the benefits of preventing identical payload re-renders.
**Action:** Use strict equality (`===`) when assigning new values from IPC payloads to Vue `ref`s to catch primitive equality but avoid deep proxy traversals, ensuring high-frequency IPC events are performant.
