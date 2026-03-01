import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Search, Users, Briefcase, Building2, BookOpen, X } from 'lucide-react';

const TYPE_CONFIG: Record<string, { icon: any; path: string; color: string }> = {
  journalist: { icon: Users, path: '/journalists', color: 'text-primary' },
  expert: { icon: Briefcase, path: '/experts', color: 'text-secondary-foreground' },
  company: { icon: Building2, path: '/companies', color: 'text-primary' },
  publication: { icon: BookOpen, path: '/publications', color: 'text-secondary-foreground' },
};

const GlobalSearch = ({ className = '' }: { className?: string }) => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < 2) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('directory_profiles')
          .select('profile_id, display_name, display_name_ar, profile_type, slug, headline, headline_ar, country_code, avatar_url')
          .eq('approval_status', 'approved')
          .eq('is_public', true)
          .eq('is_listed', true)
          .or(`display_name.ilike.%${query}%,display_name_ar.ilike.%${query}%,headline.ilike.%${query}%`)
          .order('visits_count', { ascending: false, nullsFirst: false })
          .limit(12);
        if (!error) setResults(data || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelect = (profile: any) => {
    const cfg = TYPE_CONFIG[profile.profile_type];
    if (cfg) { navigate(`${cfg.path}/${profile.slug}`); setQuery(''); setOpen(false); }
  };

  const grouped: Record<string, any[]> = {};
  results.forEach(r => { if (!grouped[r.profile_type]) grouped[r.profile_type] = []; grouped[r.profile_type].push(r); });

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="relative">
        <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
        <Input placeholder={t('searchEverything')} value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query.length >= 2 && setOpen(true)}
          className={`${isRTL ? 'pr-10 pl-8' : 'pl-10 pr-8'}`} />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
            className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'}`}>
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
      {open && query.length >= 2 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-lg max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">{t('loading')}</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">{t('noResults')}</div>
          ) : (
            Object.entries(grouped).map(([type, items]) => {
              const cfg = TYPE_CONFIG[type];
              if (!cfg) return null;
              const Icon = cfg.icon;
              return (
                <div key={type}>
                  <div className={`px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30 flex items-center gap-2`}>
                    <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                    {t(type === 'journalist' ? 'journalists' : type === 'expert' ? 'experts' : type === 'company' ? 'companies' : 'publications')}
                    <span className="text-muted-foreground/60">({items.length})</span>
                  </div>
                  {items.map((profile: any) => (
                    <button key={profile.profile_id} onClick={() => handleSelect(profile)}
                      className="w-full p-3 hover:bg-muted/50 transition-colors flex items-center gap-3 text-left">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary">{profile.display_name?.charAt(0)}</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{isRTL && profile.display_name_ar ? profile.display_name_ar : profile.display_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{isRTL && profile.headline_ar ? profile.headline_ar : profile.headline}</p>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;