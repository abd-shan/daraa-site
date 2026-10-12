import { ar, type Dictionary } from "./ar";
import { en } from "./en";

export type { Dictionary };

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

/** Arabic is the primary locale; `/` redirects here (see next.config.ts). */
export const defaultLocale: Locale = "ar";

/** Route params arrive as `string`; narrow before trusting them. */
export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export const getDictionary = (locale: Locale): Dictionary =>
  dictionaries[locale];

export const dir = (locale: Locale): "rtl" | "ltr" =>
  locale === "ar" ? "rtl" : "ltr";

export const otherLocale = (locale: Locale): Locale =>
  locale === "ar" ? "en" : "ar";

/**
 * Swaps the locale segment, keeping the rest of the path.
 * The `(?=/|$)` lookahead is load-bearing: without it "/argentina" would be
 * read as locale "ar" plus "gentina".
 */
export function localePath(pathname: string, target: Locale): string {
  const rest = pathname.replace(
    new RegExp(`^/(${locales.join("|")})(?=/|$)`),
    "",
  );
  return `/${target}${rest}`;
}
