import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { parseWindowUrl } from "../webContentUtils";
import { is } from "@electron-toolkit/utils";

vi.mock("@electron-toolkit/utils", () => ({
  is: {
    dev: false,
  },
  platform: {
    isMacOS: false,
  },
}));

describe("parseWindowUrl", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  it("should return production path when not in dev mode", () => {
    (is as { dev: boolean }).dev = false;
    // In actual code, it uses __dirname and joins with "../renderer/index.html"
    // We just test if it returns a string containing the expected parts
    const result = parseWindowUrl();
    expect(result).toContain("renderer/index.html#/");
  });

  it("should format production path with custom page correctly", () => {
    (is as { dev: boolean }).dev = false;
    const result = parseWindowUrl("/settings");
    expect(result).toContain("renderer/index.html#/settings");
  });

  it("should format production path with custom hash page correctly", () => {
    (is as { dev: boolean }).dev = false;
    const result = parseWindowUrl("#/settings");
    expect(result).toContain("renderer/index.html#/settings");
  });

  it("should return dev path when in dev mode and ELECTRON_RENDERER_URL is set (with trailing slash)", () => {
    (is as { dev: boolean }).dev = true;
    Object.defineProperty(process.env, "ELECTRON_RENDERER_URL", {
      value: "http://localhost:5173/",
      writable: true,
      configurable: true,
    });

    // The current code removes trailing slash from ELECTRON_RENDERER_URL before appending hashPath
    // `process.env["ELECTRON_RENDERER_URL"].replace(/\/?$/, hashPath)`
    const result = parseWindowUrl();
    expect(result).toBe("http://localhost:5173#/");
  });

  it("should append hashPath properly to dev path without trailing slash", () => {
    (is as { dev: boolean }).dev = true;
    Object.defineProperty(process.env, "ELECTRON_RENDERER_URL", {
      value: "http://localhost:5173",
      writable: true,
      configurable: true,
    });

    const result = parseWindowUrl("/settings");
    expect(result).toBe("http://localhost:5173#/settings");
  });

  it("should return production path if in dev mode but ELECTRON_RENDERER_URL is not set", () => {
    (is as { dev: boolean }).dev = true;
    Object.defineProperty(process.env, "ELECTRON_RENDERER_URL", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const result = parseWindowUrl();
    expect(result).toContain("renderer/index.html#/");
  });
});
