import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { is } from "@electron-toolkit/utils";
import { parseWindowUrl } from "../webContentUtils";

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
      process.env.ELECTRON_RENDERER_URL = "http://localhost:5173/";

      const result = parseWindowUrl("");
      expect(result).toBe("http://localhost:5173#/");

      const result2 = parseWindowUrl("/taskview");
      expect(result2).toBe("http://localhost:5173#/taskview");
    });

    it("should correctly handle development environment URLs without trailing slash", () => {
      is.dev = true;
      process.env.ELECTRON_RENDERER_URL = "http://localhost:5173";

      const result = parseWindowUrl("");

      expect(result).toBe("http://localhost:5173#/");
    });
  });
});
