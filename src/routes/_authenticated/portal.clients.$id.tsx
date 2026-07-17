import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/site-shell";
import { supabase } from "@/integrations/supabase/client";
import { TIERS } from "@/lib/tiers";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  tier: "starter" | "growth" | "scale" | null;
  monthly_fee: number | null;
  start_date: string | null;
  status: "active" | "paused" | "ended";
  notes: string | null;
};

type Deal = { id: string; title: string; value_gbp: number; closed_at: string };

export const Route = createFileRoute("/_authenticated/portal/clients/$id")({
  head: () => ({ meta: [{ title: "Client — Portal" }, { name: "robots", content: "noindex" }] }),
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
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [dealTitle, setDealTitle] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [dealDate, setDealDate] = useState(() => new Date().toISOString().slice(0, 10));

  async function load() {
    const [{ data: p }, { data: d }] = await Promise.all([
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
    ]);
    setProfile(p as Profile | null);
    setDeals((d ?? []) as Deal[]);
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

  function applyTierDefault(tierId: "starter" | "growth" | "scale") {
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
        <div className="container-tight flex items-center justify-between py-10">
          <div>
            <div className="eyebrow">Client</div>
            <h1 className="mt-2 font-serif text-3xl">{profile.full_name || profile.email}</h1>
            <div className="mono mt-1 text-xs text-muted-foreground">{profile.email}</div>
          </div>
          <Link to="/portal/clients" className="text-sm underline underline-offset-4">All clients</Link>
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
                  onChange={(e) => applyTierDefault(e.target.value as "starter" | "growth" | "scale")}
                >
                  <option value="">—</option>
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
    </PageShell>
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
