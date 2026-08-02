import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/site-shell";
import { supabase } from "@/integrations/supabase/client";
import { KIND_LABELS, STATUSES, type ContentKind, type ContentStatus } from "@/lib/library";
import { logActivity, type ActivityTargetKind } from "@/lib/activity";

type Item = {
  id: string;
  kind: ContentKind;
  title: string;
  summary: string | null;
  body: string;
  status: ContentStatus;
  current_version: number;
  attachment_url: string | null;
  attachment_storage_path: string | null;
  attachment_file_name: string | null;
  attachment_mime_type: string | null;
};

type Version = {
  id: string;
  version_number: number;
  title: string;
  body: string;
  change_notes: string | null;
  created_at: string;
};

type ClientRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
};

type Assignment = { id: string; profile_id: string; assigned_at: string };

export const Route = createFileRoute("/_authenticated/portal/library/$id")({
  head: () => ({ meta: [{ title: "Library item — Portal" }, { name: "robots", content: "noindex" }] }),
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
  },
  component: LibraryDetail,
});

function LibraryDetail() {
  const { id } = Route.useParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [item, setItem] = useState<Item | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [changeNotes, setChangeNotes] = useState("");
  const [assignClientId, setAssignClientId] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachBusy, setAttachBusy] = useState(false);
  const [attachMsg, setAttachMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const viewLoggedRef = useRef(false);

  async function load() {
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

    const { data: it } = await supabase
      .from("content_items")
      .select(
        "id,kind,title,summary,body,status,current_version,attachment_url,attachment_storage_path,attachment_file_name,attachment_mime_type",
      )
      .eq("id", id)
      .maybeSingle();
    if (!it) {
      setNotFound(true);
      return;
    }
    setItem(it as Item);
    setAttachmentUrl((it as Item).attachment_url ?? "");

    const [{ data: vs }, { data: asg }] = await Promise.all([
      supabase
        .from("content_versions")
        .select("id,version_number,title,body,change_notes,created_at")
        .eq("content_id", id)
        .order("version_number", { ascending: false }),
      supabase
        .from("content_assignments")
        .select("id,profile_id,assigned_at")
        .eq("content_id", id),
    ]);
    setVersions((vs ?? []) as Version[]);
    setAssignments((asg ?? []) as Assignment[]);

    if (admin) {
      const { data: adminRoles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");
      const adminIds = new Set((adminRoles ?? []).map((r) => r.user_id));
      const { data: profs } = await supabase
        .from("profiles")
        .select("id,full_name,email,company")
        .order("full_name");
      setClients(((profs ?? []) as ClientRow[]).filter((p) => !adminIds.has(p.id)));
    }
  }

  useEffect(() => {
    viewLoggedRef.current = false;
    load();
  }, [id]);

  // Log a client view once per mount when we've resolved the item + role.
  useEffect(() => {
    if (!item || isAdmin || viewLoggedRef.current) return;
    viewLoggedRef.current = true;
    logActivity("view_content", {
      target_kind: item.kind as ActivityTargetKind,
      target_id: item.id,
      metadata: { title: item.title },
    });
  }, [item, isAdmin]);

  async function saveVersion(e: React.FormEvent) {
    e.preventDefault();
    if (!item) return;
    setSaving(true);
    setMsg(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;

    const nextVersion = item.current_version + 1;
    const { error: vErr } = await supabase.from("content_versions").insert({
      content_id: item.id,
      version_number: nextVersion,
      title: item.title,
      body: item.body,
      change_notes: changeNotes.trim() || null,
      created_by: u.user.id,
    });
    if (vErr) {
      setSaving(false);
      setMsg(vErr.message);
      return;
    }
    const { error: uErr } = await supabase
      .from("content_items")
      .update({
        title: item.title,
        summary: item.summary,
        body: item.body,
        status: item.status,
        kind: item.kind,
        current_version: nextVersion,
      })
      .eq("id", item.id);
    setSaving(false);
    if (uErr) {
      setMsg(uErr.message);
      return;
    }
    setChangeNotes("");
    setMsg(`Saved as v${nextVersion}.`);
    load();
  }

  async function saveMetaOnly() {
    if (!item) return;
    setSaving(true);
    const { error } = await supabase
      .from("content_items")
      .update({ status: item.status, summary: item.summary })
      .eq("id", item.id);
    setSaving(false);
    setMsg(error ? error.message : "Metadata saved.");
  }

  async function saveAttachmentLink() {
    if (!item) return;
    setAttachMsg(null);
    const trimmed = attachmentUrl.trim();
    if (trimmed) {
      try {
        const u = new URL(trimmed);
        if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("bad protocol");
      } catch {
        setAttachMsg("Enter a valid link starting with http:// or https://");
        return;
      }
    }
    setAttachBusy(true);
    const { error } = await supabase
      .from("content_items")
      .update({ attachment_url: trimmed || null })
      .eq("id", item.id);
    setAttachBusy(false);
    if (error) {
      setAttachMsg(error.message);
      return;
    }
    setItem({ ...item, attachment_url: trimmed || null });
    setAttachMsg(trimmed ? "Link saved." : "Link removed.");
  }

  async function removeLink() {
    if (!item) return;
    setAttachmentUrl("");
    setAttachBusy(true);
    setAttachMsg(null);
    const { error } = await supabase
      .from("content_items")
      .update({ attachment_url: null })
      .eq("id", item.id);
    setAttachBusy(false);
    if (error) {
      setAttachMsg(error.message);
      return;
    }
    setItem({ ...item, attachment_url: null });
    setAttachMsg("Link removed.");
  }

  async function uploadAttachment(file: File) {
    if (!item) return;
    setAttachBusy(true);
    setAttachMsg(null);
    if (item.attachment_storage_path) {
      await supabase.storage.from("content-attachments").remove([item.attachment_storage_path]);
    }
    const safeName = file.name.replace(/[^\w.\-]+/g, "_");
    const path = `${item.id}/${Date.now()}-${safeName}`;
    const { error: upErr } = await supabase.storage
      .from("content-attachments")
      .upload(path, file, { contentType: file.type || undefined, upsert: true });
    if (upErr) {
      setAttachBusy(false);
      setAttachMsg(upErr.message);
      return;
    }
    const patch = {
      attachment_storage_path: path,
      attachment_file_name: file.name,
      attachment_mime_type: file.type || null,
    };
    const { error } = await supabase.from("content_items").update(patch).eq("id", item.id);
    setAttachBusy(false);
    if (fileRef.current) fileRef.current.value = "";
    if (error) {
      setAttachMsg(error.message);
      return;
    }
    setItem({ ...item, ...patch });
    setAttachMsg("File uploaded.");
  }

  async function removeFile() {
    if (!item?.attachment_storage_path) return;
    if (!confirm("Remove the uploaded file?")) return;
    setAttachBusy(true);
    setAttachMsg(null);
    const { error: rmErr } = await supabase.storage
      .from("content-attachments")
      .remove([item.attachment_storage_path]);
    if (rmErr) {
      setAttachBusy(false);
      setAttachMsg(rmErr.message);
      return;
    }
    const patch = {
      attachment_storage_path: null,
      attachment_file_name: null,
      attachment_mime_type: null,
    };
    const { error } = await supabase.from("content_items").update(patch).eq("id", item.id);
    setAttachBusy(false);
    if (error) {
      setAttachMsg(error.message);
      return;
    }
    setItem({ ...item, ...patch });
    setAttachMsg("File removed.");
  }

  async function openAttachmentFile() {
    if (!item?.attachment_storage_path) return;
    setAttachMsg(null);
    const { data, error } = await supabase.storage
      .from("content-attachments")
      .createSignedUrl(item.attachment_storage_path, 300, { download: item.attachment_file_name ?? true });
    if (error || !data?.signedUrl) {
      setAttachMsg(error?.message ?? "Could not create a download link.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }



  async function restoreVersion(v: Version) {
    if (!item) return;
    if (!confirm(`Restore v${v.version_number}? This creates a new version with its contents.`)) return;
    setItem({ ...item, title: v.title, body: v.body });
    setChangeNotes(`Restored from v${v.version_number}`);
  }

  async function assign(e: React.FormEvent) {
    e.preventDefault();
    if (!assignClientId) return;
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("content_assignments").insert({
      content_id: id,
      profile_id: assignClientId,
      assigned_by: u.user.id,
    });
    if (error) setMsg(error.message);
    setAssignClientId("");
    load();
  }

  async function unassign(aid: string) {
    await supabase.from("content_assignments").delete().eq("id", aid);
    load();
  }

  async function deleteItem() {
    if (!item) return;
    if (!confirm(`Delete “${item.title}”? This removes all versions and assignments.`)) return;
    const { error } = await supabase.from("content_items").delete().eq("id", item.id);
    if (error) {
      setMsg(error.message);
      return;
    }
    window.location.href = "/portal/library";
  }

  if (notFound) {
    return (
      <PageShell>
        <div className="container-tight py-16 text-sm text-muted-foreground">
          Item not found or you don’t have access.{" "}
          <Link to="/portal/library" className="underline underline-offset-4">Back to library</Link>
        </div>
      </PageShell>
    );
  }
  if (!item) {
    return (
      <PageShell>
        <div className="container-tight py-16 text-sm text-muted-foreground">Loading…</div>
      </PageShell>
    );
  }

  const assignedClients = assignments
    .map((a) => ({ a, c: clients.find((c) => c.id === a.profile_id) }))
    .sort((x, y) => (x.c?.full_name ?? "").localeCompare(y.c?.full_name ?? ""));
  const unassigned = clients.filter((c) => !assignments.find((a) => a.profile_id === c.id));

  return (
    <PageShell>
      <section className="rule-b">
        <div className="container-tight grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 py-10 sm:flex sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="eyebrow">
              {KIND_LABELS[item.kind]} · v{item.current_version} · {item.status}
            </div>
            <h1 className="mt-2 font-serif text-2xl sm:text-3xl break-words">{item.title}</h1>
            {item.summary && (
              <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
            )}
          </div>
          <Link to="/portal/library" className="shrink-0 text-sm underline underline-offset-4">All items</Link>
        </div>
      </section>

      <section>
        <div className="container-tight grid gap-8 py-10 md:grid-cols-3">
          <div className="md:col-span-2">
            {isAdmin ? (
              <>
              <form onSubmit={saveVersion} className="space-y-4">
                <div className="eyebrow">Edit</div>
                <label className="block">
                  <span className="eyebrow">Title</span>
                  <input
                    className={`${inp} mt-1.5`}
                    value={item.title}
                    onChange={(e) => setItem({ ...item, title: e.target.value })}
                    required
                  />
                </label>
                <label className="block">
                  <span className="eyebrow">Summary</span>
                  <input
                    className={`${inp} mt-1.5`}
                    value={item.summary ?? ""}
                    onChange={(e) => setItem({ ...item, summary: e.target.value })}
                  />
                </label>
                <label className="block">
                  <span className="eyebrow">Body</span>
                  <textarea
                    className={`${inp} mt-1.5 font-mono`}
                    rows={16}
                    value={item.body}
                    onChange={(e) => setItem({ ...item, body: e.target.value })}
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="eyebrow">Status</span>
                    <select
                      className={`${inp} mt-1.5`}
                      value={item.status}
                      onChange={(e) => setItem({ ...item, status: e.target.value as ContentStatus })}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="eyebrow">Change notes</span>
                    <input
                      className={`${inp} mt-1.5`}
                      placeholder="What changed in this version?"
                      value={changeNotes}
                      onChange={(e) => setChangeNotes(e.target.value)}
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button type="submit" disabled={saving} className="btn-primary">
                    {saving ? "Saving…" : `Save as v${item.current_version + 1}`}
                  </button>
                  <button type="button" onClick={saveMetaOnly} disabled={saving} className="btn-outline">
                    Save status only
                  </button>
                  <button type="button" onClick={deleteItem} className="text-xs text-muted-foreground hover:text-destructive">
                    Delete item
                  </button>
                  {msg && <span className="text-xs text-muted-foreground">{msg}</span>}
                </div>
                <p className="text-xs text-muted-foreground">
                  Every save creates a new version. Only <strong>published</strong> items are visible to assigned clients.
                </p>
              </form>

              <div className="mt-8 space-y-4 rounded-md border border-rule bg-card p-5">
                <div className="eyebrow">Attachment</div>
                <p className="text-xs text-muted-foreground">
                  A link and a file are independent — you can set either, both, or neither. Saving here
                  updates the item straight away and does not create a new version.
                </p>

                <label className="block">
                  <span className="eyebrow">Link (optional)</span>
                  <input
                    className={`${inp} mt-1.5`}
                    type="url"
                    placeholder="https://…"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                  />
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button type="button" onClick={saveAttachmentLink} disabled={attachBusy} className="btn-outline">
                    Save link
                  </button>
                  {item.attachment_url && (
                    <button
                      type="button"
                      onClick={removeLink}
                      disabled={attachBusy}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Remove link
                    </button>
                  )}
                  {item.attachment_url && (
                    <a
                      href={item.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline underline-offset-4"
                    >
                      Open link
                    </a>
                  )}
                </div>

                <label className="block">
                  <span className="eyebrow">File (optional)</span>
                  <input
                    ref={fileRef}
                    className={`${inp} mt-1.5`}
                    type="file"
                    disabled={attachBusy}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadAttachment(f);
                    }}
                  />
                </label>
                {item.attachment_storage_path ? (
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="mono text-xs break-all">
                      {item.attachment_file_name ?? item.attachment_storage_path}
                    </span>
                    <button
                      type="button"
                      onClick={openAttachmentFile}
                      disabled={attachBusy}
                      className="text-xs underline underline-offset-4"
                    >
                      Download file
                    </button>
                    <button
                      type="button"
                      onClick={removeFile}
                      disabled={attachBusy}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No file uploaded.</p>
                )}

                {attachMsg && <p className="text-xs text-muted-foreground">{attachMsg}</p>}
                {attachBusy && <p className="text-xs text-muted-foreground">Working…</p>}
              </div>
              </>
            ) : (
              <div>
                <div className="eyebrow">Body</div>
                <pre className="mt-3 whitespace-pre-wrap rounded-md border border-rule bg-card p-5 font-mono text-sm leading-relaxed">
                  {item.body || "(empty)"}
                </pre>

                {(item.attachment_url || item.attachment_storage_path) && (
                  <div className="mt-6 rounded-md border border-rule bg-card p-5">
                    <div className="eyebrow">Attachment</div>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {item.attachment_url && (
                        <a
                          href={item.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline"
                        >
                          Open link
                        </a>
                      )}
                      {item.attachment_storage_path && (
                        <button type="button" onClick={openAttachmentFile} className="btn-outline">
                          Download file
                        </button>
                      )}
                      {item.attachment_file_name && (
                        <span className="mono text-xs text-muted-foreground break-all">
                          {item.attachment_file_name}
                        </span>
                      )}
                    </div>
                    {attachMsg && <p className="mt-2 text-xs text-destructive">{attachMsg}</p>}
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {isAdmin && (
              <div className="rounded-md border border-rule bg-card p-5">
                <div className="eyebrow">Assignments ({assignments.length})</div>
                <form onSubmit={assign} className="mt-3 flex gap-2">
                  <select
                    className={inp}
                    value={assignClientId}
                    onChange={(e) => setAssignClientId(e.target.value)}
                  >
                    <option value="">Assign to client…</option>
                    {unassigned.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.full_name || c.email} {c.company ? `(${c.company})` : ""}
                      </option>
                    ))}
                  </select>
                  <button type="submit" disabled={!assignClientId} className="btn-primary">Add</button>
                </form>
                {assignedClients.length === 0 ? (
                  <p className="mt-3 text-xs text-muted-foreground">Not assigned to any client.</p>
                ) : (
                  <ul className="mt-3 divide-y divide-rule">
                    {assignedClients.map(({ a, c }) => (
                      <li key={a.id} className="flex items-center justify-between py-2 text-sm">
                        <div>
                          <div>{c?.full_name || c?.email || a.profile_id}</div>
                          {c?.company && (
                            <div className="mono text-xs text-muted-foreground">{c.company}</div>
                          )}
                        </div>
                        <button
                          onClick={() => unassign(a.id)}
                          className="text-xs text-muted-foreground hover:text-destructive"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="rounded-md border border-rule bg-card p-5">
              <div className="eyebrow">Version history</div>
              {versions.length === 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">No versions yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-rule">
                  {versions.map((v) => (
                    <li key={v.id} className="py-2 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="mono text-xs">
                          v{v.version_number} · {new Date(v.created_at).toLocaleDateString("en-GB")}
                        </div>
                        {isAdmin && v.version_number !== item.current_version && (
                          <button
                            onClick={() => restoreVersion(v)}
                            className="text-xs underline underline-offset-4"
                          >
                            Load
                          </button>
                        )}
                      </div>
                      {v.change_notes && (
                        <div className="text-xs text-muted-foreground">{v.change_notes}</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

const inp =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none";
