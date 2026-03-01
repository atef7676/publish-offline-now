import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) { setFavorites([]); setLoading(false); return; }
    try {
      const { data } = await supabase.from('user_favorites' as any).select('profile_id').eq('user_id', user.id);
      setFavorites(data?.map((f: any) => f.profile_id) || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback(async (profileId: string) => {
    if (!user) return { success: false };
    const isCurrent = favorites.includes(profileId);
    try {
      if (isCurrent) {
        await supabase.from('user_favorites' as any).delete().eq('user_id', user.id).eq('profile_id', profileId);
        setFavorites(prev => prev.filter(id => id !== profileId));
      } else {
        await supabase.from('user_favorites' as any).insert({ user_id: user.id, profile_id: profileId });
        setFavorites(prev => [...prev, profileId]);
      }
      return { success: true, isFavorite: !isCurrent };
    } catch { return { success: false }; }
  }, [user, favorites]);

  return { favorites, loading, isFavorite, toggleFavorite, refetch: fetchFavorites };
};

export default useFavorites;
