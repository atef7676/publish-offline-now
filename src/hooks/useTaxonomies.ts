import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTaxonomies = () => {
  const { language } = useLanguage();
  const [sectors, setSectors] = useState<any[]>([]);
  const [mediaRoles, setMediaRoles] = useState<any[]>([]);
  const [employmentStatus, setEmploymentStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [s, m, e] = await Promise.all([
          supabase.from('sectors' as any).select('*').order('sort_order'),
          supabase.from('media_roles').select('*').order('sort_order'),
          supabase.from('employment_status').select('*').order('sort_order'),
        ]);
        if (s.data) setSectors(s.data);
        if (m.data) setMediaRoles(m.data);
        if (e.data) setEmploymentStatus(e.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const getLabel = (item: any, field = 'name') => {
    if (!item) return '';
    if (language === 'ar') return item[`${field}_ar`] || item.name_ar || item.name_en || item.name || '';
    return item.name_en || item.name || item[field] || '';
  };

  return { sectors, mediaRoles, employmentStatus, loading, getLabel };
};

export default useTaxonomies;
