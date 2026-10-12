import { InfoCircle } from "iconsax-reactjs";
import { notFound } from "next/navigation";
import { Band } from "@/components/band";
import { DaraaMap } from "@/components/daraa-map";
import { DaraaTileMap } from "@/components/daraa-tile-map";
import { getDictionary, isLocale } from "@/i18n";

export const dynamicParams = false;

export default async function MapPage({ params }: PageProps<"/[locale]/map">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <main id="main">
      <Band title={t.mapPage.title} lead={t.mapPage.lead}>
        <DaraaTileMap
          locale={locale}
          labels={{
            zoomIn: t.mapPage.zoomIn,
            zoomOut: t.mapPage.zoomOut,
            reset: t.mapPage.reset,
            region: t.map.label,
          }}
        />

        <p className="mt-4 flex max-w-prose items-start gap-2 text-sm text-muted-foreground">
          <InfoCircle
            variant="Linear"
            color="currentColor"
            size={18}
            aria-hidden
            className="mt-0.5 shrink-0"
          />
          {t.mapPage.usage}
        </p>
      </Band>

      {/* The drawn map stays: it is the one that carries the administrative
          division, works without JavaScript, and is reachable by keyboard
          through the list beside it. The tile map above shows the ground. */}
      <Band title={t.map.title} lead={t.map.lead}>
        <DaraaMap locale={locale} />
      </Band>
    </main>
  );
}
