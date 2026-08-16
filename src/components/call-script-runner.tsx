import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ScriptBlock } from "@/lib/call-script";

export type TierOption = { id: string; name: string; price: number };

export function CallScriptRunner({
  blocks,
  tierOptions,
  clientId = null,
  onSaved,
}: {
  blocks: ScriptBlock[];
  tierOptions: TierOption[];
  clientId?: string | null;
  onSaved: () => void;
}) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [repNotes, setRepNotes] = useState<Record<string, string>>({});
  const [tierConfirmed, setTierConfirmed] = useState("");
  const [startDate, setStartDate] = useState("");
  const [attendanceConfirmed, setAttendanceConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const total = blocks.length;
  const block = blocks[step];

  function reset() {
    setStarted(false);
    setStep(0);
    setAnswers({});
    setRepNotes({});
    setTierConfirmed("");
    setStartDate("");
    setAttendanceConfirmed(false);
    setDone(false);
    setError(null);
  }

  async function save() {
    setSaving(true);
    setError(null);
    const { error: err } = await supabase.from("call_script_runs").insert({
      prospect_name: answers.client_name || null,
      answers,
      rep_notes: repNotes,
      tier_confirmed: tierConfirmed || null,
      start_date_confirmed: startDate || null,
      attendance_commitment_confirmed: attendanceConfirmed,
      client_id: clientId,
    });
    setSaving(false);
    if (err) {
      setError("Couldn't save that. Try again.");
      return;
    }
    setDone(true);
    onSaved();
  }

  if (!started) {
    return (
      <div className="rounded-md border border-rule bg-card p-6">
        <p className="text-sm text-muted-foreground">
          The full call script: intake, recap, pitch, offer, objections, and close. Click through
          live on the call.
        </p>
        <button onClick={() => setStarted(true)} className="btn-cta mt-4">
          Start call script
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-md border border-rule bg-card p-6">
        <div className="font-serif text-xl">Call logged.</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Answers, rep notes, and the confirmed tier/start date are saved.
        </p>
        <button onClick={reset} className="btn-outline mt-4 text-xs">
          Run another
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-rule bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="mono text-xs text-muted-foreground">
          Step {step + 1} of {total}
        </div>
        <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground">
          Cancel
        </button>
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-highlight transition-all duration-300"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>

      <div className="mt-6">
        {block.kind === "question" && (
          <QuestionStep
            label={block.label}
            helper={block.helper}
            multiline={!!block.multiline}
            value={answers[block.key] ?? ""}
            onChange={(v) => setAnswers((a) => ({ ...a, [block.key]: v }))}
          />
        )}

        {block.kind === "script" && (
          <ScriptStep
            title={block.title}
            drafted={!!block.drafted}
            bodyHtml={block.body(answers)}
            repNoteLabel={block.repNoteLabel}
            noteValue={repNotes[block.key] ?? ""}
            onNoteChange={(v) => setRepNotes((n) => ({ ...n, [block.key]: v }))}
          />
        )}

        {block.kind === "confirm" && (
          <ConfirmStep
            tierOptions={tierOptions}
            tierConfirmed={tierConfirmed}
            setTierConfirmed={setTierConfirmed}
            startDate={startDate}
            setStartDate={setStartDate}
            attendanceConfirmed={attendanceConfirmed}
            setAttendanceConfirmed={setAttendanceConfirmed}
          />
        )}
      </div>

      {error && <div className="mt-2 text-xs text-destructive">{error}</div>}

      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-outline text-xs disabled:opacity-40"
        >
          Back
        </button>
        {step < total - 1 ? (
          <button onClick={() => setStep((s) => s + 1)} className="btn-cta text-xs">
            Next
          </button>
        ) : (
          <button onClick={save} disabled={saving} className="btn-cta text-xs">
            {saving ? "Saving…" : "Save & finish"}
          </button>
        )}
      </div>
    </div>
  );
}

function QuestionStep({
  label,
  helper,
  multiline,
  value,
  onChange,
}: {
  label: string;
  helper?: string;
  multiline: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <>
      <div className="font-serif text-2xl leading-snug">{label}</div>
      {helper && <p className="mt-1 text-sm text-muted-foreground">{helper}</p>}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          autoFocus
          className="mt-4 w-full rounded-md border border-rule bg-background p-3 text-sm focus:border-highlight focus:outline-none"
          placeholder="Capture their answer in their own words…"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
          className="mt-4 w-full rounded-md border border-rule bg-background p-3 text-sm focus:border-highlight focus:outline-none"
          placeholder="Answer…"
        />
      )}
    </>
  );
}

function ScriptStep({
  title,
  drafted,
  bodyHtml,
  repNoteLabel,
  noteValue,
  onNoteChange,
}: {
  title: string;
  drafted: boolean;
  bodyHtml: string;
  repNoteLabel?: string;
  noteValue: string;
  onNoteChange: (v: string) => void;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="font-serif text-2xl leading-snug">{title}</div>
        {drafted && (
          <span className="rounded-full border border-highlight/40 bg-highlight/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            Drafted — review before using live
          </span>
        )}
      </div>
      <div
        className="mt-4 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
      {repNoteLabel && (
        <div className="mt-4">
          <label className="text-xs text-muted-foreground">{repNoteLabel}</label>
          <textarea
            value={noteValue}
            onChange={(e) => onNoteChange(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-rule bg-background p-3 text-sm focus:border-highlight focus:outline-none"
            placeholder="Notes for yourself…"
          />
        </div>
      )}
    </>
  );
}

function ConfirmStep({
  tierOptions,
  tierConfirmed,
  setTierConfirmed,
  startDate,
  setStartDate,
  attendanceConfirmed,
  setAttendanceConfirmed,
}: {
  tierOptions: TierOption[];
  tierConfirmed: string;
  setTierConfirmed: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  attendanceConfirmed: boolean;
  setAttendanceConfirmed: (v: boolean) => void;
}) {
  return (
    <>
      <div className="font-serif text-2xl leading-snug">Confirm details</div>
      <div className="mt-4 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground">Tier confirmed</label>
          <select
            value={tierConfirmed}
            onChange={(e) => setTierConfirmed(e.target.value)}
            className="mt-1 w-full rounded-md border border-rule bg-background p-3 text-sm focus:border-highlight focus:outline-none"
          >
            <option value="">Select tier…</option>
            {tierOptions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — £{t.price.toLocaleString("en-GB")}/mo
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Start date confirmed</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 w-full rounded-md border border-rule bg-background p-3 text-sm focus:border-highlight focus:outline-none"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={attendanceConfirmed}
            onChange={(e) => setAttendanceConfirmed(e.target.checked)}
          />
          Attendance commitment confirmed
        </label>
      </div>
    </>
  );
}
