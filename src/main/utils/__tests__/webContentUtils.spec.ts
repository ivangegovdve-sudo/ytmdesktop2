import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { is } from "@electron-toolkit/utils";
import { parseWindowUrl, rootWindowClearCustomCss, rootWindowInjectCustomCss } from "../webContentUtils";
import { WebContentsView } from "electron";

vi.mock("@electron-toolkit/utils", () => ({
  is: {
    dev: false,
  },
  platform: {
    isLinux: false,
    isMacOS: false,
    isWindows: true,
  },
}));

describe("webContentUtils", () => {


describe("rootWindowCustomCss", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully inject CSS and return true", async () => {
    const mockWebContents = {
      id: 1,
      insertCSS: vi.fn().mockResolvedValue("css-id-1"),
    };
    const mockView = { webContents: mockWebContents } as unknown as WebContentsView;

    const result = await rootWindowInjectCustomCss(mockView, "body { background: red; }");

    expect(result).toBe(true);
    expect(mockWebContents.insertCSS).toHaveBeenCalledWith("body { background: red; }");
  });

  it("should catch error during CSS injection and return false", async () => {
    const mockWebContents = {
      id: 2,
      insertCSS: vi.fn().mockRejectedValue(new Error("Injection failed")),
    };
    const mockView = { webContents: mockWebContents } as unknown as WebContentsView;

    const result = await rootWindowInjectCustomCss(mockView, "body { background: blue; }");

    expect(result).toBe(false);
    expect(mockWebContents.insertCSS).toHaveBeenCalledWith("body { background: blue; }");
  });

  it("should return false when clearing CSS if none was injected", async () => {
    const mockWebContents = {
      id: 3,
      removeInsertedCSS: vi.fn().mockResolvedValue(undefined),
    };
    const mockView = { webContents: mockWebContents } as unknown as WebContentsView;

    const result = await rootWindowClearCustomCss(mockView);

    expect(result).toBe(false);
    expect(mockWebContents.removeInsertedCSS).not.toHaveBeenCalled();
  });

  it("should successfully clear CSS and return true", async () => {
    const mockWebContents = {
      id: 4,
      insertCSS: vi.fn().mockResolvedValue("css-id-4"),
      removeInsertedCSS: vi.fn().mockResolvedValue(undefined),
    };
    const mockView = { webContents: mockWebContents } as unknown as WebContentsView;

    await rootWindowInjectCustomCss(mockView, "body { margin: 0; }");

    const result = await rootWindowClearCustomCss(mockView);

    expect(result).toBe(true);
    expect(mockWebContents.removeInsertedCSS).toHaveBeenCalledWith("css-id-4");
  });

  it("should catch error during CSS clearing and return false", async () => {
    const mockWebContents = {
      id: 5,
      insertCSS: vi.fn().mockResolvedValue("css-id-5"),
      removeInsertedCSS: vi.fn().mockRejectedValue(new Error("Clearing failed")),
    };
    const mockView = { webContents: mockWebContents } as unknown as WebContentsView;

    await rootWindowInjectCustomCss(mockView, "body { padding: 0; }");

    const result = await rootWindowClearCustomCss(mockView);

    expect(result).toBe(false);
    expect(mockWebContents.removeInsertedCSS).toHaveBeenCalledWith("css-id-5");
  });
});

  describe("parseWindowUrl", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
      originalEnv = process.env;
      process.env = { ...originalEnv };
      vi.resetModules();
    });

    afterEach(() => {
      process.env = originalEnv;
      vi.clearAllMocks();
    });

    it("should correctly parse an empty URL string and apply the default hash path", () => {
      is.dev = false;

      const result = parseWindowUrl("");

      expect(result.replace(/\\/g, "/")).toMatch(/\/renderer\/index\.html#\/$/);
    });

    it("should correctly handle undefined input", () => {
      is.dev = false;
      const result = parseWindowUrl();
      expect(result.replace(/\\/g, "/")).toMatch(/\/renderer\/index\.html#\/$/);
    });

    it("should correctly parse a URL string with a custom path", () => {
      is.dev = false;
      const result = parseWindowUrl("/settings");
      expect(result.replace(/\\/g, "/")).toMatch(/\/renderer\/index\.html#\/settings$/);
    });

    it("should correctly handle development environment URLs", () => {
      is.dev = true;
      Object.defineProperty(process.env, "ELECTRON_RENDERER_URL", { value: "http://localhost:5173/", writable: true });

      const result = parseWindowUrl("");
      expect(result).toBe("http://localhost:5173#/");

      const result2 = parseWindowUrl("/taskview");
      expect(result2).toBe("http://localhost:5173#/taskview");
    });

    it("should correctly handle development environment URLs without trailing slash", () => {
      is.dev = true;
      Object.defineProperty(process.env, "ELECTRON_RENDERER_URL", { value: "http://localhost:5173", writable: true });

      const result = parseWindowUrl("");

      expect(result).toBe("http://localhost:5173#/");
    });
  });
});
