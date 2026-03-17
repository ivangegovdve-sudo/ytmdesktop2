import { describe, expect, it, vi } from "vitest";

vi.mock("electron", () => ({
  BrowserWindow: class {},
  WebContentsView: class {},
}));

vi.mock("@shared/utils/console", () => ({
  logger: {
    child: vi.fn(() => ({
      debug: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
    })),
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@translations/index", () => ({
  default: {
    appName: "YouTube Music",
  },
}));

vi.mock("lodash-es", () => ({
  debounce: <T>(fn: T) => fn,
}));

vi.mock("~/build/favicon.ico?asset", () => ({
  default: "",
}));

vi.mock("../devUtils", () => ({
  defaultUrl: "https://music.youtube.com",
  isDevelopment: false,
  isProduction: false,
}));

vi.mock("../mappedWindow", () => ({
  createWindowContext: vi.fn(),
}));

vi.mock("../serverEvents", () => ({
  serverMain: {
    emit: vi.fn(),
    on: vi.fn(),
    onServer: vi.fn(),
  },
}));

vi.mock("../view", () => ({
  createApiView: vi.fn(),
  createView: vi.fn(),
  googleLoginPopup: vi.fn(),
}));

vi.mock("../webContentUtils", () => ({
  pushWindowStates: vi.fn(),
}));

vi.mock("../windowUtils", () => ({
  getBoundsWithScaleFactor: vi.fn(),
  wrapWindowHandler: vi.fn(),
}));

import { isPreventedNavOrRedirect, isGoogleLoginUrl } from "../windowManager";

describe("isGoogleLoginUrl", () => {
  it("should return true for Google login URLs", () => {
    expect(isGoogleLoginUrl(new URL("https://accounts.google.com/login"))).toBe(true);
    expect(isGoogleLoginUrl(new URL("https://accounts.google.co.uk"))).toBe(true);
  });

  it("should return false for non-Google login URLs", () => {
    expect(isGoogleLoginUrl(new URL("https://google.com/login"))).toBe(false);
    expect(isGoogleLoginUrl(new URL("https://youtube.com"))).toBe(false);
    expect(isGoogleLoginUrl(new URL("https://example.com"))).toBe(false);
  });
});

describe("isPreventedNavOrRedirect", () => {
  it("should block navigation to external domains not in the allowlist", () => {
    expect(isPreventedNavOrRedirect(new URL("https://example.com"))).toBe(true);
    expect(isPreventedNavOrRedirect(new URL("https://malicious.com/login"))).toBe(true);
  });

  it("should allow navigation to consent.youtube.com", () => {
    expect(isPreventedNavOrRedirect(new URL("https://consent.youtube.com"))).toBe(false);
    expect(isPreventedNavOrRedirect(new URL("https://consent.youtube.com/any/path"))).toBe(false);
  });

  it("should allow navigation to accounts.youtube.com", () => {
    expect(isPreventedNavOrRedirect(new URL("https://accounts.youtube.com"))).toBe(false);
  });

  it("should allow navigation to music.youtube.com", () => {
    expect(isPreventedNavOrRedirect(new URL("https://music.youtube.com"))).toBe(false);
  });

  it("should allow navigation to accounts.google.com and similar subdomains", () => {
    expect(isPreventedNavOrRedirect(new URL("https://accounts.google.com"))).toBe(false);
    expect(isPreventedNavOrRedirect(new URL("https://accounts.google.co.uk"))).toBe(false);
  });

  it("should allow navigation to youtube.com/premium (handled by event.preventDefault() later)", () => {
    expect(isPreventedNavOrRedirect(new URL("https://youtube.com/premium"))).toBe(false);
    expect(isPreventedNavOrRedirect(new URL("https://www.youtube.com/premium"))).toBe(false);
  });

  it("should allow navigation to youtube.com/musicpremium (handled by event.preventDefault() later)", () => {
    expect(isPreventedNavOrRedirect(new URL("https://youtube.com/musicpremium"))).toBe(false);
    expect(isPreventedNavOrRedirect(new URL("https://www.youtube.com/musicpremium"))).toBe(false);
  });

  it("should block regular youtube.com paths (because they aren't in the allowlist)", () => {
    expect(isPreventedNavOrRedirect(new URL("https://youtube.com/watch?v=123"))).toBe(true);
    expect(isPreventedNavOrRedirect(new URL("https://www.youtube.com/watch?v=123"))).toBe(true);
  });
});
