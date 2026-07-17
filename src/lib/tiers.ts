export const TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: 500,
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
    id: "growth",
    name: "Growth",
    price: 1000,
    cadence: "Biweekly workshop",
    tagline: "Follow-up stops leaking.",
    includes: [
      "Everything in Starter",
      "Biweekly cadence — two workshops per month",
      "Follow-up SOPs (email, LinkedIn, phone)",
      "Roleplay drills against objections you hit last week",
    ],
    highlight: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: 2000,
    cadence: "Weekly workshop",
    tagline: "Reps, review, tonality.",
    includes: [
      "Everything in Growth",
      "Weekly cadence — four workshops per month",
      "Tonality coaching on real recordings",
      "Live call review — I sit on your calls, we debrief after",
    ],
  },
] as const;
