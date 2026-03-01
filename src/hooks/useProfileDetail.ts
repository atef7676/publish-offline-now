import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuditLog } from '@/hooks/useAuditLog';

export function useProfileDetail(profileType: string, options: any = {}) {
  const { slug } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { logProfileView } = useAuditLog();
  const loggedRef = useRef(false);

  useEffect(() => {
    if (profile?.profile_id && !loggedRef.current) {
      loggedRef.current = true;
      logProfileView(profileType, profile.profile_id);
    }
  }, [profile?.profile_id]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('directory_profiles').select(options.select || '*').eq('slug', slug).eq('profile_type', profileType).maybeSingle();
        if (error) throw error;
        if (!data) { setNotFound(true); } else { setProfile(data); if (options.onLoaded) await options.onLoaded(data); }
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    };
    fetch();
  }, [slug]);

  const hasContactMethods = profile && (profile.website_url || profile.twitter_handle || profile.linkedin_url || profile.facebook_url || profile.instagram_url || profile.youtube_url);
  return { profile, loading, notFound, hasContactMethods, slug };
}

export default useProfileDetail;
