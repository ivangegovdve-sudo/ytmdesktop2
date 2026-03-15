
## 2024-05-24 - [Avoid Unnecessary Re-renders from IPC Updates in Vue]
**Learning:** The Electron IPC system often passes structured data directly into Vue's `ref` via utility functions like `refIpc` (`src/shared/utils/Ipc.ts`). Although the payload data structure might be identical to the existing state, IPC creates new object references. Because Vue's `ref` does equality checks based on reference and not structural equality, every IPC message—even ones with redundant data—triggers expensive component tree re-renders and re-evaluations.
**Action:** Always perform a deep equality check (e.g., using `lodash.isEqual`) when bridging IPC state updates into a Vue `ref`, particularly for nested data structures. Only update the `ref.value` if the actual contents have changed.
