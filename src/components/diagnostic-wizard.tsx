import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DIAGNOSTIC_QUESTIONS } from "@/lib/diagnostic";

export function DiagnosticWizard({
  clientId,
  onSubmitted,
}: {
  clientId: string | null;
  onSubmitted: () => void;
}) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const total = DIAGNOSTIC_QUESTIONS.length;
  const current = DIAGNOSTIC_QUESTIONS[step];
  const value = answers[current?.key ?? ""] ?? "";

  function setValue(v: string) {
    setAnswers((a) => ({ ...a, [current.key]: v }));
  }

  async function submit() {
    setSaving(true);
    setError(null);
    const payload: Record<string, string> = {};
    for (const q of DIAGNOSTIC_QUESTIONS) {
      payload[q.question] = answers[q.key] ?? "";
    }
    const { error: err } = await supabase.from("diagnostic_submissions").insert({
      client_id: clientId ?? null,
      answers: payload,
    });
    setSaving(false);
    if (err) {
      setError("Couldn't save that. Try again.");
      return;
    }
    setDone(true);
    onSubmitted();
  }

  function reset() {
    setStarted(false);
    setStep(0);
    setAnswers({});
    setDone(false);
    setError(null);
  }

  if (!started) {
    return (
      <div className="rounded-md border border-rule bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Ten questions, in order, meant to be asked live on a call. Capture their answers in their
          own words as you go.
        </p>
        <button onClick={() => setStarted(true)} className="btn-cta mt-4">
          Start diagnostic
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-md border border-rule bg-card p-6">
        <div className="font-serif text-xl">Diagnosis captured.</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Use this to find where the deal is leaking before you pitch anything.
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
          Question {step + 1} of {total}
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

      <div className="mt-6 font-serif text-2xl leading-snug">{current.question}</div>
      {current.helper && <p className="mt-1 text-sm text-muted-foreground">{current.helper}</p>}

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        autoFocus
        className="mt-4 w-full rounded-md border border-rule bg-background p-3 text-sm focus:border-highlight focus:outline-none"
        placeholder="Capture their answer in their own words…"
      />

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
          <button onClick={submit} disabled={saving} className="btn-cta text-xs">
            {saving ? "Saving…" : "Finish"}
          </button>
        )}
      </div>
    </div>
  );
}
