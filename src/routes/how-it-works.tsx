import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";
import { TIERS } from "@/lib/tiers";
import { Reveal } from "@/components/motion";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works · Script & Scale" },
      { name: "description", content: "The cadence, what you get per tier, how a workshop actually runs." },
      { property: "og:title", content: "How Script & Scale works" },
      { property: "og:description", content: "Weekly, biweekly or monthly workshops. Scripts, SOPs, roleplay, call review." },
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  return (
    <PageShell>
      <section className="rule-b">
        <div className="container-tight py-20">
          <div className="eyebrow">How it works</div>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl tracking-tight md:text-7xl">
            Here’s exactly what happens in a workshop
          </h1>
          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            30 to 45 minutes. Not a lecture, a working session. We look at your live pipeline, build
            the script or SOP you need this week, and roleplay the objection you got yesterday. You
            leave with something you can use on your next call, not a slide deck you’ll never open
            again.
          </p>
        </div>
      </section>

      <section className="rule-b">
        <div className="container-tight py-16">
          <div className="mt-2 grid gap-8 md:grid-cols-4">
            {[
              ["Minutes 0 to 5", "Pipeline review", "Spot where deals are leaking. What moved, what stalled, what needs a nudge this week."],
              ["Minutes 5 to 20", "The work", "Build what you need now. Write the script, draft the follow-up sequence, fix what killed the last deal."],
              ["Minutes 20 to 35", "Roleplay", "Drill it until it's automatic. Run the objection you keep hitting until the response is muscle memory."],
              ["Minutes 35 to 45", "Action items", "Lock in accountability. Three things you'll do before we speak next. Logged in your portal."],
            ].map(([time, title, body], i) => (
              <Reveal key={title} delay={i * 0.17}>
                <div className="mono text-xs text-highlight">{time}</div>
                <div className="mt-2 font-serif text-xl">{title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="rule-b">
        <div className="container-tight py-16">
          <div className="eyebrow">By tier</div>
          <div className="mt-8 divide-y divide-rule border-y border-rule">
            {TIERS.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.08} className="grid gap-6 py-8 md:grid-cols-12">
                <div className="md:col-span-3">
                  <div className="font-serif text-2xl">{t.name}</div>
                  <div className="mono mt-1 text-sm text-muted-foreground">£{t.price}/mo · {t.cadence}</div>
                </div>
                <ul className="md:col-span-9 grid gap-2 text-sm md:grid-cols-2">
                  {t.includes.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-[0.3rem] block h-1 w-3 shrink-0 bg-highlight" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container-tight py-16">
          <h2 className="font-serif text-3xl">Between workshops</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Your portal holds every script, SOP and objection sheet we’ve built together, plus
            recordings of past workshops and, on Scale, the calls we reviewed. It’s a working library: searchable, versioned, yours to hand to a hire when one lands.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
