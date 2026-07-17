import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Script & Scale" },
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
            <p>No frameworks with acronyms. No "seven habits". The workshops are working sessions on your actual pipeline — the script gets written from your real calls, the objection library from objections you’re actually hearing.</p>
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
            <p className="text-muted-foreground">
              [Founder bio placeholder — swap this out with your real background: years in sales,
              industries you sold in, notable outcomes if any. No fabricated stats.]
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
