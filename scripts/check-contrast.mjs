// Fails the build when a semantic token pair drops below WCAG 2.2 AA.
// Reads the light-dark() declarations in globals.css so the CSS stays the
// single source of truth. Run: node scripts/check-contrast.mjs
import { readFileSync } from "node:fs";

const CSS = readFileSync(
  new URL("../src/app/globals.css", import.meta.url),
  "utf8",
);

// --token: light-dark(#light, #dark);
const tokens = { light: {}, dark: {} };
for (const [, name, light, dark] of CSS.matchAll(
  // The negative lookahead skips 8-digit hex: a token carrying alpha cannot
  // be contrast-checked against an opaque background, so it must not be
  // silently parsed as its first six digits.
  /--([\w-]+):\s*light-dark\(\s*(#[0-9a-f]{6})(?![0-9a-f])\s*,\s*(#[0-9a-f]{6})(?![0-9a-f])\s*\)/gi,
)) {
  tokens.light[name] = light;
  tokens.dark[name] = dark;
}

// 1.4.3 Contrast (Minimum) for text, 1.4.11 Non-text Contrast for UI.
const PAIRS = [
  ["foreground", "background", 4.5],
  ["foreground", "surface", 4.5],
  ["muted-foreground", "background", 4.5],
  ["muted-foreground", "surface", 4.5],
  ["primary", "background", 4.5],
  ["primary", "surface", 4.5],
  ["primary-foreground", "primary", 4.5],
  ["secondary", "background", 4.5],
  ["success", "background", 4.5],
  ["warning", "background", 4.5],
  ["danger", "background", 4.5],
  // Hero text sits where the scrim is effectively opaque, so checking against
  // the solid scrim colour is the right approximation. Keep it that way: if
  // the gradient is ever made translucent under the text, this stops holding.
  ["office-foreground", "office", 4.5],
  ["hero-foreground", "hero-scrim", 4.5],
  ["hero-accent", "hero-scrim", 4.5],
  ["border-strong", "background", 3],
  ["border-strong", "surface", 3],
  ["focus-ring", "background", 3],
  ["focus-ring", "surface", 3],
];
// Not asserted: --border and --accent are decorative. Neither may be the
// only thing identifying a control or carrying meaning — use
// --border-strong for control outlines.

const channel = (c) =>
  c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    channel(v / 255),
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

const failures = [];
for (const theme of ["light", "dark"]) {
  const t = tokens[theme];
  if (!Object.keys(t).length)
    failures.push(`no ${theme} tokens parsed from globals.css`);
  for (const [fg, bg, min] of PAIRS) {
    if (!t[fg] || !t[bg]) {
      failures.push(`${theme}: missing token ${!t[fg] ? fg : bg}`);
      continue;
    }
    const r = ratio(t[fg], t[bg]);
    if (r < min) {
      failures.push(
        `${theme}: ${fg} (${t[fg]}) on ${bg} (${t[bg]}) = ${r.toFixed(2)}:1, needs ${min}:1`,
      );
    }
  }
}

// Known-good anchor: the algorithm itself is wrong if this drifts.
const black = ratio("#000000", "#ffffff");
if (Math.abs(black - 21) > 0.01)
  failures.push(`ratio() broken: black/white = ${black}`);

if (failures.length) {
  console.error(
    "WCAG AA contrast failures:\n" + failures.map((f) => "  " + f).join("\n"),
  );
  process.exit(1);
}
console.log(`contrast OK — ${PAIRS.length} pairs x 2 themes`);
