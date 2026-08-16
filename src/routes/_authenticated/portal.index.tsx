import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { PageShell } from "@/components/site-shell";
import { supabase } from "@/integrations/supabase/client";
import {
  SessionsPanel,
  RoleplaysPanel,
  KpisPanel,
} from "./portal.clients.$id";
import { DiagnosticWizard } from "@/components/diagnostic-wizard";
import { CallScriptRunner } from "@/components/call-script-runner";
import { CALL_SCRIPT, buildScriptBlocks, type ScriptConfig } from "@/lib/call-script";
import { downloadScriptHtml } from "@/lib/export-script";
import { TIERS } from "@/lib/tiers";
import { AlumniPanel } from "@/components/alumni-panel";


type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  company: string | null;
  tier: "opener" | "closer" | "rainmaker" | null;
  monthly_fee: number | null;
  start_date: string | null;
  status: "active" | "paused" | "ended";
};

type Deal = { id: string; title: string; value_gbp: number; closed_at: string };

export const Route = createFileRoute("/_authenticated/portal/")({
  head: () => ({
    meta: [
      { title: "Portal · Script & Scale" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Portal,
});

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

function Portal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [roleplays, setRoleplays] = useState<Roleplay[]>([]);
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [openContacts, setOpenContacts] = useState(0);
  const [clientCount, setClientCount] = useState(0);

  const loadClient = useCallback(async (uid: string) => {
    const [{ data: p }, { data: d }, { data: s }, { data: r }, { data: k }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id,email,full_name,company,tier,monthly_fee,start_date,status")
        .eq("id", uid)
        .maybeSingle(),
      supabase
        .from("deals")
        .select("id,title,value_gbp,closed_at")
        .eq("profile_id", uid)
        .order("closed_at", { ascending: false }),
      supabase
        .from("workshop_sessions")
        .select("id,session_date,covered,action_items,attended,notes")
        .eq("client_id", uid)
        .order("session_date", { ascending: false }),
      supabase
        .from("roleplay_recordings")
        .select("id,title,recorded_on,storage_path,mime_type,notes,session_id")
        .eq("client_id", uid)
        .order("recorded_on", { ascending: false }),
      supabase
        .from("kpi_entries")
        .select("id,month,opportunities,avg_deal_value,close_rate_est,closed_deal_value,dead_pipeline_value,notes")
        .eq("client_id", uid)
        .order("month", { ascending: false }),
    ]);
    setProfile(p as Profile | null);
    setDeals((d ?? []) as Deal[]);
    setSessions((s ?? []) as Session[]);
    setRoleplays((r ?? []) as Roleplay[]);
    setKpis((k ?? []) as Kpi[]);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return;
      setUserId(user.id);

      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      const admin = !!roleRow;
      setIsAdmin(admin);

      if (admin) {
        const [{ count: cCount }, { data: adminRoles }, { count: pCount }] = await Promise.all([
      supabase
        .from("contact_submissions")
        .select("id", { count: "exact", head: true })
        .eq("handled", false),
      supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin"),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true }),
    ]);
    setOpenContacts(cCount ?? 0);
    setClientCount((pCount ?? 0) - (adminRoles?.length ?? 0));
      } else {
        await loadClient(user.id);
      }
      setLoading(false);
    })();
  }, [loadClient]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <PageShell>
      <section className="rule-b">
        <div className="container-tight py-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="eyebrow">Portal</div>
              <h1 className="mt-3 font-serif text-4xl">
                {isAdmin ? "Admin" : profile?.full_name || profile?.email || "Welcome"}
              </h1>
              {isAdmin && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Manage clients, review inbox, log deal value.
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <span className="rounded-md border border-highlight px-3 py-1 text-xs text-highlight">
                  Admin
                </span>
              )}
              <button onClick={signOut} className="btn-outline">Sign out</button>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="container-tight py-16 text-sm text-muted-foreground">Loading…</div>
      ) : isAdmin ? (
        <AdminHome openContacts={openContacts} clientCount={clientCount} />
      ) : (
        <ClientHome
          profile={profile}
          deals={deals}
          sessions={sessions}
          roleplays={roleplays}
          kpis={kpis}
          userId={userId}
          reload={() => userId && loadClient(userId)}
        />
      )}
    </PageShell>
  );
}


function AdminHome({ openContacts, clientCount }: { openContacts: number; clientCount: number }) {
  return (
    <>
      <section>
        <div className="container-tight grid gap-6 py-12 md:grid-cols-3">
          <Link
            to="/portal/clients"
            className="rounded-md border border-rule bg-card p-6 transition-colors hover:border-highlight"
          >
            <div className="eyebrow">Clients</div>
            <div className="mt-2 font-serif text-2xl">{clientCount}</div>
            <p className="mt-2 text-sm text-muted-foreground">
              View, edit tier, log deal value against guarantee.
            </p>
          </Link>
          <Link
            to="/portal/library"
            className="rounded-md border border-rule bg-card p-6 transition-colors hover:border-highlight"
          >
            <div className="eyebrow">Library</div>
            <div className="mt-2 font-serif text-2xl">Scripts · SOPs · Objections</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Author versioned content and assign to clients.
            </p>
          </Link>
          <Link
            to="/portal/inbox"
            className="rounded-md border border-rule bg-card p-6 transition-colors hover:border-highlight"
          >
            <div className="eyebrow">Contact inbox</div>
            <div className="mt-2 font-serif text-2xl">
              {openContacts} <span className="text-sm text-muted-foreground">unhandled</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Manual follow-up. Mark handled when replied.
            </p>
          </Link>
        </div>
      </section>
      <AdminCallScriptPanel />
    </>
  );
}

function AdminCallScriptPanel() {
  const [rows, setRows] = useState<
    { id: string; created_at: string; prospect_name: string | null; answers: Record<string, string>; rep_notes: Record<string, string>; tier_confirmed: string | null; start_date_confirmed: string | null; attendance_commitment_confirmed: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await supabase
      .from("call_script_runs")
      .select("id,created_at,prospect_name,answers,rep_notes,tier_confirmed,start_date_confirmed,attendance_commitment_confirmed")
      .order("created_at", { ascending: false })
      .limit(10);
    setRows((data ?? []) as typeof rows);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="rule-t">
      <div className="container-tight py-10">
        <div className="eyebrow">Sales call script</div>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          The full click-through: intake, recap, pitch, offer, objections, and close. Use it live on
          your own calls with a new prospect.
        </p>
        <div className="mt-4 max-w-xl">
          <CallScriptRunner
            blocks={CALL_SCRIPT}
            tierOptions={TIERS}
            clientId={null}
            onSaved={load}
          />
        </div>

        <div className="mt-6">
          <div className="eyebrow">Recent calls ({rows.length})</div>
          {loading ? (
            <p className="mt-2 text-sm text-muted-foreground">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">None yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {rows.map((r) => (
                <li key={r.id} className="rounded-md border border-rule bg-card p-4 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-medium">{r.prospect_name || "Unnamed prospect"}</div>
                    <div className="mono text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString("en-GB")}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {r.tier_confirmed ? `Tier: ${r.tier_confirmed}` : "No tier confirmed"}
                    {r.start_date_confirmed ? ` · Start: ${r.start_date_confirmed}` : ""}
                    {r.attendance_commitment_confirmed ? " · Attendance confirmed" : ""}
                  </div>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                      View answers &amp; notes
                    </summary>
                    <dl className="mt-2 space-y-2">
                      {Object.entries(r.answers).map(([q, a]) => (
                        <div key={q}>
                          <dt className="text-xs text-muted-foreground">{q}</dt>
                          <dd className="whitespace-pre-wrap break-words">{a || "—"}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function ClientHome({
  profile,
  deals,
  sessions,
  roleplays,
  kpis,
  userId,
  reload,
}: {
  profile: Profile | null;
  deals: Deal[];
  sessions: Session[];
  roleplays: Roleplay[];
  kpis: Kpi[];
  userId: string | null;
  reload: () => void;
}) {
  if (!profile) {
    return (
      <div className="container-tight py-16 text-sm text-muted-foreground">
        Your account isn’t fully set up yet. We’ll email once your workspace is live.
      </div>
    );
  }

  const fee = Number(profile.monthly_fee ?? 0);
  const target = fee * 3;
  const start = profile.start_date ? new Date(profile.start_date) : null;
  const windowEnd = start ? new Date(start) : null;
  if (windowEnd) windowEnd.setMonth(windowEnd.getMonth() + 3);

  const inWindow = deals.filter((d) => {
    if (!start || !windowEnd) return false;
    const c = new Date(d.closed_at);
    return c >= start && c < windowEnd;
  });
  const logged = inWindow.reduce((s, d) => s + Number(d.value_gbp), 0);
  const pct = target > 0 ? Math.min(100, Math.round((logged / target) * 100)) : 0;
  const met = target > 0 && logged >= target;

  return (
    <>
      <section className="rule-b">
        <div className="container-tight py-10">
          <div className="eyebrow">Guarantee progress</div>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
            <div className="font-serif text-3xl">
              £{logged.toLocaleString()}{" "}
              <span className="text-base text-muted-foreground">of £{target.toLocaleString()}</span>
            </div>
            <div className="mono text-xs text-muted-foreground">
              {profile.tier ? profile.tier.toUpperCase() : "-"} · £{fee.toLocaleString()}/mo · 3-month window
            </div>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full border border-rule bg-background">
            <div
              className={`h-full ${met ? "bg-highlight" : "bg-foreground/70"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {start
              ? met
                ? "Deal value has covered fees. Guarantee cleared."
                : `Window runs from ${start.toLocaleDateString("en-GB")} to ${windowEnd?.toLocaleDateString("en-GB")}. If fees aren’t covered by then, month 4 is on us.`
              : "Start date not set. We’ll set it at your first workshop."}
          </p>
        </div>
      </section>

      <AlumniPanel
        startDate={profile.start_date}
        monthlyFee={profile.monthly_fee}
        closedDealValue={deals.reduce((s, d) => s + Number(d.value_gbp), 0)}
      />

      <section>
        <div className="container-tight py-10">
          <div className="eyebrow">Deals logged</div>
          {deals.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No deals logged yet. Send closed deal value to your Script &amp; Scale contact. It appears here.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-rule rounded-md border border-rule bg-card">
              {deals.map((d) => (
                <li key={d.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <div className="font-medium">{d.title}</div>
                    <div className="mono text-xs text-muted-foreground">
                      {new Date(d.closed_at).toLocaleDateString("en-GB")}
                    </div>
                  </div>
                  <div className="mono">£{Number(d.value_gbp).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <div className="container-tight py-4">
          <Link
            to="/portal/library"
            className="block rounded-md border border-rule bg-card p-6 transition-colors hover:border-highlight"
          >
            <div className="eyebrow">Library</div>
            <div className="mt-2 font-serif text-xl">Scripts, SOPs, objections assigned to you</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Read-only with change history.
            </p>
          </Link>
        </div>
      </section>

      {userId && (
        <>
          <SessionsPanelReadOnly sessions={sessions} />
          <RoleplaysPanel
            clientId={userId}
            roleplays={roleplays}
            sessions={sessions}
            reload={reload}
            isAdmin={false}
          />
          <KpisPanel clientId={userId} kpis={kpis} reload={reload} isAdmin={false} />
          <YourScriptPanel clientId={userId} />
          <DiagnosticFormPanel clientId={userId} />
        </>
      )}
    </>
  );
}

function YourScriptPanel({ clientId }: { clientId: string }) {
  const [config, setConfig] = useState<ScriptConfig | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await supabase
      .from("client_scripts")
      .select("business_name,pitch_body,transition_body,offer,mechanic_body,objections,proof_body,risk_reversal_body,whats_included,close_body")
      .eq("client_id", clientId)
      .maybeSingle();
    if (data) {
      setBusinessName(data.business_name ?? "");
      setConfig({
        pitchBody: data.pitch_body,
        transitionBody: data.transition_body,
        offer: data.offer,
        mechanicBody: data.mechanic_body,
        objections: data.objections,
        proofBody: data.proof_body,
        riskReversalBody: data.risk_reversal_body,
        whatsIncluded: data.whats_included,
        closeBody: data.close_body,
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [clientId]);

  return (
    <section className="rule-t">
      <div className="container-tight py-10">
        <div className="eyebrow">Your sales script</div>
        {loading ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
        ) : !config ? (
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Not set up yet, ask about it in your next workshop. Once it's ready, it shows up here as
            your own click-through version of the call script, built around your own pitch and offer.
          </p>
        ) : (
          <>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-xl text-sm text-muted-foreground">
                Built around your own pitch, offer, and objections. This is yours, not ours, you can
                export it and keep it even after your engagement ends.
              </p>
              <button
                onClick={() => downloadScriptHtml(businessName, config)}
                className="btn-outline shrink-0 text-xs"
              >
                Export my script
              </button>
            </div>
            <div className="mt-4 max-w-xl">
              <CallScriptRunner
                blocks={buildScriptBlocks(config)}
                tierOptions={config.offer.map((t, i) => ({ id: String(i), name: t.name, price: t.price }))}
                clientId={clientId}
                onSaved={() => {}}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function DiagnosticFormPanel({ clientId }: { clientId: string }) {
  const [rows, setRows] = useState<{ id: string; submitted_at: string; answers: Record<string, string> }[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await supabase
      .from("diagnostic_submissions")
      .select("id,submitted_at,answers")
      .eq("client_id", clientId)
      .order("submitted_at", { ascending: false });
    setRows((data ?? []) as { id: string; submitted_at: string; answers: Record<string, string> }[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [clientId]);

  return (
    <section className="rule-t">
      <div className="container-tight py-10">
        <div className="eyebrow">Sales diagnostic</div>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Run this live on a call with your own prospect, it&rsquo;s built from the same framework
          we use with you.
        </p>
        <div className="mt-4">
          <DiagnosticWizard clientId={clientId} onSubmitted={load} />
        </div>

        <div className="mt-6">
          <div className="eyebrow">Your past diagnostics ({rows.length})</div>
          {loading ? (
            <p className="mt-2 text-sm text-muted-foreground">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">None run yet, they&rsquo;ll appear here once submitted.</p>
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
                        <dd className="whitespace-pre-wrap break-words">{a || "—"}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function SessionsPanelReadOnly({ sessions }: { sessions: Session[] }) {
  return (
    <section className="rule-t">
      <div className="container-tight py-10">
        <div className="eyebrow">Workshop sessions</div>
        {sessions.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No workshops logged yet. Once you&rsquo;ve had your first session with your coach it&rsquo;ll appear here with what was covered and any action items.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {sessions.map((s) => (
              <li key={s.id} className="rounded-md border border-rule bg-card p-4 text-sm">
                <div className="mono text-xs text-muted-foreground">
                  {new Date(s.session_date).toLocaleDateString("en-GB")} · {s.attended ? "attended" : "missed"}
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

