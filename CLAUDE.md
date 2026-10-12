# Daraa Governorate Portal

Official digital portal of Daraa Governorate. Government-grade, Arabic-first,
long-lived. Phase 01 (foundation) is built; business modules are not.

## Stack

Next.js 16 App Router · React 19 Server Components · TypeScript strict ·
Tailwind v4 · pnpm 10 via corepack. No UI library, no i18n library, no state
library — none has earned its place yet.

## Commands

```
corepack pnpm dev          # dev server
corepack pnpm check        # format, lint, types, contrast, unit, build
corepack pnpm check:all    # the above plus Playwright
```

`corepack pnpm` is the prefix because `corepack enable pnpm` needs an admin
shell on this machine. Run it once as admin and plain `pnpm` works.

Never report work as done without running `check`. Report the real result,
including failures.

## Repository behaviour

- Read files before editing. Never assume the repo is empty.
- Do not refactor code the task did not ask about.
- Do not rename or move files without a stated reason.
- Do not run destructive git or shell commands; never push, merge, force-push,
  or tag unless asked.
- Never commit secrets or `.env*`.
- Stop and report unrelated changes you find in the working tree.

## Implementation rules

- Server Components by default. `"use client"` needs a browser API or an event
  handler — say which in a comment if it is not obvious.
- Smallest maintainable implementation. Reuse before adding.
- No new dependency for something the platform or an installed package does.
  Native HTML beats a component; CSS beats JavaScript.
- No abstraction with one caller.
- Explicit types at boundaries. `any` needs a written justification.
- Never disable a lint rule or suppress a type error to make a failure go away.
  The failure is information; fix the cause.

## Design tokens — `src/app/globals.css`

Three layers, and the boundary between them is the whole point:

1. **Official primitives** — four families: Golden Wheat (`--wheat-*`),
   Forest (`--forest-*`), Charcoal (`--charcoal-*`), Deep Umber (`--umber-*`).
   Never edit, never add "missing" shades. `--wheat-500` (`#b9a779`) is the
   exact gold of the official logo lockups.
2. **Semantic tokens** (`--primary`, `--surface` …). Project decisions mapping
   primitives to roles. Every dark-mode value is a project decision too — none
   of them is an official identity colour.
3. **Tailwind mapping** (`@theme inline`) → `bg-surface`, `text-foreground`.

Components use semantic tokens only. **A raw hex in a component is a bug.**

`--border` is decorative. `--border-strong` is for anything where the border is
what tells a user a control exists (WCAG 1.4.11).

`scripts/check-contrast.mjs` enforces AA on every pair in its `PAIRS` list ×
2 themes and runs in `check`. Changing a token without running it will break
the build.

## Theming

`color-scheme: light dark` + `light-dark()`. System preference costs zero
JavaScript. `data-theme` on `<html>` is the explicit override, applied
pre-paint by the inline script in the root layout. Do not add a theme
provider, a context, or a CSS-in-JS runtime.

Light values are declared plainly before the `@supports` block so browsers
without `light-dark()` still get a complete light theme.

## Internationalisation — `src/i18n/`

- `ar.ts` is the source of truth. `en.ts` is typed `Dictionary`, so a missing
  key is a compile error.
- English is a full locale, never a translation patch.
- No user-facing string inside a component.
- Routes are `/[locale]/…`. `dynamicParams = false` makes an unknown locale a
  404 at the router — that is the route-parameter validation.
- `dir` comes from `<html dir>`. Use logical utilities (`ps-*`, `me-*`,
  `border-s-*`, `text-start`). **Never mirror layout with a global transform.**

## Brand assets

Read `public/brand/README.md` before touching anything in `public/brand/` or
`assets/fonts/`.

Never redraw, trace, recolour, filter, crop, or animate the official emblem.
Anything marked `UNVERIFIED` there is blocked from shipping — currently the
emblem (an Inkscape trace, not a ministry file) and the Qomra licence.

Three Qomra weights are committed under `src/styles/fonts/` on the project
owner's instruction, licence still unconfirmed — committing them is
redistribution, so do not add weights, convert, or subset them until the
licence says otherwise. `assets/fonts/` (the original download) stays
gitignored.

## Typography — digits are Lato

Every Latin digit on the site is Lato; everything else is Qomra. This is a
standing rule, not a per-page choice.

It is enforced by one mechanism and no markup: `latoDigits` in
`src/styles/fonts.ts` declares `unicode-range: U+0030-0039`, so the browser
uses that face for digits only. `var(--font-lato-digits)` therefore sits
**first** in the font stack.

- Any rule that restates `font-family` must restate `--font-lato-digits`
  first, or that element's digits silently revert to Qomra. Two rules in
  `globals.css` do; grep before adding a third.
- Do not wrap numbers in a class or a span to style them. That is what the
  `unicode-range` exists to avoid.
- Arabic-Indic digits (U+0660–U+0669) are outside the range and stay Qomra
  on purpose — Lato has no glyphs for them.
- The committed files are Google's `text=0123456789` subsets, ~7 KB each.
  Lato is OFL 1.1, so unlike Qomra, redistributing and subsetting it is
  permitted. Re-subset from Google Fonts rather than shipping full weights.

## Content

Never invent official information — no fake officials, phone numbers,
statistics, decisions, tenders, or emergency notices. Where content is missing,
use clearly labelled development text or leave the section out.

## Accessibility

WCAG 2.2 AA. Semantic HTML first, ARIA only when native semantics fall short.
Visible focus, keyboard-operable everything, no meaning carried by colour
alone, `prefers-reduced-motion` respected without removing content.

## Security

Full audit: `docs/security-review.md`. Re-run it whenever the attack surface
grows — the first API route, form, upload, or auth check changes everything
below.

**Today's attack surface is a static bilingual site.** No auth, no database, no
API routes, no Route Handlers, no Server Actions, no middleware, no uploads, no
user input reaching the server. Most of a Next.js threat model does not apply
_yet_, and that is the only reason this file is short.

Rules that hold now:

- No secrets in the repo. `.env*` stays gitignored; nothing sensitive goes in a
  `NEXT_PUBLIC_*` variable, ever.
- Never pass `process.env` wholesale to a Client Component.
- `dangerouslySetInnerHTML` has exactly one permitted use: the pre-paint theme
  script in the root layout, a module constant with no interpolation. Any
  second use needs a reviewed sanitisation strategy.
- SVGs under `public/brand/` are served same-origin as `image/svg+xml`. They
  are static and were scanned for `<script>`, event handlers and remote refs.
  **Never serve a user-uploaded SVG from this origin** — that is stored XSS.
- `images.dangerouslyAllowSVG` stays off. Logos use `unoptimized` instead.
- Validate every route parameter. `dynamicParams = false` plus `isLocale` is
  what does that today.
- Never log citizen data. Never invent official data.

Before the first dynamic feature ships, these must exist:

1. Security response headers in `next.config.ts` — CSP, HSTS,
   `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
   `frame-ancestors`. A CSP will need a nonce or hash for the theme script.
2. Server-side authorisation inside every mutating action — a middleware
   `matcher` is not authorisation, and hiding a button is not a permission.
3. Schema validation on every untrusted input, server-side.
4. Rate limiting on anything that writes, emails, or costs money.
5. Explicit field allowlists on writes — never spread a request body into a
   create or update.

`poweredByHeader: false` is already set.

Dependency hygiene: `pnpm audit` is broken in pnpm 10 (it mis-parses the gzip
response). Use the advisory query in `docs/security-review.md`. Always confirm
a flagged package is _actually installed and reachable_ before acting — the
first scan of this repo produced a false positive.

## What is deliberately absent

CMS, auth, database, APIs, search, analytics, maps, the real homepage, and
every business module in `docs/information-architecture.md`. Do not add them
opportunistically.

Also absent on purpose: `.claude/rules/` (this file is small enough), an
architecture doc set (the code is the architecture until it isn't), and
`surface-elevated` / `information` tokens (they duplicated others).
