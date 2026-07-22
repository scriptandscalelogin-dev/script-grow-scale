
-- Restore test client tier/fee that was reset during the security probe
UPDATE public.profiles
SET tier = 'growth', monthly_fee = 1000
WHERE id = '217d0975-2f59-4749-afcf-c3cdd038e869';

-- Trigger: block non-admin users from mutating admin-only profile columns.
-- The existing "Users can update their own profile" RLS policy has no WITH CHECK,
-- which would otherwise let a signed-in client escalate their own tier/fee/status
-- by writing directly to the Data API from the browser.
CREATE OR REPLACE FUNCTION public.protect_profile_admin_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Service role writes (admin backend) bypass this check.
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  IF public.has_role(auth.uid(), 'admin') THEN
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

DROP TRIGGER IF EXISTS protect_profile_admin_fields ON public.profiles;
CREATE TRIGGER protect_profile_admin_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_admin_fields();
