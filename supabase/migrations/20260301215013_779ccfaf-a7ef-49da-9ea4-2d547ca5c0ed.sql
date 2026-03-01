
-- ============================================
-- MIGRATION 1A: Create enum and has_role function
-- ============================================

-- 1. Create app_role enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'sub_admin', 'subscriber', 'user', 'general_sub_admin', 'content_sub_admin', 'journalist_pr', 'expert');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Create has_role function with app_role enum
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role::text
  );
$$;

-- 3. is_admin_or_subadmin helper
CREATE OR REPLACE FUNCTION public.is_admin_or_subadmin(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = p_user_id
      AND role IN ('admin', 'sub_admin')
  );
$$;
