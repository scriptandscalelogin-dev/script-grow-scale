import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";
import { Reveal, Magnetic } from "@/components/motion";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "How payment works · Script & Scale" },
      { name: "description", content: "Every fee is invoiced in GBP and paid by bank transfer to a UK bank account. No card checkout. Here is exactly what is invoiced, and when." },
      { property: "og:title", content: "How payment works · Script & Scale" },
      { property: "og:description", content: "You get an invoice. You pay by bank transfer. Here is exactly what is invoiced, and when." },
      { property: "og:image", content: "https://scriptandscale.co.uk/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Payments,
});

const SCHEDULE = [
  {
    step: "Onboarding fee",
    amount: "£250",
    invoiced: "On your onboarding call",
    due: "On the call",
    note: "Covers portal setup and your first workshop. Non-refundable.",
  },
  {
    step: "Month 1 service fee",
    amount: "Your tier's monthly fee",
    invoiced: "Within 24 hours of the call",
    due: "Within 7 days of the invoice",
    note: "",
  },
  {
    step: "Months 2 and 3",
    amount: "Your tier's monthly fee",
    invoiced: "On the 1st of each month",
    due: "By the end of that month",
    note: "",
  },
  {
    step: "Month 4 onwards",
    amount: "Your tier's monthly fee",
    invoiced: "On the 1st of each month",
    due: "By the end of that month",
    note: "Rolls monthly until you cancel. See the Terms for notice.",
  },
];

const TOTALS = [
  { tier: "Opener", monthly: "£525", total: "£1,825" },
  { tier: "Closer", monthly: "£1,050", total: "£3,400" },
  { tier: "Rainmaker", monthly: "£2,100", total: "£6,550" },
];

function Payments() {
  return (
    <PageShell>
      <section className="border-y border-highlight/25 bg-highlight/8">
        <div className="container-tight py-24">
          <div className="eyebrow">How payment works</div>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl tracking-tight md:text-7xl">
            You get an invoice. You pay by bank transfer. That's it.
          </h1>
          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            No card checkout, no payment platform, no surprises. Every fee is invoiced in GBP and paid directly into a UK bank account. Here is exactly what gets invoiced, and when.
          </p>
        </div>
      </section>

      <section className="rule-b">
        <div className="container-tight py-16">
          <Reveal>
            <div className="eyebrow">What is invoiced, and when</div>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-rule text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-3 pr-4 font-medium">Invoice</th>
                    <th className="py-3 pr-4 font-medium">Amount</th>
                    <th className="py-3 pr-4 font-medium">Invoiced</th>
                    <th className="py-3 font-medium">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {SCHEDULE.map((r) => (
                    <tr key={r.step} className="border-b border-rule align-top">
                      <td className="py-4 pr-4">
                        <div className="font-medium">{r.step}</div>
                        {r.note && <div className="mt-1 text-xs text-muted-foreground">{r.note}</div>}
                      </td>
                      <td className="py-4 pr-4">{r.amount}</td>
                      <td className="py-4 pr-4">{r.invoiced}</td>
                      <td className="py-4">{r.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              On the call we say it plainly: the £250 onboarding is due today, the first month's service invoices tomorrow and is due within 7 days, and from month 2 invoices go out on the 1st and are due by the end of that month.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="rule-b">
        <div className="container-tight py-16">
          <Reveal className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="eyebrow">Your first three months</div>
            </div>
            <div className="md:col-span-8 space-y-5 text-base">
              <p>
                The £250 onboarding fee plus three monthly invoices, in full:
              </p>
              <ul className="space-y-3 text-sm">
                {TOTALS.map((t) => (
                  <li key={t.tier} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-3">
                    <span><span className="font-medium">{t.tier}</span> <span className="text-muted-foreground">(£250 + 3 × {t.monthly})</span></span>
                    <span className="mono">{t.total}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground">
                How the guarantee measures these fees against your closed deals is explained on the{" "}
                <Link to="/guarantee" className="underline">guarantee page</Link>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="rule-b">
        <div className="container-tight py-16">
          <Reveal className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="eyebrow">How you pay</div>
            </div>
            <div className="md:col-span-8 space-y-4 text-sm">
              <ul className="space-y-3">
                <li className="flex gap-3"><span className="mono text-highlight">·</span> Bank transfer in GBP into a UK bank account. The bank details are on every invoice.</li>
                <li className="flex gap-3"><span className="mono text-highlight">·</span> Use the invoice number as your payment reference, so we can match it.</li>
                <li className="flex gap-3"><span className="mono text-highlight">·</span> We do not take card payments and we do not hold your card details.</li>
                <li className="flex gap-3"><span className="mono text-highlight">·</span> Fees are agreed before you pay. The price you saw on the pricing page is the price on the invoice.</li>
              </ul>
              <div className="rounded-md border border-rule bg-card/60 p-5">
                <div className="font-medium">Check before you pay</div>
                <p className="mt-2 text-muted-foreground">
                  Bank details only ever arrive on an invoice from hello@scriptandscale.co.uk. If a message, email or call tells you our bank details have changed, do not pay it. Email us to check first.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="rule-b">
        <div className="container-tight py-16">
          <Reveal className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="eyebrow">If a payment is late</div>
            </div>
            <div className="md:col-span-8 space-y-4 text-sm">
              <p>
                An overdue invoice gets a reminder from day 1. If it is still unpaid at day 28, service is suspended. The full wording is in the{" "}
                <Link to="/terms" className="underline">Terms of service</Link>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="rule-b">
        <div className="container-tight py-16">
          <Reveal className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="eyebrow">Cancelling and refunds</div>
            </div>
            <div className="md:col-span-8 space-y-4 text-sm">
              <ul className="space-y-3">
                <li className="flex gap-3"><span className="mono text-highlight">·</span> Three months minimum, then monthly rolling.</li>
                <li className="flex gap-3"><span className="mono text-highlight">·</span> No cash refunds. The £250 onboarding fee is non-refundable.</li>
                <li className="flex gap-3"><span className="mono text-highlight">·</span> The guarantee gives you free months, not money back. See the <Link to="/guarantee" className="underline">guarantee</Link> and the <Link to="/refund-policy" className="underline">refund policy</Link>.</li>
              </ul>
              <p className="text-muted-foreground">
                Questions about an invoice? Email hello@scriptandscale.co.uk.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="container-tight py-16 text-center">
          <h2 className="font-serif text-3xl">Clear enough?</h2>
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
