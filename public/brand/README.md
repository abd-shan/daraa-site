# Brand assets

Provenance and usage terms for every identity asset in this repository.
**Nothing here may be redrawn, recoloured, filtered, or animated.**

Anything marked `UNVERIFIED` is a blocker, not a warning: do not ship it,
convert it, or commit it until the row says otherwise.

## Fonts — `assets/fonts/` (NOT committed)

| File                         | Family                 | Weight |
| ---------------------------- | ---------------------- | ------ |
| `itfQomraArabic-Light.otf`   | itf Qomra Arabic Light | 300    |
| `itfQomraArabic-Regular.otf` | itf Qomra Arabic       | 400    |
| `itfQomraArabic-Bold.otf`    | itf Qomra Arabic       | 700    |
| `itfQomraArabic-Black.otf`   | itf Qomra Arabic Black | 900    |

- Foundry: `iwantype`. Version 1.001.
- The files carry **no embedded licence** (OpenType name IDs 13/14 are absent).
- Source: supplied by the project team. Believed to originate from
  <https://visual-identity.momc.gov.sy/>, **not confirmed**.
- Licence status: **UNVERIFIED**.

**Status: in use, licence still unconfirmed.** On the project owner's
instruction the fonts are wired up and three weights (Regular, Bold, Black)
are committed under `src/styles/fonts/` and self-hosted through
`next/font/local`. `assets/fonts/` keeps the untouched original download and
stays gitignored.

Still not done, and still requiring the licence first:

1. Converting OTF → WOFF2 (that is modification, and would roughly halve the
   bytes served).
2. Any subsetting or renaming of the files.

Committing the files is redistribution. If the licence turns out to forbid
web embedding, the fix is to swap in an OFL Arabic face — the font is
referenced from exactly one file, `src/styles/fonts.ts`, so that is a
one-file change.

Questions the licence must answer: web-embedding permitted? format
conversion permitted? self-hosting permitted? pageview or domain limits?
attribution required?

`itfQomraArabic-Light.TRUNCATED-DOWNLOAD.otf.bak` is an aborted browser
download (38 KB vs 55 KB) of the Light weight. It is a duplicate of a file we
already have complete — safe to delete.

### Lato — digits only, `src/styles/fonts/`

| File                      | What it is                 | Weight |
| ------------------------- | -------------------------- | ------ |
| `Lato-Digits-Regular.ttf` | Lato, subset to `0-9` only | 400    |
| `Lato-Digits-Bold.ttf`    | Lato, subset to `0-9` only | 700    |

**Status: in use, licence settled.** Lato is **SIL Open Font License 1.1**,
which expressly permits redistribution, subsetting, and web embedding — so
unlike Qomra, committing and subsetting these is not an open question.

Both are Google Fonts' own `text=0123456789` subsets, ~7 KB each rather than
~50 KB for a full weight. Re-subset from Google Fonts if a weight is ever
needed; do not commit full Lato weights.

They render every Latin digit on the site via `unicode-range: U+0030-0039`.
See the typography section of `CLAUDE.md` — the mechanism is load-bearing and
easy to break from an unrelated CSS rule.

### Al-Omari Mosque — `images/omari-mosque-1.jpg`

**Provenance UNVERIFIED.** Supplied by the project team as a URL on
`alhurriyah.sy`, a news site. No licence statement accompanies it and no
photographer is named. It ships on the project owner's instruction, the same
basis as the Qomra weights.

Unlike the hero photographs, this one has **no licence anyone can point to**.
If the governorate has its own photograph of the mosque, replace this with it.

A second URL was supplied (`i.pinimg.com`) and was **not** used: Pinterest
re-hosts other people's images and is not a provenance source, the file was a
low-resolution phone photograph, and it showed a large street gathering, which
carries exactly the political reading the page was asked to avoid.

## Vector assets — `public/brand/`

| File                               | What it is                                                          | Provenance                                                                                                                      | Status                                                                |
| ---------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `logos/syrian-gov-text.svg`        | Arabic wordmark "الجمهورية العربية السورية"                         | Supplied by project team. Clean vector export, single official gold `#B9A77A`, no tracing metadata.                             | Available, unused                                                     |
| `logos/syrian-horizontal-gold.svg` | Horizontal lockup, emblem + wordmark                                | As above.                                                                                                                       | Available — was the header lockup until the ministry mark replaced it |
| `logos/syrian-vertical-gold.svg`   | Vertical lockup                                                     | As above.                                                                                                                       | Available — was the footer lockup                                     |
| `logos/momc-horizontal.svg`        | Ministry of Local Administration and Environment lockup, horizontal | Supplied by the project team (via `temp-images/`). 782×158. Two-tone: `#0F473D` wordmark, `#B9A779` eagle. No tracing metadata. | **In use** — header                                                   |
| `logos/momc-vertical.svg`          | The same lockup, vertical                                           | As above. 627×527.                                                                                                              | **In use** — footer, load screen, `src/app/icon.svg`                  |
| `logos/syria-emblem.svg`           | Emblem                                                              | Earlier file, **authored in Inkscape** — a redraw or trace.                                                                     | **Superseded — do not use**                                           |
| `flags/syria-flag.svg`             | Syrian flag, 3:2                                                    | Supplied by project team. Plain geometry, correct proportions.                                                                  | OK for development                                                    |
| `patterns/texture1.svg`            | Decorative pattern                                                  | Supplied by project team. Used as a CSS mask, never recoloured in place.                                                        | In use                                                                |

The gold in the lockups is `#B9A77A` — `--wheat-500` in the token layer. That
is why the government bar is a fixed deep forest in both themes: a
single-colour lockup needs a fixed ground, not a themed one.

**The ministry lockup is rendered through a CSS mask, never as an `<img>`.**
Its two-tone artwork cannot go on the government bar as supplied: the
`#0F473D` wordmark is 1.53:1 against `--gov-bar`, which is invisible. Masking
paints the shape in `--accent` — 6.8:1 — and, exactly as with
`patterns/texture1.svg`, the file on disk is never recoloured, filtered, or
edited. See the `.lockup` rules in `src/app/globals.css`.

If the ministry supplies an approved single-colour gold variant, that file
replaces the mask and the `.lockup` rules go away.

**Open question:** these two files are a _ministry_ lockup, not a Daraa
Governorate mark. Whether the governorate portal should lead with the parent
ministry's identity is a decision for the project owner, not a technical one.
Provenance beyond "supplied by the project team" is unrecorded, and no written
usage terms accompany them — treat that the same way as the font licence.

`syria-emblem.svg` is kept only so nobody re-adds it by mistake. Phase 01
forbids traced or redrawn official marks, and an Inkscape-authored file is
exactly that.

Every SVG here was scanned: no `<script>`, no event handlers, no remote
`href`, no embedded rasters.

## Photographs — `public/brand/images/`

| File                    | Subject                                          | Source                                                                                                                                                                | Licence          |
| ----------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `bosra-theatre.jpg`     | Roman theatre, Bosra al-Sham (Daraa Governorate) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Bosra,_theatre.jpg), photo by Arian Zwegers, originally Flickr                                            | **CC BY 2.0**    |
| `tell-shihab-falls.jpg` | Tell Shihab falls, western rural Daraa           | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%D8%B4%D9%84%D8%A7%D9%84%D8%A7%D8%AA_%D8%AA%D9%84_%D8%B4%D9%87%D8%A7%D8%A8.jpg), photo by Abdullah hreden | **CC BY-SA 4.0** |
| `lajat.jpg`             | Lajat biosphere reserve, volcanic plates         | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Lajat,_Syria1.jpg), photo by Anas Qtiesh                                                                  | **CC BY 2.0**    |

All three are 1920px wide, downloaded at reduced size rather than at the
originals. No restrictions recorded on the source pages.

**Every one of these licences requires visible attribution.** The three
credits are hero captions that fade in step with their own photograph — a
licence condition, not styling. Removing one makes that use non-compliant.
The strings live in `src/i18n/ar.ts` and `en.ts` under
`hero.slides.<key>.credit`.

`tell-shihab-falls.jpg` is **CC BY-SA 4.0** — the share-alike licence this
file otherwise says to avoid. It was taken anyway because it is the only
freely licensed photograph of the subject on Commons, and it is used
unmodified: share-alike binds adaptations, and embedding an unaltered
photograph in a page does not make the page a derivative work. If that
reading is ever contested, the fix is to drop the slide — `heroSlides` in
`src/config/home.ts` is a plain array. For everything else, prefer
attribution-only; it is the cleaner obligation on a government portal.

**Still wanted:** a freely licensed photograph of the Al-Omari Mosque **in
Daraa**. Commons has none — every "Al-Omari" result is Beirut, Gaza, Lod, or
Jerusalem. Do not substitute another city's mosque.

`sharp` is a devDependency purely so Next can optimise this file — it is the
largest asset on the site, and the audience includes slow mobile connections.

## Map data

`src/data/daraa-map.ts` is generated, not hand-written. Source: geoBoundaries
gbOpen SYR ADM3 (2017), from the UN Cartographic Section and UN OCHA, under
**CC BY 3.0 IGO** — the attribution line under the map is a licence
condition, not decoration. The boundaries are provisional and the page says so
on screen; when the governorate GIS team supplies official geometry, only that
one file changes.

## Still missing

- Official geographic data from the governorate GIS team.
- Official emblem master file, with its approved variants (light background,
  dark background, monochrome).
- Written font licence.
- Official clear-space and minimum-size rules.
- Confirmed provenance for `texture1.svg`.
