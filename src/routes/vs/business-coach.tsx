import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";
import { Reveal } from "@/components/motion";

export const Route = createFileRoute("/vs/business-coach")({
  head: () => ({
    meta: [
      { title: "Script & Scale vs Business Coach · Comparison" },
      { name: "description", content: "Why Script & Scale's process-driven approach delivers better results than traditional business coaching." },
      { property: "og:title", content: "Script & Scale vs Business Coach" },
      { property: "og:description", content: "Process and accountability vs advice and philosophy." },
      { property: "og:image", content: "https://scriptandscale.co.uk/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://scriptandscale.co.uk/og-image.png" },
    ],
  }),
  component: VsBusinessCoach,
});

function VsBusinessCoach() {
  return (
    <PageShell>
      <section className="rule-b">
        <Reveal className="container-tight py-20">
          <div className="eyebrow">Comparison</div>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl tracking-tight md:text-7xl">
            Script & Scale vs Business Coach
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground">
            Business coaches provide accountability and advice. Script & Scale provides a custom script, live drilling, follow-up SOPs, and a guarantee tied to deal recovery.
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
                  <th className="text-left py-4 px-4 font-semibold">Business Coach</th>
                  <th className="text-left py-4 px-4 font-semibold">Script & Scale</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Price</td>
                  <td className="py-4 px-4">£150-3,500/month</td>
                  <td className="py-4 px-4 text-highlight">£525-2,100/month</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Written script</td>
                  <td className="py-4 px-4">No</td>
                  <td className="py-4 px-4 text-highlight">Yes. Custom to your business</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Follow-up SOPs</td>
                  <td className="py-4 px-4">Generic advice only</td>
                  <td className="py-4 px-4 text-highlight">Specific sequences tied to your deal cycle</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Objection library</td>
                  <td className="py-4 px-4">General principles</td>
                  <td className="py-4 px-4 text-highlight">Your actual objections. Written responses.</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Live roleplay</td>
                  <td className="py-4 px-4">Rarely</td>
                  <td className="py-4 px-4 text-highlight">Every workshop (depending on tier)</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Call coaching</td>
                  <td className="py-4 px-4">Feedback on mindset</td>
                  <td className="py-4 px-4 text-highlight">Specific tonality and mechanics feedback</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Accountability</td>
                  <td className="py-4 px-4">Personal accountability</td>
                  <td className="py-4 px-4 text-highlight">Tied to deal recovery (3-month guarantee)</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">You keep the process</td>
                  <td className="py-4 px-4">Disappears when coaching ends</td>
                  <td className="py-4 px-4 text-highlight">Yours forever. Export anytime. No lock-in.</td>
                </tr>
                <tr className="border-b border-rule/40">
                  <td className="py-4 px-4 font-semibold">Works for</td>
                  <td className="py-4 px-4">Mindset issues, general advice</td>
                  <td className="py-4 px-4 text-highlight">Pipeline leaks in follow-up stage</td>
                </tr>
                <tr className="bg-highlight/5">
                  <td className="py-4 px-4 font-semibold">Result</td>
                  <td className="py-4 px-4">Accountability that disappears</td>
                  <td className="py-4 px-4 text-highlight">A repeatable system you keep and scale</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rule-b">
        <Reveal className="container-tight py-20">
          <div className="eyebrow">When business coaching works</div>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl">
            If your problem is mindset, business coaches are good.
          </h2>
          <div className="mt-8 space-y-4 text-base text-muted-foreground max-w-3xl">
            <p>If you're stuck on imposter syndrome, procrastination, or lack of direction, a business coach helps. They provide accountability, strategy review, and personal growth.</p>
            <p>But if your problem is tactical: no written script, no follow-up process, team confusion on objection handling, then a coach won't solve it. They'll help you feel accountable, but they won't give you the process to hand your team.</p>
          </div>
        </Reveal>
      </section>

      <section className="rule-b">
        <Reveal className="container-tight py-20">
          <div className="eyebrow">The real difference</div>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl">
            Process vs philosophy.
          </h2>
          <div className="mt-8 space-y-4 text-base text-muted-foreground max-w-3xl">
            <p>Business coaches teach mindset. You leave the call feeling motivated. Then you do the same thing and get the same result.</p>
            <p>Script & Scale gives you a written script, follow-up sequences, objection responses. Your team knows exactly what to say. No improvisation. No confusion. Repeatable.</p>
            <p>One fades when coaching ends. The other stays and compounds.</p>
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
