import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { OfferTier, IncludedTier, Objection } from "@/lib/call-script";

type ClientScriptRow = {
  business_name: string | null;
  pitch_body: string;
  transition_body: string;
  offer: OfferTier[];
  mechanic_body: string;
  objections: Objection[];
  proof_body: string;
  risk_reversal_body: string;
  whats_included: IncludedTier[];
  close_body: string;
};

const BLANK: ClientScriptRow = {
  business_name: "",
  pitch_body: "",
  transition_body: "",
  offer: [],
  mechanic_body: "",
  objections: [],
  proof_body: "",
  risk_reversal_body: "",
  whats_included: [],
  close_body: "",
};

export function ClientScriptEditor({ clientId }: { clientId: string }) {
  const [row, setRow] = useState<ClientScriptRow>(BLANK);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("client_scripts")
        .select("business_name,pitch_body,transition_body,offer,mechanic_body,objections,proof_body,risk_reversal_body,whats_included,close_body")
        .eq("client_id", clientId)
        .maybeSingle();
      if (data) {
        setRow(data as ClientScriptRow);
        setExists(true);
      }
      setLoading(false);
    })();
  }, [clientId]);

  async function save() {
    setSaving(true);
    setSaved(false);
    const { error } = await supabase
      .from("client_scripts")
      .upsert({ client_id: clientId, ...row, updated_at: new Date().toISOString() }, { onConflict: "client_id" });
    setSaving(false);
    if (!error) {
      setExists(true);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  function set<K extends keyof ClientScriptRow>(key: K, value: ClientScriptRow[K]) {
    setRow((r) => ({ ...r, [key]: value }));
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      {!exists && (
        <p className="text-sm text-muted-foreground">
          No script set up for this client yet. Fill this in and their portal will show a fully
          configured version of the call script, built around their own business.
        </p>
      )}

      <TextField label="Business name" value={row.business_name ?? ""} onChange={(v) => set("business_name", v)} />
      <TextArea label="Pitch (what we actually do)" value={row.pitch_body} onChange={(v) => set("pitch_body", v)} rows={6} />
      <TextArea label="Transition" value={row.transition_body} onChange={(v) => set("transition_body", v)} rows={2} />

      <OfferEditor value={row.offer} onChange={(v) => set("offer", v)} />

      <TextArea label="The mechanic" value={row.mechanic_body} onChange={(v) => set("mechanic_body", v)} rows={3} />

      <ObjectionsEditor value={row.objections} onChange={(v) => set("objections", v)} />

      <TextArea label="The proof" value={row.proof_body} onChange={(v) => set("proof_body", v)} rows={5} />
      <TextArea label="The risk reversal" value={row.risk_reversal_body} onChange={(v) => set("risk_reversal_body", v)} rows={4} />

      <IncludedEditor value={row.whats_included} onChange={(v) => set("whats_included", v)} />

      <TextArea label="The close" value={row.close_body} onChange={(v) => set("close_body", v)} rows={3} />

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="btn-cta text-xs">
          {saving ? "Saving…" : "Save script"}
        </button>
        {saved && <span className="text-xs text-muted-foreground">Saved.</span>}
      </div>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-rule bg-background p-3 text-sm focus:border-highlight focus:outline-none"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-1.5 w-full rounded-md border border-rule bg-background p-3 text-sm focus:border-highlight focus:outline-none"
      />
    </label>
  );
}

function OfferEditor({ value, onChange }: { value: OfferTier[]; onChange: (v: OfferTier[]) => void }) {
  function update(i: number, patch: Partial<OfferTier>) {
    onChange(value.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  }
  function add() {
    onChange([...value, { name: "", price: 0, cadence: "", tagline: "" }]);
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <span className="eyebrow">The offer (tiers)</span>
      <div className="mt-2 space-y-3">
        {value.map((t, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 rounded-md border border-rule bg-card p-3">
            <input
              value={t.name}
              onChange={(e) => update(i, { name: e.target.value })}
              placeholder="Tier name"
              className="rounded-md border border-rule bg-background p-2 text-sm focus:border-highlight focus:outline-none"
            />
            <input
              type="number"
              value={t.price}
              onChange={(e) => update(i, { price: Number(e.target.value) })}
              placeholder="Price /mo"
              className="rounded-md border border-rule bg-background p-2 text-sm focus:border-highlight focus:outline-none"
            />
            <input
              value={t.cadence}
              onChange={(e) => update(i, { cadence: e.target.value })}
              placeholder="Cadence, e.g. Monthly workshop"
              className="rounded-md border border-rule bg-background p-2 text-sm focus:border-highlight focus:outline-none"
            />
            <input
              value={t.tagline}
              onChange={(e) => update(i, { tagline: e.target.value })}
              placeholder="Tagline"
              className="rounded-md border border-rule bg-background p-2 text-sm focus:border-highlight focus:outline-none"
            />
            <button onClick={() => remove(i)} className="col-span-2 text-left text-xs text-muted-foreground hover:text-destructive">
              Remove tier
            </button>
          </div>
        ))}
        <button onClick={add} className="btn-outline text-xs">Add tier</button>
      </div>
    </div>
  );
}

function ObjectionsEditor({ value, onChange }: { value: Objection[]; onChange: (v: Objection[]) => void }) {
  function update(i: number, patch: Partial<Objection>) {
    onChange(value.map((o, idx) => (idx === i ? { ...o, ...patch } : o)));
  }
  function add() {
    onChange([...value, { title: "", body: "" }]);
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <span className="eyebrow">Objections</span>
      <div className="mt-2 space-y-3">
        {value.map((o, i) => (
          <div key={i} className="space-y-2 rounded-md border border-rule bg-card p-3">
            <input
              value={o.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder="Objection, e.g. it's too expensive"
              className="w-full rounded-md border border-rule bg-background p-2 text-sm focus:border-highlight focus:outline-none"
            />
            <textarea
              value={o.body}
              onChange={(e) => update(i, { body: e.target.value })}
              rows={3}
              placeholder="How to respond"
              className="w-full rounded-md border border-rule bg-background p-2 text-sm focus:border-highlight focus:outline-none"
            />
            <button onClick={() => remove(i)} className="text-xs text-muted-foreground hover:text-destructive">
              Remove objection
            </button>
          </div>
        ))}
        <button onClick={add} className="btn-outline text-xs">Add objection</button>
      </div>
    </div>
  );
}

function IncludedEditor({ value, onChange }: { value: IncludedTier[]; onChange: (v: IncludedTier[]) => void }) {
  function update(i: number, patch: Partial<IncludedTier>) {
    onChange(value.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  }
  function add() {
    onChange([...value, { name: "", price: 0, includes: [] }]);
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <span className="eyebrow">What's included (per tier)</span>
      <div className="mt-2 space-y-3">
        {value.map((t, i) => (
          <div key={i} className="space-y-2 rounded-md border border-rule bg-card p-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                value={t.name}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder="Tier name"
                className="rounded-md border border-rule bg-background p-2 text-sm focus:border-highlight focus:outline-none"
              />
              <input
                type="number"
                value={t.price}
                onChange={(e) => update(i, { price: Number(e.target.value) })}
                placeholder="Price /mo"
                className="rounded-md border border-rule bg-background p-2 text-sm focus:border-highlight focus:outline-none"
              />
            </div>
            <textarea
              value={t.includes.join("\n")}
              onChange={(e) => update(i, { includes: e.target.value.split("\n").filter(Boolean) })}
              rows={4}
              placeholder="One inclusion per line"
              className="w-full rounded-md border border-rule bg-background p-2 text-sm focus:border-highlight focus:outline-none"
            />
            <button onClick={() => remove(i)} className="text-xs text-muted-foreground hover:text-destructive">
              Remove tier
            </button>
          </div>
        ))}
        <button onClick={add} className="btn-outline text-xs">Add tier</button>
      </div>
    </div>
  );
}
