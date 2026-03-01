
-- ============================================================
-- 1. profile_view_credits: Enable RLS (currently DISABLED)
-- ============================================================
ALTER TABLE public.profile_view_credits ENABLE ROW LEVEL SECURITY;

-- Users read their own credits
CREATE POLICY "Users read own credits"
  ON public.profile_view_credits FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins manage all credits
CREATE POLICY "Admins manage credits"
  ON public.profile_view_credits FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- 2. contact_messages
-- ============================================================
-- Users can insert their own messages
CREATE POLICY "Users insert own contact messages"
  ON public.contact_messages FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Users read their own messages
CREATE POLICY "Users read own contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Anonymous users can submit contact messages
CREATE POLICY "Anon insert contact messages"
  ON public.contact_messages FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Admins read all
CREATE POLICY "Admins read all contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.is_admin_or_subadmin(auth.uid()));

-- Admins update status
CREATE POLICY "Admins update contact messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_subadmin(auth.uid()));

-- ============================================================
-- 3. experts
-- ============================================================
-- Public can read approved experts
CREATE POLICY "Public read approved experts"
  ON public.experts FOR SELECT
  USING (approval_status = 'approved' AND profile_visibility = 'public');

-- Owners manage own expert profile
CREATE POLICY "Owners manage own expert"
  ON public.experts FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins manage all experts
CREATE POLICY "Admins manage all experts"
  ON public.experts FOR ALL
  TO authenticated
  USING (public.is_admin_or_subadmin(auth.uid()))
  WITH CHECK (public.is_admin_or_subadmin(auth.uid()));

-- ============================================================
-- 4. journalists
-- ============================================================
-- Public can read approved journalists
CREATE POLICY "Public read approved journalists"
  ON public.journalists FOR SELECT
  USING (approval_status = 'approved' AND profile_visibility = 'public');

-- Owners manage own journalist profile
CREATE POLICY "Owners manage own journalist"
  ON public.journalists FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins manage all journalists
CREATE POLICY "Admins manage all journalists"
  ON public.journalists FOR ALL
  TO authenticated
  USING (public.is_admin_or_subadmin(auth.uid()))
  WITH CHECK (public.is_admin_or_subadmin(auth.uid()));

-- ============================================================
-- 5. publications
-- ============================================================
-- Public can read publications
CREATE POLICY "Public read publications"
  ON public.publications FOR SELECT
  USING (true);

-- Admins manage all publications
CREATE POLICY "Admins manage publications"
  ON public.publications FOR ALL
  TO authenticated
  USING (public.is_admin_or_subadmin(auth.uid()))
  WITH CHECK (public.is_admin_or_subadmin(auth.uid()));

-- ============================================================
-- 6. journalist_publications (junction table)
-- ============================================================
-- Public can read journalist-publication associations
CREATE POLICY "Public read journalist_publications"
  ON public.journalist_publications FOR SELECT
  USING (true);

-- Admins manage
CREATE POLICY "Admins manage journalist_publications"
  ON public.journalist_publications FOR ALL
  TO authenticated
  USING (public.is_admin_or_subadmin(auth.uid()))
  WITH CHECK (public.is_admin_or_subadmin(auth.uid()));

-- Journalist owners can manage their own associations
CREATE POLICY "Journalist owners manage own associations"
  ON public.journalist_publications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.journalists j
      WHERE j.id = journalist_publications.journalist_id
        AND j.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.journalists j
      WHERE j.id = journalist_publications.journalist_id
        AND j.user_id = auth.uid()
    )
  );

-- ============================================================
-- 7. journalist_expert_interactions
-- ============================================================
-- Participants can read their own interactions
CREATE POLICY "Journalists read own interactions"
  ON public.journalist_expert_interactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.journalists j
      WHERE j.id = journalist_expert_interactions.journalist_id
        AND j.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.experts e
      WHERE e.id = journalist_expert_interactions.expert_id
        AND e.user_id = auth.uid()
    )
  );

-- Admins manage all
CREATE POLICY "Admins manage interactions"
  ON public.journalist_expert_interactions FOR ALL
  TO authenticated
  USING (public.is_admin_or_subadmin(auth.uid()))
  WITH CHECK (public.is_admin_or_subadmin(auth.uid()));

-- Authenticated users can insert interactions
CREATE POLICY "Authenticated insert interactions"
  ON public.journalist_expert_interactions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.journalists j
      WHERE j.id = journalist_expert_interactions.journalist_id
        AND j.user_id = auth.uid()
    )
  );

-- ============================================================
-- 8. profile_views
-- ============================================================
-- Users read their own views
CREATE POLICY "Users read own profile_views"
  ON public.profile_views FOR SELECT
  TO authenticated
  USING (viewer_user_id = auth.uid());

-- Admins read all
CREATE POLICY "Admins read all profile_views"
  ON public.profile_views FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- 9. publication_views
-- ============================================================
-- Users read their own views
CREATE POLICY "Users read own publication_views"
  ON public.publication_views FOR SELECT
  TO authenticated
  USING (viewer_user_id = auth.uid());

-- Admins read all
CREATE POLICY "Admins read all publication_views"
  ON public.publication_views FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- 10. publication_contact_details_table
-- ============================================================
-- Admins manage all
CREATE POLICY "Admins manage pub contact details"
  ON public.publication_contact_details_table FOR ALL
  TO authenticated
  USING (public.is_admin_or_subadmin(auth.uid()))
  WITH CHECK (public.is_admin_or_subadmin(auth.uid()));

-- Paid PR subscribers can read (controlled via function, but need base SELECT)
CREATE POLICY "Paid PR read pub contact details"
  ON public.publication_contact_details_table FOR SELECT
  TO authenticated
  USING (public.is_pr_paid_active());
