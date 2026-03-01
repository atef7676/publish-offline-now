
-- ============================================
-- MIGRATION 3: Remaining feature tables
-- ============================================

-- User coins
CREATE TABLE IF NOT EXISTS public.user_coins (
  user_id uuid PRIMARY KEY,
  balance integer NOT NULL DEFAULT 0,
  total_earned integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_coins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all user_coins" ON public.user_coins FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Users view own coins" ON public.user_coins FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own coins" ON public.user_coins FOR INSERT WITH CHECK (user_id = auth.uid());

-- User favorites
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  profile_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, profile_id)
);
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own favorites" ON public.user_favorites FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- User lists
CREATE TABLE IF NOT EXISTS public.user_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own lists" ON public.user_lists FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- List items
CREATE TABLE IF NOT EXISTS public.list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid NOT NULL REFERENCES public.user_lists(id),
  profile_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  added_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(list_id, profile_id)
);
ALTER TABLE public.list_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage items in own lists" ON public.list_items FOR ALL
  USING (EXISTS (SELECT 1 FROM public.user_lists ul WHERE ul.id = list_items.list_id AND ul.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_lists ul WHERE ul.id = list_items.list_id AND ul.user_id = auth.uid()));

-- Contact requests
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  recipient_profile_id uuid NOT NULL REFERENCES public.directory_profiles(profile_id),
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  coins_spent integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz
);
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can send requests" ON public.contact_requests FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can view own sent requests" ON public.contact_requests FOR SELECT USING (sender_id = auth.uid());
CREATE POLICY "Profile owners can view requests" ON public.contact_requests FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = contact_requests.recipient_profile_id AND dp.owner_user_id = auth.uid()));
CREATE POLICY "Profile owners can update request status" ON public.contact_requests FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.directory_profiles dp WHERE dp.profile_id = contact_requests.recipient_profile_id AND dp.owner_user_id = auth.uid()));

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_request_id uuid NOT NULL REFERENCES public.contact_requests(id),
  sender_id uuid NOT NULL,
  content text NOT NULL,
  coins_cost integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'sent',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view messages" ON public.messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.contact_requests cr
    LEFT JOIN public.directory_profiles dp ON dp.profile_id = cr.recipient_profile_id
    WHERE cr.id = messages.contact_request_id
      AND (cr.sender_id = auth.uid() OR dp.owner_user_id = auth.uid())
  ));
CREATE POLICY "Participants can send messages" ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.contact_requests cr
    LEFT JOIN public.directory_profiles dp ON dp.profile_id = cr.recipient_profile_id
    WHERE cr.id = messages.contact_request_id
      AND cr.status = 'approved'
      AND (cr.sender_id = auth.uid() OR dp.owner_user_id = auth.uid())
  ));

-- Mutes/blocks
CREATE TABLE IF NOT EXISTS public.mutes_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_user_id uuid NOT NULL,
  blocked_user_id uuid NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(blocker_user_id, blocked_user_id)
);
ALTER TABLE public.mutes_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own blocks" ON public.mutes_blocks FOR ALL USING (blocker_user_id = auth.uid()) WITH CHECK (blocker_user_id = auth.uid());

-- System messages
CREATE TABLE IF NOT EXISTS public.system_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.system_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins insert system_messages" ON public.system_messages FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Users view own system_messages" ON public.system_messages FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update own system_messages" ON public.system_messages FOR UPDATE USING (user_id = auth.uid());

-- Email preferences
CREATE TABLE IF NOT EXISTS public.email_preferences (
  user_id uuid PRIMARY KEY,
  email_verified boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  notify_new_messages boolean NOT NULL DEFAULT true,
  notify_favorites boolean NOT NULL DEFAULT true,
  notify_profile_views boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own email_preferences" ON public.email_preferences FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Email verification tokens (service role only)
CREATE TABLE IF NOT EXISTS public.email_verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  token text NOT NULL UNIQUE,
  email text NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON public.email_verification_tokens(token) WHERE used_at IS NULL;
ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only tokens" ON public.email_verification_tokens FOR ALL USING (false);

-- Email notifications queue
CREATE TABLE IF NOT EXISTS public.email_notifications_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id uuid NOT NULL,
  recipient_email text NOT NULL,
  notification_type text NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,
  metadata jsonb,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  last_attempt_at timestamptz,
  sent_at timestamptz,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON public.email_notifications_queue(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_email_queue_created ON public.email_notifications_queue(created_at);
ALTER TABLE public.email_notifications_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view email queue" ON public.email_notifications_queue FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Audit events
CREATE TABLE IF NOT EXISTS public.audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid NOT NULL,
  event_type text NOT NULL,
  target_profile_id uuid REFERENCES public.directory_profiles(profile_id),
  target_user_id uuid,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON public.audit_events(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_events(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_event_type ON public.audit_events(event_type);
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view audit_events" ON public.audit_events FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "System insert audit_events" ON public.audit_events FOR INSERT WITH CHECK (true);

-- Audit logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  actor_user_id uuid,
  actor_role text NOT NULL DEFAULT 'anon',
  actor_profile_id uuid,
  target_type text,
  target_id text,
  action text NOT NULL,
  result text NOT NULL DEFAULT 'success',
  reason text,
  metadata jsonb DEFAULT '{}',
  ip_hash text,
  ua_hash text,
  request_id text,
  session_id text,
  severity text NOT NULL DEFAULT 'info'
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_user_id ON public.audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON public.audit_logs(severity) WHERE severity IN ('warn', 'error', 'critical');
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON public.audit_logs(target_type, target_id);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit_logs" ON public.audit_logs FOR SELECT USING (public.is_admin_or_subadmin(auth.uid()));
CREATE POLICY "System insert audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Users read own audit_logs" ON public.audit_logs FOR SELECT USING (actor_user_id = auth.uid());

-- User monitoring plan
CREATE TABLE IF NOT EXISTS public.user_monitoring_plan (
  user_id uuid PRIMARY KEY,
  plan_id uuid NOT NULL REFERENCES public.monitoring_plans(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_monitoring_plan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own monitoring_plan" ON public.user_monitoring_plan FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admin manage monitoring_plans" ON public.user_monitoring_plan FOR ALL USING (public.is_admin_or_subadmin(auth.uid())) WITH CHECK (public.is_admin_or_subadmin(auth.uid()));
