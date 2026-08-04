import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/guarantee", label: "Guarantee" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Book a call" },
] as const;

export function SiteHeader() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="rule-b sticky top-0 z-40 bg-background/85 backdrop-blur">
      <div className="container-tight flex h-16 items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-serif text-xl">Script &amp; Scale</span>
          <span className="eyebrow hidden sm:inline">Revenue Enablement</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-sm text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
          {signedIn ? (
            <Link to="/portal" className="btn-primary">Portal</Link>
          ) : (
            <Link to="/auth" className="text-sm text-foreground underline-offset-4 hover:underline">
              Sign in
            </Link>
          )}
        </nav>
        <Link
          to={signedIn ? "/portal" : "/auth"}
          className="btn-primary md:hidden"
        >
          Portal
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="rule-t mt-24">
      <div className="container-tight grid gap-8 py-12 md:grid-cols-3">
        <div>
          <div className="font-serif text-lg">Script &amp; Scale</div>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Revenue enablement subscription for UK founder-led firms. Workshops, scripts, follow-up SOPs.
          </p>
        </div>
        <div>
          <div className="eyebrow">Site</div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-highlight">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="eyebrow">Client area</div>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><Link to="/auth" className="hover:text-highlight">Sign in</Link></li>
            <li className="text-muted-foreground">Accounts created by Script &amp; Scale.</li>
            <li className="pt-2"><Link to="/privacy" className="hover:text-highlight">Privacy policy</Link></li>
            <li><Link to="/terms" className="hover:text-highlight">Terms of service</Link></li>
          </ul>
        </div>
      </div>
      <div className="rule-t">
        <div className="container-tight flex flex-col items-start justify-between gap-2 py-5 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Script &amp; Scale Ltd.</div>
          <div className="mono">Direct sales, weekly reps, no fluff.</div>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
