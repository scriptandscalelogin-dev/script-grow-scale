import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy · Script & Scale" },
      { name: "description", content: "How Script & Scale collects, stores, and handles your data." },
      { property: "og:title", content: "Privacy Policy · Script & Scale" },
      { property: "og:description", content: "How Script & Scale collects, stores, and handles your data." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <PageShell>
      <section className="rule-b">
        <div className="container-tight py-14">
          <div className="eyebrow">Legal</div>
          <h1 className="mt-3 font-serif text-4xl">Privacy Policy</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}.
          </p>
        </div>
      </section>

      <section>
        <div className="container-tight max-w-3xl space-y-8 py-12 text-[15px] leading-relaxed">
          <Disclaimer />

          <Block title="Who we are">
            <p>
              2026 Script &amp; Scale - Sole Proprietor (&ldquo;we&rdquo;, &ldquo;us&rdquo;) provides a revenue enablement
              subscription to UK small businesses. This policy explains what data we collect when you
              use our website (<span className="mono">scriptandscale.co.uk</span>) and the client portal.
            </p>
            <p>
              Questions or data requests: <a className="underline underline-offset-4" href="mailto:hello@scriptandscale.co.uk">hello@scriptandscale.co.uk</a>.
            </p>
          </Block>

          <Block title="What we collect">
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>Contact enquiries:</strong> name, company, email, and message when you submit the contact form.</li>
              <li><strong>Client profile:</strong> full name, company, email, phone number, tier, monthly fee, start date, status, and internal notes.</li>
              <li><strong>Account credentials:</strong> email and password (hashed) for portal sign-in.</li>
              <li><strong>Deal data:</strong> deal titles and values (GBP) you log against the 3-month guarantee.</li>
              <li><strong>KPI figures:</strong> monthly opportunities, average deal value, estimated close rate, closed deal value, and dead pipeline value.</li>
              <li><strong>Workshop and session data:</strong> attendance, topics covered, action items, and internal notes.</li>
              <li><strong>Roleplay recordings:</strong> audio or video files uploaded for coaching, plus your notes.</li>
              <li><strong>Payment status:</strong> whether your subscription is active, paused, or ended. We do not store card numbers.</li>
              <li><strong>Activity log:</strong> sign-in timestamps and which library items you open, so your coach can see engagement.</li>
            </ul>
          </Block>

          <Block title="Why we collect it">
            <p>
              To deliver the service: run workshops, track your progress against the guarantee, assign scripts and
              SOPs to you, review recordings, invoice you, and reply when you contact us. We do not use your data
              for advertising and do not sell it to anyone.
            </p>
          </Block>

          <Block title="How it is stored">
            <p>
              Application data lives in a managed Supabase (Postgres) database, and roleplay files live in
              Supabase Storage. Access is restricted with row-level security so each client can only see their
              own data, and admin access is limited to Script &amp; Scale staff. Data centres are located in
              the EU/UK region.
            </p>
          </Block>

          <Block title="Who we share it with">
            <p>
              Only the sub-processors we need to run the service:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Supabase (database, auth, storage)</li>
              <li>Our email provider, when you receive a portal invite or password reset link</li>
              <li>Our payment processor, if you are on a paid subscription</li>
              <li>Cal.com (booking/scheduling): processes your name, email, and meeting details when you book a call. Cal.com is US-hosted; transfers from the UK are covered by Cal.com&rsquo;s Data Processing Agreement and Standard Contractual Clauses.</li>
            </ul>
            <p>
              We do not share your data with third-party marketers, analytics networks, or data brokers.
            </p>
          </Block>

          <Block title="How long we keep it">
            <p>
              For as long as you are a client, plus a reasonable window afterwards for accounting and legal
              obligations (typically up to 6 years for financial records). Roleplay recordings are kept only
              while they are useful for coaching and can be deleted on request at any time.
            </p>
          </Block>

          <Block title="Your rights">
            <p>Under UK GDPR you can:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Ask for a copy of the data we hold on you</li>
              <li>Ask us to correct anything that&rsquo;s wrong</li>
              <li>Ask us to delete your account and associated data</li>
              <li>Withdraw consent for optional processing at any time</li>
            </ul>
            <p>
              To request deletion, email <a className="underline underline-offset-4" href="mailto:hello@scriptandscale.co.uk">hello@scriptandscale.co.uk</a> from the address on
              your account. We will delete profile, deal, KPI, workshop, and roleplay data within 30 days.
              We may keep minimal invoice records for tax purposes.
            </p>
          </Block>

          <Block title="Cookies">
            <p>
              We use only functional cookies required to keep you signed in to the portal. No advertising or
              third-party tracking cookies.
            </p>
          </Block>

          <Block title="Changes">
            <p>
              If we materially change this policy we&rsquo;ll email active clients before the change takes effect.
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
        This is a plain-language template written from what the app actually collects. It is <strong>not</strong> a
        finished legal document and should be reviewed by a UK solicitor before you rely on it publicly.
      </p>
    </div>
  );
}
