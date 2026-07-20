
CREATE TABLE public.workshop_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  covered TEXT,
  action_items TEXT,
  attended BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workshop_sessions TO authenticated;
GRANT ALL ON public.workshop_sessions TO service_role;
ALTER TABLE public.workshop_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all workshop sessions" ON public.workshop_sessions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients view own workshop sessions" ON public.workshop_sessions
  FOR SELECT TO authenticated
  USING (client_id = auth.uid());
CREATE TRIGGER trg_workshop_sessions_updated
  BEFORE UPDATE ON public.workshop_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.roleplay_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.workshop_sessions(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  recorded_on DATE NOT NULL DEFAULT CURRENT_DATE,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.roleplay_recordings TO authenticated;
GRANT ALL ON public.roleplay_recordings TO service_role;
ALTER TABLE public.roleplay_recordings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all roleplays" ON public.roleplay_recordings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients view own roleplays" ON public.roleplay_recordings
  FOR SELECT TO authenticated
  USING (client_id = auth.uid());
CREATE TRIGGER trg_roleplay_recordings_updated
  BEFORE UPDATE ON public.roleplay_recordings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.kpi_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  opportunities INTEGER NOT NULL DEFAULT 0,
  avg_deal_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  close_rate_est NUMERIC(5,2) NOT NULL DEFAULT 0,
  closed_deal_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  dead_pipeline_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (client_id, month)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kpi_entries TO authenticated;
GRANT ALL ON public.kpi_entries TO service_role;
ALTER TABLE public.kpi_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all kpi entries" ON public.kpi_entries
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients view own kpi entries" ON public.kpi_entries
  FOR SELECT TO authenticated
  USING (client_id = auth.uid());
CREATE POLICY "Clients insert own kpi entries" ON public.kpi_entries
  FOR INSERT TO authenticated
  WITH CHECK (client_id = auth.uid());
CREATE POLICY "Clients update own kpi entries" ON public.kpi_entries
  FOR UPDATE TO authenticated
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());
CREATE TRIGGER trg_kpi_entries_updated
  BEFORE UPDATE ON public.kpi_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage policies for the private 'roleplays' bucket.
-- Path convention: <client_id>/<filename>
CREATE POLICY "Admins manage all roleplay files" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'roleplays' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'roleplays' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients read own roleplay files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'roleplays'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
