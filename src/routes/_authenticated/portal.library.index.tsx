import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/site-shell";
import { supabase } from "@/integrations/supabase/client";
import { KIND_LABELS, KINDS, type ContentKind, type ContentStatus } from "@/lib/library";

type Row = {
  id: string;
  kind: ContentKind;
  title: string;
  summary: string | null;
  status: ContentStatus;
  current_version: number;
  updated_at: string;
  attachment_url: string | null;
  attachment_storage_path: string | null;
};

export const Route = createFileRoute("/_authenticated/portal/library/")({
  head: () => ({ meta: [{ title: "Library · Portal" }, { name: "robots", content: "noindex" }] }),
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
  },
  component: LibraryIndex,
});

function LibraryIndex() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<{ kind: ContentKind; title: string; summary: string }>({
    kind: "script",
    title: "",
    summary: "",
  });
  const [filterKind, setFilterKind] = useState<ContentKind | "all">("all");

  async function load() {
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data: adminRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", u.user.id)
      .eq("role", "admin")
      .maybeSingle();
    const admin = !!adminRow;
    setIsAdmin(admin);

    const { data, error } = await supabase
      .from("content_items")
      .select("id,kind,title,summary,status,current_version,updated_at,attachment_url,attachment_storage_path")
      .order("updated_at", { ascending: false });
    if (error) setMsg(error.message);
    setRows((data ?? []) as Row[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data, error } = await supabase
      .from("content_items")
      .insert({
        kind: form.kind,
        title: form.title.trim(),
        summary: form.summary.trim() || null,
        body: "",
        status: "draft",
        current_version: 1,
        created_by: u.user.id,
      })
      .select("id")
      .single();
    if (error) {
      setMsg(error.message);
      return;
    }
    // seed version 1
    await supabase.from("content_versions").insert({
      content_id: data.id,
      version_number: 1,
      title: form.title.trim(),
      body: "",
      change_notes: "Initial version",
      created_by: u.user.id,
    });
    setForm({ kind: "script", title: "", summary: "" });
    setShowAdd(false);
    load();
  }

  const visible = rows.filter((r) => filterKind === "all" || r.kind === filterKind);

  return (
    <PageShell>
      <section className="rule-b">
        <div className="container-tight grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 py-10 sm:flex sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="eyebrow">{isAdmin ? "Admin" : "Your"}</div>
            <h1 className="mt-2 font-serif text-2xl sm:text-3xl">Content library</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isAdmin
                ? "Scripts, SOPs and objection sheets. Author here, assign to clients."
                : "Scripts, SOPs and objection sheets assigned to you."}
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
            {isAdmin && (
              <button onClick={() => setShowAdd((s) => !s)} className="btn-primary">
                {showAdd ? "Cancel" : "New item"}
              </button>
            )}
            <Link to="/portal" className="text-sm underline underline-offset-4">Back to portal</Link>
          </div>
        </div>
      </section>

      {showAdd && isAdmin && (
        <section className="rule-b bg-card/40">
          <div className="container-tight py-6">
            <form onSubmit={create} className="grid gap-4 md:grid-cols-4">
              <label className="block">
                <span className="eyebrow">Kind</span>
                <select
                  className={`${inp} mt-1.5`}
                  value={form.kind}
                  onChange={(e) => setForm({ ...form, kind: e.target.value as ContentKind })}
                >
                  {KINDS.map((k) => (
                    <option key={k} value={k}>{KIND_LABELS[k]}</option>
                  ))}
                </select>
              </label>
              <label className="block md:col-span-3">
                <span className="eyebrow">Title</span>
                <input
                  className={`${inp} mt-1.5`}
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </label>
              <label className="block md:col-span-4">
                <span className="eyebrow">Summary (optional)</span>
                <input
                  className={`${inp} mt-1.5`}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                />
              </label>
              <div className="md:col-span-4">
                <button type="submit" className="btn-primary">Create draft</button>
              </div>
            </form>
          </div>
        </section>
      )}

      <section>
        <div className="container-tight py-8">
          <div className="mb-4 flex items-center gap-2 text-xs">
            <button
              className={filterPill(filterKind === "all")}
              onClick={() => setFilterKind("all")}
            >All</button>
            {KINDS.map((k) => (
              <button
                key={k}
                className={filterPill(filterKind === k)}
                onClick={() => setFilterKind(k)}
              >{KIND_LABELS[k]}</button>
            ))}
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : msg ? (
            <p className="text-sm text-destructive">{msg}</p>
          ) : visible.length === 0 ? (
            <div className="rounded-md border border-dashed border-rule bg-card px-5 py-8 text-sm text-muted-foreground">
              {isAdmin
                ? "No content yet. Click “New item” to add your first script, SOP, or objection sheet."
                : filterKind === "all"
                  ? "Your coach hasn’t published anything for you yet. Scripts, SOPs and objection sheets will show up here as they’re assigned to you."
                  : `No ${KIND_LABELS[filterKind].toLowerCase()}s assigned to you yet. Check back after your next workshop.`}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border border-rule bg-card">
              <table className="w-full text-sm">
                <thead className="bg-background/60 text-left">
                  <tr>
                    <Th>Title</Th>
                    <Th>Kind</Th>
                    <Th>Status</Th>
                    <Th>Version</Th>
                    <Th>Updated</Th>
                    <Th></Th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r) => (
                    <tr key={r.id} className="border-t border-rule">
                      <Td>
                        <div className="font-medium">{r.title}</div>
                        {r.summary && (
                          <div className="text-xs text-muted-foreground">{r.summary}</div>
                        )}
                        {(r.attachment_url || r.attachment_storage_path) && (
                          <div className="mono mt-1 text-[10px] uppercase text-muted-foreground">
                            {[r.attachment_url ? "link" : null, r.attachment_storage_path ? "file" : null]
                              .filter(Boolean)
                              .join(" + ")}{" "}
                            attached
                          </div>
                        )}
                      </Td>
                      <Td className="mono text-xs uppercase">{KIND_LABELS[r.kind]}</Td>
                      <Td className="mono text-xs uppercase">{r.status}</Td>
                      <Td className="mono">v{r.current_version}</Td>
                      <Td className="mono text-xs">
                        {new Date(r.updated_at).toLocaleDateString("en-GB")}
                      </Td>
                      <Td>
                        <Link
                          to="/portal/library/$id"
                          params={{ id: r.id }}
                          className="underline underline-offset-4"
                        >
                          {isAdmin ? "Edit" : "Open"}
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

function filterPill(active: boolean) {
  return `rounded-full border px-3 py-1 ${
    active ? "border-highlight text-highlight" : "border-rule text-muted-foreground hover:text-foreground"
  }`;
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="eyebrow px-4 py-3 font-normal">{children}</th>;
}
function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}
