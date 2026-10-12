"use client";

import { type Icon, Monitor, Moon, Sun1 } from "iconsax-reactjs";
import { useId, useSyncExternalStore } from "react";
import type { Dictionary } from "@/i18n";

type Choice = "system" | "light" | "dark";

const STORAGE_KEY = "theme";

/**
 * Runs before first paint, so an explicit override never flashes.
 * System preference needs no JavaScript at all — globals.css handles it with
 * `color-scheme: light dark`, which is why this script only reads an override.
 * Static string, no interpolation: nothing user-controlled reaches the DOM.
 */
export const themeInitScript = `try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

// localStorage is external state, so it is read through useSyncExternalStore
// rather than mirrored into React state. `storage` only fires in *other* tabs,
// hence the local listener set for this one.
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Choice {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

// The server cannot know the override; it renders "system" and React
// reconciles after hydration. The paint is already correct by then.
const getServerSnapshot = (): Choice => "system";

// Module scope, with the rest of the store: this writes to the DOM and to
// localStorage, which is not something a component body may do.
function applyTheme(next: Choice) {
  if (next === "system") {
    delete document.documentElement.dataset.theme;
    localStorage.removeItem(STORAGE_KEY);
  } else {
    document.documentElement.dataset.theme = next;
    localStorage.setItem(STORAGE_KEY, next);
  }
  listeners.forEach((l) => l());
}

const OPTIONS: [Choice, Icon][] = [
  ["system", Monitor],
  ["light", Sun1],
  ["dark", Moon],
];

export function ThemeSwitcher({ t }: { t: Dictionary["theme"] }) {
  const name = useId();
  const choice = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    // Real radios inside a fieldset: arrow-key navigation, grouping, and the
    // accessible name all come from the platform. A div soup with
    // aria-pressed would be more code and worse.
    // Styled for the government bar, which is deep forest in both themes —
    // hence the fixed gov-bar tokens rather than themed surface colours.
    <fieldset className="flex items-center rounded-full border border-(--gov-bar-foreground)/25 bg-(--gov-bar-foreground)/10 p-0.5">
      <legend className="sr-only">{t.label}</legend>
      {OPTIONS.map(([value, IconComponent]) => (
        <label key={value} className="cursor-pointer" title={t[value]}>
          <input
            type="radio"
            name={name}
            value={value}
            checked={choice === value}
            onChange={() => applyTheme(value)}
            className="peer sr-only"
          />
          <span className="flex size-8 items-center justify-center rounded-full text-(--gov-bar-foreground)/70 transition-colors duration-(--duration-fast) ease-(--ease-standard) peer-checked:bg-accent peer-checked:text-(--gov-bar) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:text-(--gov-bar-foreground)">
            <IconComponent
              variant={choice === value ? "Bold" : "Linear"}
              color="currentColor"
              size={16}
              aria-hidden
            />
            <span className="sr-only">{t[value]}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
