/**
 * Section heading + lead, used by every band on every page so the vertical
 * rhythm is set in one place rather than re-tuned per section. Lifted out of
 * the homepage when the news page needed the same shape.
 */
export function Band({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="shell py-14">
      <h2 className="text-2xl font-black sm:text-3xl">{title}</h2>
      {lead && <p className="mt-2 max-w-prose text-muted-foreground">{lead}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}
