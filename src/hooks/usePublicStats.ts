import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePublicStats() {
  const [stats, setStats] = useState({
    journalists_count: 0,
    experts_count: 0,
    companies_count: 0,
    publications_count: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Count approved profiles by type
        const { count: journalistsCount } = await supabase
          .from('directory_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('approval_status', 'approved')
          .eq('profile_type', 'journalist');

        const { count: expertsCount } = await supabase
          .from('directory_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('approval_status', 'approved')
          .eq('profile_type', 'expert');

        const { count: companiesCount } = await supabase
          .from('directory_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('approval_status', 'approved')
          .eq('profile_type', 'company');

        const { count: publicationsCount } = await supabase
          .from('directory_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('approval_status', 'approved')
          .eq('profile_type', 'publication');

        setStats({
          journalists_count: journalistsCount || 0,
          experts_count: expertsCount || 0,
          companies_count: companiesCount || 0,
          publications_count: publicationsCount || 0,
        });
      } catch (err) {
        console.warn('Failed to fetch public stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 120000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading };
}