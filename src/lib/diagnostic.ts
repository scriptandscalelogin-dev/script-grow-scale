export type DiagnosticQuestion = {
  key: string;
  question: string;
  helper?: string;
};

// The KYC framework, in order. Order matters: each question is meant to be
// asked live, in this sequence, on a real call.
export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  { key: "whats_broken", question: "What's broken right now?" },
  { key: "who_handles_sales", question: "Who handles sales and how?" },
  {
    key: "lead_to_close",
    question:
      "Walk me through your full lead-to-close process, step by step, from when a lead first comes in to when it either closes or falls away.",
    helper: "This is usually where the leak surfaces.",
  },
  { key: "opportunities_per_month", question: "Roughly how many opportunities or leads do you get each month?" },
  { key: "avg_deal_value", question: "What is your average deal value?" },
  { key: "why_deals_dont_close", question: "What's the most common reason deals don't close for you, in general?" },
  { key: "last_lost_deal", question: "Tell me about your last lost deal. What happened there?" },
  { key: "close_rate", question: "What's your current close rate estimate?" },
  { key: "whats_been_tried", question: "What's been tried before to fix this? Any coach, training, or tools?" },
  { key: "goals_3_6_months", question: "What are your goals for the next 3 to 6 months, and how do you plan to achieve them?" },
];
