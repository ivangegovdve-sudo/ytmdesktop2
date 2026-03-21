🎯 **What:** The testing gap addressed
This PR addresses the missing error handling tests in `rootWindowClearCustomCss` and `rootWindowInjectCustomCss` within `src/main/utils/webContentUtils.ts`. These functions previously lacked coverage for failure scenarios.

📊 **Coverage:** What scenarios are now tested
- **rootWindowInjectCustomCss:** Added tests for both the successful injection path and the error path where `insertCSS` rejects.
- **rootWindowClearCustomCss:** Added tests for the successful clear path, the error path where `removeInsertedCSS` rejects, and the edge case where no CSS was previously injected.

✨ **Result:** The improvement in test coverage
We now have full code coverage over the custom CSS injection and clearance utilities, verifying that when Electron's WebContents fail to inject or clear CSS, the functions correctly log the error and return `false` as expected without throwing unhandled promise rejections.
