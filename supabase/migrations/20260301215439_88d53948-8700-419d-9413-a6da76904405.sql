
-- ============================================
-- MIGRATION 4 (retry): Opportunities, social monitoring, publications
-- ============================================

-- Opportunities
CREATE TABLE IF NOT EXISTS public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_profile_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  created_by_user_id uuid NOT NULL,
  title text NOT NULL, title_ar text,
  description text NOT NULL, description_ar text,
  opportunity_type text NOT NULL,
  compensation_type text NOT NULL DEFAULT 'paid',
  budget_min numeric, budget_max numeric,
  budget_currency text NOT NULL DEFAULT 'USD',
  country_code text NOT NULL, city text,
  work_location text NOT NULL DEFAULT 'remote',
  sector_tags text[] NOT NULL DEFAULT '{}',
  language_required text[],
  required_experience_years integer,
  nda_required boolean NOT NULL DEFAULT false,
  urgency_level integer NOT NULL DEFAULT 1,
  visibility text NOT NULL DEFAULT 'public',
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz, closes_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_opportunities_company ON public.opportunities(company_profile_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_sector_tags ON public.opportunities USING GIN(sector_tags);
CREATE INDEX IF NOT EXISTS idx_opportunities_status_published ON public.opportunities(status, published_at);
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all opportunities" ON public.opportunities FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone view published public opportunities" ON public.opportunities FOR SELECT USING (status = 'published' AND visibility = 'public');
CREATE POLICY "Company owners manage own opportunities" ON public.opportunities FOR ALL
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = opportunities.company_profile_id AND dp.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = opportunities.company_profile_id AND dp.owner_user_id = auth.uid()));

-- Opportunity applications
CREATE TABLE IF NOT EXISTS public.opportunity_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id),
  journalist_profile_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  application_type text NOT NULL DEFAULT 'pitch',
  cover_note text, proposal_text text, proposed_fee numeric,
  proposed_currency text, proposed_timeline_days integer,
  deliverables jsonb, attachments jsonb,
  status text NOT NULL DEFAULT 'submitted', company_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(opportunity_id, journalist_profile_id)
);
ALTER TABLE public.opportunity_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all applications" ON public.opportunity_applications FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Journalists apply" ON public.opportunity_applications FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = opportunity_applications.journalist_profile_id AND dp.owner_user_id = auth.uid()));
CREATE POLICY "Journalists view own applications" ON public.opportunity_applications FOR SELECT USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = opportunity_applications.journalist_profile_id AND dp.owner_user_id = auth.uid()));
CREATE POLICY "Companies view applications" ON public.opportunity_applications FOR SELECT USING (EXISTS (SELECT 1 FROM public.opportunities o JOIN public.directory_profiles dp ON dp.profile_id = o.company_profile_id WHERE o.id = opportunity_applications.opportunity_id AND dp.owner_user_id = auth.uid()));

-- Opportunity invites
CREATE TABLE IF NOT EXISTS public.opportunity_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id),
  journalist_profile_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  invited_by_user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(opportunity_id, journalist_profile_id)
);
ALTER TABLE public.opportunity_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage invites" ON public.opportunity_invites FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Journalists view own invites" ON public.opportunity_invites FOR SELECT USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = opportunity_invites.journalist_profile_id AND dp.owner_user_id = auth.uid()));

-- Opportunity saves
CREATE TABLE IF NOT EXISTS public.opportunity_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id),
  journalist_profile_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(opportunity_id, journalist_profile_id)
);
ALTER TABLE public.opportunity_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saves" ON public.opportunity_saves FOR ALL
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = opportunity_saves.journalist_profile_id AND dp.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = opportunity_saves.journalist_profile_id AND dp.owner_user_id = auth.uid()));

-- Article requests
CREATE TABLE IF NOT EXISTS public.article_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, article_type text NOT NULL,
  title text, filters jsonb NOT NULL DEFAULT '{}',
  date_range_start timestamptz, date_range_end timestamptz,
  tone text NOT NULL DEFAULT 'neutral', status text NOT NULL DEFAULT 'queued',
  generated_text text, generated_data jsonb DEFAULT '{}',
  source_post_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz
);
ALTER TABLE public.article_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "articles_admin" ON public.article_requests FOR SELECT USING (public.is_admin_or_subadmin(auth.uid()));
CREATE POLICY "articles_own" ON public.article_requests FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Social providers
CREATE TABLE IF NOT EXISTS public.social_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.social_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin manage social_providers" ON public.social_providers FOR ALL USING (public.is_admin_or_subadmin(auth.uid())) WITH CHECK (public.is_admin_or_subadmin(auth.uid()));
CREATE POLICY "Authenticated read social_providers" ON public.social_providers FOR SELECT TO authenticated USING (true);

-- Provider config
CREATE TABLE IF NOT EXISTS public.provider_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.social_providers(id),
  config jsonb NOT NULL DEFAULT '{}', api_key_secret_name text,
  headers jsonb, rate_limit_per_minute integer NOT NULL,
  cost_per_request numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.provider_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin manage provider_config" ON public.provider_config FOR ALL USING (public.is_admin_or_subadmin(auth.uid())) WITH CHECK (public.is_admin_or_subadmin(auth.uid()));

-- Provider usage
CREATE TABLE IF NOT EXISTS public.provider_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.social_providers(id),
  usage_date date NOT NULL, requests_made integer NOT NULL DEFAULT 0,
  posts_fetched integer, errors_count integer, estimated_cost numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider_id, usage_date)
);
ALTER TABLE public.provider_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin manage provider_usage" ON public.provider_usage FOR ALL USING (public.is_admin_or_subadmin(auth.uid())) WITH CHECK (public.is_admin_or_subadmin(auth.uid()));

-- X monitors (create table first, no RLS policy referencing other tables yet)
CREATE TABLE IF NOT EXISTS public.x_monitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, name text NOT NULL,
  keywords text[], accounts text[],
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.x_monitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own monitors" ON public.x_monitors FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin view all monitors" ON public.x_monitors FOR SELECT USING (public.is_admin_or_subadmin(auth.uid()));

-- X posts (no RLS policies yet - will add after monitor_hits)
CREATE TABLE IF NOT EXISTS public.x_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text UNIQUE, author_handle text, content text,
  posted_at timestamptz, metrics jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.x_posts ENABLE ROW LEVEL SECURITY;

-- Monitor hits
CREATE TABLE IF NOT EXISTS public.monitor_hits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id uuid NOT NULL REFERENCES public.x_monitors(id),
  x_post_id uuid NOT NULL REFERENCES public.x_posts(id),
  matched_rule text, relevance_score numeric,
  is_alert boolean, alert_reasons text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(monitor_id, x_post_id)
);
ALTER TABLE public.monitor_hits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View own monitor_hits" ON public.monitor_hits FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.x_monitors xm WHERE xm.id = monitor_hits.monitor_id AND xm.user_id = auth.uid()));

-- NOW add x_posts RLS (monitor_hits exists)
CREATE POLICY "View x_posts via own monitors" ON public.x_posts FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.monitor_hits mh JOIN public.x_monitors xm ON xm.id = mh.monitor_id WHERE mh.x_post_id = x_posts.id AND xm.user_id = auth.uid()));
CREATE POLICY "Admin view all x_posts" ON public.x_posts FOR SELECT USING (public.is_admin_or_subadmin(auth.uid()));

-- Alert events
CREATE TABLE IF NOT EXISTS public.alert_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id uuid NOT NULL REFERENCES public.x_monitors(id),
  x_post_id uuid REFERENCES public.x_posts(id),
  alert_type text NOT NULL, alert_data jsonb DEFAULT '{}',
  severity text NOT NULL DEFAULT 'info', is_read boolean DEFAULT false,
  notified_via text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_alert_events_unread ON public.alert_events(monitor_id) WHERE is_read = false;
ALTER TABLE public.alert_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alerts_own" ON public.alert_events FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.x_monitors xm WHERE xm.id = alert_events.monitor_id AND xm.user_id = auth.uid()));
CREATE POLICY "alerts_update_own" ON public.alert_events FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.x_monitors xm WHERE xm.id = alert_events.monitor_id AND xm.user_id = auth.uid()));

-- Monitor digests
CREATE TABLE IF NOT EXISTS public.monitor_digests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id uuid NOT NULL REFERENCES public.x_monitors(id),
  period_type text NOT NULL, period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL, post_count integer,
  summary_data jsonb, generated_text text, status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.monitor_digests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View own digests" ON public.monitor_digests FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.x_monitors xm WHERE xm.id = monitor_digests.monitor_id AND xm.user_id = auth.uid()));

-- X post snapshots
CREATE TABLE IF NOT EXISTS public.x_post_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  x_post_id uuid NOT NULL REFERENCES public.x_posts(id),
  metrics jsonb DEFAULT '{}',
  captured_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.x_post_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View own snapshots" ON public.x_post_snapshots FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.monitor_hits mh JOIN public.x_monitors xm ON xm.id = mh.monitor_id WHERE mh.x_post_id = x_post_snapshots.x_post_id AND xm.user_id = auth.uid()));

-- Tweets processed
CREATE TABLE IF NOT EXISTS public.tweets_processed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tweet_id text UNIQUE,
  processed_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'processed'
);
ALTER TABLE public.tweets_processed ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read tweets" ON public.tweets_processed FOR SELECT TO authenticated USING (true);

-- Publication contacts
CREATE TABLE IF NOT EXISTS public.publication_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  name text, job_title text, email text, phone text, whatsapp text, other_details text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.publication_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage pub_contacts" ON public.publication_contacts FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone view approved pub_contacts" ON public.publication_contacts FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = publication_contacts.publication_id AND dp.approval_status = 'approved' AND dp.is_public = true));

-- Publication journalists
CREATE TABLE IF NOT EXISTS public.publication_journalists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  journalist_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  role_id uuid REFERENCES public.journalist_roles(id),
  is_primary boolean,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(publication_id, journalist_id)
);
ALTER TABLE public.publication_journalists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view pub_journalists" ON public.publication_journalists FOR SELECT USING (true);
CREATE POLICY "Admins manage pub_journalists" ON public.publication_journalists FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Publication news desks
CREATE TABLE IF NOT EXISTS public.publication_news_desks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  desk_type_id uuid REFERENCES public.news_desk_types(id),
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.publication_news_desks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view approved news_desks" ON public.publication_news_desks FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = publication_news_desks.publication_id AND dp.approval_status = 'approved' AND dp.is_public = true));
CREATE POLICY "Admins manage news_desks" ON public.publication_news_desks FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Publication news desk contacts
CREATE TABLE IF NOT EXISTS public.publication_news_desk_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  news_desk_id uuid NOT NULL REFERENCES public.publication_news_desks(id),
  name text, job_title text, email text, phone text, other_details text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.publication_news_desk_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage desk_contacts" ON public.publication_news_desk_contacts FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Publication periodicals
CREATE TABLE IF NOT EXISTS public.publication_periodicals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  periodical_type_id uuid REFERENCES public.periodical_types(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(publication_id, periodical_type_id)
);
ALTER TABLE public.publication_periodicals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view approved periodicals" ON public.publication_periodicals FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = publication_periodicals.publication_id AND dp.approval_status = 'approved' AND dp.is_public = true));
CREATE POLICY "Admins manage periodicals" ON public.publication_periodicals FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Update publications (legacy) columns
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS name_ar text;
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS facebook_url text;
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS instagram_url text;
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS sector_id uuid REFERENCES public.sectors(id);
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
