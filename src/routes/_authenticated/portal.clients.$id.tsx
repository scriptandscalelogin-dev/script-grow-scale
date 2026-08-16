import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/site-shell";
import { supabase } from "@/integrations/supabase/client";
import { TIERS } from "@/lib/tiers";
import { sendPasswordResetForClient } from "@/lib/clients.functions";
import { formatActivity } from "@/lib/activity";
import { LeakLedger } from "@/components/leak-ledger";
import { ClientScriptEditor } from "@/components/client-script-editor";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  tier: "opener" | "closer" | "rainmaker" | null;
  monthly_fee: number | null;
  start_date: string | null;
  status: "active" | "paused" | "ended";
  notes: string | null;
};

type Deal = { id: string; title: string; value_gbp: number; closed_at: string };

type Session = {
  id: string;
  session_date: string;
  covered: string | null;
  action_items: string | null;
  attended: boolean;
  notes: string | null;
};

type Roleplay = {
  id: string;
  title: string;
  recorded_on: string;
  storage_path: string;
  mime_type: string | null;
  notes: string | null;
  session_id: string | null;
};

type Kpi = {
  id: string;
  month: string;
  opportunities: number;
  avg_deal_value: number;
  close_rate_est: number;
  closed_deal_value: number;
  dead_pipeline_value: number;
  notes: string | null;
};

export const Route = createFileRoute("/_authenticated/portal/clients/$id")({
  head: () => ({ meta: [{ title: "Client · Portal" }, { name: "robots", content: "noindex" }] }),
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
  component: ClientDetail,
});

function ClientDetail() {
  const { id } = Route.useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [roleplays, setRoleplays] = useState<Roleplay[]>([]);
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [dealTitle, setDealTitle] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [dealDate, setDealDate] = useState(() => new Date().toISOString().slice(0, 10));

  async function load() {
    const [{ data: p }, { data: d }, { data: s }, { data: r }, { data: k }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id,email,full_name,company,phone,tier,monthly_fee,start_date,status,notes")
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("deals")
        .select("id,title,value_gbp,closed_at")
        .eq("profile_id", id)
        .order("closed_at", { ascending: false }),
      supabase
        .from("workshop_sessions")
        .select("id,session_date,covered,action_items,attended,notes")
        .eq("client_id", id)
        .order("session_date", { ascending: false }),
      supabase
        .from("roleplay_recordings")
        .select("id,title,recorded_on,storage_path,mime_type,notes,session_id")
        .eq("client_id", id)
        .order("recorded_on", { ascending: false }),
      supabase
        .from("kpi_entries")
        .select("id,month,opportunities,avg_deal_value,close_rate_est,closed_deal_value,dead_pipeline_value,notes")
        .eq("client_id", id)
        .order("month", { ascending: false }),
    ]);
    setProfile(p as Profile | null);
    setDeals((d ?? []) as Deal[]);
    setSessions((s ?? []) as Session[]);
    setRoleplays((r ?? []) as Roleplay[]);
    setKpis((k ?? []) as Kpi[]);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMsg(null);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        company: profile.company,
        phone: profile.phone,
        tier: profile.tier,
        monthly_fee: profile.monthly_fee,
        start_date: profile.start_date,
        status: profile.status,
        notes: profile.notes,
      })
      .eq("id", profile.id);
    setSaving(false);
    setMsg(error ? error.message : "Saved.");
  }

  async function addDeal(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(dealValue);
    if (!dealTitle || !Number.isFinite(value) || value < 0) return;
    const { error } = await supabase.from("deals").insert({
      profile_id: id,
      title: dealTitle,
      value_gbp: value,
      closed_at: dealDate,
    });
    if (!error) {
      setDealTitle("");
      setDealValue("");
      setDealDate(new Date().toISOString().slice(0, 10));
      load();
    } else {
      setMsg(error.message);
    }
  }

  async function deleteDeal(dealId: string) {
    if (!confirm("Delete this deal?")) return;
    await supabase.from("deals").delete().eq("id", dealId);
    load();
  }

  function applyTierDefault(tierId: "opener" | "closer" | "rainmaker") {
    const t = TIERS.find((x) => x.id === tierId);
    setProfile((p) => (p ? { ...p, tier: tierId, monthly_fee: t?.price ?? p.monthly_fee } : p));
  }

  if (!profile) {
    return (
      <PageShell>
        <div className="container-tight py-16 text-sm text-muted-foreground">Loading…</div>
      </PageShell>
    );
  }

  const fee = Number(profile.monthly_fee ?? 0);
  const target = fee * 3;
  const start = profile.start_date ? new Date(profile.start_date) : null;
  const windowEnd = start ? new Date(start) : null;
  if (windowEnd) windowEnd.setMonth(windowEnd.getMonth() + 3);
  const logged = deals
    .filter((d) => {
      if (!start || !windowEnd) return false;
      const c = new Date(d.closed_at);
      return c >= start && c < windowEnd;
    })
    .reduce((s, d) => s + Number(d.value_gbp), 0);

  return (
    <PageShell>
      <section className="rule-b">
        <div className="container-tight grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 py-10 sm:flex sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="eyebrow">Client</div>
            <h1 className="mt-2 font-serif text-2xl sm:text-3xl break-words">{profile.full_name || profile.email}</h1>
            <div className="mono mt-1 text-xs text-muted-foreground truncate">{profile.email}</div>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-2">
            <SendResetButton email={profile.email ?? ""} />
            <Link to="/portal/clients" className="text-sm underline underline-offset-4">All clients</Link>
          </div>
        </div>
      </section>

      

      <section>
        <div className="container-tight grid gap-8 py-10 md:grid-cols-2">
          <form onSubmit={save} className="space-y-4">
            <div className="eyebrow">Profile</div>
            <Field label="Full name">
              <input
                className={inp}
                value={profile.full_name ?? ""}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              />
            </Field>
            <Field label="Company">
              <input
                className={inp}
                value={profile.company ?? ""}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              />
            </Field>
            <Field label="Phone">
              <input
                className={inp}
                value={profile.phone ?? ""}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tier">
                <select
                  className={inp}
                  value={profile.tier ?? ""}
                  onChange={(e) => applyTierDefault(e.target.value as "opener" | "closer" | "rainmaker")}
                >
                  <option value="">-</option>
                  {TIERS.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} (£{t.price})</option>
                  ))}
                </select>
              </Field>
              <Field label="Monthly fee (£)">
                <input
                  className={inp}
                  type="number"
                  min="0"
                  step="1"
                  value={profile.monthly_fee ?? ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      monthly_fee: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Start date">
                <input
                  className={inp}
                  type="date"
                  value={profile.start_date ?? ""}
                  onChange={(e) => setProfile({ ...profile, start_date: e.target.value || null })}
                />
              </Field>
              <Field label="Status">
                <select
                  className={inp}
                  value={profile.status}
                  onChange={(e) =>
                    setProfile({ ...profile, status: e.target.value as Profile["status"] })
                  }
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="ended">Ended</option>
                </select>
              </Field>
            </div>
            <Field label="Internal notes (not shown to client)">
              <textarea
                rows={4}
                className={inp}
                value={profile.notes ?? ""}
                onChange={(e) => setProfile({ ...profile, notes: e.target.value })}
              />
            </Field>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving…" : "Save"}
              </button>
              {msg && <span className="text-xs text-muted-foreground">{msg}</span>}
            </div>
          </form>

          <div className="space-y-6">
            <div className="rounded-md border border-rule bg-card p-5">
              <div className="eyebrow">Guarantee</div>
              <div className="mt-2 font-serif text-2xl">
                £{logged.toLocaleString()}{" "}
                <span className="text-sm text-muted-foreground">
                  of £{target.toLocaleString()}
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full border border-rule bg-background">
                <div
                  className="h-full bg-foreground/70"
                  style={{ width: `${target > 0 ? Math.min(100, (logged / target) * 100) : 0}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Deals in the 3-month window from start date count toward the guarantee.
              </p>
            </div>

            <form onSubmit={addDeal} className="rounded-md border border-rule bg-card p-5 space-y-3">
              <div className="eyebrow">Log deal</div>
              <input
                className={inp}
                placeholder="Deal title / client"
                value={dealTitle}
                onChange={(e) => setDealTitle(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className={inp}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Value £"
                  value={dealValue}
                  onChange={(e) => setDealValue(e.target.value)}
                  required
                />
                <input
                  className={inp}
                  type="date"
                  value={dealDate}
                  onChange={(e) => setDealDate(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">Add deal</button>
            </form>

            <div>
              <div className="eyebrow">Deals ({deals.length})</div>
              {deals.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">No deals logged.</p>
              ) : (
                <ul className="mt-3 divide-y divide-rule rounded-md border border-rule bg-card">
                  {deals.map((d) => (
                    <li key={d.id} className="flex items-center justify-between px-4 py-3 text-sm">
                      <div>
                        <div className="font-medium">{d.title}</div>
                        <div className="mono text-xs text-muted-foreground">
                          {new Date(d.closed_at).toLocaleDateString("en-GB")}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="mono">£{Number(d.value_gbp).toLocaleString()}</span>
                        <button
                          onClick={() => deleteDeal(d.id)}
                          className="text-xs text-muted-foreground hover:text-destructive"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <SessionsPanel clientId={id} sessions={sessions} reload={load} />
      <RoleplaysPanel
        clientId={id}
        roleplays={roleplays}
        sessions={sessions}
        reload={load}
        isAdmin={true}
      />
      <KpisPanel clientId={id} kpis={kpis} reload={load} isAdmin={true} />
      <ClientScriptPanel clientId={id} />
      <DiagnosticPanel clientId={id} />
      <ActivityPanel clientId={id} />
    </PageShell>
  );
}

/* ------------------------- Send-reset button ------------------------- */

function SendResetButton({ email }: { email: string }) {
  const send = useServerFn(sendPasswordResetForClient);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  async function onClick() {
    if (!email) return;
    if (!confirm(`Send password reset email to ${email}?`)) return;
    setBusy(true);
    setMsg(null);
    try {
      await send({
        data: {
          email,
          redirect_to: `${window.location.origin}/reset-password`,
        },
      });
      setMsg("Reset email sent.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="text-right">
      <button onClick={onClick} disabled={busy || !email} className="btn-outline text-xs">
        {busy ? "Sending…" : "Send password reset"}
      </button>
      {msg && <div className="mt-1 text-xs text-muted-foreground">{msg}</div>}
    </div>
  );
}

/* ------------------------- Client's own script ------------------------- */

function ClientScriptPanel({ clientId }: { clientId: string }) {
  return (
    <section className="rule-t">
      <div className="container-tight py-10">
        <div className="eyebrow">Their sales script</div>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Configure this client's own pitch, offer, objections, and close. Once saved, it shows up
          in their portal as their own version of the call script tool, with an export they keep
          forever.
        </p>
        <div className="mt-4">
          <ClientScriptEditor clientId={clientId} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------- Sales diagnostic ------------------------- */

type DiagnosticSubmission = {
  id: string;
  submitted_at: string;
  answers: Record<string, string>;
};

function DiagnosticPanel({ clientId }: { clientId: string }) {
  const [rows, setRows] = useState<DiagnosticSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("diagnostic_submissions")
        .select("id,submitted_at,answers")
        .eq("client_id", clientId)
        .order("submitted_at", { ascending: false });
      setRows((data ?? []) as DiagnosticSubmission[]);
      setLoading(false);
    })();
  }, [clientId]);

  return (
    <section className="rule-t">
      <div className="container-tight py-10">
        <div className="eyebrow">Sales diagnostic</div>
        {loading ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No diagnostic submissions yet. They can run this themselves from their own portal home.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {rows.map((r) => (
              <li key={r.id} className="rounded-md border border-rule bg-card p-4 text-sm">
                <div className="mono text-xs text-muted-foreground">
                  {new Date(r.submitted_at).toLocaleString("en-GB")}
                </div>
                <dl className="mt-2 space-y-2">
                  {Object.entries(r.answers).map(([q, a]) => (
                    <div key={q}>
                      <dt className="text-xs text-muted-foreground">{q}</dt>
                      <dd className="whitespace-pre-wrap break-words">{a || "none given"}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ------------------------- Activity ------------------------- */

type ActivityRow = {
  id: string;
  event_type: string;
  target_kind: string | null;
  target_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

function ActivityPanel({ clientId }: { clientId: string }) {
  const [rows, setRows] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("activity_log")
        .select("id,event_type,target_kind,target_id,metadata,created_at")
        .eq("user_id", clientId)
        .order("created_at", { ascending: false })
        .limit(20);
      setRows((data ?? []) as ActivityRow[]);
      setLoading(false);
    })();
  }, [clientId]);

  const lastLogin = rows.find((r) => r.event_type === "login")?.created_at ?? null;
  const lastView = rows.find((r) => r.event_type === "view_content");

  return (
    <section className="rule-t">
      <div className="container-tight py-10">
        <div className="eyebrow">Activity</div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-rule bg-card p-4 text-sm">
            <div className="eyebrow">Last sign-in</div>
            <div className="mt-2 font-serif text-xl">
              {lastLogin ? new Date(lastLogin).toLocaleString("en-GB") : "Never"}
            </div>
          </div>
          <div className="rounded-md border border-rule bg-card p-4 text-sm">
            <div className="eyebrow">Last content view</div>
            <div className="mt-2 font-serif text-xl break-words">
              {lastView
                ? `${lastView.target_kind ?? "content"}: ${(lastView.metadata?.title as string) ?? "-"}`
                : "None yet"}
            </div>
            <div className="mono mt-1 text-xs text-muted-foreground">
              {lastView ? new Date(lastView.created_at).toLocaleString("en-GB") : ""}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="eyebrow">Recent events ({rows.length})</div>
          {loading ? (
            <p className="mt-2 text-sm text-muted-foreground">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No activity recorded yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-rule rounded-md border border-rule bg-card">
              {rows.map((r) => (
                <li key={r.id} className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <span className="break-words">{formatActivity(r)}</span>
                  <span className="mono shrink-0 text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("en-GB")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------- Sessions ------------------------- */

export function SessionsPanel({
  clientId,
  sessions,
  reload,
}: {
  clientId: string;
  sessions: Session[];
  reload: () => void;
}) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [covered, setCovered] = useState("");
  const [action, setAction] = useState("");
  const [attended, setAttended] = useState(true);
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const { error } = await supabase.from("workshop_sessions").insert({
      client_id: clientId,
      session_date: date,
      covered: covered || null,
      action_items: action || null,
      attended,
      notes: notes || null,
    });
    if (error) return setErr(error.message);
    setCovered("");
    setAction("");
    setNotes("");
    setAttended(true);
    reload();
  }

  async function del(sid: string) {
    if (!confirm("Delete this session?")) return;
    await supabase.from("workshop_sessions").delete().eq("id", sid);
    reload();
  }

  return (
    <section className="rule-t">
      <div className="container-tight grid gap-8 py-10 md:grid-cols-2">
        <form onSubmit={add} className="space-y-3 rounded-md border border-rule bg-card p-5">
          <div className="eyebrow">Log workshop session</div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input className={inp} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </Field>
            <Field label="Attended">
              <select
                className={inp}
                value={attended ? "y" : "n"}
                onChange={(e) => setAttended(e.target.value === "y")}
              >
                <option value="y">Yes</option>
                <option value="n">No</option>
              </select>
            </Field>
          </div>
          <Field label="Covered">
            <textarea rows={2} className={inp} value={covered} onChange={(e) => setCovered(e.target.value)} />
          </Field>
          <Field label="Action items">
            <textarea rows={2} className={inp} value={action} onChange={(e) => setAction(e.target.value)} />
          </Field>
          <Field label="Internal notes">
            <textarea rows={2} className={inp} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
          <button type="submit" className="btn-primary w-full">Add session</button>
          {err && <div className="text-xs text-destructive">{err}</div>}
        </form>

        <div>
          <div className="eyebrow">Sessions ({sessions.length})</div>
          {sessions.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No sessions logged.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {sessions.map((s) => (
                <li key={s.id} className="rounded-md border border-rule bg-card p-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="mono text-xs text-muted-foreground">
                      {new Date(s.session_date).toLocaleDateString("en-GB")} · {s.attended ? "attended" : "missed"}
                    </div>
                    <button
                      onClick={() => del(s.id)}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Delete
                    </button>
                  </div>
                  {s.covered && (
                    <div className="mt-2">
                      <div className="eyebrow">Covered</div>
                      <div className="whitespace-pre-wrap">{s.covered}</div>
                    </div>
                  )}
                  {s.action_items && (
                    <div className="mt-2">
                      <div className="eyebrow">Action items</div>
                      <div className="whitespace-pre-wrap">{s.action_items}</div>
                    </div>
                  )}
                  {s.notes && (
                    <div className="mt-2">
                      <div className="eyebrow">Notes</div>
                      <div className="whitespace-pre-wrap text-muted-foreground">{s.notes}</div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------- Roleplays ------------------------- */

export function RoleplaysPanel({
  clientId,
  roleplays,
  sessions,
  reload,
  isAdmin,
}: {
  clientId: string;
  roleplays: Roleplay[];
  sessions: Session[];
  reload: () => void;
  isAdmin: boolean;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [file, setFile] = useState<File | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!file || !title) return setErr("Title and file required.");
    setUploading(true);
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${clientId}/${Date.now()}-${safe}`;
    const { error: upErr } = await supabase.storage.from("roleplays").upload(path, file, {
      contentType: file.type || undefined,
      upsert: false,
    });
    if (upErr) {
      setUploading(false);
      return setErr(`Upload failed: ${upErr.message}`);
    }
    const { error: insErr } = await supabase.from("roleplay_recordings").insert({
      client_id: clientId,
      session_id: sessionId || null,
      title,
      recorded_on: date,
      storage_path: path,
      mime_type: file.type || null,
      notes: notes || null,
    });
    setUploading(false);
    if (insErr) return setErr(`Record insert failed: ${insErr.message}`);
    setTitle("");
    setFile(null);
    setSessionId("");
    setNotes("");
    (document.getElementById("rp-file") as HTMLInputElement | null)?.value &&
      ((document.getElementById("rp-file") as HTMLInputElement).value = "");
    reload();
  }

  async function play(path: string, mime: string | null) {
    const { data, error } = await supabase.storage.from("roleplays").createSignedUrl(path, 3600);
    if (error || !data) return alert(`Signed URL failed: ${error?.message ?? "unknown"}`);
    const w = window.open("", "_blank");
    if (!w) return;
    const isVideo = (mime ?? "").startsWith("video");
    const tag = isVideo
      ? `<video controls autoplay style="width:100%;max-width:960px"><source src="${data.signedUrl}" type="${mime ?? ""}"></video>`
      : `<audio controls autoplay src="${data.signedUrl}" style="width:100%"></audio><p style="margin-top:12px"><a href="${data.signedUrl}">Download</a></p>`;
    w.document.write(
      `<html><head><title>Roleplay</title></head><body style="background:#111;color:#eee;font-family:system-ui;padding:24px">${tag}</body></html>`,
    );
    w.document.close();
  }

  async function del(r: Roleplay) {
    if (!confirm(`Delete "${r.title}" and its file?`)) return;
    await supabase.storage.from("roleplays").remove([r.storage_path]);
    await supabase.from("roleplay_recordings").delete().eq("id", r.id);
    reload();
  }

  return (
    <section className="rule-t">
      <div className="container-tight grid gap-8 py-10 md:grid-cols-2">
        {isAdmin ? (
          <form onSubmit={upload} className="space-y-3 rounded-md border border-rule bg-card p-5">
            <div className="eyebrow">Upload roleplay</div>
            <Field label="Title">
              <input className={inp} value={title} onChange={(e) => setTitle(e.target.value)} required />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Recorded on">
                <input className={inp} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </Field>
              <Field label="Session (optional)">
                <select className={inp} value={sessionId} onChange={(e) => setSessionId(e.target.value)}>
                  <option value="">-</option>
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {new Date(s.session_date).toLocaleDateString("en-GB")}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Audio / video file">
              <input
                id="rp-file"
                className={inp}
                type="file"
                accept="audio/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                required
              />
            </Field>
            <Field label="Review notes">
              <textarea rows={3} className={inp} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Field>
            <button type="submit" disabled={uploading} className="btn-primary w-full">
              {uploading ? "Uploading…" : "Upload"}
            </button>
            {err && <div className="text-xs text-destructive">{err}</div>}
          </form>
        ) : (
          <div />
        )}

        <div>
          <div className="eyebrow">Roleplays ({roleplays.length})</div>
          {roleplays.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No roleplays yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {roleplays.map((r) => (
                <li key={r.id} className="rounded-md border border-rule bg-card p-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{r.title}</div>
                      <div className="mono text-xs text-muted-foreground">
                        {new Date(r.recorded_on).toLocaleDateString("en-GB")}
                        {r.mime_type ? ` · ${r.mime_type}` : ""}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => play(r.storage_path, r.mime_type)}
                        className="text-xs underline underline-offset-4"
                      >
                        Play
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => del(r)}
                          className="text-xs text-muted-foreground hover:text-destructive"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  {r.notes && (
                    <div className="mt-2 whitespace-pre-wrap text-muted-foreground">{r.notes}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------- KPIs ------------------------- */

export function KpisPanel({
  clientId,
  kpis,
  reload,
  isAdmin,
}: {
  clientId: string;
  kpis: Kpi[];
  reload: () => void;
  isAdmin: boolean;
}) {
  const thisMonth = new Date().toISOString().slice(0, 7) + "-01";
  const [month, setMonth] = useState(thisMonth);
  const [opps, setOpps] = useState("");
  const [avg, setAvg] = useState("");
  const [rate, setRate] = useState("");
  const [closed, setClosed] = useState("");
  const [dead, setDead] = useState("");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const row = {
      client_id: clientId,
      month,
      opportunities: Number(opps || 0),
      avg_deal_value: Number(avg || 0),
      close_rate_est: Number(rate || 0),
      closed_deal_value: Number(closed || 0),
      dead_pipeline_value: Number(dead || 0),
      notes: notes || null,
    };
    const { error } = await supabase
      .from("kpi_entries")
      .upsert(row, { onConflict: "client_id,month" });
    if (error) return setErr(error.message);
    setOpps("");
    setAvg("");
    setRate("");
    setClosed("");
    setDead("");
    setNotes("");
    reload();
  }

  async function del(kid: string) {
    if (!confirm("Delete KPI entry?")) return;
    await supabase.from("kpi_entries").delete().eq("id", kid);
    reload();
  }

  return (
    <section className="rule-t">
      <div className="container-tight py-10">
        <div className="eyebrow">The leak, month by month</div>
        <div className="mt-4">
          <LeakLedger kpis={kpis} />
        </div>
      </div>
      <div className="container-tight grid gap-8 py-10 md:grid-cols-2">
        <form onSubmit={save} className="space-y-3 rounded-md border border-rule bg-card p-5">
          <div className="eyebrow">Log monthly KPIs</div>
          <Field label="Month (first day)">
            <input
              className={inp}
              type="date"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Opportunities">
              <input className={inp} type="number" min="0" value={opps} onChange={(e) => setOpps(e.target.value)} />
            </Field>
            <Field label="Avg deal £">
              <input className={inp} type="number" min="0" step="1" value={avg} onChange={(e) => setAvg(e.target.value)} />
            </Field>
            <Field label="Close rate est %">
              <input className={inp} type="number" min="0" max="100" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
            </Field>
            <Field label="Closed deal £">
              <input className={inp} type="number" min="0" step="1" value={closed} onChange={(e) => setClosed(e.target.value)} />
            </Field>
            <Field label="Dead pipeline £">
              <input className={inp} type="number" min="0" step="1" value={dead} onChange={(e) => setDead(e.target.value)} />
            </Field>
          </div>
          <Field label="Notes">
            <textarea rows={2} className={inp} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
          <button type="submit" className="btn-primary w-full">Save month</button>
          {err && <div className="text-xs text-destructive">{err}</div>}
          <p className="text-xs text-muted-foreground">
            Saving the same month again overwrites the previous entry.
          </p>
        </form>

        <div>
          <div className="eyebrow">KPI history ({kpis.length})</div>
          {kpis.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No KPI entries yet.</p>
          ) : (
            <div className="mt-3 overflow-x-auto rounded-md border border-rule bg-card">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-muted-foreground">
                  <tr className="border-b border-rule">
                    <th className="px-3 py-2">Month</th>
                    <th className="px-3 py-2">Opps</th>
                    <th className="px-3 py-2">Avg £</th>
                    <th className="px-3 py-2">Close %</th>
                    <th className="px-3 py-2">Closed £</th>
                    <th className="px-3 py-2">Dead £</th>
                    {isAdmin && <th className="px-3 py-2"></th>}
                  </tr>
                </thead>
                <tbody>
                  {kpis.map((k) => (
                    <tr key={k.id} className="border-b border-rule last:border-0">
                      <td className="mono px-3 py-2">{k.month.slice(0, 7)}</td>
                      <td className="mono px-3 py-2">{k.opportunities}</td>
                      <td className="mono px-3 py-2">£{Number(k.avg_deal_value).toLocaleString()}</td>
                      <td className="mono px-3 py-2">{Number(k.close_rate_est)}%</td>
                      <td className="mono px-3 py-2">£{Number(k.closed_deal_value).toLocaleString()}</td>
                      <td className="mono px-3 py-2">£{Number(k.dead_pipeline_value).toLocaleString()}</td>
                      {isAdmin && (
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => del(k.id)}
                            className="text-xs text-muted-foreground hover:text-destructive"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const inp =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
