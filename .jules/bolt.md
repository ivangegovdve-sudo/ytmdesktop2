
## 2024-05-15 - [Prevent Unnecessary Re-renders from IPC Events]
**Learning:** In Vue/Electron architectures, IPC payloads frequently provide new object references for structurally identical data. When bridging this IPC state to Vue reactive `ref`s (like `refIpc` values), this triggers unnecessary component tree re-renders because Vue's default reactivity relies on reference equality.
**Action:** Always use deep equality checks (e.g., `lodash-es`'s `isEqual`) before updating a reactive `ref` with incoming IPC data. Only assign the new value if `isEqual(newVal, state.value)` is false.

## 2024-05-15 - [Optimize Service Provider Lookups]
**Learning:** `BaseCollection` (used for `providers`, `services`, and `events`) relied on `$O(n)$` array lookups (`this.items.find`) and mapping for `getProvider` and `getProviderNames`. Since `getProvider` is called frequently (e.g. `this.getProvider("track")`), this can add up in tight event loops.
**Action:** Implemented an internal `Map` for $O(1)$ constant time lookups in `getProvider` and cached the names array for `getProviderNames`.

## 2024-05-15 - [Dangers of Blind Deep Equality in Reactivity]
**Learning:** Initially attempted to optimize Vue component re-renders by blindly applying `lodash-es`'s `isEqual` to all incoming IPC payloads in `refIpc` before updating Vue refs. While this prevents re-renders on identical data, `isEqual` performs a synchronous deep traversal. When dealing with Vue Proxies, this traversal triggers reactive getter traps for every nested property. For large, frequently mutating IPC payloads, this overhead causes severe performance regressions on the main thread that outweigh the benefit of avoiding a re-render.
**Action:** Do not blindly apply deep equality checks across all state updates. Only use deep equality checks when the cost of re-rendering is proven to be higher than the cost of the equality check, and target specific bottlenecks rather than modifying generic utility functions.
