# Script & Scale — Build Plan

Two-part app: public marketing site + authenticated portal (admin + client roles). Backend on Lovable Cloud (Postgres, auth, storage). Payments deferred.

## Phase 1 — Marketing site + auth foundation (this build)

**Public routes**
- `/` Home — problem, three tiers, guarantee, CTA to `/contact`
- `/how-it-works` — cadence + deliverables per tier
- `/pricing` — three tiers side by side, onboarding fee, 3-month minimum
- `/guarantee` — plain-English mechanic, attendance requirement, fee recovery only
- `/about` — founder credibility, no fabricated stats (placeholder copy the user edits)
- `/contact` — form (name, email, company, company type, message) → `contact_submissions` table
- `/auth` — email/password sign in (no public signup)

**Design direction**
- Direct, sales-operator feel. Off-white/warm neutral background, near-black ink, single sharp accent (deep red or oxblood), tight monospace for numbers/tier prices, serif or heavy geometric sans for headings, no gradient hero, no stock imagery. Semantic tokens in `src/styles.css` only.

**Auth**
- Lovable Cloud email/password. Admin creates client accounts (no self-signup — `/auth` shows sign-in only).
- `profiles` table (id, full_name, email) + `user_roles` table with `app_role` enum (`admin`, `client`) and `has_role()` SECURITY DEFINER function.
- Managed `_authenticated` gate for portal routes.

**Content submission storage**
- `contact_submissions` table, public insert policy, admin-only select.

## Phase 2 — Portal core (next build)

- `clients` table linked 1:1 to a client auth user (company, contact, tier enum, start_date, guarantee_window_end, subscription_status, fees_paid_to_date).
- Admin: `/admin` client list (filter tier + guarantee status), `/admin/clients/$id` edit profile, contact submissions inbox.
- Client: `/portal` dashboard — tier, next workshop date, guarantee progress bar (closed_deal_value / fees_paid).

## Phase 3 — Content library

- `scripts`, `sops`, `objections` tables with rich-text content, category, updated_at, plus `content_assignments` join table (content ↔ client, or content ↔ tier for shared).
- `script_versions` table for version history.
- Admin CRUD + assignment UI. Client library views with search/filter, read-only.

## Phase 4 — Sessions, roleplays, KPIs

- `workshop_sessions` (client_id, date, covered, action_items, attendance, notes).
- `roleplay_recordings` (client_id, title, date, storage file, notes, session_id nullable) — Storage bucket `roleplays`, private, RLS by client.
- `kpi_entries` (client_id, month, opportunities, avg_deal_value, close_rate_est, closed_deal_value, dead_pipeline_value). Client submits, admin edits. Guarantee tracker aggregates across clients.
- `progress_notes` (client_id, date, body, client_visible bool).

## Technical notes

- TanStack Start routes: public files at top level; portal under `src/routes/_authenticated/` (managed gate). Admin sub-gate via `has_role` check in a nested pathless `_admin` layout using a `requireSupabaseAuth` server fn.
- Every mutation via `createServerFn` + `requireSupabaseAuth`. RLS: clients see only rows where `client_id` maps to their auth user; admins gated via `has_role(auth.uid(), 'admin')`.
- Storage bucket `roleplays` private; signed URLs via server fn for playback.
- `sitemap.xml` + `robots.txt` for public pages. Per-route `head()` metadata with distinct titles/descriptions.
- All colors as oklch semantic tokens; no hardcoded hex in components.

## This turn delivers

Phase 1 only: marketing site (6 public routes with distinct SEO), design system, Lovable Cloud enabled, auth + roles schema, `/auth` sign-in page, contact form wired to DB, sitemap/robots. Portal shell stubbed with a placeholder dashboard so admin-created accounts can log in; full portal features land in Phase 2+.

Confirm to proceed, or tell me what to reshuffle (e.g. collapse phases, change accent color, skip a page).
