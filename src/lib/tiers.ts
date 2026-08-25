type Tier = {
  id: string;
  name: string;
  price: number;
  cadence: string;
  tagline: string;
  includes: string[];
  highlight?: boolean;
};

export const TIERS: Tier[] = [
  {
    id: "opener",
    name: "Opener",
    price: 525,
    cadence: "Monthly cadence. Core process locked in.",
    tagline: "For founders who want the script and process but have limited time for workshops.",
    includes: [
      "Your custom script (configured in onboarding, exported as standalone HTML you keep)",
      "Follow-up sequence tied to your deal cycle",
      "Top 10 objection responses for your space",
      "One 45-minute monthly workshop",
      "Recorded sessions for team replay",
      "Permanent portal access even after you leave",
    ],
  },
  {
    id: "closer",
    name: "Closer",
    price: 1050,
    cadence: "Biweekly cadence. Follow-up on autopilot.",
    tagline: "Most pick this. For founders who want to drill the process and see live results.",
    includes: [
      "Everything in Opener",
      "Two 45-minute workshops per month",
      "Live roleplay against objections your team actually hit this week",
      "Follow-up SOP for email, phone, LinkedIn (sequenced to your deal cycle)",
      "Call coaching (I review your call recordings, we debrief)",
      "Weekly Slack updates if something breaks",
    ],
    highlight: true,
  },
  {
    id: "rainmaker",
    name: "Rainmaker",
    price: 2100,
    cadence: "Weekly cadence. Full call partnership.",
    tagline: "For founders closing £60k+ ARR deals who want live coaching and process refinement.",
    includes: [
      "Everything in Closer",
      "Four 45-minute workshops per month (every Thursday 7pm UK)",
      "I sit on your discovery calls live. We debrief after.",
      "Tonality coaching. You record calls, I listen, we fix what breaks deals.",
      "Ad-hoc script tweaks when you hit new objections",
      "Priority support (24-hour response)",
    ],
  },
] as const;