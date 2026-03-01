
-- ============================================
-- MIGRATION 1B: Taxonomy & lookup tables
-- ============================================

-- Sectors
CREATE TABLE IF NOT EXISTS public.sectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  name_ar text,
  slug text NOT NULL UNIQUE
);
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage sectors" ON public.sectors FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can view sectors" ON public.sectors FOR SELECT USING (true);

-- Tags
CREATE TABLE IF NOT EXISTS public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ar text,
  slug text NOT NULL UNIQUE,
  usage_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage tags" ON public.tags FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can view tags" ON public.tags FOR SELECT USING (true);

-- Profile types
CREATE TABLE IF NOT EXISTS public.profile_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ar text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profile_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage profile_types" ON public.profile_types FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can view profile_types" ON public.profile_types FOR SELECT USING (true);

-- Journalist roles
CREATE TABLE IF NOT EXISTS public.journalist_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ar text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.journalist_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage journalist_roles" ON public.journalist_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can view journalist_roles" ON public.journalist_roles FOR SELECT USING (true);

-- Media roles
CREATE TABLE IF NOT EXISTS public.media_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ar text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.media_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage media_roles" ON public.media_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can view media_roles" ON public.media_roles FOR SELECT USING (true);

-- Employment status
CREATE TABLE IF NOT EXISTS public.employment_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ar text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.employment_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage employment_status" ON public.employment_status FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can view employment_status" ON public.employment_status FOR SELECT USING (true);

-- News desk types
CREATE TABLE IF NOT EXISTS public.news_desk_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ar text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.news_desk_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage news_desk_types" ON public.news_desk_types FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can view news_desk_types" ON public.news_desk_types FOR SELECT USING (true);

-- Periodical types
CREATE TABLE IF NOT EXISTS public.periodical_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ar text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.periodical_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage periodical_types" ON public.periodical_types FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can view periodical_types" ON public.periodical_types FOR SELECT USING (true);

-- Source types
CREATE TABLE IF NOT EXISTS public.source_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ar text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.source_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage source_types" ON public.source_types FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can view source_types" ON public.source_types FOR SELECT USING (true);

-- Platform config
CREATE TABLE IF NOT EXISTS public.platform_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage platform_config" ON public.platform_config FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can read platform_config" ON public.platform_config FOR SELECT USING (true);

-- Rate limits (service role only)
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  function_name text NOT NULL,
  window_start timestamptz NOT NULL DEFAULT now(),
  request_count integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON public.rate_limits(identifier, function_name);
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only rate_limits" ON public.rate_limits FOR ALL USING (false);

-- Account status
CREATE TABLE IF NOT EXISTS public.account_status (
  user_id uuid PRIMARY KEY,
  status text NOT NULL DEFAULT 'pending',
  activated_by text,
  activated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.account_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all account statuses" ON public.account_status FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can check account status" ON public.account_status FOR SELECT USING (true);

-- User permissions
CREATE TABLE IF NOT EXISTS public.user_permissions (
  user_id uuid PRIMARY KEY,
  can_bypass_coins boolean NOT NULL DEFAULT false,
  can_view_all_contacts boolean NOT NULL DEFAULT false,
  can_override_limits boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage permissions" ON public.user_permissions FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Users read own permissions" ON public.user_permissions FOR SELECT USING (user_id = auth.uid());

-- Monitoring plans
CREATE TABLE IF NOT EXISTS public.monitoring_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_key text NOT NULL UNIQUE,
  plan_name text NOT NULL,
  max_monitors integer NOT NULL,
  retention_days integer NOT NULL,
  allow_real_time boolean,
  allow_stream boolean,
  allow_snapshots boolean,
  allow_article_generation boolean,
  advanced_articles boolean,
  custom_snapshot_intervals boolean,
  team_collaboration boolean,
  api_access boolean,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.monitoring_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read monitoring_plans" ON public.monitoring_plans FOR SELECT USING (true);
CREATE POLICY "Admins manage monitoring_plans" ON public.monitoring_plans FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
