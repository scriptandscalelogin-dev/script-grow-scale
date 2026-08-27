import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

function reflectionFor(reason: string): string {
  const r = reason.toLowerCase();
  if (/follow[\s-]?up/.test(r)) {
    return "That points at follow-up, not lead volume. Most deals here don't die from too few leads, they die from what happens after the first conversation.";
  }
  if (/price|pricing|cost|budget|expensive/.test(r)) {
    return "That's usually not really a pricing objection, it's a sign the value never got anchored early enough in the call.";
  }
  if (/time|busy|no process|never get to it|forget|slip/.test(r)) {
    return "That's a process gap, not a willpower problem. Founder-led sales without anything written down leaks exactly like this.";
  }
  if (/competit|competitor|shopping around|comparing/.test(r)) {
    return "If they're comparing you on price alone, that's a sign the differentiation never got said out loud during the call.";
  }
  return "That's a pattern we see constantly in founder-led sales without a written process, it's rarely a lead-volume problem.";
}

export function MiniDiagnostic() {
  const [step, setStep] = useState(0);
  const [opportunities, setOpportunities] = useState("");
  const [closeRate, setCloseRate] = useState("");
  const [avgDealValue, setAvgDealValue] = useState("");
  const [reason, setReason] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const oppN = Number(opportunities) || 0;
  const dealN = Number(avgDealValue) || 0;
  const deadPipelineValue = oppN * dealN;

  async function finish() {
    await supabase.from("mini_diagnostic_leads").insert({
      opportunities: oppN,
      close_rate: Number(closeRate) || 0,
      avg_deal_value: dealN,
      why_deals_dont_close: reason,
      dead_pipeline_value: deadPipelineValue,
      email: email || null,
    });
    setSubmitted(true);
  }

  const steps = [
    {
      label: "Roughly how many opportunities or leads do you get a month?",
      value: opportunities,
      onChange: setOpportunities,
      type: "number",
      placeholder: "e.g. 12",
    },
    {
      label: "What's your rough close rate estimate?",
      value: closeRate,
      onChange: setCloseRate,
      type: "number",
      placeholder: "e.g. 20 (as a %)",
    },
    {
      label: "What's your average deal value?",
      value: avgDealValue,
      onChange: setAvgDealValue,
      type: "number",
      placeholder: "e.g. 3000",
    },
    {
      label: "In one line, what's the most common reason deals don't close?",
      value: reason,
      onChange: setReason,
      type: "text",
      placeholder: "e.g. they go quiet after the quote",
    },
  ];

  if (submitted) {
    return (
      <div className="rounded-md border border-rule bg-card p-6">
        <div className="eyebrow">Your leak, roughly</div>
        <p className="mt-3 text-sm">
          Based on what you've told me, you've got roughly{" "}
          <span className="font-medium text-highlight">
            £{deadPipelineValue.toLocaleString("en-GB")}
          </span>{" "}
          in opportunities moving through your pipeline each month.
        </p>
        <p className="mt-3 text-sm">{reflectionFor(reason)}</p>
        <p className="mt-4 text-xs text-muted-foreground">
          This is a rough read from four numbers, not a diagnosis. The real one happens on a call, live, against your actual last five deals.
        </p>
        <Link to="/contact" className="btn-cta mt-5 inline-block">Book a discovery call</Link>
      </div>
    );
  }

  if (step >= steps.length) {
    return (
      <div className="rounded-md border border-rule bg-card p-6">
        <div className="font-serif text-lg md:text-xl">One optional thing</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Want the number emailed to you too? Leave your email, or skip straight to the result.
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com (optional)"
          className="mt-4 w-full rounded-md border border-rule bg-background p-4 text-base md:text-sm focus:border-highlight focus:outline-none focus:ring-2 focus:ring-highlight/50"
          aria-label="Email address (optional)"
        />
        <div className="mt-6 flex items-center justify-between gap-3">
          <button 
            onClick={() => setStep((s) => s - 1)} 
            className="btn-outline text-sm md:text-xs h-12 md:h-10 min-w-12"
            aria-label="Go to previous question"
          >
            Back
          </button>
          <button 
            onClick={finish} 
            className="btn-cta text-sm md:text-xs h-12 md:h-10 px-6"
            aria-label="View your pipeline leak estimate"
          >
            Show me the number
          </button>
        </div>
      </div>
    );
  }

  const current = steps[step];

  return (
    <div className="rounded-md border border-rule bg-card p-6">
      <div className="mono text-xs text-muted-foreground">Question {step + 1} of {steps.length}</div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-highlight transition-all duration-300"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
      <label htmlFor={`q-${step}`} className="mt-5 block font-serif text-lg md:text-xl leading-snug">
        {current.label}
      </label>
      <input
        id={`q-${step}`}
        type={current.type}
        value={current.value}
        onChange={(e) => current.onChange(e.target.value)}
        placeholder={current.placeholder}
        autoFocus
        inputMode={current.type === "number" ? "numeric" : "text"}
        className="mt-4 w-full rounded-md border border-rule bg-background p-4 text-base md:text-sm focus:border-highlight focus:outline-none focus:ring-2 focus:ring-highlight/50"
        aria-label={`Answer to: ${current.label}`}
      />
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-outline text-sm md:text-xs disabled:opacity-40 h-12 md:h-10 min-w-12"
          aria-label="Go to previous question"
        >
          Back
        </button>
        <button
          onClick={() => setStep((s) => s + 1)}
          disabled={!current.value}
          className="btn-cta text-sm md:text-xs disabled:opacity-40 h-12 md:h-10 px-6"
          aria-label={step === steps.length - 1 ? "View your pipeline leak estimate" : "Go to next question"}
        >
          {step === steps.length - 1 ? "See my number" : "Next"}
        </button>
      </div>
    </div>
  );
}
