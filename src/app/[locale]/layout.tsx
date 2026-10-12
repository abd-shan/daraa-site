import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/shell";
import { themeInitScript } from "@/components/theme-switcher";
import { dir, getDictionary, isLocale, locales } from "@/i18n";
import { latoDigits, qomra } from "@/styles/fonts";
import "../globals.css";

// The only layout in the tree, so this is the root layout.
// dynamicParams: false → a locale outside `locales` 404s at the router
// instead of rendering. The isLocale guards below narrow `string` to
// `Locale`; they are types made honest, not belt-and-braces.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return { title: t.siteName, description: t.siteDescription };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${qomra.variable} ${latoDigits.variable} h-full antialiased`}
    >
      <head>
        {/* Applies a stored theme override before first paint. The string is
            a module constant with no interpolation — see theme-switcher.tsx. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        {/* Load screen. aria-hidden and inert: it is a visual flourish, and a
            screen reader or keyboard user must never be held behind it. It
            retires itself with a CSS animation — no JavaScript, so it cannot
            get stuck waiting for a bundle that failed to load. */}
        <div className="site-loader" aria-hidden inert>
          <span className="lockup lockup-vertical h-40 sm:h-56" />
        </div>

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 focus:bg-surface focus:px-4 focus:py-2 focus:text-foreground"
        >
          {t.skipToContent}
        </a>
        <SiteHeader locale={locale} />
        <div className="flex-1">{children}</div>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
