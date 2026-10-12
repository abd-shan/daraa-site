import { InfoCircle } from "iconsax-reactjs";
import { areas, viewBox } from "@/data/daraa-map";
import { getDictionary, type Locale } from "@/i18n";

/**
 * The five districts of the governorate and the nawāhī in each, as supplied
 * by the governorate. Kept here rather than in `@/data/daraa-map`, which is
 * generated: the UN source that file comes from still carries the older
 * three-district field, so regenerating it must not silently drop this.
 * The polygons themselves are the UN's, unmodified — only the grouping is
 * ours, so no boundary is redrawn.
 */
export const districts = {
  markaz: ["dar-a", "kherbet-ghazala", "da-el", "ash-shajara", "mzeireb"],
  sanamayn: ["as-sanamayn", "masmiyyeh", "ghabagheb"],
  izra: ["izra", "hrak", "sheikh-miskine"],
  bosra: ["busra-esh-sham", "jizeh", "mseifra"],
  nawa: ["nawa", "tassil", "jasim"],
} as const;

type DistrictKey = keyof typeof districts;
const districtKeys = Object.keys(districts) as DistrictKey[];

const districtOf = new Map<string, DistrictKey>(
  districtKeys.flatMap((key) => districts[key].map((id) => [id, key] as const)),
);

/**
 * Server Component: no JavaScript ships for this. Hover, focus and the label
 * reveal are all CSS (see .map-area / .map-label in globals.css). The list
 * beside the map is not a fallback — it carries the same information for
 * keyboard and screen-reader users.
 */
export function DaraaMap({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const name = (a: (typeof areas)[number]) => (locale === "ar" ? a.ar : a.en);

  return (
    <div>
      <p className="mb-6 flex max-w-prose items-start gap-2 border-s-2 border-accent ps-3 text-sm text-muted-foreground">
        <InfoCircle
          variant="Linear"
          color="currentColor"
          size={18}
          aria-hidden
          className="mt-0.5 shrink-0"
        />
        {t.map.provisional}
      </p>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <svg
          viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
          role="img"
          aria-label={t.map.label}
          className="mx-auto max-h-[70vh] w-full max-w-sm overflow-visible"
        >
          {areas.map((a) => (
            // ponytail: a hovered label can be overlapped by a later sibling's
            // fill — SVG has paint order, not z-index. The halo keeps it
            // legible; re-order in JS only if it ever reads badly.
            <g key={a.id} className="map-item">
              {/* Not focusable: role="img" above makes every descendant
                  presentational, so a tab stop here would announce nothing.
                  The list beside the map is the keyboard path to the same
                  names. */}
              <path
                d={a.d}
                className="map-area"
                data-district={districtOf.get(a.id)}
              >
                <title>{name(a)}</title>
              </path>
              <text x={a.cx} y={a.cy} className="map-label" aria-hidden>
                {name(a)}
              </text>
            </g>
          ))}
        </svg>

        <div>
          <h3 className="text-sm font-bold">{t.map.areasTitle}</h3>
          <div className="mt-4 space-y-5">
            {districtKeys.map((key) => (
              <div key={key}>
                <h4 className="text-sm font-bold text-primary">
                  {t.map.districts[key]}
                </h4>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {areas
                    .filter((a) => districtOf.get(a.id) === key)
                    .map((a) => (
                      <li
                        key={a.id}
                        className="rounded-full border border-border bg-surface px-3 py-1 text-sm"
                      >
                        {name(a)}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">{t.map.attribution}</p>
    </div>
  );
}
