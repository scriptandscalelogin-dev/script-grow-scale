import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";
import { Reveal } from "@/components/motion";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Script & Scale vs Alternatives · Comparison" },
      { name: "description", content: "How Script & Scale compares to business coaches, fractional sales leaders, training firms, lead-gen agencies, and cohort coaching." },
    ],
  }),
  component: Compare,
});

function Compare() {
  const options = [
    {
      name: "Business coach",
      price: "£150-3,500/mo",
      shape: "Ongoing 1:1 sessions",
      note: "Advice and accountability. No scripts, no SOPs. Coaching is unregulated in the UK, so quality varies a lot at every price point.",
    },
    {
      name: "Fractional head of sales",
      price: "£1,500-5,000/mo",
      shape: "One to two days a week",
      note: "Senior strategic oversight. Not hands-on scripting, roleplay, or workshop cadence.",
    },
    {
      name: "Sales training firm",
      price: "£5,000-20,000",
      shape: "One-off program, not a subscription",
      note: "Structured content delivered once. No ongoing pipeline work after the program ends.",
    },
    {
      name: "Outbound or lead-gen agency",
      price: "£1,500-8,000/mo",
      shape: "Retainer",
      note: "Fixes how many leads arrive. Doesn't touch what happens once a lead becomes a live deal, which is where deals actually die.",
    },
    {
      name: "Community / cohort coaching",
      price: "£200-2,500/mo",
      shape: "Group calls, shared content library",
      note: "Peer accountability and mindset coaching, built around a cohort, not your specific pipeline. No 1:1 roleplay against the objections you're actually hearing.",
    },
  ];

  return (
    <PageShell>
      {/* HERO */}
      <section className="rule-b">
        <Reveal className="container-tight py-16 md:py-24">
          <div className="eyebrow">Why Other Options Don't Work For This Problem</div>
          <h1 className="mt-5 font-serif text-5xl md:text-6xl leading-[1.1]">
            Most solve a different problem.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground">
            Your issue isn't lead volume, mindset, or coaching. It's that deals leak in week 2 because you have no follow-up process. Here's how each alternative stacks up.
          </p>
        </Reveal>
      </section>

      {/* COMPARISON TABLE */}
      <section className="rule-b">
        <div className="container-tight py-20">
          <div className="divide-y divide-rule border-y border-rule">
            {options.map((row) => (
              <div
                key={row.name}
                className="grid gap-3 py-6 px-3 -mx-3 transition-colors duration-200 md:grid-cols-12 hover:bg-secondary/40"
              >
                <div className="md:col-span-3 font-serif text-lg md:text-xl">{row.name}</div>
                <div className="mono md:col-span-3 text-sm text-muted-foreground">{row.price}</div>
                <div className="md:col-span-2 text-sm text-muted-foreground">{row.shape}</div>
                <p className="md:col-span-4 text-sm">{row.note}</p>
              </div>
            ))}
            <div
              className="grid gap-3 py-7 px-3 -mx-3 bg-secondary/60 border-l-2 border-highlight font-medium md:grid-cols-12"
            >
              <div className="md:col-span-3 font-serif text-lg md:text-xl">Script &amp; Scale</div>
              <div className="mono md:col-span-3 text-sm">£525-2,100/mo</div>
              <div className="md:col-span-2 text-sm">Custom script, live roleplay, monthly-to-weekly workshops</div>
              <p className="md:col-span-4 text-sm">
                Guarantee tied to fee recovery (month 4 free if it doesn't work). You own the process even after you leave (standalone portal access).
              </p>
            </div>
          </div>
          <div className="mt-8 rounded-md border border-rule bg-card/60 p-6">
            <h3 className="font-serif text-lg">The actual difference</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Most of these solve a different problem than the one costing you deals. Script &amp; Scale solves this one: no follow-up process, no repeatable script, no way to drill your team. 
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              And unlike everything above, if it doesn't work, you don't pay for month 4. That's not a refund policy. That's a guarantee tied to your actual pipeline recovery.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <Reveal className="container-tight py-20 text-center">
          <h2 className="font-serif text-4xl md:text-5xl">Ready to fix your leak?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Let's talk about your last five deals. If it's a fit, we'll build your script.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-cta">Book Your Diagnostic</Link>
            <Link to="/" className="btn-outline">Back to Home</Link>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
