import { InfoCircle } from "iconsax-reactjs";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Band } from "@/components/band";
import { FeaturedNews, NewsCard } from "@/components/news-card";
import { DaraaMap } from "@/components/daraa-map";
import { StatCounter } from "@/components/stat-counter";
import { explore, HERO_SLIDE_SECONDS, heroSlides, stats } from "@/config/home";
import { byDate, featured } from "@/data/news";
import { getDictionary, isLocale } from "@/i18n";

/** A tile that is not a link yet. It says so instead of pretending. */
function Tile({
  icon: Icon,
  label,
  soon,
}: {
  icon: typeof InfoCircle;
  label: string;
  soon: string;
}) {
  return (
    <div className="group flex h-full flex-col gap-3 rounded-lg border border-border bg-surface p-5 transition-colors duration-(--duration-base) ease-(--ease-standard) hover:border-border-strong">
      <Icon variant="Linear" color="currentColor" size={28} aria-hidden />
      <span className="font-bold">{label}</span>
      <span className="mt-auto text-xs text-muted-foreground">{soon}</span>
    </div>
  );
}

export default async function Page({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <main id="main">
      {/* Full-bleed hero: photograph behind the text, edge to edge. The scrim
          and its foreground are themed together (--hero-*) so the hero melts
          into the page below — wheat in light, forest in dark. Flipping one
          without the other makes the headline unreadable.

          svh, not vh: on mobile browsers vh includes retracting chrome, which
          would make the hero taller than the screen and push the first band
          out of reach. */}
      <section className="relative isolate flex min-h-svh items-end">
        {/* Crossfading slides. Pure CSS: each layer runs the same keyframes
            offset by one slot, so no JavaScript ships and there is nothing to
            hydrate. prefers-reduced-motion stops on the first slide. */}
        {heroSlides.map((slide, i) => (
          <div
            key={slide.key}
            className="hero-slide -z-20"
            style={{ animationDelay: `${-i * HERO_SLIDE_SECONDS}s` }}
          >
            <Image
              src={slide.src}
              alt={t.hero.slides[slide.key].alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
        {/* Scrim. Heavy at the bottom where the text sits, so contrast does
            not depend on how bright that part of the photograph happens to
            be. Without this the headline is unreadable over the stone. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-(--hero-scrim) via-(--hero-scrim)/85 to-(--hero-scrim)/40"
        />

        <div className="shell pt-28 pb-16 text-(--hero-foreground) sm:pt-36 sm:pb-20">
          <p className="text-sm font-bold tracking-widest text-(--hero-accent) uppercase">
            {t.hero.eyebrow}
          </p>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl lg:text-8xl">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-(--hero-foreground)/85 text-balance sm:text-xl">
            {t.hero.lead}
          </p>
          <p className="mt-8 inline-flex max-w-xl items-start gap-2 border-s-2 border-(--hero-accent) ps-3 text-sm text-(--hero-foreground)/75">
            <InfoCircle
              variant="Linear"
              color="currentColor"
              size={18}
              aria-hidden
              className="mt-0.5 shrink-0"
            />
            {t.hero.note}
          </p>
        </div>
      </section>

      {/* Map — the visual anchor of the whole portal. */}
      <Band title={t.map.title} lead={t.map.lead}>
        <DaraaMap locale={locale} />
      </Band>

      {/* Every figure carries its source and year. The area figure is flagged
          because sources genuinely disagree — see src/config/home.ts. */}
      <Band title={t.stats.title} lead={t.stats.lead}>
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.key}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <dt className="text-sm text-muted-foreground">
                {t.stats[s.key]}
              </dt>
              <dd className="mt-2 text-3xl font-black text-primary">
                <StatCounter value={s.value} locale={locale} />
                {s.unitKey && (
                  <span className="ms-1 text-base font-bold text-muted-foreground">
                    {t.stats[s.unitKey]}
                  </span>
                )}
              </dd>
              <p className="mt-3 text-xs text-muted-foreground">
                {t.stats.sourceLabel}: {t.stats.sources[s.sourceKey]} · {s.year}
              </p>
              {s.unverified && (
                <p className="mt-1 text-xs text-warning">
                  {t.stats.unverified}
                </p>
              )}
            </div>
          ))}
        </dl>
      </Band>

      <Band title={t.explore.title} lead={t.explore.lead}>
        {/* auto-rows-fr sizes every row to the tallest tile, so a label that
            wraps to two lines cannot make its own tile taller than the rest.
            No fixed height: the grid still adapts if the wording grows. */}
        <ul className="grid auto-rows-fr grid-cols-2 gap-4 lg:grid-cols-4">
          {explore.map(({ key, icon }) => (
            <li key={key}>
              <Tile icon={icon} label={t.explore[key]} soon={t.soon} />
            </li>
          ))}
        </ul>
      </Band>

      {/* The homepage carries the featured item and the nine most recent
          after it. Every item, every category and the pagination live at
          /news — this band is a window, not a second implementation. */}
      <Band title={t.news.title} lead={t.news.lead}>
        <FeaturedNews item={featured} locale={locale} t={t.news} />

        <ul className="mt-6 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {byDate
            .filter((item) => item.id !== featured.id)
            .slice(0, 9)
            .map((item) => (
              <li key={item.id}>
                <NewsCard item={item} locale={locale} t={t.news} />
              </li>
            ))}
        </ul>

        <Link
          href={`/${locale}/news`}
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors duration-(--duration-fast) ease-(--ease-standard) hover:bg-primary-hover"
        >
          {t.news.viewAll}
        </Link>
      </Band>
    </main>
  );
}
