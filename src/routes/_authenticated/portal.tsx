import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/site-shell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({
    meta: [
      { title: "Portal — Script & Scale" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Portal,
});

function Portal() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      setEmail(userData.user?.email ?? null);
      if (userData.user) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userData.user.id)
          .eq("role", "admin")
          .maybeSingle();
        setIsAdmin(!!data);
      }
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <PageShell>
      <section className="rule-b">
        <div className="container-tight py-16">
          <div className="eyebrow">Portal</div>
          <h1 className="mt-3 font-serif text-4xl">Welcome{email ? `, ${email}` : ""}.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            The full portal — dashboard, scripts, SOPs, objection sheets, roleplays, KPIs — lands in
            the next build. This shell confirms sign-in works and your role is set.
          </p>
          <div className="mt-6 flex gap-3">
            {isAdmin && (
              <span className="rounded-md border border-highlight px-3 py-1 text-xs text-highlight">
                Admin
              </span>
            )}
            <button onClick={signOut} className="btn-outline">Sign out</button>
          </div>
        </div>
      </section>

      <section>
        <div className="container-tight grid gap-6 py-12 md:grid-cols-3">
          {[
            ["Coming next", "Client dashboard", "Tier, next workshop, guarantee progress bar."],
            ["Coming next", "Content library", "Scripts, SOPs, objection sheets, search + version history."],
            ["Coming next", "Sessions & KPIs", "Workshop log, roleplay uploads, monthly KPI submission."],
          ].map(([e, t, b]) => (
            <div key={t} className="rounded-md border border-rule bg-card p-6">
              <div className="eyebrow">{e}</div>
              <div className="mt-2 font-serif text-xl">{t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
