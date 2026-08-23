import { TIERS } from "@/lib/tiers";

export type ScriptBlock =
  | {
      kind: "question";
      key: string;
      label: string;
      helper?: string;
      multiline?: boolean;
    }
  | {
      kind: "script";
      key: string;
      title: string;
      body: (answers: Record<string, string>) => string;
      repNoteLabel?: string;
      drafted?: boolean;
    }
  | { kind: "confirm" };

export type OfferTier = { name: string; price: number; cadence: string; tagline: string };
export type IncludedTier = { name: string; price: number; includes: string[] };
export type Objection = { title: string; body: string };

export type ScriptConfig = {
  pitchBody: string;
  transitionBody: string;
  offer: OfferTier[];
  mechanicBody: string;
  objections: Objection[];
  proofBody: string;
  riskReversalBody: string;
  whatsIncluded: IncludedTier[];
  closeBody: string;
};

export function money(n: number) {
  return `£${Number(n || 0).toLocaleString("en-GB")}`;
}

function m(answers: Record<string, string>, key: string) {
  return answers[key]?.trim() || "none given";
}

function nl2br(text: string) {
  return (text || "").replace(/\n/g, "<br>");
}

// ---- Intake questions: generic, same for every business, this is what makes
// the diagnosis work regardless of what's being sold. ----
export const INTAKE_QUESTIONS: ScriptBlock[] = [
  { kind: "question", key: "client_name", label: "Client name" },
  { kind: "question", key: "motivation", label: "What motivated you to book this call?", multiline: true },
  { kind: "question", key: "prior_coach", label: "Have you worked with a coach, trainer, or consultant on your sales process before?" },
  {
    kind: "question",
    key: "prior_attempts",
    label: "How did it go, what worked and what didn't? (if applicable) What have you tried on your own, if anything? (if no prior coach)",
    multiline: true,
  },
  { kind: "question", key: "last_lost_deal", label: "Thinking about your most recent lost deal, what happened there?", multiline: true },
  { kind: "question", key: "why_deals_dont_close", label: "What's the most common reason deals don't close for you, in general?", multiline: true },
  { kind: "question", key: "business_description", label: "What does your business do and specialise in?", multiline: true },
  {
    kind: "question",
    key: "lead_to_close",
    label: "Walk me through your full lead-to-close process, step by step, from when a lead first comes in to when it either closes or falls away.",
    helper: "This is usually where the leak surfaces.",
    multiline: true,
  },
  { kind: "question", key: "dream_client", label: "Who is your dream client?", multiline: true },
  { kind: "question", key: "profitable_services", label: "Which services make you the most profit?" },
  { kind: "question", key: "why_choose_you", label: "Why would someone choose you over your competition?", multiline: true },
  { kind: "question", key: "most_enquired_services", label: "What services do people enquire about most?" },
  { kind: "question", key: "avg_client_value", label: "What is your average client value?" },
  { kind: "question", key: "opportunities_per_month", label: "Roughly how many opportunities or leads do you get each month?" },
  { kind: "question", key: "sales_closed_per_month", label: "How many sales do you close in a month?" },
  { kind: "question", key: "conversion_rate", label: "What is your current conversion rate estimate?" },
  { kind: "question", key: "who_handles_sales", label: "Who handles selling and sales calls right now?" },
  {
    kind: "question",
    key: "conversion_increase_impact",
    label: "If you could increase your conversions by X%, what impact would that have on your business?",
    multiline: true,
  },
  { kind: "question", key: "no_change_consequence", label: "If you don't change anything now, what happens?", multiline: true },
  { kind: "question", key: "other_business_plans", label: "What other plans do you have for the business?", multiline: true },
  {
    kind: "question",
    key: "goals_3_6_months",
    label: "What are your 3 to 6 month goals, and how do you plan to achieve them?",
    multiline: true,
  },
];

export const RECAP_BLOCK: ScriptBlock = {
  kind: "script",
  key: "recap",
  title: "Recap",
  repNoteLabel: "Rep notes",
  body: (a) =>
    `So I've got tons of notes here based on what we've discussed, I won't recap all of it, but here's a quick summary of some of the things we've discussed.<br><br>` +
    `<b>You booked a call with me today because</b>: ${m(a, "motivation")}<br><br>` +
    `<b>I asked what you've tried on your own and you said</b>: ${m(a, "prior_attempts")}<br><br>` +
    `<b>Your business does</b>: ${m(a, "business_description")}<br><br>` +
    `<b>You said your dream client was the following</b>: ${m(a, "dream_client")}<br><br>` +
    `<b>I asked why someone might choose you over your competition and you said</b>: ${m(a, "why_choose_you")}<br><br>` +
    `<b>Per customer you estimated you make</b>: ${m(a, "avg_client_value")}<br><br>` +
    `I've written down a lot here so I won't go through all of it again, but does that all sound roughly correct to you?`,
};

export const CONFIRM_BLOCK: ScriptBlock = { kind: "confirm" };

// ---- Builds the pitch/offer/objections/close blocks from any script config,
// whether that's Script & Scale's own or a specific client's. ----
export function buildPitchBlocks(config: ScriptConfig): ScriptBlock[] {
  const blocks: ScriptBlock[] = [
    {
      kind: "script",
      key: "what_we_actually_do",
      title: "What we actually do",
      repNoteLabel: "Rep notes",
      body: () => nl2br(config.pitchBody),
    },
    {
      kind: "script",
      key: "transition",
      title: "Transition",
      repNoteLabel: "Rep notes",
      body: () => nl2br(config.transitionBody),
    },
    {
      kind: "script",
      key: "the_offer",
      title: "The offer",
      repNoteLabel: "Rep notes on which tier the prospect leans toward",
      body: () =>
        config.offer
          .map((t) => `<b>${t.name}</b>: ${money(t.price)} per month, ${t.cadence.toLowerCase()}, ${t.tagline}`)
          .join("<br><br>"),
    },
    {
      kind: "script",
      key: "the_mechanic",
      title: "The mechanic",
      repNoteLabel: "Rep notes",
      body: () => nl2br(config.mechanicBody),
    },
  ];

  config.objections.forEach((o, i) => {
    blocks.push({
      kind: "script",
      key: `objection_${i}`,
      title: `Objection: ${o.title}`,
      repNoteLabel: "Rep notes on how the prospect responded",
      body: () => nl2br(o.body),
    });
  });

  blocks.push(
    {
      kind: "script",
      key: "the_proof",
      title: "The proof",
      repNoteLabel: "Rep notes",
      body: () => nl2br(config.proofBody),
    },
    {
      kind: "script",
      key: "the_risk_reversal",
      title: "The risk reversal",
      repNoteLabel: "Rep notes",
      body: () => nl2br(config.riskReversalBody),
    },
    {
      kind: "script",
      key: "whats_included",
      title: "What's included",
      repNoteLabel: "Rep notes",
      body: () =>
        config.whatsIncluded
          .map((t) => `<b>${t.name} (${money(t.price)}/mo)</b><br>` + t.includes.map((i) => `• ${i}`).join("<br>"))
          .join("<br><br>"),
    },
    {
      kind: "script",
      key: "the_close",
      title: "The close",
      repNoteLabel: "Rep notes",
      body: () => nl2br(config.closeBody),
    },
  );

  return blocks;
}

export function buildScriptBlocks(config: ScriptConfig): ScriptBlock[] {
  return [...INTAKE_QUESTIONS, RECAP_BLOCK, ...buildPitchBlocks(config), CONFIRM_BLOCK];
}

function withDrafted(blocks: ScriptBlock[], keys: string[]): ScriptBlock[] {
  return blocks.map((b) => (b.kind === "script" && keys.includes(b.key) ? { ...b, drafted: true } : b));
}

// ---- Script & Scale's own content, as a config like any other. The four
// sections below were empty placeholders in the original Jotform version,
// drafted here from verified master-prompt facts only. ----
export const SCRIPT_AND_SCALE_CONFIG: ScriptConfig = {
  pitchBody:
    "We consider ourselves a fully managed revenue enablement service. Our goal is to fix the leak in your sales process so the leads and opportunities you already have convert, without you needing to build that process yourself.\n\n" +
    "Our process relies on three pillars: Diagnosis, Script, and Cadence.\n\n" +
    "Diagnosis: We map your entire lead-to-close journey with you, live, in the first workshop. This surfaces exactly where deals are leaking, whether that's follow-up, objection handling, or how calls are structured. You don't have to guess where the problem is, we find it with you.\n\n" +
    "Script: We build the actual scripts, objection responses, and follow-up sequences your team uses on every call and message from there. This isn't generic training, it's built around your specific offer, your specific objections, and the deals you're actually losing.\n\n" +
    "Cadence: Ongoing workshops (monthly, biweekly, or weekly depending on tier) keep the process alive: roleplay drills, live call review, and tonality coaching so the fix compounds instead of fading after one session.\n\n" +
    "Essentially, we do the work of building and running your sales process so you can focus on running your business.\n\n" +
    "And that's how we help you convert the pipeline you already have, consistently.\n\nHave you got any questions about that?",
  transitionBody: "Based on what you've shared, here's where I think the leak is and how we'd fix it.",
  offer: TIERS.map((t) => ({ name: t.name, price: t.price, cadence: t.cadence, tagline: t.tagline })),
  mechanicBody: "3 month minimum. £250 onboarding fee. Monthly rolling after. Attendance is mandatory for the guarantee to apply.",
  objections: [
    {
      title: "I need proof this works",
      body:
        "Isolate first: Is the doubt that this works at all, or that it works for your specific situation?\n\n" +
        "If general doubt, speak to track record: over 10 years in B2B sales, SaaS deals closed in the £12,000 to £180,000 ARR range, most recent close £60,000 per month, top 5 percent performance across 5 territories.\n\n" +
        "If specific doubt, dig into what's different about their business before responding.\n\n" +
        "Only once isolated, close with the guarantee line: If deal value in the first 3 months doesn't cover fees paid, and you've attended and run the program, month 4 is free until it does.",
    },
    {
      title: "let me think about it",
      body: "If it's a genuine blocker, let's name it right now. If it's just a pause, the pipeline won't wait, let's close this today.",
    },
  ],
  proofBody:
    "Before we get into the how, here's why this isn't guesswork.\n\n" +
    "Over 10+ years in B2B sales across SaaS, telecoms, and enterprise. SaaS deals closed in the £12,000–£180,000 ARR range, most recent close £60,000 a month, in the founder's most recent role prior to founding Script & Scale.\n\n" +
    "Top 5% performance across 5 territories.\n\n" +
    "Every framework you're looking at right now, KYC, roleplay, objection handling, is the same structure used to close those deals personally.\n\n" +
    "Foundation-level certified in ITIL4, PRINCE2 Agile, DevOps, and TOGAF.",
  riskReversalBody:
    "If closed deal value across your first three months doesn't cover the fees you paid, and you attended the workshops and ran the program, month four is free. Every month after that too, until we're square.\n\n" +
    "No cash refund. Attendance is required. It's a real guarantee, not a marketing one. It works because both sides show up.",
  whatsIncluded: TIERS.map((t) => ({ name: t.name, price: t.price, includes: t.includes })),
  closeBody:
    "So here's what happens next: we lock in a tier, agree a start date, and get your first workshop on the calendar. Three month minimum, £250 onboarding fee, monthly rolling after that.\n\n" +
    "Based on everything we've talked through, which tier makes the most sense for you?",
};

export const CALL_SCRIPT: ScriptBlock[] = withDrafted(buildScriptBlocks(SCRIPT_AND_SCALE_CONFIG), [
  "the_proof",
  "the_risk_reversal",
  "whats_included",
  "the_close",
]);
