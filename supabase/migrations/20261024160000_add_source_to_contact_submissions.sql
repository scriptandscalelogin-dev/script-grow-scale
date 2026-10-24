-- Track how each inbound found us (required by the weekly review: spend, bookings, show-ups, closes).
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS source text;

ALTER TABLE public.contact_submissions
  DROP CONSTRAINT IF EXISTS contact_submissions_source_len;
ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_submissions_source_len
  CHECK (source IS NULL OR length(source) <= 80);
