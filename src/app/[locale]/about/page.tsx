import Image from "next/image";
import { notFound } from "next/navigation";
import { Band } from "@/components/band";
import { StatCounter } from "@/components/stat-counter";
import { stats } from "@/config/home";
import { getDictionary, isLocale } from "@/i18n";

export const dynamicParams = false;

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <main id="main">
      {/* The title sits above the photograph rather than on top of it. A scrim
          heavy enough to carry a headline was washing the mosque out, and on
          this page the photograph is the point — so it gets the frame to
          itself and the heading gets a clean band. */}
      <section className="shell pt-14 pb-8 sm:pt-20">
        <p className="text-sm font-bold tracking-widest text-primary uppercase">
          {t.siteName}
        </p>
        <h1 className="mt-3 text-4xl font-black sm:text-6xl">
          {t.about.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground text-balance">
          {t.about.lead}
        </p>
      </section>

      {/* 3:2 matches the source file, so the whole frame is shown and nothing
          is cropped away. Capped in svh so it cannot outgrow a short screen. */}
      <figure className="shell">
        <div className="relative aspect-3/2 max-h-[80svh] w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src="/brand/images/omari-mosque-1.jpg"
            alt={t.about.mosqueAlt}
            fill
            priority
            sizes="(min-width: 1536px) 1536px, 100vw"
            className="object-cover"
          />
        </div>
        <figcaption className="mt-3 text-sm text-muted-foreground">
          {t.about.mosqueCaption}
        </figcaption>
      </figure>

      <Band title={t.about.introTitle}>
        <div className="max-w-prose space-y-4 text-lg leading-relaxed">
          <p>{t.about.intro1}</p>
          <p>{t.about.intro2}</p>
          <p>{t.about.intro3}</p>
        </div>
      </Band>

      {/* Same figures as the homepage, from the same source of truth, so the
          two pages cannot drift apart. */}
      <Band title={t.about.factsTitle}>
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
              {/* The area figure is disputed between sources. It carries the
                  caveat on the homepage, so it carries it here too. */}
              {s.unverified && (
                <p className="mt-1 text-xs text-warning">
                  {t.stats.unverified}
                </p>
              )}
            </div>
          ))}
        </dl>
      </Band>

      <Band title={t.about.governorTitle}>
        {/* The portrait is the governorate's own official photograph, taken
            from its existing portal and served from here — the same reason
            the news images are not hotlinked from the test host.

            The office is the one block on this page that should read as the
            state speaking, so it gets its own --office pair: deep forest in
            light, identity gold in dark. It cannot use --gov-bar, because in
            dark that is the same colour as the page background and the whole
            card disappears. Everything inside it keys off --office-foreground
            rather than --accent — gold on gold is invisible. */}
        <div className="grid overflow-hidden rounded-lg bg-(--office) text-(--office-foreground) lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
          <div className="relative aspect-4/3 w-full bg-(--office) lg:aspect-auto lg:min-h-80">
            <Image
              src="/brand/images/governor.jpg"
              alt={t.about.governorName}
              fill
              sizes="(min-width: 1024px) 24rem, 100vw"
              className="object-cover object-top"
            />
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10">
            <p className="text-xs font-bold tracking-widest text-(--office-foreground)/75 uppercase">
              {t.about.governorRole}
            </p>
            <p className="mt-3 text-3xl font-black sm:text-4xl">
              {t.about.governorName}
            </p>
            <span
              aria-hidden
              className="mt-5 block h-0.5 w-16 bg-(--office-foreground)/40"
            />
            <p className="mt-5 max-w-prose leading-loose text-(--office-foreground)/80">
              {t.about.governorBio}
            </p>
          </div>
        </div>
      </Band>
    </main>
  );
}
