import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";
import { TIERS } from "@/lib/tiers";
import { Reveal, CountUp, ShineOnce } from "@/components/motion";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing · Script & Scale" },
      { name: "description", content: "Three tiers: £525, £1,050 or £2,100/month. £250 onboarding. 3-month minimum, monthly rolling after." },
      { property: "og:title", content: "Pricing · Script & Scale" },
      { property: "og:description", content: "Starter, Growth, Scale. Clear terms, guarantee on the first three months." },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <PageShell>
      <section className="rule-b">
        <div className="container-tight py-20">
          <div className="eyebrow">Pricing</div>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl tracking-tight md:text-7xl">Three tiers. Same guarantee.</h1>
          <p className="mt-5 max-w-2xl text-sm text-muted-foreground">
            Pick the cadence you’ll actually keep. You can move up a tier at any time; you can move
            down after the first three months.
          </p>
        </div>
      </section>

      <section className="rule-b">
        <div className="container-tight py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {TIERS.map((t, i) => (
              <Reveal
                key={t.id}
                delay={i * 0.22}
                hoverLift
                className={`flex flex-col rounded-md border p-7 transition-shadow ${
                  t.highlight ? "border-2 border-highlight bg-card" : "border-rule bg-card/60"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <div className="font-serif text-2xl">{t.name}</div>
                  {t.highlight && (
                    <ShineOnce className="eyebrow text-highlight">Most pick this</ShineOnce>
                  )}
                </div>
                <div className="mt-3">
                  <span className="mono text-4xl">{`£${t.price}`}</span>
                  <span className="text-sm text-muted-foreground"> / month</span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{t.cadence}</div>
                <p className="mt-4 text-sm">{t.tagline}</p>
                <ul className="mt-6 flex-1 space-y-2 text-sm">
                  {t.includes.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-[0.3rem] block h-1 w-3 shrink-0 bg-highlight" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="btn-cta mt-6">Book a call</Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="rule-b">
        <div className="container-tight py-16">
          <Reveal className="grid gap-10 md:grid-cols-2">
            <div>
              <div className="eyebrow">What you’re actually signing up for</div>
              <ul className="mt-5 space-y-4 text-sm">
                <li><strong className="font-medium">£250 onboarding fee.</strong> One-off. Covers the initial deep-dive: your offer, ICP, current pipeline, existing collateral.</li>
                <li><strong className="font-medium">3-month minimum.</strong> Real change doesn’t happen in a single session. After month three it’s monthly rolling. Cancel any time with 30 days’ notice.</li>
                <li><strong className="font-medium">No long contracts.</strong> No auto-escalating price tiers. What you sign is what you pay.</li>
              </ul>
            </div>
            <div>
              <div className="eyebrow">The guarantee</div>
              <p className="mt-5 text-sm">
                If closed deal value across your first three months doesn’t cover the fees you paid,
                month four is free. Every month after that too, until you break even.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Attendance required. Fee recovery only, no cash refund.
              </p>
              <Link to="/guarantee" className="mt-5 inline-block text-sm underline-offset-4 hover:underline">
                Full mechanic →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}