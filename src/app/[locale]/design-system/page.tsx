import type { Metadata } from "next";
import {
  Buildings2,
  Call,
  DocumentText,
  Gallery,
  Global,
  Hospital,
  Home2,
  type Icon,
  Map,
  Moneys,
  Notification,
  SearchNormal1,
} from "iconsax-reactjs";

// Internal engineering page. Its chrome is English-only on purpose: it is a
// developer tool, not public content, and localising 40 labels would bloat the
// dictionaries for no citizen benefit. It still renders inside /ar with
// dir="rtl", which makes it a useful mixed-direction stress test.
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const PRIMITIVES = [
  ["Golden Wheat", ["wheat-900", "wheat-500", "wheat-100"]],
  ["Forest", ["forest-900", "forest-500", "forest-300"]],
  ["Charcoal", ["charcoal-900", "charcoal-500", "charcoal-100"]],
  ["Deep Umber", ["umber-900", "umber-500", "umber-300"]],
] as const;

const SEMANTIC = [
  "background",
  "surface",
  "foreground",
  "muted",
  "muted-foreground",
  "border",
  "border-strong",
  "primary",
  "primary-hover",
  "primary-foreground",
  "secondary",
  "accent",
  "focus-ring",
  "success",
  "warning",
  "danger",
] as const;

const LONG_AR =
  "قرار إداري صادر عن مجلس محافظة درعا بشأن تنظيم إجراءات الترخيص للمنشآت الصناعية الصغيرة والمتوسطة ضمن النطاق الإداري للمحافظة وتحديد الجهات المختصة بمتابعة التنفيذ";
const LONG_EN =
  "Administrative decision issued by the Daraa Governorate Council regarding the organisation of licensing procedures for small and medium industrial facilities within the administrative scope of the governorate";

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-xl font-bold">{title}</h2>
      {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Swatch({ token }: { token: string }) {
  return (
    <div>
      <div
        className="h-16 rounded border border-border"
        style={{ background: `var(--${token})` }}
      />
      <code className="mt-1 block text-xs text-muted-foreground">{token}</code>
    </div>
  );
}

const btn =
  "rounded px-4 py-2 text-sm transition-colors duration-(--duration-fast) ease-(--ease-standard)";

// House icon set. One family, so nothing looks borrowed from three sites.
// Iconsax ships six variants — we use Linear for UI and Bold for the
// active/selected state. Never mix the other four in.
const ICONS: [string, Icon][] = [
  ["Home2", Home2],
  ["Buildings2", Buildings2],
  ["DocumentText", DocumentText],
  ["Map", Map],
  ["Moneys", Moneys],
  ["Hospital", Hospital],
  ["Gallery", Gallery],
  ["Notification", Notification],
  ["SearchNormal1", SearchNormal1],
  ["Global", Global],
  ["Call", Call],
];

export default function DesignSystemPage() {
  return (
    <main id="main" className="shell space-y-10 py-12">
      <header>
        <h1 className="text-3xl font-bold">Design system</h1>
        <p className="mt-2 text-muted-foreground">
          Internal preview. Switch locale and theme in the header — every
          section below reacts.
        </p>
      </header>

      <Section
        title="Official identity primitives"
        note="From visual-identity.momc.gov.sy. Never referenced directly by components."
      >
        <div className="space-y-6">
          {PRIMITIVES.map(([family, tokens]) => (
            <div key={family}>
              <h3 className="mb-2 text-sm font-bold">{family}</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {tokens.map((tok) => (
                  <Swatch key={tok} token={tok} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Semantic tokens"
        note="Project decisions, not official identity. Contrast is enforced by scripts/check-contrast.mjs."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SEMANTIC.map((tok) => (
            <Swatch key={tok} token={tok} />
          ))}
        </div>
      </Section>

      <Section
        title="Typography"
        note="Qomra, three weights, self-hosted. Licence still unconfirmed — see public/brand/README.md."
      >
        <div className="space-y-4">
          <h3 className="text-3xl font-bold" lang="ar" dir="rtl">
            محافظة درعا — عنوان رئيسي
          </h3>
          <h3 className="text-3xl font-bold" lang="en" dir="ltr">
            Daraa Governorate — main heading
          </h3>
          <p className="max-w-prose" lang="ar" dir="rtl">
            {LONG_AR}
          </p>
          <p className="max-w-prose" lang="en" dir="ltr">
            {LONG_EN}
          </p>
          <p className="max-w-prose" lang="ar" dir="rtl">
            أرقام عربية شرقية ١٢٣٤٥٦٧٨٩٠ وأرقام غربية 1234567890 مع نص إنجليزي
            مضمّن مثل <span lang="en">Daraa Governorate Portal</span> داخل فقرة
            عربية.
          </p>
          <p className="text-sm text-muted-foreground">
            Small / muted text — 14px.
          </p>
        </div>
      </Section>

      <Section
        title="Icons — Iconsax"
        note='color="currentColor" always, so icons inherit the token of their text. Linear for UI, Bold for active state. Decorative icons need aria-hidden.'
      >
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {ICONS.map(([name, IconComponent]) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <span className="flex gap-2 text-primary">
                <IconComponent
                  variant="Linear"
                  color="currentColor"
                  size={24}
                  aria-hidden
                />
                <IconComponent
                  variant="Bold"
                  color="currentColor"
                  size={24}
                  aria-hidden
                />
              </span>
              <code className="text-[10px] text-muted-foreground">{name}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Buttons and links" note="Tab through these to see focus.">
        <div className="flex flex-wrap items-center gap-3">
          <button
            className={`${btn} bg-primary text-primary-foreground hover:bg-primary-hover`}
          >
            Primary
          </button>
          <button
            className={`${btn} border border-border-strong text-foreground hover:bg-muted`}
          >
            Secondary
          </button>
          <button className={`${btn} text-primary hover:bg-muted`}>
            Ghost
          </button>
          <button
            disabled
            className={`${btn} border border-border text-muted-foreground opacity-60`}
          >
            Disabled
          </button>
          <a href="#main" className="text-primary underline underline-offset-4">
            Inline link
          </a>
        </div>
      </Section>

      <Section title="Form controls">
        <div className="grid max-w-xl gap-4">
          <div>
            <label htmlFor="ds-text" className="block text-sm">
              Text input
            </label>
            <input
              id="ds-text"
              className="mt-1 w-full rounded border border-border-strong bg-surface px-3 py-2"
              placeholder="اكتب هنا…"
            />
          </div>
          <div>
            <label htmlFor="ds-select" className="block text-sm">
              Select
            </label>
            <select
              id="ds-select"
              className="mt-1 w-full rounded border border-border-strong bg-surface px-3 py-2"
            >
              <option>درعا المدينة</option>
              <option>إزرع</option>
              <option>الصنمين</option>
            </select>
          </div>
          <div>
            <label htmlFor="ds-area" className="block text-sm">
              Textarea
            </label>
            <textarea
              id="ds-area"
              rows={3}
              className="mt-1 w-full rounded border border-border-strong bg-surface px-3 py-2"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" /> Checkbox
          </label>
        </div>
      </Section>

      <Section
        title="Status messages"
        note="Each carries a text prefix — meaning never depends on colour alone."
      >
        <div className="space-y-2">
          <p
            className="border-s-4 border-success ps-3 text-success"
            role="status"
          >
            <strong>Success:</strong> تم حفظ الطلب.
          </p>
          <p
            className="border-s-4 border-warning ps-3 text-warning"
            role="status"
          >
            <strong>Warning:</strong> بعض الحقول غير مكتملة.
          </p>
          <p className="border-s-4 border-danger ps-3 text-danger" role="alert">
            <strong>Error:</strong> تعذّر إرسال النموذج.
          </p>
        </div>
      </Section>

      <Section title="Surfaces">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-border bg-background p-4 text-sm">
            background
          </div>
          <div className="rounded border border-border bg-surface p-4 text-sm">
            surface
          </div>
          <div className="rounded border border-border bg-muted p-4 text-sm">
            muted
          </div>
        </div>
      </Section>

      <Section
        title="Motion"
        note="120ms / 200ms, one easing curve. prefers-reduced-motion cuts all of it to ~0 without removing anything from the page."
      >
        <button
          className={`${btn} bg-primary text-primary-foreground hover:bg-primary-hover`}
        >
          Hover me
        </button>
      </Section>

      <Section
        title="Long-content stress"
        note="Long government titles must wrap, not truncate. Check at 320px."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-border bg-surface p-4">
            <h3 className="font-bold" lang="ar" dir="rtl">
              {LONG_AR}
            </h3>
          </div>
          <div className="rounded border border-border bg-surface p-4">
            <h3 className="font-bold" lang="en" dir="ltr">
              {LONG_EN}
            </h3>
          </div>
        </div>
      </Section>
    </main>
  );
}
