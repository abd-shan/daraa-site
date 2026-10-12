"use client";

import { usePathname } from "next/navigation";
import {
  getDictionary,
  localePath,
  locales,
  otherLocale,
  type Locale,
} from "@/i18n";

const SHORT: Record<Locale, string> = { ar: "ع", en: "EN" };

/** A two-segment pill matching the theme control: the active locale is a
 *  static segment, the other is the link. Lands on the equivalent page
 *  rather than dumping the user on the home. */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const t = getDictionary(locale);
  const other = otherLocale(locale);

  return (
    // Matches the theme switcher, and like it is styled for the government
    // bar's fixed forest ground rather than the themed page surface.
    <div className="flex items-center rounded-full border border-(--gov-bar-foreground)/25 bg-(--gov-bar-foreground)/10 p-0.5">
      {locales.map((code) =>
        code === locale ? (
          <span
            key={code}
            aria-current="true"
            className="flex h-8 min-w-9 items-center justify-center rounded-full bg-accent px-2 text-xs font-bold text-(--gov-bar)"
          >
            {SHORT[code]}
          </span>
        ) : (
          // Plain <a>, not <Link>: a locale change rewrites <html lang> and
          // <html dir>, so it needs a document load, not a soft navigation.
          // A soft navigation re-renders <html> and drops the data-theme
          // attribute the pre-paint script set, which silently reverted an
          // explicit light/dark choice.
          <a
            key={code}
            href={localePath(pathname, other)}
            lang={other}
            hrefLang={other}
            aria-label={t.languageSwitchLabel}
            className="flex h-8 min-w-9 items-center justify-center rounded-full px-2 text-xs font-bold text-(--gov-bar-foreground)/70 transition-colors duration-(--duration-fast) ease-(--ease-standard) hover:text-(--gov-bar-foreground)"
          >
            {SHORT[code]}
          </a>
        ),
      )}
    </div>
  );
}
