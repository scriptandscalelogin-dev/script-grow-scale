-- Activity log for admin visibility into client actions.
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'login' | 'view_content'
  target_kind text,          -- e.g. 'script' | 'sop' | 'objection'
  target_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX activity_log_user_id_created_at_idx
  ON public.activity_log (user_id, created_at DESC);

GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Users can insert their own events.
CREATE POLICY "Users insert own activity"
  ON public.activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all; users can read their own.
CREATE POLICY "Admins read all activity"
  ON public.activity_log
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users read own activity"
  ON public.activity_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
