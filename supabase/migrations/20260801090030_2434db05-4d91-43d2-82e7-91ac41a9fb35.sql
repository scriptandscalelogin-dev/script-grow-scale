-- 1. contact_submissions INSERT: replace WITH CHECK (true) with real validation
DROP POLICY IF EXISTS "Anyone can submit a contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit a contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  handled = false
  AND length(btrim(name)) BETWEEN 1 AND 120
  AND length(btrim(company)) BETWEEN 1 AND 160
  AND length(btrim(message)) BETWEEN 1 AND 5000
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(email) <= 254
  AND (company_type IS NULL OR length(company_type) <= 80)
);

-- 2. profiles self-update: add owner-scoped WITH CHECK (was missing => permissive on new row)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. trigger function must not be directly callable via the API
REVOKE ALL ON FUNCTION public.protect_profile_admin_fields() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;