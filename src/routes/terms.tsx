import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service · Script & Scale" },
      { name: "description", content: "The terms that govern Script & Scale subscriptions, the guarantee, and portal use." },
      { property: "og:title", content: "Terms of Service · Script & Scale" },
      { property: "og:description", content: "The terms that govern Script & Scale subscriptions, the guarantee, and portal use." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <PageShell>
      <section className="rule-b">
        <div className="container-tight py-14">
          <div className="eyebrow">Legal</div>
          <h1 className="mt-3 font-serif text-4xl">Terms of Service</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}.
          </p>
        </div>
      </section>

      <section>
        <div className="container-tight max-w-3xl space-y-8 py-12 text-[15px] leading-relaxed">
          <Disclaimer />

          <Block title="1. Who these terms are between">
            <p>
              These terms are between Script &amp; Scale Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;) and the
              business or individual who signs up for a subscription (&ldquo;you&rdquo;, the &ldquo;client&rdquo;).
              By starting a subscription you accept these terms.
            </p>
          </Block>

          <Block title="2. What we deliver">
            <p>
              A revenue enablement subscription with three tiers:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>Starter, £525/mo:</strong> one 30–45 min workshop per month, core script, top-10 objection library, recorded workshops.</li>
              <li><strong>Growth, £1,050/mo:</strong> everything in Starter, plus biweekly workshops, follow-up SOPs, weekly-relevant roleplay drills.</li>
              <li><strong>Scale, £2,100/mo:</strong> everything in Growth, plus weekly workshops, tonality coaching on real recordings, live call review.</li>
            </ul>
            <p>
              Fees are quoted in GBP, exclusive of VAT where applicable.
            </p>
          </Block>

          <Block title="3. Onboarding and commitment">
            <ul className="list-disc space-y-2 pl-5">
              <li>A one-off onboarding fee of £250 is payable before the first workshop.</li>
              <li>The minimum commitment is three (3) months from your start date.</li>
              <li>After the initial 3 months the subscription rolls monthly and can be cancelled with 30 days&rsquo; written notice.</li>
              <li>You can upgrade tier at any time; the new fee applies from the next billing cycle.</li>
            </ul>
          </Block>

          <Block title="4. Payment">
            <ul className="list-disc space-y-2 pl-5">
              <li>Monthly fees are invoiced in advance on the same day of the month as your start date.</li>
              <li>Payment is due within 7 days of invoice date.</li>
              <li>Overdue accounts may be paused. Access to the portal, workshops, and content library is suspended until the account is settled.</li>
            </ul>
          </Block>

          <Block title="5. The guarantee">
            <p>
              If, by the end of your first three months, the deal value logged into the portal for that period
              does not cover the fees you have paid us for those three months (i.e. 3 × monthly fee), your
              fourth month is free.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>&ldquo;Deal value&rdquo; means closed-won revenue logged in the portal against your account within the 3-month window from your start date.</li>
              <li>You are responsible for logging deals accurately and on time. Deals not logged inside the window do not count.</li>
              <li>The guarantee applies once per client, to the first 3-month window only.</li>
              <li>The guarantee does not apply if attendance drops below 75% of scheduled workshops in the 3-month window, or if you fail to complete agreed action items between sessions.</li>
              <li>The one-off £250 onboarding fee is not covered by the guarantee and is non-refundable.</li>
            </ul>
          </Block>

          <Block title="6. Client responsibilities">
            <ul className="list-disc space-y-2 pl-5">
              <li>Attend booked workshops or reschedule with at least 24 hours&rsquo; notice.</li>
              <li>Keep your client profile, deals, and KPIs up to date in the portal.</li>
              <li>Keep portal login details confidential and use them only for your own team.</li>
            </ul>
          </Block>

          <Block title="7. Content and IP">
            <ul className="list-disc space-y-2 pl-5">
              <li>Scripts, SOPs and objection sheets we produce for you are licensed for internal use by your business for as long as you are an active subscriber.</li>
              <li>The underlying frameworks, templates and methods remain our IP and may not be resold, redistributed, or used to train third-party AI systems.</li>
              <li>Roleplay recordings you upload remain yours; we use them solely to coach you.</li>
            </ul>
          </Block>

          <Block title="8. Confidentiality">
            <p>
              We treat commercial information you share with us as confidential and do not disclose it to third
              parties, except sub-processors listed in our Privacy Policy or where required by law.
            </p>
          </Block>

          <Block title="9. Cancellation">
            <ul className="list-disc space-y-2 pl-5">
              <li>After the initial 3-month term you can cancel with 30 days&rsquo; notice by email.</li>
              <li>No pro-rata refunds are given for the notice month.</li>
              <li>On cancellation we retain your data as described in the Privacy Policy; deletion can be requested.</li>
            </ul>
          </Block>

          <Block title="10. Liability">
            <p>
              We provide the service on a best-efforts basis. We do not guarantee any specific revenue outcome
              other than the specific guarantee described in clause 5. To the maximum extent permitted by law,
              our total liability in any 12-month period is limited to the fees paid by you in that period.
            </p>
          </Block>

          <Block title="11. Changes to these terms">
            <p>
              We may update these terms occasionally. Material changes will be emailed to active clients at
              least 14 days before they take effect.
            </p>
          </Block>

          <Block title="12. Governing law">
            <p>
              These terms are governed by the laws of England &amp; Wales. Disputes are subject to the exclusive
              jurisdiction of the courts of England &amp; Wales.
            </p>
          </Block>
        </div>
      </section>
    </PageShell>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-muted-foreground">{children}</div>
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="rounded-md border border-highlight/40 bg-card p-4 text-sm">
      <div className="eyebrow text-highlight">Draft · not legal advice</div>
      <p className="mt-2">
        This is a plain-language template based on the offer already described on the Pricing and Guarantee pages.
        It is <strong>not</strong> a finished legal contract. Have a UK solicitor review it before you rely on it publicly
        or ask clients to sign it.
      </p>
    </div>
  );
}
