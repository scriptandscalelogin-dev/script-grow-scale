
CREATE TYPE public.content_kind AS ENUM ('script', 'sop', 'objection');
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.content_kind NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  body TEXT NOT NULL DEFAULT '',
  status public.content_status NOT NULL DEFAULT 'draft',
  current_version INTEGER NOT NULL DEFAULT 1,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.content_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (content_id, profile_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_assignments TO authenticated;
GRANT ALL ON public.content_assignments TO service_role;
ALTER TABLE public.content_assignments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  change_notes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (content_id, version_number)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_versions TO authenticated;
GRANT ALL ON public.content_versions TO service_role;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;

-- Policies (all tables now exist so cross-references resolve)
CREATE POLICY "Admins manage content_items"
  ON public.content_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients read assigned published items"
  ON public.content_items FOR SELECT TO authenticated
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.content_assignments a
      WHERE a.content_id = content_items.id AND a.profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage assignments"
  ON public.content_assignments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients view their own assignments"
  ON public.content_assignments FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Admins manage content_versions"
  ON public.content_versions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients read versions of assigned published items"
  ON public.content_versions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.content_items ci
      JOIN public.content_assignments a
        ON a.content_id = ci.id AND a.profile_id = auth.uid()
      WHERE ci.id = content_versions.content_id
        AND ci.status = 'published'
    )
  );

CREATE TRIGGER content_items_set_updated_at
  BEFORE UPDATE ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX content_items_kind_status_idx ON public.content_items(kind, status);
CREATE INDEX content_assignments_profile_idx ON public.content_assignments(profile_id);
CREATE INDEX content_versions_content_idx ON public.content_versions(content_id, version_number DESC);
