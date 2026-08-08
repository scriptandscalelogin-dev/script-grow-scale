import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";
import { TIERS } from "@/lib/tiers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Script & Scale · Sales enablement for UK small businesses" },
      { name: "description", content: "Weekly sales workshops, scripts, objection drills and follow-up SOPs for MSPs, ITSM providers and consultancies. Fee-recovery guarantee on the first three months." },
      { property: "og:title", content: "Script & Scale · Revenue enablement, UK, subscription" },
      { property: "og:description", content: "Founder-led sales without a process? Weekly reps, not a course. Three tiers from £500/month." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PageShell>
      {/* HERO */}
      <section className="rule-b">
        <div className="container-tight grid gap-14 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-8">
            <div className="eyebrow">Revenue enablement · UK · Subscription</div>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-7xl">
              You built the business.<br />
              It still can’t close without you.
            </h1>
            <p className="mt-7 max-w-2xl text-lg text-muted-foreground">
              MSPs, ITSM providers, consultancies. Same pattern every time: founder-led sales, no
              real process, deals dying in follow-up, quotes sent into silence. Script &amp; Scale
              fixes that with weekly reps, not a course.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/contact" className="btn-primary">Book a discovery call</Link>
              <Link to="/how-it-works" className="btn-outline">See how it works</Link>
            </div>
          </div>
          <aside className="md:col-span-4 md:border-l md:border-rule md:pl-8">
            <div className="eyebrow">Every week, you leave with</div>
            <ul className="mt-4 space-y-3 text-sm">
              <li>A script that fits how you actually talk</li>
              <li>Objection responses drilled until they’re automatic</li>
              <li>Follow-up SOPs so nothing sits in your inbox</li>
              <li>Live call review at the top tier</li>
            </ul>
          </aside>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="rule-b bg-secondary/40">
        <div className="container-tight py-20">
          <div className="eyebrow">What breaks first</div>
          <div className="mt-8 grid gap-10 md:grid-cols-3">
            {[
              { t: "No process.", b: "Every deal handled from memory. What worked last month doesn’t repeat, because nothing was written down." },
              { t: "Follow-up is where deals die.", b: "You send the proposal, they go quiet, you don’t know when or how to push. So you don’t. So it closes lost." },
              { t: "You can’t hand it off.", b: "No script, no playbook, no SOP. A hire would take a year to be useful. You keep doing it yourself." },
            ].map((c) => (
              <div key={c.t}>
                <div className="font-serif text-2xl">{c.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RISK LINE */}
      <section className="rule-b">
        <div className="container-tight py-10 text-center">
          <p className="font-serif text-2xl md:text-3xl">
            First three months don’t pay for themselves, next month is free. That’s the whole risk
            you’re taking.
          </p>
        </div>
      </section>

      {/* TIERS */}
      <section className="rule-b">
        <div className="container-tight py-20">
          <div className="flex items-end justify-between gap-8">
            <div>
              <div className="eyebrow">Three tiers</div>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl">Pick the cadence you can actually keep.</h2>
            </div>
            <Link to="/pricing" className="hidden text-sm underline-offset-4 hover:underline md:inline">
              Full pricing →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TIERS.map((t) => (
              <div
                key={t.id}
                className={`flex flex-col rounded-md border p-6 ${
                  t.highlight ? "border-ink bg-card" : "border-rule bg-card/60"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <div className="font-serif text-2xl">{t.name}</div>
                  {t.highlight && <div className="eyebrow text-highlight">Most pick this</div>}
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="mono text-3xl">£{t.price.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">/ month</span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{t.cadence}</div>
                <p className="mt-4 text-sm">{t.tagline}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {t.includes.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-[0.3rem] block h-1 w-3 shrink-0 bg-highlight" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            £250 onboarding fee. 3-month minimum. Monthly rolling after that.
          </p>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="rule-b">
        <div className="container-tight grid gap-10 py-20 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="eyebrow">The guarantee</div>
            <h2 className="mt-3 font-serif text-4xl">Your first three months pay for themselves.</h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-base">
              If closed deal value across your first three months doesn’t cover the fees you paid, and
              you attended the workshops and ran the program, month four is free. Every month after that too, until we’re square.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              No cash refund. Attendance is required. It’s a real guarantee, not a marketing one. It works because both sides show up.
            </p>
            <Link to="/guarantee" className="mt-6 inline-block text-sm underline-offset-4 hover:underline">
              Read the full mechanic →
            </Link>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="rule-b">
        <div className="container-tight py-20">
          <div className="eyebrow">What founders usually try first</div>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            Typical UK market rates by category, not quotes from any named competitor.
          </p>
          <div className="mt-8 divide-y divide-rule border-y border-rule">
            {[
              {
                name: "Business coach",
                price: "£150 to £3,500 a month",
                shape: "Ongoing 1:1 sessions",
                note: "Advice and accountability. No scripts, no SOPs. Coaching is unregulated in the UK, so quality varies a lot at every price point.",
              },
              {
                name: "Fractional head of sales",
                price: "£1,500 to £5,000 a month",
                shape: "One to two days a week",
                note: "Senior strategic oversight. Not hands-on scripting, roleplay, or workshop cadence.",
              },
              {
                name: "Sales training firm",
                price: "£5,000 to £20,000",
                shape: "One-off program, not a subscription",
                note: "Structured content delivered once. No ongoing pipeline work after the program ends.",
              },
              {
                name: "Outbound or lead-gen agency",
                price: "£1,500 to £8,000 a month",
                shape: "Retainer",
                note: "Fixes how many leads arrive. Doesn’t touch what happens once a lead becomes a live deal, which is where deals actually die.",
              },
              {
                name: "Script & Scale",
                price: "£500 to £2,000 a month",
                shape: "Weekly to monthly workshops",
                note: "Scripts, SOPs, live roleplay, and a guarantee tied to fees recovered.",
              },
            ].map((row) => (
              <div key={row.name} className="grid gap-3 py-6 md:grid-cols-12">
                <div className="md:col-span-3 font-serif text-xl">{row.name}</div>
                <div className="mono md:col-span-3 text-sm text-muted-foreground">{row.price}</div>
                <div className="md:col-span-2 text-sm text-muted-foreground">{row.shape}</div>
                <p className="md:col-span-4 text-sm">{row.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Most of these solve a different problem than the one that’s actually costing you deals.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="container-tight py-20 text-center">
          <h2 className="font-serif text-4xl md:text-5xl">30-minute call. No pitch deck.</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell me what your last five deals looked like. If it isn’t a fit, I’ll say so.
          </p>
          <div className="mt-8">
            <Link to="/contact" className="btn-primary">Book a discovery call</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
