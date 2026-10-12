import { ArrowLeft } from "iconsax-reactjs";
import Image from "next/image";
import { categories, imageUrl, type NewsItem, sourceUrl } from "@/data/news";
import { type Dictionary, type Locale } from "@/i18n";

/** Arabic locale with Latin digits — the forms government documents use. */
export const formatDate = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "ar" ? "ar-SY-u-nu-latn" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));

export const categoryName = (slug: NewsItem["category"], locale: Locale) => {
  const found = categories.find((c) => c.slug === slug);
  return locale === "ar" ? found?.ar : found?.en;
};

/** A small pill carrying the category. Not a link — the filter lives in the
 *  row of category links above the list, and two ways in is one too many. */
function CategoryTag({ item, locale }: { item: NewsItem; locale: Locale }) {
  return (
    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-primary">
      {categoryName(item.category, locale)}
    </span>
  );
}

/**
 * The article body lives on the governorate's existing portal, so the card
 * links out rather than pretending to a full article route this site does
 * not have yet. External, hence the explicit rel and the new tab.
 */
export function NewsCard({
  item,
  locale,
  t,
}: {
  item: NewsItem;
  locale: Locale;
  t: Dictionary["news"];
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors duration-(--duration-base) ease-(--ease-standard) hover:border-border-strong">
      {/* Fixed 16:9 so a portrait and a landscape photograph give the same
          card height — the grid stays even whatever the source uploaded.
          alt="" because the headline right below already names the story;
          announcing it twice is noise. */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={imageUrl(item)}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-(--duration-base) ease-(--ease-standard) group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryTag item={item} locale={locale} />
          <time dateTime={item.date} className="text-xs text-muted-foreground">
            {formatDate(item.date, locale)}
          </time>
        </div>

        <h3 className="mt-3 leading-snug font-bold text-balance">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {item.excerpt}
        </p>

        <a
          href={sourceUrl(item)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-primary underline-offset-4 hover:underline"
        >
          {t.readMore}
          <ArrowLeft
            variant="Linear"
            color="currentColor"
            size={16}
            aria-hidden
            className="ltr:rotate-180 rtl:rotate-0"
          />
        </a>
      </div>
    </article>
  );
}

/** The pinned item: same information, given the width to be read first. */
export function FeaturedNews({
  item,
  locale,
  t,
}: {
  item: NewsItem;
  locale: Locale;
  t: Dictionary["news"];
}) {
  return (
    <article className="grid overflow-hidden rounded-lg border-s-4 border-accent bg-surface ring-1 ring-border lg:grid-cols-2">
      {/* Photograph first in the DOM but visually second in LTR/RTL terms is
          not worth the complexity — order it first on wide screens with a
          plain grid and let it sit on top on narrow ones. Priority: this is
          the largest image above the fold on both pages that use it. */}
      <div className="relative aspect-video w-full bg-muted lg:aspect-auto lg:min-h-72">
        <Image
          src={imageUrl(item)}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-(--gov-bar)">
            {t.featured}
          </span>
          <CategoryTag item={item} locale={locale} />
          <time dateTime={item.date} className="text-xs text-muted-foreground">
            {formatDate(item.date, locale)}
          </time>
        </div>

        <h3 className="mt-4 text-xl font-black text-balance sm:text-2xl">
          {item.title}
        </h3>
        <p className="mt-3 max-w-prose text-muted-foreground">{item.excerpt}</p>

        <a
          href={sourceUrl(item)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary underline-offset-4 hover:underline"
        >
          {t.readMore}
          <ArrowLeft
            variant="Linear"
            color="currentColor"
            size={16}
            aria-hidden
            className="ltr:rotate-180 rtl:rotate-0"
          />
        </a>
      </div>
    </article>
  );
}
