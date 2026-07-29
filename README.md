# Script & Scale Hub

SCRIPT & SCALE: LOVABLE BUILD PROMPT

Build a two-part product: a marketing website and a client portal with login, for a company called Script & Scale.

THE BUSINESS Script & Scale is a Revenue Enablement subscription for UK small businesses without a sales process (ITSM providers, MSPs, consultancies). Founder-led, ad hoc, deals leaking in follow-up. Delivery is 30-45 minute workshops, weekly, biweekly, or monthly depending on tier.

Tiers:

Starter (£500/mo): monthly workshop, core script, objection library

Growth (£1,000/mo): biweekly workshop, follow-up SOPs, roleplay drills

Scale (£2,000/mo): weekly cadence, tonality coaching, live call review

Offer terms: 3-month minimum, £250 onboarding fee, monthly rolling after that. Guarantee: if closed deal value across the first 3 months doesn't cover fees paid, and the client attended workshops and ran the program, month 4 is free until it does.

PART 1: MARKETING WEBSITE Public pages, no login required.

Home: hero with the core problem (founder-led sales, no process, leaking deals in follow-up), the three tiers with pricing, the guarantee explained plainly, a call-to-action to book a discovery call

How it works: the workshop cadence, what a client gets (script, objection library, SOPs, roleplay drills, live call review depending on tier)

Pricing: the three tiers side by side, onboarding fee and minimum term stated clearly

Guarantee: dedicated page explaining the mechanic in plain terms (fee recovery only, attendance required, no cash refund)

About: founder credibility, no invented stats

Contact / book a call: a form (name, email, company, company type, message) that stores submissions in the database for me to follow up on manually. No auto-booking calendar integration needed yet.

Tone: direct, no sales fluff, no triplets or generic SaaS copy ("seamless," "revolutionary," "game-changing"). Write it the way a founder who's actually done sales would write it, not the way an AI describes sales.

PART 2: CLIENT PORTAL (behind login) Two roles: admin (me) and client. Client accounts are created by admin, not self-signup.

Data model, one record per client:

Client profile: company name, contact name, email, tier (Starter/Growth/Scale), start date, 3-month guarantee window dates, subscription status

Scripts: title, content (rich text), version history, last updated date

SOPs: title, content (rich text), category (follow-up, objection handling, onboarding, etc.), last updated date

Objection handling sheets: objection name, response script, category, last updated date

Roleplay recordings: title, date, audio or video file upload, notes, linked to a specific workshop session if relevant

Workshop sessions log: date, tier-appropriate cadence, what was covered, action items, attendance (attended/missed), linked coaching notes

Progress notes: freeform notes per client, dated, visible to admin; a client-facing subset visible to the client

KPI tracking: opportunities per month, average deal value, close rate estimate, closed deal value (running total against the guarantee threshold), dead-pipeline value

Client view (client logs in and sees only their own data):

Dashboard: their tier, next workshop date, guarantee progress (closed deal value vs. fees paid so far, visual progress bar), recent scripts/SOPs

Scripts & SOPs library: everything assigned to them, organized by category, searchable

Objection handling sheets: same, searchable by objection type

Roleplay recordings: theirs only, playable in browser

Session history: past workshops, what was covered, action items

KPI submission: simple form to log monthly opportunities, average deal value, closed deals (admin can also edit)

Admin view (me):

All clients in one list, filterable by tier and guarantee status

Per-client detail page: everything above, editable

Add/edit scripts, SOPs, objection sheets, assign to one or more clients (some content is shared across all clients on a tier, some is client-specific)

Upload roleplay recordings, log workshop sessions

Guarantee tracker across all clients: who's approaching month 3, who's below the fee-recovery threshold

Contact form submissions from the marketing site

AUTH Email/password login. Admin and client are different permission levels on the same auth system, not separate apps. Client accounts are created by admin (invite by email), not open signup.

DESIGN Clean, direct, professional. Not generic SaaS-blue. Something that reads as built by someone who does sales for a living, not a template. Dark or light is your call, but no stock gradient hero.

FIRST BUILD PRIORITY

Marketing site (all public pages)

Auth (admin + client login)

Admin: client list, add/edit client profile

Client dashboard with guarantee progress

Scripts/SOPs/objection sheets library (both admin edit and client view)

Roleplay upload and playback

KPI tracking and session history

Leave payment processing (Stripe) for a later pass, this build is the portal and content storage first.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/750aae0f-e026-447b-b4df-0febd31267ab).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
