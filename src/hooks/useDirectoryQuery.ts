import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserRole } from '@/hooks/useUserRole';
import useDirectoryAccess from '@/hooks/useDirectoryAccess';
import { useAuditLog } from '@/hooks/useAuditLog';

export function useDirectoryQuery({ profileType, filterKeys = ['search', 'country', 'city', 'sector', 'language'], defaultSort = 'recent', buildQuery, transformResults, fetchExtraFilters }: any) {
  const { isRTL } = useLanguage();
  const { isAdmin, isSubAdmin } = useUserRole();
  const navigate = useNavigate();
  const { loading: accessLoading, subscriptionLoading, isAuthenticated, hasSubscription, canAccessFilters, canLoadMore, trackLoad, shouldNoIndex, shouldShowSubscriptionPrompt, getRemainingLoads, config: accessConfig } = useDirectoryAccess();

  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownerEmails, setOwnerEmails] = useState<Record<string, string>>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOptions, setFilterOptions] = useState<any>({ countries: [], cities: [], languages: [], sectors: [], roles: [], categories: [] });

  const batchSize = accessConfig.batch_size || 6;
  const [visibleCount, setVisibleCount] = useState(batchSize);

  const filters: Record<string, string> = {};
  filterKeys.forEach((key: string) => { filters[key] = searchParams.get(key) || ''; });
  const sortBy = searchParams.get('sort') || defaultSort;
  const hasActiveFilters = filterKeys.some((k: string) => filters[k]) || (sortBy && sortBy !== defaultSort);

  useEffect(() => { setVisibleCount(batchSize); }, [...Object.values(filters), sortBy, batchSize]);

  const { logDirectoryView } = useAuditLog();

  useEffect(() => {
    fetchProfiles();
    fetchFilters();
    logDirectoryView(profileType, filters);
  }, [...Object.values(filters), sortBy]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      let query = supabase.from('directory_profiles').select('*').eq('profile_type', profileType).eq('approval_status', 'approved').eq('is_public', true).eq('is_listed', true);
      if (sortBy === 'views') query = query.order('visits_count', { ascending: false, nullsFirst: false });
      else if (sortBy === 'top') query = query.order('is_top_listing', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });
      else if (sortBy === 'updated') query = query.order('updated_at', { ascending: false });
      else query = query.order('created_at', { ascending: false });

      if (buildQuery) query = buildQuery(query, filters, { sortBy });
      else {
        if (filters.search) query = query.or(`display_name.ilike.%${filters.search}%,headline.ilike.%${filters.search}%`);
        if (filters.country) query = query.eq('country_code', filters.country);
        if (filters.city) query = query.eq('city', filters.city);
        if (filters.language) query = query.contains('languages', [filters.language]);
      }

      const { data, error } = await query;
      if (error) throw error;
      setAllProfiles(transformResults ? transformResults(data || []) : (data || []));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchFilters = async () => {
    const { data } = await supabase.from('directory_profiles').select('country_code, city, languages, sector_id, specializations, media_role, category').eq('profile_type', profileType).eq('approval_status', 'approved').eq('is_public', true).eq('is_listed', true);
    if (data) {
      const sectorIds = new Set<string>();
      data.forEach(d => { if (d.sector_id) sectorIds.add(d.sector_id); if (d.specializations) d.specializations.forEach((s: string) => sectorIds.add(s)); });
      setFilterOptions({
        countries: [...new Set(data.map(d => d.country_code).filter(Boolean))],
        cities: [...new Set(data.map(d => d.city).filter(Boolean))],
        languages: [...new Set(data.flatMap(d => d.languages || []))],
        sectors: [...sectorIds],
        roles: [...new Set(data.map(d => d.media_role).filter(Boolean))],
        categories: [...new Set(data.map(d => d.category).filter(Boolean))],
      });
    }
  };

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const clearAllFilters = useCallback(() => setSearchParams(new URLSearchParams()), [setSearchParams]);

  const handleLoadMore = useCallback(() => {
    if (canLoadMore()) { trackLoad(profileType); setVisibleCount(prev => prev + batchSize); }
  }, [canLoadMore, trackLoad, batchSize, profileType]);

  const visibleProfiles = allProfiles.slice(0, visibleCount);
  const hasMoreToLoad = visibleCount < allProfiles.length;
  const showLoadLimitPrompt = !subscriptionLoading && shouldShowSubscriptionPrompt() && hasMoreToLoad;

  return { allProfiles, visibleProfiles, loading, ownerEmails, filterOptions, filters, sortBy, hasActiveFilters, hasMoreToLoad, showLoadLimitPrompt, handleLoadMore, canLoadMore, getRemainingLoads, updateFilter, clearAllFilters, accessLoading, isAuthenticated, hasSubscription, canAccessFilters, navigate };
}

export default useDirectoryQuery;
