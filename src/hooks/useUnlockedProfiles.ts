import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUnlockedProfiles = () => {
  const { user } = useAuth();
  const [unlockedProfiles, setUnlockedProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setUnlockedProfiles([]); setLoading(false); return; }
    try {
      const { data } = await supabase.from('profile_unlocks' as any)
        .select('id, coins_spent, created_at, profile:directory_profiles(profile_id, display_name, profile_type, slug, avatar_url)')
        .eq('unlocker_user_id', user.id).order('created_at', { ascending: false });
      setUnlockedProfiles(data?.filter((u: any) => u.profile) || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const isUnlocked = useCallback((profileId: string) => unlockedProfiles.some((u: any) => u.profile?.profile_id === profileId), [unlockedProfiles]);

  return { unlockedProfiles, loading, isUnlocked, refetch: fetch };
};

export default useUnlockedProfiles;
