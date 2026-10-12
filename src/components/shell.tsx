import { HamburgerMenu } from "iconsax-reactjs";
import Link from "next/link";
import { nav } from "@/config/nav";
import { getDictionary, type Locale } from "@/i18n";
import { LanguageSwitcher } from "./language-switcher";
import { NavLinks } from "./nav-links";
import { ThemeSwitcher } from "./theme-switcher";

/**
 * One continuous deep-forest band — no light/dark split across the header.
 * The gold lockup is a single fixed colour, so its ground is fixed too, in
 * both themes. Rules inside the band are translucent gold rather than a
 * second background colour.
 */
export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  const navList = <NavLinks locale={locale} t={t.nav} soon={t.soon} />;

  const controls = (
    <>
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold tracking-widest text-(--gov-bar-foreground)/60 uppercase">
          {t.languageSwitchLabel}
        </span>
        <LanguageSwitcher locale={locale} />
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold tracking-widest text-(--gov-bar-foreground)/60 uppercase">
          {t.theme.label}
        </span>
        <ThemeSwitcher t={t.theme} />
      </div>
    </>
  );

  return (
    // relative: the mobile drawer is positioned against the whole header, so
    // it spans the full width rather than being trapped inside .shell.
    <header className="relative bg-(--gov-bar) text-(--gov-bar-foreground)">
      <div className="shell">
        <div className="flex items-center gap-4 py-4">
          {/* <details> is the whole mobile menu: open state, keyboard, and
              the expanded/collapsed announcement are all native. The summary
              has to live inside it, which is why the button and its panel
              are one element here rather than two. */}
          <details className="md:hidden">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full transition-colors duration-(--duration-fast) ease-(--ease-standard) hover:bg-(--gov-bar-foreground)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
              <HamburgerMenu
                variant="Linear"
                color="currentColor"
                size={24}
                aria-hidden
              />
              {/* Icon-only by request. The label stays for screen readers —
                  an unlabelled control is not an option here. */}
              <span className="sr-only">{t.nav.label}</span>
            </summary>

            <div className="drawer absolute inset-x-0 top-full z-50 border-t border-(--gov-bar-foreground)/15 bg-(--gov-bar) shadow-lg">
              <nav aria-label={t.nav.label} className="shell py-4">
                {navList}
                <div className="mt-4 space-y-3 border-t border-(--gov-bar-foreground)/15 pt-4">
                  {controls}
                </div>
              </nav>
            </div>
          </details>

          {/* Centred on mobile, so the mark is the fixed point of the header
              instead of being crowded next to the menu button. left/translate
              rather than the logical properties on purpose: centring is
              symmetric, and inset-inline-start would flip it off-centre. */}
          <Link
            href={`/${locale}`}
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5 md:static md:left-auto md:translate-x-0 md:gap-4"
          >
            <span
              role="img"
              aria-label={t.govBar.country}
              className="lockup lockup-republic h-8 shrink-0 sm:h-11"
            />
            <span className="border-s border-(--gov-bar-foreground)/25 ps-2.5 text-sm leading-tight font-black sm:ps-4 sm:text-lg">
              {t.siteName}
            </span>
          </Link>

          {/* Desktop only. On a phone these live inside the drawer, where
              there is room to label them. */}
          <div className="ms-auto hidden shrink-0 items-center gap-2 md:flex md:gap-3">
            <LanguageSwitcher locale={locale} />
            <ThemeSwitcher t={t.theme} />
          </div>
        </div>
      </div>

      <div className="hidden border-t border-(--gov-bar-foreground)/15 md:block">
        <nav aria-label={t.nav.label} className="shell md:py-1">
          {navList}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <footer
      aria-label={t.footer.label}
      className="mt-20 bg-(--gov-bar) text-(--gov-bar-foreground)"
    >
      <div className="shell grid gap-8 py-12 sm:grid-cols-2">
        <div>
          <span
            role="img"
            aria-label={t.govBar.ministry}
            className="lockup lockup-vertical h-24"
          />
          <h2 className="mt-6 text-sm font-bold">{t.footer.about}</h2>
          <p className="mt-2 max-w-prose text-sm text-(--gov-bar-foreground)/75">
            {t.footer.notice}
          </p>
          <p className="mt-2 max-w-prose text-sm text-(--gov-bar-foreground)/75">
            {t.footer.identityNotice}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold">{t.footer.sections}</h2>
          <ul className="mt-3 grid grid-cols-2 gap-1.5 text-sm text-(--gov-bar-foreground)/75">
            {nav.map((item) => (
              <li key={item.key}>
                {item.status === "live" ? (
                  <Link
                    href={`/${locale}${item.path}`}
                    className="hover:text-accent"
                  >
                    {t.nav[item.key]}
                  </Link>
                ) : (
                  <span>{t.nav[item.key]}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-(--gov-bar-foreground)/15">
        <div className="shell flex flex-wrap items-center gap-x-6 gap-y-2 py-4 text-xs text-(--gov-bar-foreground)/70">
          <p>{t.footer.rights}</p>
          {/* Internal route: linked in development only, never advertised as a
              public section. The route itself still exists in production. */}
          {process.env.NODE_ENV !== "production" && (
            <Link
              href={`/${locale}/design-system`}
              className="ms-auto text-accent underline underline-offset-4"
            >
              {t.footer.designSystem}
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
