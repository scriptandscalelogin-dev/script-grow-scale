import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";
import { Reveal, Magnetic } from "@/components/motion";

export const Route = createFileRoute("/pay-on-results")({
  head: () => ({
    meta: [
      { title: "Pay on results · Script & Scale" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "No monthly fee. You only pay a share of what actually closes." },
    ],
  }),
  component: PayOnResults,
});

function PayOnResults() {
  return (
    <PageShell>
      <section className="border-y border-highlight/25 bg-highlight/8">
        <Reveal className="container-tight py-24">
          <div className="eyebrow">Not publicly listed. You were sent here.</div>
          <h1 className="mt-4 font-serif text-5xl tracking-tight sm:text-6xl md:text-7xl">
            Don't pay us a penny unless deals actually close.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground">
            This is the version for people who've heard sales pitches before and don't trust them.
            Fair. Here's the arrangement with nothing left for you to take on faith.
          </p>
        </Reveal>
      </section>

      <section className="rule-b">
        <Reveal className="container-tight grid gap-10 py-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="eyebrow">The arrangement</div>
            <h2 className="mt-3 font-serif text-3xl">No monthly fee. A share of what closes.</h2>
          </div>
          <div className="md:col-span-7 space-y-4 text-base">
            <p>
              Same workshops, same scripts, same roleplay, same weekly cadence as the Rainmaker tier.
              The difference is how it's paid for.
            </p>
            <p>
              Instead of a monthly fee, we take a percentage of the value of deals that close during
              the engagement, attributable to the process we build together. If nothing closes, we
              get nothing. There's still a one-off £250 onboarding fee, that's it for anything fixed.
            </p>
            <p className="text-sm text-muted-foreground">
              The percentage isn't published anywhere, it's a conversation. It depends on your deal
              size, your close rate, and how much of the process you're handing over. Bring your
              numbers and we'll land on something fair for both sides.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="rule-b bg-secondary/40">
        <Reveal className="container-tight grid gap-10 py-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="eyebrow">Why this exists</div>
            <h2 className="mt-3 font-serif text-3xl">Because the guarantee still asks you to trust a promise.</h2>
          </div>
          <div className="md:col-span-7 space-y-4 text-base">
            <p>
              The standard fee-recovery guarantee means if closed deal value doesn't cover what you
              paid, month four is free until it does. That's real, but it's still a promise about the
              future.
            </p>
            <p>
              This removes the promise entirely. There's no fee to recover because there's no fee
              upfront. If the process doesn't produce closed deals, there's simply nothing to pay for.
              The incentive to make this work isn't a guarantee we've written down, it's the only way
              we get paid.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="rule-b">
        <Reveal className="container-tight grid gap-10 py-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="eyebrow">The catch, honestly</div>
            <h2 className="mt-3 font-serif text-3xl">This only works with real attribution.</h2>
          </div>
          <div className="md:col-span-7 space-y-4 text-base">
            <p>
              We need visibility into what closes and roughly when, enough to say with a straight face
              that a given deal came through the process we built, not from something you were already
              going to close anyway. That means the KPI tracking and deal logging in the portal aren't
              optional here, they're the whole basis of what you'd owe.
            </p>
            <p>
              Same 3 month minimum, same attendance expectation as every other tier. The cadence
              doesn't get lighter just because the fee structure changed.
            </p>
          </div>
        </Reveal>
      </section>

      <section>
        <div className="container-tight py-20 text-center">
          <h2 className="font-serif text-3xl">If this is the arrangement that gets you to yes</h2>
          <p className="mt-3 text-sm text-muted-foreground">Let's talk specifics.</p>
          <div className="mt-6">
            <Magnetic>
              <Link to="/contact" className="btn-cta">Book a discovery call</Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
