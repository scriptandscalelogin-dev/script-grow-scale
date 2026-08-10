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
    cadence: "Monthly workshop",
    tagline: "Core process, in place.",
    includes: [
      "One 30–45 minute workshop per month",
      "Core sales script tailored to your offer",
      "Objection library (top 10 for your market)",
      "Recorded workshops for team replay",
    ],
  },
  {
    id: "closer",
    name: "Closer",
    price: 1050,
    cadence: "Biweekly workshop",
    tagline: "Follow-up stops leaking.",
    includes: [
      "Everything in Opener",
      "Biweekly cadence: two workshops a month",
      "Follow-up SOPs (email, LinkedIn, phone)",
      "Roleplay drills against objections you hit last week",
    ],
    highlight: true,
  },
  {
    id: "rainmaker",
    name: "Rainmaker",
    price: 2100,
    cadence: "Weekly workshop",
    tagline: "Reps, review, tonality.",
    includes: [
      "Everything in Closer",
      "Weekly cadence: four workshops a month",
      "Tonality coaching on real recordings",
      "Live call review. I sit on your calls, we debrief after.",
    ],
  },
] as const;