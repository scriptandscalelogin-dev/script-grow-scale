CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- activity_log
DROP POLICY IF EXISTS "Admins read all activity" ON public.activity_log;
CREATE POLICY "Admins read all activity" ON public.activity_log FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

-- contact_submissions
DROP POLICY IF EXISTS "Admins can view submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view submissions" ON public.contact_submissions FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update submissions" ON public.contact_submissions;
CREATE POLICY "Admins can update submissions" ON public.contact_submissions FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- content_assignments
DROP POLICY IF EXISTS "Admins manage assignments" ON public.content_assignments;
CREATE POLICY "Admins manage assignments" ON public.content_assignments FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- content_items
DROP POLICY IF EXISTS "Admins manage content_items" ON public.content_items;
CREATE POLICY "Admins manage content_items" ON public.content_items FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- content_versions
DROP POLICY IF EXISTS "Admins manage content_versions" ON public.content_versions;
CREATE POLICY "Admins manage content_versions" ON public.content_versions FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- deals
DROP POLICY IF EXISTS "Admins delete deals" ON public.deals;
CREATE POLICY "Admins delete deals" ON public.deals FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins insert deals" ON public.deals;
CREATE POLICY "Admins insert deals" ON public.deals FOR INSERT TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins update deals" ON public.deals;
CREATE POLICY "Admins update deals" ON public.deals FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Clients view own deals" ON public.deals;
CREATE POLICY "Clients view own deals" ON public.deals FOR SELECT TO authenticated
USING (profile_id = auth.uid() OR private.has_role(auth.uid(), 'admin'));

-- kpi_entries
DROP POLICY IF EXISTS "Admins manage all kpi entries" ON public.kpi_entries;
CREATE POLICY "Admins manage all kpi entries" ON public.kpi_entries FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- roleplay_recordings
DROP POLICY IF EXISTS "Admins manage all roleplays" ON public.roleplay_recordings;
CREATE POLICY "Admins manage all roleplays" ON public.roleplay_recordings FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- user_roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

-- workshop_sessions
DROP POLICY IF EXISTS "Admins manage all workshop sessions" ON public.workshop_sessions;
CREATE POLICY "Admins manage all workshop sessions" ON public.workshop_sessions FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- storage policies for the roleplays bucket
DROP POLICY IF EXISTS "Admins manage all roleplay files" ON storage.objects;
CREATE POLICY "Admins manage all roleplay files" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'roleplays' AND private.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'roleplays' AND private.has_role(auth.uid(), 'admin'));

-- profile field protection trigger
CREATE OR REPLACE FUNCTION public.protect_profile_admin_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  IF private.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.monthly_fee IS DISTINCT FROM OLD.monthly_fee
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.start_date IS DISTINCT FROM OLD.start_date
     OR NEW.notes IS DISTINCT FROM OLD.notes
     OR NEW.email IS DISTINCT FROM OLD.email
  THEN
    RAISE EXCEPTION 'Only admins can modify tier, monthly_fee, status, start_date, notes, email, or id'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.protect_profile_admin_fields() FROM PUBLIC, anon, authenticated;

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);