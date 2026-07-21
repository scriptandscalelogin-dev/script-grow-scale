import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/site-shell";
import { supabase } from "@/integrations/supabase/client";
import { createClientAccount } from "@/lib/clients.functions";
import { TIERS } from "@/lib/tiers";

type Row = {
  id: string;
  email: string | null;
  full_name: string | null;
  company: string | null;
  tier: "starter" | "growth" | "scale" | null;
  monthly_fee: number | null;
  status: "active" | "paused" | "ended";
  start_date: string | null;
};

export const Route = createFileRoute("/_authenticated/portal/clients/")({
  head: () => ({ meta: [{ title: "Clients — Portal" }, { name: "robots", content: "noindex" }] }),
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
  component: ClientsList,
});

function ClientsList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const createFn = useServerFn(createClientAccount);

  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    company: "",
    phone: "",
    tier: "" as "" | "starter" | "growth" | "scale",
    monthly_fee: "" as string,
    start_date: new Date().toISOString().slice(0, 10),
    password: "",
    invite_mode: "password" as "password" | "invite",
  });
  const [createdInfo, setCreatedInfo] = useState<{
    email: string;
    mode: "password" | "invite";
    tempPassword: string | null;
  } | null>(null);

  async function load() {
    const { data: adminRoles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");
    const adminIds = new Set((adminRoles ?? []).map((r) => r.user_id));

    const { data } = await supabase
      .from("profiles")
      .select("id,email,full_name,company,tier,monthly_fee,status,start_date")
      .order("created_at", { ascending: false });
    setRows(((data ?? []) as Row[]).filter((r) => !adminIds.has(r.id)));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function pickTier(t: "" | "starter" | "growth" | "scale") {
    const preset = TIERS.find((x) => x.id === t);
    setForm((f) => ({
      ...f,
      tier: t,
      monthly_fee: preset ? String(preset.price) : f.monthly_fee,
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormMsg(null);
    setCreatedInfo(null);
    try {
      const result = await createFn({
        data: {
          email: form.email.trim(),
          full_name: form.full_name.trim(),
          company: form.company.trim() || null,
          phone: form.phone.trim() || null,
          tier: form.tier || null,
          monthly_fee: form.monthly_fee ? Number(form.monthly_fee) : null,
          start_date: form.start_date || null,
          password: form.invite_mode === "password" ? form.password || null : null,
          invite_mode: form.invite_mode,
          redirect_to:
            form.invite_mode === "invite"
              ? `${window.location.origin}/reset-password`
              : null,
        },
      });
      setCreatedInfo({
        email: result.email,
        mode: form.invite_mode,
        tempPassword: result.temp_password,
      });
      setFormMsg(`Created ${result.full_name} (${result.email}).`);
      setForm({
        email: "",
        full_name: "",
        company: "",
        phone: "",
        tier: "",
        monthly_fee: "",
        start_date: new Date().toISOString().slice(0, 10),
        password: "",
        invite_mode: form.invite_mode,
      });
      setShowAdd(false);
      load();
    } catch (err) {
      setFormMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <section className="rule-b">
        <div className="container-tight grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 py-10 sm:flex sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="eyebrow">Admin</div>
            <h1 className="mt-2 font-serif text-2xl sm:text-3xl">Clients</h1>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
            <button
              onClick={() => {
                setShowAdd((s) => !s);
                setFormMsg(null);
              }}
              className="btn-primary"
            >
              {showAdd ? "Cancel" : "Add client"}
            </button>
            <Link to="/portal" className="text-sm underline underline-offset-4">Back to portal</Link>
          </div>
        </div>
      </section>

      {showAdd && (
        <section className="rule-b bg-card/40">
          <div className="container-tight py-8">
            <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
              <Field label="Full name">
                <input className={inp} required value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </Field>
              <Field label="Email (login)">
                <input className={inp} type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label="Company">
                <input className={inp} value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </Field>
              <Field label="Phone">
                <input className={inp} value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </Field>
              <Field label="Tier">
                <select className={inp} value={form.tier}
                  onChange={(e) => pickTier(e.target.value as "" | "starter" | "growth" | "scale")}>
                  <option value="">—</option>
                  {TIERS.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} (£{t.price})</option>
                  ))}
                </select>
              </Field>
              <Field label="Monthly fee (£)">
                <input className={inp} type="number" min="0" step="1" value={form.monthly_fee}
                  onChange={(e) => setForm({ ...form, monthly_fee: e.target.value })} />
              </Field>
              <Field label="Start date">
                <input className={inp} type="date" value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </Field>
              <Field label="How they get their login">
                <select
                  className={inp}
                  value={form.invite_mode}
                  onChange={(e) => setForm({ ...form, invite_mode: e.target.value as "password" | "invite" })}
                >
                  <option value="password">Set a temporary password (I&apos;ll share it out-of-band)</option>
                  <option value="invite">Email an invite link (they set their own password)</option>
                </select>
              </Field>
              {form.invite_mode === "password" && (
                <Field label="Password (leave blank to auto-generate)">
                  <input className={inp} type="text" minLength={8} value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </Field>
              )}
              <div className="md:col-span-2 flex items-center gap-3">
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? "Creating…" : "Create client account"}
                </button>
                {formMsg && <span className="text-xs text-muted-foreground">{formMsg}</span>}
              </div>
              <p className="md:col-span-2 text-xs text-muted-foreground">
                {form.invite_mode === "password"
                  ? "Creates a login (email confirmed) with the password above. You&apos;ll see the password once so you can share it."
                  : "Creates the account and emails a setup link so they set their own password. Uses default Supabase auth emails until you configure a custom sender domain."}
              </p>
            </form>
          </div>
        </section>
      )}

      {createdInfo && (
        <section className="rule-b bg-card">
          <div className="container-tight py-5 text-sm">
            {createdInfo.mode === "password" && createdInfo.tempPassword ? (
              <>
                <div className="eyebrow text-highlight">Copy this now — it won&apos;t be shown again</div>
                <div className="mt-2">
                  Login for <strong>{createdInfo.email}</strong>:{" "}
                  <code className="mono rounded bg-background px-2 py-1">{createdInfo.tempPassword}</code>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Share this password with the client through your normal channel. They can change it from the sign-in page via &ldquo;Forgot password?&rdquo;.
                </p>
              </>
            ) : (
              <>
                <div className="eyebrow text-highlight">Invite sent</div>
                <div className="mt-2">
                  Setup link emailed to <strong>{createdInfo.email}</strong>. They click it to set their password. If they don&apos;t receive it, check spam or use the &ldquo;Send password reset&rdquo; button on their client page.
                </div>
              </>
            )}
            <button
              onClick={() => setCreatedInfo(null)}
              className="mt-3 text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </button>
          </div>
        </section>
      )}

      {!showAdd && !createdInfo && formMsg && (
        <section className="rule-b">
          <div className="container-tight py-3 text-xs text-muted-foreground">{formMsg}</div>
        </section>
      )}

      <section>
        <div className="container-tight py-10">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No clients yet. Click “Add client” to create one.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-rule bg-card">
              <table className="w-full text-sm">
                <thead className="bg-background/60 text-left">
                  <tr>
                    <Th>Client</Th>
                    <Th>Company</Th>
                    <Th>Tier</Th>
                    <Th>Fee</Th>
                    <Th>Status</Th>
                    <Th>Start</Th>
                    <Th></Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t border-rule">
                      <Td>
                        <div>{r.full_name || "—"}</div>
                        <div className="mono text-xs text-muted-foreground">{r.email}</div>
                      </Td>
                      <Td>{r.company || "—"}</Td>
                      <Td className="uppercase mono text-xs">{r.tier || "—"}</Td>
                      <Td>{r.monthly_fee ? `£${Number(r.monthly_fee).toLocaleString()}` : "—"}</Td>
                      <Td>{r.status}</Td>
                      <Td>{r.start_date ? new Date(r.start_date).toLocaleDateString("en-GB") : "—"}</Td>
                      <Td>
                        <Link
                          to="/portal/clients/$id"
                          params={{ id: r.id }}
                          className="underline underline-offset-4"
                        >
                          Manage
                        </Link>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="eyebrow px-4 py-3 font-normal">{children}</th>;
}
function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}
