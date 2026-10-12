import localFont from "next/font/local";

/**
 * Qomra — the official Arabic typeface of the Syrian visual identity.
 *
 * Three weights only. Light is deliberately left out: thin text fails on the
 * low-quality screens a public portal has to serve, and every extra weight is
 * another ~55 KB on a slow connection.
 *
 * Licence is still unconfirmed — see public/brand/README.md. Nothing here
 * modifies the font files; Next.js self-hosts them as-is.
 */
export const qomra = localFont({
  src: [
    {
      path: "./fonts/itfQomraArabic-Regular.otf",
      weight: "400",
      style: "normal",
    },
    { path: "./fonts/itfQomraArabic-Bold.otf", weight: "700", style: "normal" },
    {
      path: "./fonts/itfQomraArabic-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-qomra",
  display: "swap",
  // Qomra is Arabic-only, so Latin glyphs fall through to the system stack.
  fallback: ["system-ui", "Segoe UI", "Tahoma", "sans-serif"],
});

/**
 * Lato — digits only, everywhere on the site.
 *
 * `unicode-range` is the whole mechanism: the browser reaches for this face
 * only for U+0030–U+0039, so listing it ahead of Qomra restyles every Latin
 * digit and touches nothing else. No component, no class, no wrapper span.
 * Arabic-Indic digits (U+0660–U+0669) are outside the range and stay Qomra.
 *
 * The files are Google's `text=0123456789` subsets — ~7 KB each instead of
 * ~50 KB. Lato is SIL Open Font License 1.1, which unlike Qomra explicitly
 * permits redistribution, so committing these is settled rather than
 * provisional.
 */
export const latoDigits = localFont({
  src: [
    { path: "./fonts/Lato-Digits-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Lato-Digits-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-lato-digits",
  display: "swap",
  declarations: [{ prop: "unicode-range", value: "U+0030-0039" }],
  // A metric-adjusted fallback face would carry no unicode-range and so would
  // capture far more than digits.
  adjustFontFallback: false,
});
