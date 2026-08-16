export type LeakLedgerKpi = {
  id: string;
  month: string;
  closed_deal_value: number;
  dead_pipeline_value: number;
  notes: string | null;
};

function money(n: number) {
  return `£${Math.round(n).toLocaleString("en-GB")}`;
}

function monthLabel(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export function LeakLedger({ kpis }: { kpis: LeakLedgerKpi[] }) {
  if (kpis.length === 0) {
    return (
      <div className="rounded-md border border-rule bg-card p-6 text-sm text-muted-foreground">
        No months logged yet. Once the first month's KPIs are in, the story starts here.
      </div>
    );
  }

  const sorted = [...kpis].sort((a, b) => a.month.localeCompare(b.month));
  const totalClosed = sorted.reduce((s, k) => s + Number(k.closed_deal_value), 0);
  const totalDead = sorted.reduce((s, k) => s + Number(k.dead_pipeline_value), 0);
  const maxValue = Math.max(...sorted.map((k) => Math.max(k.closed_deal_value, k.dead_pipeline_value)), 1);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-highlight/30 bg-highlight/8 p-5">
          <div className="eyebrow">Recovered so far</div>
          <div className="mt-2 font-serif text-3xl text-highlight">{money(totalClosed)}</div>
          <p className="mt-1 text-xs text-muted-foreground">Total closed deal value logged across every month.</p>
        </div>
        <div className="rounded-md border border-rule bg-card p-5">
          <div className="eyebrow">Still sitting dead</div>
          <div className="mt-2 font-serif text-3xl">{money(totalDead)}</div>
          <p className="mt-1 text-xs text-muted-foreground">Pipeline that hasn't converted yet, this is the opportunity still on the table.</p>
        </div>
      </div>

      <ol className="mt-6 space-y-4 border-l border-rule pl-6">
        {sorted.map((k) => {
          const closedPct = Math.max(2, (k.closed_deal_value / maxValue) * 100);
          const deadPct = Math.max(2, (k.dead_pipeline_value / maxValue) * 100);
          return (
            <li key={k.id} className="relative">
              <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-highlight" />
              <div className="font-medium">{monthLabel(k.month)}</div>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-14 shrink-0 text-muted-foreground">Closed</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-highlight" style={{ width: `${closedPct}%` }} />
                  </div>
                  <span className="mono w-24 shrink-0 text-right">{money(k.closed_deal_value)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-14 shrink-0 text-muted-foreground">Dead</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-muted-foreground/40" style={{ width: `${deadPct}%` }} />
                  </div>
                  <span className="mono w-24 shrink-0 text-right">{money(k.dead_pipeline_value)}</span>
                </div>
              </div>
              {k.notes && <p className="mt-2 text-sm text-muted-foreground">{k.notes}</p>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
