import { describe, expect, it } from "vitest";
import { ar } from "./ar";
import { en } from "./en";
import { dir, getDictionary, isLocale, localePath, otherLocale } from ".";

describe("isLocale", () => {
  it("accepts supported locales", () => {
    expect(isLocale("ar")).toBe(true);
    expect(isLocale("en")).toBe(true);
  });

  it("rejects everything else", () => {
    for (const bad of ["fr", "AR", "", "ar-SY", "../etc/passwd"]) {
      expect(isLocale(bad)).toBe(false);
    }
  });
});

describe("dir", () => {
  it("maps Arabic to rtl and English to ltr", () => {
    expect(dir("ar")).toBe("rtl");
    expect(dir("en")).toBe("ltr");
  });
});

describe("localePath", () => {
  it("swaps the locale segment", () => {
    expect(localePath("/ar", "en")).toBe("/en");
    expect(localePath("/ar/design-system", "en")).toBe("/en/design-system");
    expect(localePath("/en/design-system", "ar")).toBe("/ar/design-system");
  });

  it("does not eat a path that merely starts with a locale's letters", () => {
    expect(localePath("/argentina", "en")).toBe("/en/argentina");
    expect(localePath("/energy/report", "ar")).toBe("/ar/energy/report");
  });

  it("prefixes a path that has no locale yet", () => {
    expect(localePath("/", "ar")).toBe("/ar/");
    expect(localePath("/news", "ar")).toBe("/ar/news");
  });
});

describe("dictionaries", () => {
  it("returns the right dictionary", () => {
    expect(getDictionary("ar")).toBe(ar);
    expect(getDictionary("en")).toBe(en);
  });

  it("has no untranslated strings left over from Arabic", () => {
    // TypeScript already guarantees the keys match. This catches the other
    // failure: an English value copy-pasted from Arabic and never translated.
    expect(en.siteName).not.toBe(ar.siteName);
    expect(en.skipToContent).not.toBe(ar.skipToContent);
    expect(en.nav.home).not.toBe(ar.nav.home);
  });

  it("switches to the other locale", () => {
    expect(otherLocale("ar")).toBe("en");
    expect(otherLocale("en")).toBe("ar");
  });
});
