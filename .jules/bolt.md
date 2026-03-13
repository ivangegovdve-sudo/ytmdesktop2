## 2024-03-13 - [Performance Optimization: Math vs date-fns]
**Learning:** `intervalToDuration` from `date-fns` is surprisingly slow when called frequently (e.g., inside a `computed` property updating every tick/frame in Vue).
**Action:** Use native math calculations (`Math.floor` and modulo `%`) for simple time formatting in hot paths instead of heavy utility library functions.
