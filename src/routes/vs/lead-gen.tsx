import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";
import { Reveal } from "@/components/motion";

export const Route = createFileRoute("/vs/lead-gen")({
  head: () => ({
    meta: [
      { title: "Script & Scale vs Lead-Gen Agencies · Comparison" },
      { name: "description", content: "Why fixing follow-up beats getting more leads when deals are leaking in week 2." },
      { property: "og:title", content: "Script & Scale vs Lead-Gen Agencies" },
      { property: "og:description", content: "More leads don't help if you lose them in follow-up." },
      { property: "og:image", content: "https://scriptandscale.co.uk/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://scriptandscale.co.uk/og-image.png" },
    ],
  }),
  component: VsLeadGen,
});

function VsLeadGen() {
  return (
    <PageShell>
      <section className="rule-b">
        <Reveal className="container-tight py-20">
          <div className="eyebrow">Comparison</div>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl tracking-tight md:text-7xl">
            Script & Scale vs Lead-Gen Agencies
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground">
            Lead-gen agencies fill your pipeline. Script & Scale fixes where deals leak out. Both matter, but only one solves the actual problem if you're losing deals in follow-up.
          </p>
        </Reveal>
      </section>

      <section className="rule-b">
        <div className="container-tight py-16">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-rule">
                  <th className="text-left py-4 px-4 font-semibold">What It Does</th>
                  <th className="text-left py-4 px-4 font-semibold">Lead-Gen Agency</th>
                  <th className="text-left py-4 px-4 font-semibold">Script & Scale</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Price</td>
                  <td className="py-4 px-4">£1,500-8,000/month</td>
                  <td className="py-4 px-4 text-highlight">£525-2,100/month</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">What they focus on</td>
                  <td className="py-4 px-4">Volume: getting more leads into your pipeline</td>
                  <td className="py-4 px-4 text-highlight">Quality: converting the leads you already have</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Sales process</td>
                  <td className="py-4 px-4">Not their problem</td>
                  <td className="py-4 px-4 text-highlight">This is literally the entire focus</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Follow-up training</td>
                  <td className="py-4 px-4">None</td>
                  <td className="py-4 px-4 text-highlight">Custom script, SOPs, live roleplay</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Your team's ability to close</td>
                  <td className="py-4 px-4">Unchanged</td>
                  <td className="py-4 px-4 text-highlight">Gets better every month</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">ROI math</td>
                  <td className="py-4 px-4">10 leads × 20% close rate = 2 deals</td>
                  <td className="py-4 px-4 text-highlight">5 leads × 40% close rate = 2 deals (same result, lower volume)</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Works if</td>
                  <td className="py-4 px-4">Your pipeline is empty</td>
                  <td className="py-4 px-4 text-highlight">Your pipeline exists but deals are dying in week 2</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">If you hire them AND us</td>
                  <td className="py-4 px-4 text-highlight">Lead-gen brings 10 leads, we convert 6 instead of 2</td>
                  <td className="py-4 px-4 text-highlight">Your lead-gen ROI doubles immediately</td>
                </tr>
                <tr className="bg-highlight/5">
                  <td className="py-4 px-4 font-semibold">The math</td>
                  <td className="py-4 px-4">Fixes one side of the equation (numerator)</td>
                  <td className="py-4 px-4 text-highlight">Fixes the other side (denominator). Multiplies results.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rule-b">
        <Reveal className="container-tight py-20">
          <div className="eyebrow">The real problem</div>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl">
            You don't have a lead problem. You have a close rate problem.
          </h2>
          <div className="mt-8 space-y-4 text-base text-muted-foreground max-w-3xl">
            <p>Most MSPs, consultancies, and trades think they need more leads. "If only I had 20 leads a month instead of 10, I'd be fine."</p>
            <p>But that's not true. Because if 10 leads close 2 deals (20% close rate), 20 leads close 4 deals. You're not growing your pipeline, you're just running harder on the same broken system.</p>
            <p>The real problem: your team doesn't know what to say in week 2. No follow-up script. No objection handling. No next-step clarity. So deals die silent.</p>
            <p>You can double your leads and still only close the same percentage. You're just spending twice as much.</p>
          </div>
        </Reveal>
      </section>

      <section className="rule-b">
        <Reveal className="container-tight py-20">
          <div className="eyebrow">The math that matters</div>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl">
            Same leads, better conversion.
          </h2>
          <div className="mt-8 space-y-6 text-base text-muted-foreground max-w-3xl">
            <div className="border-l-4 border-highlight pl-4">
              <p className="font-semibold text-foreground">Current state</p>
              <p className="mt-2">10 leads per month × 20% close rate = 2 deals</p>
              <p className="mt-1 text-sm">Cost to close: £250 per deal</p>
            </div>
            <div className="border-l-4 border-highlight pl-4">
              <p className="font-semibold text-foreground">Add lead-gen agency (£3,000/month)</p>
              <p className="mt-2">20 leads per month × 20% close rate = 4 deals</p>
              <p className="mt-1 text-sm">Cost: £3,000 + £750 = £3,750 for 4 deals. £937 per deal</p>
            </div>
            <div className="border-l-4 border-highlight pl-4">
              <p className="font-semibold text-foreground">Add Script & Scale only (£1,050/month)</p>
              <p className="mt-2">10 leads per month × 40% close rate = 4 deals</p>
              <p className="mt-1 text-sm">Cost: £1,050 for 4 deals. £262 per deal. Same leads, double closes.</p>
            </div>
            <div className="border-l-4 border-highlight/60 border-dashed pl-4">
              <p className="font-semibold text-foreground">Do both (£3,000 + £1,050 = £4,050/month)</p>
              <p className="mt-2">20 leads per month × 40% close rate = 8 deals</p>
              <p className="mt-1 text-sm">Cost: £4,050 for 8 deals. £506 per deal. Compound effect.</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="rule-b">
        <Reveal className="container-tight py-20">
          <div className="eyebrow">Why both, not either</div>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl">
            Lead-gen and Script & Scale solve different problems.
          </h2>
          <div className="mt-8 space-y-4 text-base text-muted-foreground max-w-3xl">
            <p>Lead-gen fixes volume: getting more people interested.</p>
            <p>Script & Scale fixes conversion: turning interested people into customers.</p>
            <p>If your only problem is empty pipeline, hire lead-gen.</p>
            <p>If your pipeline is full but deals are dying in follow-up, hire Script & Scale.</p>
            <p>If both are true (which it usually is), do both. But Script & Scale will show ROI faster because you can prove it against your existing pipeline.</p>
          </div>
        </Reveal>
      </section>

      <section>
        <div className="container-tight py-20 text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">Ready to fix the leak?</h2>
          <Link to="/contact" className="btn-cta">Book Your Diagnostic</Link>
        </div>
      </section>
    </PageShell>
  );
}
