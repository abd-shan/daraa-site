import Link from "next/link";
import { notFound } from "next/navigation";
import { Band } from "@/components/band";
import { FeaturedNews, NewsCard } from "@/components/news-card";
import { byDate, categories, featured, type CategorySlug } from "@/data/news";
import { getDictionary, isLocale } from "@/i18n";

/** Unknown category or page number is a 404 at the router, not a blank list. */
export const dynamicParams = false;

const PAGE_SIZE = 9;

const pageCount = (total: number) => Math.max(1, Math.ceil(total / PAGE_SIZE));

/**
 * The unfiltered list leaves out the featured item, which is pinned above it
 * — otherwise it appears twice on the first screen. Inside a category it is
 * an ordinary item, because the pinned copy is not shown there.
 */
const itemsIn = (category?: CategorySlug) =>
  category
    ? byDate.filter((n) => n.category === category)
    : byDate.filter((n) => n.id !== featured.id);

/**
 * The URL carries the filter and the page as path segments rather than a
 * query string, so every combination prerenders. A `?page=` would make this
 * route render per request for no gain — the list only changes at build.
 *
 *   /news                        all, page 1
 *   /news/page/2                 all, page 2
 *   /news/category/health        one category, page 1
 *   /news/category/health/page/2 one category, page 2
 */
function parse(slug?: string[]) {
  const parts = slug ?? [];
  let category: CategorySlug | undefined;
  let rest = parts;

  if (parts[0] === "category") {
    const found = categories.find((c) => c.slug === parts[1]);
    if (!found) return null;
    category = found.slug;
    rest = parts.slice(2);
  }

  if (rest.length === 0) return { category, page: 1 };
  if (rest.length !== 2 || rest[0] !== "page") return null;

  // Reject "01", "1.0" and " 1" as well as non-numbers: one URL per page.
  const page = Number(rest[1]);
  if (!Number.isInteger(page) || String(page) !== rest[1] || page < 2) {
    return null;
  }
  if (page > pageCount(itemsIn(category).length)) return null;

  return { category, page };
}

export function generateStaticParams() {
  const params: { slug: string[] }[] = [{ slug: [] }];

  for (let p = 2; p <= pageCount(byDate.length); p++) {
    params.push({ slug: ["page", String(p)] });
  }

  for (const c of categories) {
    params.push({ slug: ["category", c.slug] });
    for (let p = 2; p <= pageCount(itemsIn(c.slug).length); p++) {
      params.push({ slug: ["category", c.slug, "page", String(p)] });
    }
  }

  return params;
}

export default async function NewsPage({
  params,
}: PageProps<"/[locale]/news/[[...slug]]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const parsed = parse(slug);
  if (!parsed) notFound();
  const { category, page } = parsed;

  const t = getDictionary(locale);
  const all = itemsIn(category);
  const total = pageCount(all.length);
  const items = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const base = `/${locale}/news`;
  const href = (c: CategorySlug | undefined, p: number) => {
    const segments = [base];
    if (c) segments.push("category", c);
    if (p > 1) segments.push("page", String(p));
    return segments.join("/");
  };

  return (
    <main id="main">
      <Band title={t.news.title} lead={t.news.lead}>
        {/* The featured item is pinned, so it shows on page 1 of the
            unfiltered list only — repeating it under every filter would
            push three real items off the first screen. */}
        {!category && page === 1 && (
          <div className="mb-10">
            <FeaturedNews item={featured} locale={locale} t={t.news} />
          </div>
        )}

        <nav aria-label={t.news.filterLabel} className="mb-8">
          <ul className="flex flex-wrap gap-2">
            {[undefined, ...categories.map((c) => c.slug)].map((slugOrAll) => {
              const active = category === slugOrAll;
              const label = slugOrAll
                ? locale === "ar"
                  ? categories.find((c) => c.slug === slugOrAll)!.ar
                  : categories.find((c) => c.slug === slugOrAll)!.en
                : t.news.all;
              return (
                <li key={slugOrAll ?? "all"}>
                  {/* aria-current="true", not "page": the pagination below
                      owns aria-current="page", and two of them on one screen
                      makes neither meaningful. */}
                  <Link
                    href={href(slugOrAll, 1)}
                    aria-current={active ? "true" : undefined}
                    className={
                      active
                        ? "inline-block rounded-full bg-primary px-3.5 py-1.5 text-sm font-bold text-primary-foreground"
                        : "inline-block rounded-full border border-border-strong px-3.5 py-1.5 text-sm transition-colors duration-(--duration-fast) ease-(--ease-standard) hover:border-primary hover:text-primary"
                    }
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border-strong p-10 text-center">
            <p className="font-bold">{t.news.empty}</p>
          </div>
        ) : (
          <ul className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.id}>
                <NewsCard item={item} locale={locale} t={t.news} />
              </li>
            ))}
          </ul>
        )}

        {total > 1 && (
          <nav
            aria-label={t.news.pagination}
            className="mt-10 flex items-center justify-center gap-2"
          >
            {page > 1 && (
              <Link
                href={href(category, page - 1)}
                rel="prev"
                className="rounded-md border border-border-strong px-4 py-2 text-sm font-bold hover:border-primary hover:text-primary"
              >
                {t.news.previous}
              </Link>
            )}

            <ul className="flex gap-1">
              {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
                <li key={p}>
                  <Link
                    href={href(category, p)}
                    aria-current={p === page ? "page" : undefined}
                    className={
                      p === page
                        ? "inline-block min-w-10 rounded-md bg-primary px-3 py-2 text-center text-sm font-bold text-primary-foreground"
                        : "inline-block min-w-10 rounded-md border border-border px-3 py-2 text-center text-sm hover:border-primary hover:text-primary"
                    }
                  >
                    {new Intl.NumberFormat(
                      locale === "ar" ? "ar-SY-u-nu-latn" : "en-GB",
                    ).format(p)}
                  </Link>
                </li>
              ))}
            </ul>

            {page < total && (
              <Link
                href={href(category, page + 1)}
                rel="next"
                className="rounded-md border border-border-strong px-4 py-2 text-sm font-bold hover:border-primary hover:text-primary"
              >
                {t.news.next}
              </Link>
            )}
          </nav>
        )}
      </Band>
    </main>
  );
}
