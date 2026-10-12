<p align="center">
  <img
    src="public/brand/logos/momc-horizontal.svg"
    alt="وزارة الإدارة المحلية والبيئة — Ministry of Local Administration and Environment"
    width="480"
  />
</p>

# Daraa Governorate Portal — البوابة الإلكترونية لمحافظة درعا

Official digital portal of the Daraa Governorate, Syrian Arab Republic.
Foundation phase: bilingual (ar/en), themable (light/dark), accessible
(WCAG 2.2 AA), statically rendered.

## Stack

| Layer           | Choice                                      |
| --------------- | ------------------------------------------- |
| Framework       | Next.js 16 (App Router)                     |
| UI              | React 19 Server Components                  |
| Styling         | Tailwind v4 + CSS custom properties         |
| Language        | TypeScript strict                           |
| Package manager | pnpm 10                                     |
| Testing         | Vitest (unit) + Playwright (E2E)            |
| Quality         | ESLint, Prettier, WCAG contrast enforcement |

No UI library. No i18n library. No state library. Zero-dependency philosophy
— native HTML beats a component, CSS beats JavaScript.

## Getting started

```sh
corepack pnpm install
corepack pnpm dev        # http://localhost:3000
corepack pnpm check      # format, lint, types, contrast, unit, build
corepack pnpm check:all  # above + Playwright E2E
```

`corepack enable pnpm` once (admin shell) enables plain `pnpm`.

## Project structure

```
src/
├── app/
│   ├── globals.css              # Design token system (3 layers)
│   └── [locale]/
│       ├── layout.tsx           # Root shell, theme script, fonts
│       ├── page.tsx             # Homepage (7 content bands)
│       └── design-system/       # Internal reference page
├── components/
│   ├── shell.tsx                # SiteHeader + SiteFooter (Server)
│   ├── theme-switcher.tsx       # Client: system/light/dark
│   ├── language-switcher.tsx    # Client: ar/en pill
│   ├── stat-counter.tsx         # Client: count-up animation
│   └── daraa-map.tsx            # Server: interactive SVG map
├── config/
│   ├── nav.ts                   # Navigation tree (10 items)
│   └── home.ts                  # Homepage content configuration
├── data/
│   └── daraa-map.ts             # 17 sub-district SVG paths
├── i18n/
│   ├── ar.ts                    # Arabic dictionary (source of truth)
│   ├── en.ts                    # Full English dictionary (typed)
│   └── index.ts                 # Locale utilities
└── styles/
    ├── fonts.ts                 # Qomra typeface (next/font/local)
    └── fonts/                   # .otf files (3 weights, committed)
```

## Architecture decisions (brief)

- **Server Components by default.** Client boundary only for browser APIs
  (theme persistence, language switching, IntersectionObserver).
- **Design tokens in 3 layers:** Official identity primitives →
  semantic mappings → Tailwind theme. No raw hex in components.
- **Theming via `light-dark()`.** System preference costs zero JS. Explicit
  override via `data-theme` attribute, applied pre-paint by an inline script.
- **i18n without a library.** Typed dictionary objects. Arabic is the source
  of truth; English is a full parallel locale. Missing key = compile error.
- **No invented official content.** Where real data is unavailable, sections
  show clearly labelled development text or are omitted.

## Design tokens

Four official identity colour families:

- **Golden Wheat** (`--wheat-*`) — the gold of the national emblem
- **Forest** (`--forest-*`) — institutional green
- **Charcoal** (`--charcoal-*`) — structural greys
- **Deep Umber** (`--umber-*`) — earth tones

All components reference semantic tokens (`--primary`, `--surface`, etc.)
which map to these primitives. The mapping changes for dark mode via
`light-dark()`.

## Security

Current attack surface: a static bilingual site. No auth, no database, no
API routes, no Server Actions, no middleware, no uploads, no user input
reaching the server. Full audit in `docs/security-review.md`.

## Status

Phase 01 (foundation) — shell complete. Business modules, real content,
and dynamic features have not been started.

---

© Daraa Governorate — Syrian Arab Republic
