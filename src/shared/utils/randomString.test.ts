import { describe, expect, it } from "vitest";
import { generateRandom } from "./randomString";

describe("generateRandom", () => {
  it("generates a string of the correct length", () => {
    expect(generateRandom(10)).toHaveLength(10);
    expect(generateRandom(32)).toHaveLength(32);
    expect(generateRandom(100)).toHaveLength(100);
  });

  it("generates a base64url encoded string", () => {
    const result = generateRandom(64);
    expect(result).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("generates unique strings", () => {
    const str1 = generateRandom(32);
    const str2 = generateRandom(32);
    expect(str1).not.toBe(str2);
  });

  it("handles length 0", () => {
    expect(generateRandom(0)).toHaveLength(0);
  });
});
