import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/site-shell";
import { supabase } from "@/integrations/supabase/client";

type Submission = {
  id: string;
  name: string;
  email: string;
  company: string;
  company_type: string | null;
  message: string;
  handled: boolean;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/portal/inbox")({
  head: () => ({ meta: [{ title: "Inbox — Portal" }, { name: "robots", content: "noindex" }] }),
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", u.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!data) throw redirect({ to: "/portal" });
  },
  component: Inbox,
});

function Inbox() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [showHandled, setShowHandled] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    let q = supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!showHandled) q = q.eq("handled", false);
    const { data } = await q;
    setRows((data ?? []) as Submission[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [showHandled]);

  async function toggleHandled(id: string, handled: boolean) {
    await supabase.from("contact_submissions").update({ handled: !handled }).eq("id", id);
    load();
  }

  return (
    <PageShell>
      <section className="rule-b">
        <div className="container-tight flex items-center justify-between py-10">
          <div>
            <div className="eyebrow">Admin</div>
            <h1 className="mt-2 font-serif text-3xl">Contact inbox</h1>
          </div>
          <Link to="/portal" className="text-sm underline underline-offset-4">Back to portal</Link>
        </div>
      </section>
      <section>
        <div className="container-tight py-8">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showHandled}
              onChange={(e) => setShowHandled(e.target.checked)}
            />
            Show handled
          </label>

          {loading ? (
            <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              {showHandled ? "No submissions." : "Inbox zero. Nothing waiting."}
            </p>
          ) : (
            <ul className="mt-6 space-y-4">
              {rows.map((r) => (
                <li
                  key={r.id}
                  className={`rounded-md border p-5 ${r.handled ? "border-rule bg-background/40 opacity-70" : "border-rule bg-card"}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <div className="font-serif text-lg">{r.name}</div>
                      <div className="mono text-xs text-muted-foreground">
                        {r.company}
                        {r.company_type ? ` · ${r.company_type}` : ""} · {r.email}
                      </div>
                    </div>
                    <div className="mono text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString("en-GB")}
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm">{r.message}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <a href={`mailto:${r.email}`} className="btn-outline">Reply by email</a>
                    <button
                      onClick={() => toggleHandled(r.id, r.handled)}
                      className="text-xs underline underline-offset-4"
                    >
                      {r.handled ? "Mark as unhandled" : "Mark as handled"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </PageShell>
  );
}
