import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy · Script & Scale" },
      { name: "description", content: "How refunds, the fee-recovery guarantee, and cancellations work at Script & Scale." },
      { property: "og:title", content: "Refund Policy · Script & Scale" },
      { property: "og:description", content: "How refunds, the fee-recovery guarantee, and cancellations work at Script & Scale." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RefundPolicy,
});

function RefundPolicy() {
  return (
    <PageShell>
      <section className="rule-b">
        <div className="container-tight py-14">
          <div className="eyebrow">Legal</div>
          <h1 className="mt-3 font-serif text-4xl">Refund Policy</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}.
          </p>
        </div>
      </section>

      <section>
        <div className="container-tight max-w-3xl space-y-8 py-12 text-[15px] leading-relaxed">
          <Disclaimer />

          <Block title="No cash refunds">
            <p>
              2026 Script &amp; Scale - Sole Proprietor does not offer cash refunds on subscription fees or the onboarding fee. Instead
              of a refund, we back the service with a fee-recovery guarantee, described below and in full on our{" "}
              <a className="underline underline-offset-4" href="/guarantee">Guarantee page</a>.
            </p>
          </Block>

          <Block title="The fee-recovery guarantee">
            <p>
              If, by the end of your first three months, the deal value you&rsquo;ve logged in the portal doesn&rsquo;t
              cover the fees you&rsquo;ve paid for that period, your fourth month is free, and every month after that
              until it does. This applies only if you attended the scheduled workshops and completed agreed action
              items between sessions. Full terms are set out in clause 5 of our{" "}
              <a className="underline underline-offset-4" href="/terms">Terms of Service</a>.
            </p>
          </Block>

          <Block title="Onboarding fee">
            <p>
              The one-off £250 onboarding fee is non-refundable under any circumstances, including under the
              fee-recovery guarantee.
            </p>
          </Block>

          <Block title="Cancellation">
            <p>
              After your initial three-month commitment, you can cancel with 30 days&rsquo; written notice. No
              pro-rata refund is given for the notice month itself, you retain access and continue receiving
              workshops for the notice period you&rsquo;ve already paid for.
            </p>
          </Block>

          <Block title="Billing errors">
            <p>
              If you believe you&rsquo;ve been charged in error, e.g. duplicate billing or a charge after
              cancellation was confirmed, contact us within 14 days and we will investigate and correct genuine
              errors, including refunding the erroneous amount where appropriate. This is separate from, and
              does not affect, the no-cash-refund policy above.
            </p>
          </Block>

          <Block title="Questions">
            <p>
              Email <a className="underline underline-offset-4" href="mailto:hello@scriptandscale.co.uk">hello@scriptandscale.co.uk</a> for
              anything related to billing, the guarantee, or this policy.
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
        This is a plain-language template consistent with the Terms of Service and Guarantee pages. It is{" "}
        <strong>not</strong> a finished legal document and should be reviewed by a UK solicitor before you rely
        on it publicly.
      </p>
    </div>
  );
}