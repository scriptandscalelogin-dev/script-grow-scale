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

type MiniDiagnosticLead = {
  id: string;
  opportunities: number;
  close_rate: number;
  avg_deal_value: number;
  why_deals_dont_close: string;
  dead_pipeline_value: number;
  email: string | null;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/portal/inbox")({
  head: () => ({ meta: [{ title: "Inbox · Portal" }, { name: "robots", content: "noindex" }] }),
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
  const [leads, setLeads] = useState<MiniDiagnosticLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);

  async function loadLeads() {
    const { data } = await supabase
      .from("mini_diagnostic_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    setLeads((data ?? []) as MiniDiagnosticLead[]);
    setLeadsLoading(false);
  }

  useEffect(() => {
    loadLeads();
  }, []);

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

      <section className="rule-t">
        <div className="container-tight py-10">
          <div className="eyebrow">Website mini-diagnostic leads ({leads.length})</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Anyone who ran the four-question diagnostic on the homepage, most recent first.
          </p>
          {leadsLoading ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
          ) : leads.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">None yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {leads.map((l) => (
                <li key={l.id} className="rounded-md border border-rule bg-card p-4 text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div className="font-medium">
                      {l.email || "No email left"} · £{l.dead_pipeline_value.toLocaleString("en-GB")} pipeline
                    </div>
                    <div className="mono text-xs text-muted-foreground">
                      {new Date(l.created_at).toLocaleString("en-GB")}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {l.opportunities} opportunities/mo · {l.close_rate}% close rate · £{l.avg_deal_value.toLocaleString("en-GB")} avg deal
                  </div>
                  <p className="mt-2 whitespace-pre-wrap">{l.why_deals_dont_close}</p>
                  {l.email && (
                    <a href={`mailto:${l.email}`} className="btn-outline mt-3 inline-block text-xs">
                      Reply by email
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </PageShell>
  );
}
