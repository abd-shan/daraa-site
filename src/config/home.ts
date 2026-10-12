import { Bank, type Icon, Location, Tree } from "iconsax-reactjs";
import type { Dictionary } from "@/i18n";

/**
 * Hero slides, in display order. The first one is the LCP image and is the
 * only one preloaded. The key is typed against `hero.slides`, so a slide
 * without its alt text is a compile error rather than an unlabelled image.
 */
export type HeroSlide = {
  key: keyof Dictionary["hero"]["slides"];
  src: string;
};

export const heroSlides: HeroSlide[] = [
  { key: "bosra", src: "/brand/images/bosra-theatre.jpg" },
  { key: "tellShihab", src: "/brand/images/tell-shihab-falls.jpg" },
  { key: "lajat", src: "/brand/images/lajat.jpg" },
];

/** Seconds each slide holds before the crossfade. Mirrored by --hero-slide
 *  in globals.css; the two have to agree or the captions drift out of sync. */
export const HERO_SLIDE_SECONDS = 7;

/** Every tile is a label key plus an icon. Labels never live here. */
type Tile<G extends keyof Dictionary> = {
  key: Exclude<keyof Dictionary[G], "title" | "lead">;
  icon: Icon;
};

export const explore: Tile<"explore">[] = [
  { key: "heritage", icon: Bank },
  { key: "nature", icon: Tree },
  { key: "towns", icon: Location },
];

/**
 * Every figure carries its source and year, because Phase 9 forbids publishing
 * a number without them. A stat with no verifiable source does not get a card.
 *
 * `unverified` renders a visible caveat. Area is marked so on purpose:
 * Arabic sources and Wikipedia give 3,730 km² while some OCHA material gives
 * 2,594 km², and nothing authoritative has settled it. The governorate's own
 * figure replaces this.
 */
export type Stat = {
  key: "area" | "population" | "districts" | "subDistricts";
  value: number;
  sourceKey: keyof Dictionary["stats"]["sources"];
  year: number;
  unitKey?: "km2";
  unverified?: true;
};

export const stats: Stat[] = [
  {
    key: "area",
    value: 3730,
    sourceKey: "general",
    year: 2024,
    unitKey: "km2",
    unverified: true,
  },
  { key: "population", value: 1023833, sourceKey: "ocha", year: 2022 },
  // Five, not the UN dataset's three: the governorate supplied the current
  // structure, and it is the authority on its own administrative divisions.
  // The grouping this figure counts lives in src/components/daraa-map.tsx.
  { key: "districts", value: 5, sourceKey: "governorate", year: 2026 },
  // 17 still matches the sub-districts in src/data/daraa-map.ts exactly,
  // which is a useful cross-check on the map.
  { key: "subDistricts", value: 17, sourceKey: "ocha", year: 2022 },
];
