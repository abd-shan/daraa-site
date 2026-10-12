"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n";

const DURATION = 1400;

// Arabic locale formatting with Latin digits: correct grouping for the locale,
// but the digit forms government documents actually use.
const format = (value: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "ar" ? "ar-SY-u-nu-latn" : "en-GB").format(
    value,
  );

/**
 * Counts up to `value` when the card first scrolls into view.
 *
 * The final number is rendered on the server, so it is present without
 * JavaScript and in the page source. The count-up only replaces it if the
 * element starts off-screen — animating something already in view would show
 * a visible jump back to zero, which looks broken rather than lively.
 */
export function StatCounter({
  value,
  locale,
}: {
  value: number;
  locale: Locale;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const onScreen = el.getBoundingClientRect().top < window.innerHeight;
    if (reduced || onScreen) return;

    setShown(0);
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / DURATION, 1);
          // easeOutCubic: fast then settling, so the final digits are readable.
          setShown(Math.round(value * (1 - (1 - p) ** 3)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    // tabular-nums stops the card width jittering as digits change.
    <span ref={ref} className="tabular-nums">
      {format(shown, locale)}
    </span>
  );
}
