import { describe, it, expect, vi } from "vitest";
import { parseJson } from "./index";

describe("parseJson", () => {
  it("should correctly parse a valid JSON string", () => {
    const result = parseJson<{ key: string }>('{"key":"value"}');
    expect(result).toEqual({ key: "value" });
  });

  it("should return null for non-string inputs", () => {
    expect(parseJson(123)).toBeNull();
    expect(parseJson({ key: "value" })).toBeNull();
    expect(parseJson(null)).toBeNull();
    expect(parseJson(undefined)).toBeNull();
  });

  it("should return null and log an error when given an invalid JSON string", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = parseJson('{"invalid": true'); // missing closing brace

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledOnce();

    consoleSpy.mockRestore();
  });
});
