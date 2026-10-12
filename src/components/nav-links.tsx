"use client";

// usePathname: the header is rendered once per locale, so only the client
// knows which section the reader is actually in.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/config/nav";
import type { Dictionary, Locale } from "@/i18n";

export function NavLinks({
  locale,
  t,
  soon,
}: {
  locale: Locale;
  t: Dictionary["nav"];
  soon: string;
}) {
  const pathname = usePathname();

  /** The home tab must not light up on every page, so it matches exactly;
   *  every other tab also matches its sub-pages, e.g. /news/page/2. */
  const isActive = (path: string) => {
    const full = `/${locale}${path}`;
    return path === "" ? pathname === full : pathname.startsWith(full);
  };

  return (
    <ul className="flex flex-col gap-x-6 gap-y-1 text-sm md:flex-row md:flex-wrap md:items-center">
      {nav.map((item) =>
        item.status === "live" ? (
          <li key={item.key}>
            <Link
              href={`/${locale}${item.path}`}
              aria-current={isActive(item.path) ? "page" : undefined}
              className="nav-link"
            >
              {t[item.key]}
            </Link>
          </li>
        ) : (
          <li key={item.key}>
            <span className="nav-link nav-link-soon">
              {t[item.key]}
              <span className="rounded-full bg-(--gov-bar-foreground)/15 px-1.5 py-px text-[10px]">
                {soon}
              </span>
            </span>
          </li>
        ),
      )}
    </ul>
  );
}
