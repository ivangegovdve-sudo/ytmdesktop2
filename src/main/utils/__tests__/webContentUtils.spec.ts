import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { is } from "@electron-toolkit/utils";
import type { WebContentsView } from "electron";
import { parseWindowUrl, rootWindowClearCustomCss, rootWindowInjectCustomCss } from "../webContentUtils";

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

vi.mock("electron", () => ({
  BrowserWindow: vi.fn(),
}));

describe("webContentUtils", () => {
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

  describe("rootWindowClearCustomCss", () => {
    it("should return false when removeInsertedCSS throws an error", async () => {
      const mockWebContents = {
        id: 999,
        insertCSS: vi.fn().mockResolvedValue("mock-css-key"),
        removeInsertedCSS: vi.fn().mockRejectedValue(new Error("Mock error")),
      };

      const mockView = { webContents: mockWebContents } as unknown as WebContentsView;

      // Setup state by injecting CSS first
      await rootWindowInjectCustomCss(mockView, "body { color: red; }");

      const result = await rootWindowClearCustomCss(mockView);
      expect(result).toBe(false);
    });
  });
});
