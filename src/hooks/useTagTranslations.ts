import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const useTagTranslations = (tags?: string[]) => {
  const [arMap, setArMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!tags || tags.length === 0) { setArMap({}); return; }
    const fetch = async () => {
      try {
        const { data } = await supabase.from('tags' as any).select('name, name_ar').in('name', tags);
        const map: Record<string, string> = {};
        data?.forEach((t: any) => { if (t.name_ar) map[t.name] = t.name_ar; });
        setArMap(map);
      } catch { /* ignore */ }
    };
    fetch();
  }, [JSON.stringify(tags)]);

  return arMap;
};

export default useTagTranslations;
