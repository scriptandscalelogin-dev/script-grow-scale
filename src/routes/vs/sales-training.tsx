import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";
import { Reveal } from "@/components/motion";

export const Route = createFileRoute("/vs/sales-training")({
  head: () => ({
    meta: [
      { title: "Script & Scale vs Sales Training · Comparison" },
      { name: "description", content: "Why ongoing process-driven training beats one-off sales courses." },
      { property: "og:title", content: "Script & Scale vs Sales Training" },
      { property: "og:description", content: "One-time content vs ongoing drilling tied to YOUR pipeline." },
      { property: "og:image", content: "https://scriptandscale.co.uk/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://scriptandscale.co.uk/og-image.png" },
    ],
  }),
  component: VsSalesTraining,
});

function VsSalesTraining() {
  return (
    <PageShell>
      <section className="rule-b">
        <Reveal className="container-tight py-20">
          <div className="eyebrow">Comparison</div>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl tracking-tight md:text-7xl">
            Script & Scale vs Sales Training Course
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground">
            Training courses deliver content once and disappear. Script & Scale drills your team live against their actual objections, every week or month, until the process is automatic.
          </p>
        </Reveal>
      </section>

      <section className="rule-b">
        <div className="container-tight py-16">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-rule">
                  <th className="text-left py-4 px-4 font-semibold">Feature</th>
                  <th className="text-left py-4 px-4 font-semibold">Sales Training Course</th>
                  <th className="text-left py-4 px-4 font-semibold">Script & Scale</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Price</td>
                  <td className="py-4 px-4">£5,000-20,000 one-time</td>
                  <td className="py-4 px-4 text-highlight">£525-2,100/month (or £250 + 3 months)</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Content delivery</td>
                  <td className="py-4 px-4">One-time course, then disappears</td>
                  <td className="py-4 px-4 text-highlight">Ongoing workshops (monthly to weekly)</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Generic vs custom</td>
                  <td className="py-4 px-4">Generic frameworks for everyone</td>
                  <td className="py-4 px-4 text-highlight">Custom to your business, your objections</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Live roleplay</td>
                  <td className="py-4 px-4">Rarely, often with strangers</td>
                  <td className="py-4 px-4 text-highlight">Every workshop against YOUR actual objections</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Accountability for results</td>
                  <td className="py-4 px-4">None</td>
                  <td className="py-4 px-4 text-highlight">Guarantee: month 4 free if deals don't cover costs</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Follow-up support</td>
                  <td className="py-4 px-4">None after the course ends</td>
                  <td className="py-4 px-4 text-highlight">Weekly or monthly ongoing support</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Team learning curve</td>
                  <td className="py-4 px-4">Steep. No drilling. Content often forgotten week 2</td>
                  <td className="py-4 px-4 text-highlight">Gradual. Drilled live every session until automatic</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Works if</td>
                  <td className="py-4 px-4">Your team wants to learn concepts</td>
                  <td className="py-4 px-4 text-highlight">Your pipeline is leaking in follow-up stage</td>
                </tr>
                <tr className="bg-highlight/5">
                  <td className="py-4 px-4 font-semibold">Result</td>
                  <td className="py-4 px-4">Initial motivation, fade by week 3</td>
                  <td className="py-4 px-4 text-highlight">Repeatable system drilled into automatic behavior</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rule-b">
        <Reveal className="container-tight py-20">
          <div className="eyebrow">Why training courses fail</div>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl">
            Content alone doesn't change behavior.
          </h2>
          <div className="mt-8 space-y-4 text-base text-muted-foreground max-w-3xl">
            <p>You pay £10k for a two-day course. Your team learns frameworks. Everyone feels energized. You leave, go back to the office, and nothing changes. By week 3, they're back to the old way.</p>
            <p>Why. Because frameworks without drilling don't stick. Your reps aren't used to saying the script. They don't know how to handle the objections your specific prospects raise. So they improvise, fall back to old habits, and the deal dies the same way.</p>
            <p>Script & Scale is different because we don't teach frameworks. We drill your actual script against your actual objections. Every session. Until it's automatic. That's how behavior actually changes.</p>
          </div>
        </Reveal>
      </section>

      <section className="rule-b">
        <Reveal className="container-tight py-20">
          <div className="eyebrow">The real difference</div>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl">
            Consumption vs drilling.
          </h2>
          <div className="mt-8 space-y-4 text-base text-muted-foreground max-w-3xl">
            <p>Training courses let you consume information. Sales training feels productive at the time. But productivity and behavior change aren't the same thing.</p>
            <p>Script & Scale forces drilling. You don't read about objection handling. You roleplay it live. You don't theorize about follow-up timing. You run the actual sequence on your pipeline. The script lives in your portal. Your team uses it every call. That's why it sticks.</p>
            <p>One gives you knowledge. The other gives you automatic behavior. Behavior closes deals.</p>
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
