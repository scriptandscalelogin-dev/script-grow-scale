function monthsSince(dateStr: string) {
  const start = new Date(dateStr);
  const now = new Date();
  return (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
}

export function AlumniPanel({
  startDate,
  monthlyFee,
  closedDealValue,
}: {
  startDate: string | null;
  monthlyFee: number | null;
  closedDealValue: number;
}) {
  if (!startDate || !monthlyFee) return null;

  const tenureMonths = monthsSince(startDate);
  const feesEstimate = monthlyFee * Math.max(1, tenureMonths) + 250;
  const eligible = tenureMonths >= 3 && closedDealValue >= feesEstimate;

  if (!eligible) {
    const remaining = Math.max(0, 3 - tenureMonths);
    return (
      <section className="rule-t">
        <div className="container-tight py-10">
          <div className="eyebrow">Alumni status</div>
          <div className="mt-3 rounded-md border border-rule bg-card p-6 text-sm text-muted-foreground">
            Locked for now. Alumni status opens once you're three months in and your closed deal
            value covers what you've paid, the same line the guarantee is measured against.
            {remaining > 0 && ` Roughly ${remaining} month${remaining === 1 ? "" : "s"} of tenure to go.`}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rule-t border-y border-highlight/25 bg-highlight/8">
      <div className="container-tight py-10">
        <div className="eyebrow">Alumni status</div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-highlight/50 bg-highlight/15 px-3 py-1 text-xs font-medium uppercase tracking-wide">
            Earned
          </span>
          <p className="text-sm">Three months in, and your closed deal value has already covered what you've paid.</p>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          This is early, the alumni layer is still being built out, but you're first in line for
          whatever lands here: earlier access to new frameworks before other tiers see them,
          priority on workshop scheduling, and first invite if a peer group ever opens up.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Know another founder who'd get real value from this? Send them my way, I'd rather work with people you vouch for.
        </p>
      </div>
    </section>
  );
}
