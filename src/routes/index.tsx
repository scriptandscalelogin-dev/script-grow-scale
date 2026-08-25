import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";
import { TIERS } from "@/lib/tiers";
import { Reveal, Magnetic, CountUp, ShineOnce } from "@/components/motion";
import { MiniDiagnostic } from "@/components/mini-diagnostic";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Script & Scale · Sales enablement for UK small businesses" },
      { name: "description", content: "Weekly sales workshops, scripts, objection drills and follow-up SOPs for MSPs, consultancies and high-ticket trades. Fee-recovery guarantee on the first three months." },
      { property: "og:title", content: "Script & Scale · Revenue enablement, UK, subscription" },
      { property: "og:description", content: "Founder-led sales without a process? Weekly reps, not a course. Three tiers from £525/month." },
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
        <Reveal className="container-tight grid gap-14 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-8">
            <div className="eyebrow">Revenue enablement · UK · Subscription</div>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05] tracking-[-0.015em] sm:text-6xl md:text-8xl md:leading-[1.02] md:tracking-[-0.02em]">
              You built the business.<br />
              It still can’t close without you.
            </h1>
            <p className="mt-7 max-w-2xl text-base text-muted-foreground">
              Most MSPs, consultancies, and trades win the deal, then lose it in week 2. You don't have a follow-up process. So every deal gets handled differently. Some close. Most don't. That's usually £200k–600k in lost revenue per year.
            </p>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Script &amp; Scale fixes the leak. Custom script, follow-up sequences, monthly workshops. Guarantee: if it doesn't recover your pipeline, month 4 is free.
            </p>
            <p className="mt-3 max-w-2xl text-sm font-medium">
              Your script is yours. Export it any time, and it's still yours even if you leave.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link to="/contact" className="btn-cta">Book a 20-Minute Diagnostic</Link>
              </Magnetic>
              <Link to="/how-it-works" className="btn-outline">See How We Find the Leak</Link>
            </div>
          </div>
          <aside className="md:col-span-4 md:border-l md:border-rule md:pl-8">
            <div className="eyebrow">Every week, you leave with</div>
            <ul className="mt-4 space-y-3 text-sm">
              <li>A script that fits how you actually talk</li>
              <li>Objection responses drilled until they’re automatic</li>
              <li>Follow-up SOPs so nothing sits in your inbox</li>
              <li>Live call review at the top tier</li>
              <li>A tool you keep, not a login you lose access to</li>
            </ul>
          </aside>
        </Reveal>
      </section>

      {/* MINI DIAGNOSTIC */}
      <section className="rule-b">
        <Reveal className="container-tight grid gap-10 py-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="eyebrow">Before you book a call</div>
            <h2 className="mt-3 font-serif text-3xl">See Your Pipeline Leak in 60 Seconds.</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              We'll estimate how much revenue you're losing right now. No email required. No pitch, just math.
            </p>
          </div>
          <div className="md:col-span-7">
            <MiniDiagnostic />
          </div>
        </Reveal>
      </section>

      {/* PROBLEM */}
      <section className="rule-b bg-secondary/40">
        <div className="container-tight py-20">
          <div className="eyebrow">Where the Money Actually Leaks</div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { t: "Week 1: You win the deal.", b: "Prospect says yes. You're excited." },
              { t: "Week 2: Radio silence.", b: "They're thinking. You don't follow up because you don't have a process. So someone else calls them back first." },
              { t: "Week 3: Deal is gone.", b: "They chose a competitor. You never knew why. Result: 20-30% of your pipeline leaks. That's £200k-600k per year." },
            ].map((c, i) => (
              <Reveal
                key={c.t}
                delay={i * 0.24}
                hoverLift
                className="rounded-md border border-rule bg-card/60 p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="font-serif text-2xl">{c.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{c.b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RISK LINE */}
      <section className="rule-b">
        <Reveal className="container-tight py-10 text-center">
          <p className="font-serif text-2xl md:text-3xl">
            First three months don’t pay for themselves, next month is free. That’s the whole risk
            you’re taking.
          </p>
        </Reveal>
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
            {TIERS.map((t, i) => (
              <Reveal
                key={t.id}
                delay={i * 0.22}
                hoverLift
                className={`flex flex-col rounded-md border p-6 transition-colors duration-200 ease-out ${
                  t.highlight ? "border-2 border-highlight bg-card" : "border-rule bg-card/60 hover:border-highlight"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <div className="font-serif text-2xl">{t.name}</div>
                  {t.highlight && (
                    <ShineOnce className="eyebrow text-highlight">Most pick this</ShineOnce>
                  )}
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="mono text-3xl relative inline-block">
                    <CountUp to={t.price} prefix="£" duration={2} />
                    <span className="pointer-events-none absolute left-0 -bottom-1 h-px w-full origin-left scale-x-0 bg-highlight transition-transform duration-300 group-hover:scale-x-100" />
                  </span>
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
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            £250 onboarding fee. 3-month minimum. Monthly rolling after that.
          </p>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="border-y border-highlight/25 bg-highlight/8">
        <Reveal className="container-tight grid gap-10 py-28 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="eyebrow">The guarantee</div>
            <h2 className="mt-3 font-serif text-4xl">The Guarantee (This Is Real)</h2>
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
        </Reveal>
      </section>

      {/* COMPARISON */}
      <section className="rule-b">
        <div className="container-tight py-20">
          <div className="eyebrow">Why Other Options Don't Work For This Problem</div>
          <div className="mt-8 divide-y divide-rule border-y border-rule">
            {[
              {
                name: "Business coach",
                price: "£150–3,500/mo",
                shape: "Ongoing 1:1 sessions",
                note: "Advice and accountability. No scripts, no SOPs. Coaching is unregulated in the UK, so quality varies a lot at every price point.",
              },
              {
                name: "Fractional head of sales",
                price: "£1,500–5,000/mo",
                shape: "One to two days a week",
                note: "Senior strategic oversight. Not hands-on scripting, roleplay, or workshop cadence.",
              },
              {
                name: "Sales training firm",
                price: "£5,000–20,000",
                shape: "One-off program, not a subscription",
                note: "Structured content delivered once. No ongoing pipeline work after the program ends.",
              },
              {
                name: "Outbound or lead-gen agency",
                price: "£1,500–8,000/mo",
                shape: "Retainer",
                note: "Fixes how many leads arrive. Doesn’t touch what happens once a lead becomes a live deal, which is where deals actually die.",
              },
              {
                name: "Community / cohort coaching",
                price: "£200–2,500/mo",
                shape: "Group calls, shared content library",
                note: "Peer accountability and mindset coaching, built around a cohort, not your specific pipeline. No 1:1 roleplay against the objections you're actually hearing.",
              },
              {
                name: "Script & Scale",
                price: "£525–2,100/mo",
                shape: "Custom script, follow-up SOPs, live roleplay, monthly-to-weekly workshops",
                note: "Guarantee tied to fee recovery (month 4 free if it doesn't work). You own the process even after you leave (standalone portal access).",
              },
            ].map((row) => (
              <div
                key={row.name}
                className={`grid gap-3 py-6 px-3 -mx-3 transition-colors duration-200 md:grid-cols-12 ${
                  row.name === "Script & Scale"
                    ? "bg-secondary/60 border-l-2 border-highlight hover:bg-secondary font-medium py-7"
                    : "hover:bg-secondary/40"
                }`}
              >
                <div className="md:col-span-3 font-serif text-xl">{row.name}</div>
                <div className="mono md:col-span-3 text-sm text-muted-foreground">{row.price}</div>
                <div className="md:col-span-2 text-sm text-muted-foreground">{row.shape}</div>
                <p className="md:col-span-4 text-sm">{row.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            The difference: Most of these solve a different problem. Script & Scale solves the actual problem costing you deals: no follow-up process, no repeatable script, no way to drill your team. And if it doesn't work, you don't pay for month 4.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="rule-b">
        <div className="container-tight py-20">
          <div className="eyebrow">Questions</div>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Before you book the call.</h2>
          <div className="mt-10 divide-y divide-rule border-y border-rule">
            {[
              {
                q: "What happens if it doesn't work?",
                a: "Three things have to be true: 1) you attended every workshop (no exceptions), 2) you ran the program (used the script on calls, logged deals, sent follow-up sequences), 3) closed deal value in three months didn't cover total fees paid (£250 + 3x monthly). If all three are true, month 4 is free. We keep working until it works. If you didn't attend or didn't run the program, the guarantee doesn't apply. This is a real bet, not a refund.",
              },
              {
                q: "Is there a minimum commitment?",
                a: "Three months minimum, plus a £250 onboarding fee. After that it rolls monthly, cancel when it stops earning its keep.",
              },
              {
                q: "What do we actually get each week?",
                a: "It depends on your tier. All tiers include your custom script (built during onboarding), follow-up sequences timed to your deal cycle, and monthly to weekly workshops. Closer and above add live roleplay against real objections from your team. Rainmaker adds live call coaching where I sit on your discovery calls. Monthly workshops drill the process into your team.",
              },
              {
                q: "Who is this actually for?",
                a: "Founder-led B2B service businesses, MSPs, consultancies, high-ticket trades, where the founder is still doing most of the selling and there's no written process to hand off.",
              },
              {
                q: "How is this different from a sales training course?",
                a: "Training courses deliver generic content once and you forget by week 2. Script & Scale is custom script built around your pitch and objections, with monthly to weekly workshops, live roleplay against what you actually hear, call review where I sit in on your discovery calls, and a guarantee tied to pipeline recovery. Success is measured by closed deals, not motivation. We're betting on results, not content delivery.",
              },
            ].map((item) => (
              <FaqRow key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <Reveal className="container-tight py-20 text-center">
          <h2 className="font-serif text-4xl md:text-5xl">20-Minute Pipeline Diagnostic</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell me what your last five deals looked like. If it isn’t a fit, I’ll say so.
          </p>
          <div className="mt-8">
            <Magnetic>
              <Link to="/contact" className="btn-cta">Book a 20-Minute Diagnostic</Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}

function FaqRow({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-serif text-xl">{question}</span>
        <span className="mono text-lg text-muted-foreground">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{answer}</p>
      )}
    </div>
  );
}