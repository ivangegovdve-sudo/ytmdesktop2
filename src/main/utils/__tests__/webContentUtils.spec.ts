import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { is } from "@electron-toolkit/utils";
import { parseWindowUrl, rootWindowInjectCustomCss } from "../webContentUtils";

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

  describe("rootWindowInjectCustomCss", () => {
    it("should return false and log error if insertCSS throws an error", async () => {
      const mockWebContents = {
        id: 1,
        insertCSS: vi.fn().mockRejectedValue(new Error("CSS insertion failed")),
      };

      const mockWebContentsView = {
        webContents: mockWebContents as any,
      } as any;

      const result = await rootWindowInjectCustomCss(mockWebContentsView, "body { color: red; }");

      expect(result).toBe(false);
      expect(mockWebContents.insertCSS).toHaveBeenCalledWith("body { color: red; }");
    });

    it("should return false and handle unknown errors without a message property", async () => {
      const mockWebContents = {
        id: 2,
        insertCSS: vi.fn().mockRejectedValue(null),
      };

      const mockWebContentsView = {
        webContents: mockWebContents as any,
      } as any;

      const result = await rootWindowInjectCustomCss(mockWebContentsView, "body { color: blue; }");

      expect(result).toBe(false);
      expect(mockWebContents.insertCSS).toHaveBeenCalledWith("body { color: blue; }");
    });
  });
});
