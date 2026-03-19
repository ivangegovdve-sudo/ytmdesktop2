import { join } from "path";
import { describe, expect, it, vi } from "vitest";

vi.mock("electron", () => ({
  BrowserWindow: vi.fn(),
  WebContentsView: vi.fn(),
  screen: {
    getAllDisplays: vi.fn(() => []),
    getDisplayNearestPoint: vi.fn(() => ({ bounds: {}, scaleFactor: 1 })),
  },
  shell: {
    openExternal: vi.fn(),
  },
}));

vi.mock("@electron-toolkit/utils", () => ({
  platform: {
    isWindows: false,
    isMacOS: false,
    isLinux: true,
  },
}));

vi.mock("@main/lib/store/createYmlStore", () => ({
  createYmlStore: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
  })),
}));

vi.mock("@shared/utils/console", () => ({
  createLogger: vi.fn(() => ({
    child: vi.fn(() => ({
      debug: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
    })),
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  })),
}));

vi.mock("./devUtils", () => ({
  isDevelopment: false,
}));

vi.mock("./webContentUtils", () => ({
  loadUrlOfWindow: vi.fn(),
  syncWindowStateToWebContents: vi.fn(() => vi.fn()),
}));

vi.mock("~/build/favicon.ico?asset", () => ({
  default: "",
}));

import { parseScriptPath } from "./windowUtils";

describe("parseScriptPath", () => {
  it("joins __dirname, ../preload and the provided path", () => {
    const path = "my-script.js";
    const expected = join(__dirname, "../preload", path);

    expect(parseScriptPath(path)).toBe(expected);
  });

  it("handles paths with subdirectories", () => {
    const path = "sub/dir/script.js";
    const expected = join(__dirname, "../preload", path);

    expect(parseScriptPath(path)).toBe(expected);
  });

  it("handles an empty string", () => {
    const path = "";
    const expected = join(__dirname, "../preload", path);

    expect(parseScriptPath(path)).toBe(expected);
  });
});
