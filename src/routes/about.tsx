import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";
import { Reveal, Magnetic, CountUp } from "@/components/motion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · Script & Scale" },
      { name: "description", content: "Why Script & Scale exists, who it's for, and who's on the other end of the workshops." },
      { property: "og:title", content: "About Script & Scale" },
      { property: "og:description", content: "Founder-led, built for UK small businesses without a sales process." },
      { property: "og:image", content: "https://scriptandscale.co.uk/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://scriptandscale.co.uk/og-image.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Arno",
          "title": "Founder, Script & Scale",
          "description": "Revenue enablement expert with 10+ years in B2B sales",
          "url": "https://scriptandscale.co.uk/about",
          "jobTitle": "Founder",
          "worksFor": {
            "@type": "Organization",
            "name": "Script & Scale",
            "url": "https://scriptandscale.co.uk"
          },
          "knowsAbout": [
            "Sales Enablement",
            "B2B Sales",
            "Sales Process Design",
            "Objection Handling",
            "Sales Coaching"
          ],
          "hasCredential": [
            {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": "Certification",
              "name": "ITIL4 Foundation"
            },
            {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": "Certification",
              "name": "PRINCE2 Agile"
            },
            {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": "Certification",
              "name": "DevOps Foundation"
            },
            {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": "Certification",
              "name": "TOGAF"
            }
          ],
          "knowsLanguage": ["English"],
          "areaServed": "GB",
          "experience": {
            "@type": "WorkExperience",
            "description": "10+ years B2B sales across SaaS, telecoms, enterprise. Closed deals £12k-£180k ARR. Top 5% performance across 5 territories. Most recent close: £60k/month."
          }
        })
      }
    ]
  }),
  component: About,
});

function About() {
  return (
    <PageShell>
      <section className="rule-b">
        <Reveal className="container-tight py-20">
          <div className="eyebrow">About</div>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl tracking-tight md:text-7xl">
            Built for the founder still sending every proposal.
          </h1>
          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            Script &amp; Scale exists because most sales training is written for enterprise reps, not
            for the technical founder of a 4-person MSP who took a call at 9am, quoted at lunchtime,
            and hasn’t heard back in a week.
          </p>
        </Reveal>
      </section>

      <section className="rule-b">
        <Reveal className="container-tight grid gap-10 py-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="eyebrow">Who it’s for</div>
          </div>
          <div className="md:col-span-8 space-y-4 text-base">
            <p>UK small businesses, roughly 2–20 people, where sales is still whoever founded the company.</p>
            <p>Typical clients: managed service providers, boutique consultancies, and high-ticket trades such as kitchen fitters, joiners, landscapers and boutique builders. The kind of business where the offer is real and the delivery is good, and the missing piece is a repeatable way to move deals forward.</p>
          </div>
        </Reveal>
      </section>

      <section className="rule-b">
        <Reveal className="container-tight grid gap-10 py-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="eyebrow">The approach</div>
          </div>
          <div className="md:col-span-8 space-y-4 text-base">
            <p>No frameworks with acronyms. No "seven habits". The workshops are working sessions on your actual pipeline. The script gets written from your real calls, the objection library from objections you’re actually hearing.</p>
            <p>Small caseload on purpose. This isn’t a course you buy and consume alone, and it isn’t a cohort either. No community, no group calls with strangers’ pipelines, no mindset work. Just your numbers, your calls, and a guarantee that doesn’t care how the workshops made you feel.</p>
          </div>
        </Reveal>
      </section>

      <section className="rule-b">
        <Reveal className="container-tight grid gap-10 py-16 md:grid-cols-12">
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
              £<CountUp to={12} suffix="k" /> up to £<CountUp to={180} suffix="k" /> ARR, ranked top{" "}
              <CountUp to={5} suffix="%" /> across five territories. During my most recent
              role before founding Script &amp; Scale, I closed complex deals worth £<CountUp to={60} suffix="k" /> a month.
            </p>
            <p>
              This isn’t coaching. It isn’t training. It’s showing you how to deliver value and
              produce results. Easy. Consistent. Methodical.
            </p>

            <p>
              I scaled my own pipeline using the exact scripts and frameworks I'm now teaching you. Same discovery structure. Same objection isolation. Same follow-up cadence. It worked then. It works now.
            </p>
            <p>
              Foundation-level certified in ITIL4, PRINCE2 Agile, DevOps, and TOGAF. So when we sit
              down to build your script, I’m not learning what an MSP or consultancy does from
              scratch. I already speak the language your prospects speak.
            </p>
          </div>
        </Reveal>
      </section>

      <section>
        <div className="container-tight py-16 text-center">
          <Magnetic>
            <Link to="/contact" className="btn-cta">Book a discovery call</Link>
          </Magnetic>
        </div>
      </section>
    </PageShell>
  );
}
