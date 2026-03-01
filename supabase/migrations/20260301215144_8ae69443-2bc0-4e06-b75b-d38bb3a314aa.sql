
-- ============================================
-- MIGRATION 2: Update directory_profiles + sub-tables
-- ============================================

-- Add new columns to directory_profiles (IF NOT EXISTS via DO block)
DO $$ BEGIN
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS specializations text[];
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS profile_complete boolean DEFAULT false;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS sector_id uuid REFERENCES public.sectors(id);
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS rank text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS media_role text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS expertise_areas text[];
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS hourly_rate text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS services_offered text[];
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS hire_me_enabled boolean DEFAULT false;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS parent_company text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS bio_ar text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS headline_ar text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS employment_status text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS phone_number text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS whatsapp_number text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS show_email_to_subscribers boolean NOT NULL DEFAULT false;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS show_phone_to_subscribers boolean NOT NULL DEFAULT false;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS show_whatsapp_to_subscribers boolean NOT NULL DEFAULT false;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS press_id_url text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS title text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS notes text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS data_source text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS avatar_updated_at timestamptz DEFAULT now();
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS gender text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS tumblr_url text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS is_top_listing boolean DEFAULT false;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS visits_count integer DEFAULT 0;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS first_name text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS last_name text;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS profile_type_id uuid REFERENCES public.profile_types(id);
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS influence_score integer;
  ALTER TABLE public.directory_profiles ADD COLUMN IF NOT EXISTS username text;
END $$;

-- Unique index on username
CREATE UNIQUE INDEX IF NOT EXISTS idx_directory_profiles_username_unique
  ON public.directory_profiles (lower(username))
  WHERE username IS NOT NULL;

-- Entity tags
CREATE TABLE IF NOT EXISTS public.entity_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id uuid NOT NULL REFERENCES public.tags(id),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tag_id, entity_type, entity_id)
);
CREATE INDEX IF NOT EXISTS idx_entity_tags_entity ON public.entity_tags(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_tags_tag_id ON public.entity_tags(tag_id);
ALTER TABLE public.entity_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all entity tags" ON public.entity_tags FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can view entity tags" ON public.entity_tags FOR SELECT USING (true);
CREATE POLICY "Profile owners can manage entity tags" ON public.entity_tags FOR ALL
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = entity_tags.entity_id AND dp.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = entity_tags.entity_id AND dp.owner_user_id = auth.uid()));

-- Journalist profiles (1:1 extension)
CREATE TABLE IF NOT EXISTS public.journalist_profiles (
  directory_profile_id uuid PRIMARY KEY REFERENCES public.directory_profiles(profile_id),
  job_title text,
  job_title_ar text,
  portfolio_json jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.journalist_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage journalist_profiles" ON public.journalist_profiles FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Owners manage own journalist_profile" ON public.journalist_profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = journalist_profiles.directory_profile_id AND dp.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = journalist_profiles.directory_profile_id AND dp.owner_user_id = auth.uid()));
CREATE POLICY "Public view approved journalist_profiles" ON public.journalist_profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = journalist_profiles.directory_profile_id AND dp.approval_status = 'approved' AND dp.is_public = true));

-- Expert profiles (1:1 extension)
CREATE TABLE IF NOT EXISTS public.expert_profiles (
  directory_profile_id uuid PRIMARY KEY REFERENCES public.directory_profiles(profile_id),
  expert_role text,
  organisation_name text,
  position text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.expert_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage expert_profiles" ON public.expert_profiles FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Owners manage own expert_profile" ON public.expert_profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = expert_profiles.directory_profile_id AND dp.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = expert_profiles.directory_profile_id AND dp.owner_user_id = auth.uid()));
CREATE POLICY "Public view approved expert_profiles" ON public.expert_profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = expert_profiles.directory_profile_id AND dp.approval_status = 'approved' AND dp.is_public = true));

-- Publication profiles (1:1 extension)
CREATE TABLE IF NOT EXISTS public.publication_profiles (
  directory_profile_id uuid PRIMARY KEY REFERENCES public.directory_profiles(profile_id),
  editor_in_chief text,
  circulation_info text,
  publication_status text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.publication_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage publication_profiles" ON public.publication_profiles FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Owners manage own publication_profile" ON public.publication_profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = publication_profiles.directory_profile_id AND dp.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = publication_profiles.directory_profile_id AND dp.owner_user_id = auth.uid()));
CREATE POLICY "Public view approved publication_profiles" ON public.publication_profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = publication_profiles.directory_profile_id AND dp.approval_status = 'approved' AND dp.is_public = true));

-- Profile contact private (1:1)
CREATE TABLE IF NOT EXISTS public.profile_contact_private (
  directory_profile_id uuid PRIMARY KEY REFERENCES public.directory_profiles(profile_id),
  email text,
  phone text,
  whatsapp text,
  website text,
  twitter text,
  facebook text,
  linkedin text,
  instagram text,
  youtube text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profile_contact_private ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all private contacts" ON public.profile_contact_private FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Owners manage own private contacts" ON public.profile_contact_private FOR ALL
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = profile_contact_private.directory_profile_id AND dp.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = profile_contact_private.directory_profile_id AND dp.owner_user_id = auth.uid()));

-- Profile contact flags (1:1)
CREATE TABLE IF NOT EXISTS public.profile_contact_flags (
  directory_profile_id uuid PRIMARY KEY REFERENCES public.directory_profiles(profile_id),
  has_email boolean NOT NULL DEFAULT false,
  has_phone boolean NOT NULL DEFAULT false,
  has_whatsapp boolean NOT NULL DEFAULT false,
  has_twitter boolean NOT NULL DEFAULT false,
  has_facebook boolean NOT NULL DEFAULT false,
  has_linkedin boolean NOT NULL DEFAULT false,
  has_instagram boolean NOT NULL DEFAULT false,
  has_youtube boolean NOT NULL DEFAULT false,
  has_website boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profile_contact_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage contact_flags" ON public.profile_contact_flags FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Owners manage own contact_flags" ON public.profile_contact_flags FOR ALL
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = profile_contact_flags.directory_profile_id AND dp.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = profile_contact_flags.directory_profile_id AND dp.owner_user_id = auth.uid()));
CREATE POLICY "Anyone view approved contact_flags" ON public.profile_contact_flags FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = profile_contact_flags.directory_profile_id AND dp.approval_status = 'approved' AND dp.is_public = true AND dp.is_listed = true));

-- Expert companies
CREATE TABLE IF NOT EXISTS public.expert_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_profile_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  company_profile_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  expertise_area text,
  is_current boolean,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(expert_profile_id, company_profile_id)
);
ALTER TABLE public.expert_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view expert_companies" ON public.expert_companies FOR SELECT USING (true);
CREATE POLICY "Owners manage expert_companies" ON public.expert_companies FOR ALL
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = expert_companies.expert_profile_id AND dp.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = expert_companies.expert_profile_id AND dp.owner_user_id = auth.uid()));

-- Profile unlocks
CREATE TABLE IF NOT EXISTS public.profile_unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unlocker_user_id uuid NOT NULL,
  profile_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  coins_spent integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(unlocker_user_id, profile_id)
);
ALTER TABLE public.profile_unlocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert own unlocks" ON public.profile_unlocks FOR INSERT WITH CHECK (unlocker_user_id = auth.uid());
CREATE POLICY "Users view own unlocks" ON public.profile_unlocks FOR SELECT USING (unlocker_user_id = auth.uid());
CREATE POLICY "Profile owners see who unlocked" ON public.profile_unlocks FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = profile_unlocks.profile_id AND dp.owner_user_id = auth.uid()));

-- Add RLS policy for profile_contact_private: users who unlocked can view
CREATE POLICY "Users who unlocked can view private contacts" ON public.profile_contact_private FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profile_unlocks pu WHERE pu.profile_id = profile_contact_private.directory_profile_id AND pu.unlocker_user_id = auth.uid()));

-- Profile visits
CREATE TABLE IF NOT EXISTS public.profile_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  viewer_user_id uuid,
  viewer_session_id text,
  visit_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_profile_visits_user ON public.profile_visits(profile_id, viewer_user_id, visit_date) WHERE viewer_user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_profile_visits_session ON public.profile_visits(profile_id, viewer_session_id, visit_date) WHERE viewer_session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profile_visits_profile_id ON public.profile_visits(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_visits_created_at ON public.profile_visits(created_at);
ALTER TABLE public.profile_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view all visits" ON public.profile_visits FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can record a visit" ON public.profile_visits FOR INSERT WITH CHECK (true);

-- Profile reviews
CREATE TABLE IF NOT EXISTS public.profile_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  reviewer_id uuid NOT NULL,
  rating integer NOT NULL,
  comment text,
  is_approved boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(reviewer_id, profile_id)
);
ALTER TABLE public.profile_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all reviews" ON public.profile_reviews FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone view approved reviews" ON public.profile_reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users manage own reviews" ON public.profile_reviews FOR ALL USING (reviewer_id = auth.uid()) WITH CHECK (reviewer_id = auth.uid());

-- Profile claims
CREATE TABLE IF NOT EXISTS public.profile_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  claimant_id uuid NOT NULL,
  evidence text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profile_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all claims" ON public.profile_claims FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Users create own claims" ON public.profile_claims FOR INSERT WITH CHECK (claimant_id = auth.uid());
CREATE POLICY "Users view own claims" ON public.profile_claims FOR SELECT USING (claimant_id = auth.uid());

-- Profile settings
CREATE TABLE IF NOT EXISTS public.profile_settings (
  user_id uuid PRIMARY KEY,
  allow_followups boolean NOT NULL DEFAULT true,
  min_message_cost integer NOT NULL DEFAULT 0,
  auto_reject_sectors text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own settings" ON public.profile_settings FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
