import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/site-shell";
import { supabase } from "@/integrations/supabase/client";

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

export const Route = createFileRoute("/_authenticated/portal/clients")({
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

  useEffect(() => {
    (async () => {
      // exclude admins by leaving them out via join to user_roles
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
    })();
  }, []);

  return (
    <PageShell>
      <section className="rule-b">
        <div className="container-tight flex items-center justify-between py-10">
          <div>
            <div className="eyebrow">Admin</div>
            <h1 className="mt-2 font-serif text-3xl">Clients</h1>
          </div>
          <Link to="/portal" className="text-sm underline underline-offset-4">Back to portal</Link>
        </div>
      </section>
      <section>
        <div className="container-tight py-10">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No clients yet. Create the auth user in the backend, then set their tier here once they appear.
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

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="eyebrow px-4 py-3 font-normal">{children}</th>;
}
function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}
