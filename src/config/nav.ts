import type { Dictionary } from "@/i18n";

/**
 * "planned" renders as plain text with a "soon" badge, never as a link.
 * No dead hrefs, no placeholder pages pretending to be real sections.
 * Flip to "live" on the day the route ships.
 */
export type Status = "live" | "planned";

export type NavItem = {
  /** Key into Dictionary["nav"] — a wrong label is a compile error. */
  key: Exclude<keyof Dictionary["nav"], "label">;
  /** Path after /[locale]. "" is the locale root. */
  path: string;
  status: Status;
};

export const nav: NavItem[] = [
  { key: "home", path: "", status: "live" },
  { key: "about", path: "/about", status: "live" },
  { key: "services", path: "/services", status: "planned" },
  { key: "directorates", path: "/directorates", status: "planned" },
  { key: "news", path: "/news", status: "live" },
  { key: "decisions", path: "/decisions", status: "planned" },
  { key: "investment", path: "/investment", status: "planned" },
  { key: "explore", path: "/explore", status: "planned" },
  { key: "map", path: "/map", status: "live" },
  { key: "contact", path: "/contact", status: "planned" },
];
