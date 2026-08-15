import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";
import { Reveal, Magnetic } from "@/components/motion";

export const Route = createFileRoute("/guarantee")({
  head: () => ({
    meta: [
      { title: "The guarantee · Script & Scale" },
      { name: "description", content: "Fee-recovery guarantee on the first three months. Attendance required. No cash refund. The mechanic, in plain English." },
      { property: "og:title", content: "The guarantee · Script & Scale" },
      { property: "og:description", content: "If closed deal value across your first three months doesn't cover fees paid, month four is free until it does." },
    ],
  }),
  component: Guarantee,
});

function Guarantee() {
  return (
    <PageShell>
      <section className="border-y border-highlight/25 bg-highlight/8">
        <div className="container-tight py-28">
          <div className="eyebrow">The guarantee</div>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl tracking-tight md:text-7xl">
            Your first three months pay for themselves. Or the next ones are on us.
          </h1>
          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            Most sales training sells you hope. We sell you a number. If the numbers don’t move, you
            don’t keep paying for nothing, you keep getting workshops until they do.
          </p>
        </div>
      </section>

      <section className="rule-b">
        <div className="container-tight py-16">
          <Reveal className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="eyebrow">The mechanic</div>
            </div>
            <div className="md:col-span-8 space-y-6 text-base">
              <p>
                At the end of month three we add up two numbers:
              </p>
              <ol className="mono list-decimal space-y-2 pl-6 text-sm">
                <li>Fees you paid Script &amp; Scale (subscription + onboarding).</li>
                <li>Closed deal value: deals that signed and started paying you, during those three months.</li>
              </ol>
              <p>
                If the fees are higher than the closed deal value, month four is free.
              </p>
              <p>
                If, after month four, we’re still not square, month five is free. And month six.
                Until closed deal value catches up with fees paid.
              </p>
              <p className="text-muted-foreground">
                No cash changes hands back. It’s time recovered, not money refunded. That’s deliberate. A cash refund lets both sides off the hook. Free months mean we keep working until it works.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="rule-b">
        <div className="container-tight py-16">
          <Reveal className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="eyebrow">What we ask</div>
            </div>
            <div className="md:col-span-8 space-y-5 text-base">
              <p>
                For the guarantee to apply you have to actually run the program. That means:
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3"><span className="mono text-highlight">·</span> Attend the workshops. Missing more than one in the three-month window voids it.</li>
                <li className="flex gap-3"><span className="mono text-highlight">·</span> Use the scripts and SOPs on real calls. Not read once and filed away.</li>
                <li className="flex gap-3"><span className="mono text-highlight">·</span> Log pipeline honestly in the portal: opportunities, deal values, outcomes.</li>
                <li className="flex gap-3"><span className="mono text-highlight">·</span> Actually be selling. If you paused business development for three months, the guarantee doesn’t apply.</li>
              </ul>
              <p className="text-muted-foreground">
                None of this is a trapdoor. If you show up and use what we build, the numbers usually
                land inside three months. The guarantee exists for the cases where they don’t.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="container-tight py-16 text-center">
          <h2 className="font-serif text-3xl">Fair enough?</h2>
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
