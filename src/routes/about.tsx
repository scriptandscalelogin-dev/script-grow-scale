import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · Script & Scale" },
      { name: "description", content: "Why Script & Scale exists, who it's for, and who's on the other end of the workshops." },
      { property: "og:title", content: "About Script & Scale" },
      { property: "og:description", content: "Founder-led, built for UK small businesses without a sales process." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PageShell>
      <section className="rule-b">
        <div className="container-tight py-20">
          <div className="eyebrow">About</div>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl">
            Built for the founder still sending every proposal.
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Script &amp; Scale exists because most sales training is written for enterprise reps, not
            for the technical founder of a 4-person MSP who took a call at 9am, quoted at lunchtime,
            and hasn’t heard back in a week.
          </p>
        </div>
      </section>

      <section className="rule-b">
        <div className="container-tight grid gap-10 py-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="eyebrow">Who it’s for</div>
          </div>
          <div className="md:col-span-8 space-y-4 text-base">
            <p>UK small businesses, roughly 2–20 people, where sales is still whoever founded the company.</p>
            <p>Typical clients: managed service providers, ITSM consultancies, technical services firms, boutique consultancies. The kind of business where the offer is real and the delivery is good, and the missing piece is a repeatable way to move deals forward.</p>
          </div>
        </div>
      </section>

      <section className="rule-b">
        <div className="container-tight grid gap-10 py-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="eyebrow">The approach</div>
          </div>
          <div className="md:col-span-8 space-y-4 text-base">
            <p>No frameworks with acronyms. No "seven habits". The workshops are working sessions on your actual pipeline. The script gets written from your real calls, the objection library from objections you’re actually hearing.</p>
            <p>Small caseload on purpose. This isn’t a course you buy and consume alone.</p>
          </div>
        </div>
      </section>

      <section className="rule-b">
        <div className="container-tight grid gap-10 py-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="eyebrow">The founder</div>
          </div>
          <div className="md:col-span-8 space-y-4 text-base">
            <p>
              Built Script &amp; Scale because I kept watching founders solve their sales problem
              the same expensive way: hire a rep, wait three months for them to ramp, and still end
              up closing the big deals yourself while they figure it out.
            </p>
            <p>
              The people who already understand your product, your engineers, your existing staff,
              can be trained to sell it properly. That’s the entire premise.
            </p>
            <p>
              I’ve spent over 10 years in B2B sales. SaaS, telecoms, enterprise. Closed deals from
              £12k up to £180k ARR, ranked top 5% across five territories. During my most recent
              role before founding Script &amp; Scale, I closed complex deals worth £60k a month.
            </p>
            <p>
              This isn’t coaching. It isn’t training. It’s showing you how to deliver value and
              produce results. Easy. Consistent. Methodical.
            </p>

            <p>
              Built and led sales teams using live roleplay, objection handling drills, and
              structured discovery, the same approach behind this program, lifting close rates by
              25% and cutting onboarding errors by 40%.
            </p>
            <p>
              Foundation-level certified in ITIL4, PRINCE2 Agile, DevOps, and TOGAF. So when we sit
              down to build your script, I’m not learning what an MSP or ITSM provider does from
              scratch. I already speak the language your prospects speak.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="container-tight py-16 text-center">
          <Link to="/contact" className="btn-primary">Book a discovery call</Link>
        </div>
      </section>
    </PageShell>
  );
}
