"use client";

// Leaflet touches window and measures the container, so it cannot run on the
// server. This is the only reason the component is a client one.

import "leaflet/dist/leaflet.css";
import type * as Leaflet from "leaflet";
import { useEffect, useRef } from "react";
import type { Locale } from "@/i18n";

/**
 * District seats, from published coordinates. These place the label, they do
 * not draw a boundary — the governorate's own boundary data is still the
 * missing piece, and the SVG map on the homepage carries the same caveat.
 */
const seats = [
  { key: "markaz", ar: "درعا", en: "Daraa", lat: 32.6189, lng: 36.1021 },
  {
    key: "sanamayn",
    ar: "الصنمين",
    en: "Al-Sanamayn",
    lat: 33.0722,
    lng: 36.1806,
  },
  { key: "izra", ar: "إزرع", en: "Izra'", lat: 32.8686, lng: 36.2453 },
  { key: "nawa", ar: "نوى", en: "Nawa", lat: 32.8892, lng: 36.0431 },
  {
    key: "bosra",
    ar: "بصرى الشام",
    en: "Bosra al-Sham",
    lat: 32.5175,
    lng: 36.4817,
  },
] as const;

/** Roughly the governorate's extent, so the first view frames all of it. */
const BOUNDS: Leaflet.LatLngBoundsLiteral = [
  [32.31, 35.72],
  [33.16, 36.75],
];

export function DaraaTileMap({
  locale,
  labels,
}: {
  locale: Locale;
  labels: { zoomIn: string; zoomOut: string; reset: string; region: string };
}) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    // Imported here, not at module scope: Leaflet touches window as soon as
    // it is evaluated, and this component is still server-rendered during
    // the static export even though it is a client component.
    let map: Leaflet.Map | undefined;
    let observer: ResizeObserver | undefined;
    let cancelled = false;

    void (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled) return;

      map = L.map(el, {
        center: [32.72, 36.2],
        zoom: 10,
        minZoom: 8,
        maxZoom: 18,
        // Keep the reader inside the governorate rather than adrift in the
        // Mediterranean; they can still zoom out to see it in context.
        maxBounds: L.latLngBounds(BOUNDS).pad(0.6),
        zoomControl: false,
        // Dragging stays on everywhere — panning freely is the point of this
        // page. Only the wheel is held back, so a reader scrolling past the
        // map does not get their page scroll eaten; Ctrl+wheel still zooms.
        scrollWheelZoom: false,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        // Required by the ODbL. This is the map data licence, not decoration.
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      L.control
        .zoom({
          position: "topleft",
          zoomInTitle: labels.zoomIn,
          zoomOutTitle: labels.zoomOut,
        })
        .addTo(map);
      L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

      for (const seat of seats) {
        L.marker([seat.lat, seat.lng], {
          icon: L.divIcon({
            className: "",
            html: `<span class="map-pin"></span>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          }),
          title: locale === "ar" ? seat.ar : seat.en,
          alt: locale === "ar" ? seat.ar : seat.en,
          keyboard: true,
        })
          .addTo(map)
          .bindTooltip(locale === "ar" ? seat.ar : seat.en, {
            permanent: true,
            direction: "top",
            offset: [0, -8],
            className: "map-seat-label",
          });
      }

      map.fitBounds(BOUNDS);

      // Leaflet measures on creation; if the container was still laying out,
      // the tiles come back stretched until something forces a recalculation.
      observer = new ResizeObserver(() => map?.invalidateSize());
      observer.observe(el);
    })();

    return () => {
      cancelled = true;
      observer?.disconnect();
      map?.remove();
    };
  }, [locale, labels]);

  return (
    <div
      ref={container}
      role="application"
      aria-label={labels.region}
      className="h-[70vh] min-h-96 w-full overflow-hidden rounded-lg border border-border"
    />
  );
}
