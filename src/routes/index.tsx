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
      {/* HERO: Outcome-first, diagnostic interactive, trust signal included */}
      <section className="rule-b">
        <Reveal className="container-tight grid gap-10 py-16 md:grid-cols-12 md:gap-14 md:py-24">
          <div className="md:col-span-6">
            <div className="eyebrow">Revenue enablement · UK · Subscription</div>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05] tracking-[-0.015em] sm:text-6xl md:text-7xl md:leading-[1.02] md:tracking-[-0.02em]">
              Get your custom sales script in 20 minutes.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium text-foreground">
              Guarantee: if it doesn't recover your pipeline value in the first 3 months, month 4 is free.
            </p>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
              Custom script, follow-up SOPs, objection drills, monthly to weekly workshops. Founder-led sales without a process costs you 20-30% of your pipeline. That's £200k-600k per year leaking. We fix the leak with a script you own and keep, even if you leave.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link to="/contact" className="btn-cta">Book Your Diagnostic</Link>
              </Magnetic>
              <Link to="/how-it-works" className="btn-outline">See the Process</Link>
            </div>
            <div className="mt-10 border-t border-rule pt-6">
              <div className="eyebrow text-xs">Why you should talk to me</div>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li>10+ years B2B sales. Closed deals £12k-£180k ARR. Most recent close: £60k/month.</li>
                <li>Top 5% performance across 5 territories.</li>
                <li>Currently lead an 8-person team: +25% close rate, -40% onboarding errors via structured process.</li>
              </ul>
            </div>
          </div>
          <div className="md:col-span-6">
            <MiniDiagnostic />
          </div>
        </Reveal>
      </section>

      {/* WHAT YOU KEEP: Ownership and export differentiation */}
      <section className="rule-b bg-secondary/40">
        <Reveal className="container-tight py-16 md:py-20">
          <div className="eyebrow">Your script is yours</div>
          <div className="mt-6 grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl">You own the process. Export it any time.</h2>
              <p className="mt-4 text-sm text-muted-foreground">
                During onboarding, we build your custom script inside the portal. Everything configured for your business, your pitch, your objections.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                But you're not locked in. Download a standalone HTML copy whenever you want. No login required. It works offline, it's yours to keep even if you cancel.
              </p>
            </div>
            <div className="rounded-md border border-rule bg-card/60 p-6">
              <div className="eyebrow text-xs">What you export includes</div>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="shrink-0">✓</span>
                  <span>Your click-through call script (intake to close)</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0">✓</span>
                  <span>All custom objection responses</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0">✓</span>
                  <span>Follow-up sequences with timing</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0">✓</span>
                  <span>Works offline, no login needed, fully portable</span>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* PROBLEM SEQUENCE: Where the leak happens */}
      <section className="rule-b">
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

      {/* RISK LINE: Anchor the guarantee */}
      <section className="rule-b">
        <Reveal className="container-tight py-10 text-center">
          <p className="font-serif text-2xl md:text-3xl">
            First three months don't pay for themselves, next month is free. That's the whole risk you're taking.
          </p>
        </Reveal>
      </section>

      {/* TIERS: Three paths */}
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

      {/* GUARANTEE: Real skin in the game */}
      <section className="border-y border-highlight/25 bg-highlight/8">
        <Reveal className="container-tight grid gap-10 py-28 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="eyebrow">The guarantee</div>
            <h2 className="mt-3 font-serif text-4xl">The Guarantee (This Is Real)</h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-base">
              If closed deal value across your first three months doesn't cover the fees you paid, and you attended the workshops and ran the program, month four is free. Every month after that too, until we're square.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              No cash refund. Attendance is required. It's a real guarantee, not a marketing one. It works because both sides show up.
            </p>
            <Link to="/guarantee" className="mt-6 inline-block text-sm underline-offset-4 hover:underline">
              Read the full mechanic →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* COMPARISON: Show why yours wins */}
      <section className="rule-b">
        <div className="container-tight py-20">
          <Reveal>
            <div className="text-center mb-12">
              <div className="eyebrow">Why Script & Scale Wins</div>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl">You're not paying for mindset coaching.</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Most alternatives solve a different problem. Here's how they actually compare on what matters: process, script, drilling, and results.
              </p>
            </div>
          </Reveal>
          
          <div className="mt-12 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule">
                  <th className="text-left py-4 px-3 font-serif text-base">Solution</th>
                  <th className="text-left py-4 px-3 font-serif text-base">Price</th>
                  <th className="text-left py-4 px-3 font-serif text-base">Custom Script</th>
                  <th className="text-left py-4 px-3 font-serif text-base">Live Roleplay</th>
                  <th className="text-left py-4 px-3 font-serif text-base">Follow-Up SOPs</th>
                  <th className="text-left py-4 px-3 font-serif text-base">Guarantee</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-rule hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-3">Business coach</td>
                  <td className="py-4 px-3 mono text-xs">£150-3,500/mo</td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">No</span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">No</span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">No</span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">No</span>
                  </td>
                </tr>
                <tr className="border-b border-rule hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-3">Fractional head of sales</td>
                  <td className="py-4 px-3 mono text-xs">£1,500-5,000/mo</td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">No</span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">Sometimes</span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">No</span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">No</span>
                  </td>
                </tr>
                <tr className="border-b border-rule hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-3">Sales training firm</td>
                  <td className="py-4 px-3 mono text-xs">£5,000-20,000 (one-off)</td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">Generic</span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">No</span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">No</span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">No</span>
                  </td>
                </tr>
                <tr className="border-b border-rule hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-3">Lead-gen agency</td>
                  <td className="py-4 px-3 mono text-xs">£1,500-8,000/mo</td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">No</span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">No</span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">No</span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">No</span>
                  </td>
                </tr>
                <tr className="border-b border-rule hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-3">Cohort coaching</td>
                  <td className="py-4 px-3 mono text-xs">£200-2,500/mo</td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">No</span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">Group only</span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">Generic</span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="text-muted-foreground">No</span>
                  </td>
                </tr>
                <tr className="bg-secondary/60 border-l-2 border-highlight font-medium">
                  <td className="py-5 px-3">Script & Scale</td>
                  <td className="py-5 px-3 mono text-xs">£525-2,100/mo</td>
                  <td className="py-5 px-3 text-center">
                    <span className="text-highlight">Yes, yours</span>
                  </td>
                  <td className="py-5 px-3 text-center">
                    <span className="text-highlight">Live, 1:1</span>
                  </td>
                  <td className="py-5 px-3 text-center">
                    <span className="text-highlight">Custom</span>
                  </td>
                  <td className="py-5 px-3 text-center">
                    <span className="text-highlight">Yes, real</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-10 rounded-md border border-rule bg-card/60 p-6 md:p-8">
            <h3 className="font-serif text-lg md:text-xl">The actual edge</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              You're not paying for general business coaching or group mindset work. You're buying a custom script built around your actual pitch and objections, drilled live in roleplay against what your team hears, with SOPs that match your deal cycle, and a guarantee tied to real pipeline recovery.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              If it doesn't work, you don't pay for month 4. None of the alternatives above have that. Most don't even have a process to give you in the first place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-cta">Book Your Diagnostic</Link>
              <Link to="/compare" className="btn-outline">See Full Details</Link>
            </div>
          </div>
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
              {
                q: "How does this compare to other options?",
                a: "Most alternatives solve a different problem. Business coaches give you advice. Fractional sales leaders do strategy. Training firms deliver content once. Lead-gen agencies fix your top of funnel. Cohorts give you peer accountability. Script & Scale fixes what's actually costing you deals: no follow-up process, no repeatable script, no way to drill your team. See the full breakdown on our comparison page.",
                isLink: true,
                linkText: "View the comparison",
                linkTo: "/compare",
              },
            ].map((item) => (
              <FaqRow key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA: Final call to action */}
      <section>
        <Reveal className="container-tight py-20 text-center">
          <h2 className="font-serif text-4xl md:text-5xl">20-Minute Pipeline Diagnostic</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell me what your last five deals looked like. If it isn't a fit, I'll say so.
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

function FaqRow({ question, answer, isLink, linkText, linkTo }: { question: string; answer: string; isLink?: boolean; linkText?: string; linkTo?: string }) {
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
        <div>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{answer}</p>
          {isLink && linkTo && linkText && (
            <Link to={linkTo} className="mt-4 inline-block text-sm underline-offset-4 hover:underline">
              {linkText} →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
