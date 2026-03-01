import { useLanguage } from '@/contexts/LanguageContext';
import useTaxonomies from '@/hooks/useTaxonomies';
import { getCountryName } from '@/data/countries';
import Layout from '@/components/layout/Layout';
import DirectoryFilters from '@/components/directory/DirectoryFilters';
import DirectoryResults from '@/components/directory/DirectoryResults';
import { FilterAccessGate } from '@/components/directory/DirectoryAccessGate';
import { useDirectoryQuery } from '@/hooks/useDirectoryQuery';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap } from 'lucide-react';

const ExpertsDirectory = () => {
  const { t, isRTL } = useLanguage();
  const { sectors, getLabel } = useTaxonomies();

  const {
    visibleProfiles, loading, filterOptions, filters, sortBy, hasActiveFilters,
    hasMoreToLoad, showLoadLimitPrompt, handleLoadMore, canLoadMore, getRemainingLoads,
    updateFilter, clearAllFilters, accessLoading, isAuthenticated, hasSubscription, canAccessFilters, navigate,
  } = useDirectoryQuery({
    profileType: 'expert',
    filterKeys: ['search', 'country', 'city', 'sector', 'language'],
    buildQuery: (query: any, f: any, { sortBy }: any) => {
      query = supabase.from('directory_profiles').select(`*, expert_profiles (expert_role, organisation_name, position)`)
        .eq('profile_type', 'expert').eq('approval_status', 'approved').eq('is_public', true).eq('is_listed', true);
      if (sortBy === 'views') query = query.order('visits_count', { ascending: false, nullsFirst: false });
      else if (sortBy === 'top') query = query.order('is_top_listing', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });
      else if (sortBy === 'updated') query = query.order('updated_at', { ascending: false });
      else query = query.order('created_at', { ascending: false });
      if (f.search) query = query.or(`display_name.ilike.%${f.search}%,headline.ilike.%${f.search}%,bio.ilike.%${f.search}%`);
      if (f.country) query = query.eq('country_code', f.country);
      if (f.city) query = query.eq('city', f.city);
      if (f.language) query = query.contains('languages', [f.language]);
      if (f.sector) { const match = sectors.find((s: any) => s.slug === f.sector); if (match) query = query.or(`sector_id.eq.${match.id},specializations.cs.{${match.id}}`); }
      return query;
    },
    transformResults: (data: any[]) => data.map(p => ({ ...p, expert_role: p.expert_profiles?.expert_role || null, organisation_name: p.expert_profiles?.organisation_name || null })),
  });

  const displaySectors = sectors.filter((s: any) => filterOptions.sectors.includes(s.id));

  if (!accessLoading && hasActiveFilters && !canAccessFilters(hasActiveFilters)) {
    return <Layout><FilterAccessGate onBack={() => navigate('/experts')} /></Layout>;
  }

  const sortOptions = [
    { value: 'recent', label: isRTL ? 'الأحدث' : 'Most Recent' },
    { value: 'updated', label: isRTL ? 'آخر تحديث' : 'Recently Updated' },
    { value: 'views', label: isRTL ? 'الأكثر مشاهدة' : 'Most Viewed' },
    { value: 'top', label: isRTL ? 'المميزون أولاً' : 'Top Listings First' },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{t('expertsDirectory')}</h1>
          <p className="text-muted-foreground">{t('expertsSubtitle')}</p>
        </div>
        <DirectoryFilters filters={filters} updateFilter={updateFilter} clearAllFilters={clearAllFilters}
          hasActiveFilters={hasActiveFilters} hasSubscription={hasSubscription} isAuthenticated={isAuthenticated}
          searchPlaceholder={t('searchExperts')} sortBy={sortBy} sortOptions={sortOptions}
          selectFilters={[
            { key: 'country', placeholder: t('country'), allLabel: t('allCountries'), options: filterOptions.countries.map((c: string) => ({ value: c, label: getCountryName(c, isRTL ? 'ar' : 'en') })) },
            { key: 'city', placeholder: t('city'), allLabel: t('allCities'), options: filterOptions.cities.map((c: string) => ({ value: c, label: c })) },
            { key: 'sector', placeholder: t('sector'), allLabel: t('allSectors'), options: displaySectors.map((s: any) => ({ value: s.slug, label: getLabel(s) })) },
            { key: 'language', placeholder: t('language'), allLabel: t('allLanguages'), options: filterOptions.languages.map((l: string) => ({ value: l, label: l })) },
          ]}
          chipFilters={[]}
        />
        <DirectoryResults profiles={visibleProfiles} profileType="expert" loading={loading}
          emptyTitle={t('noExpertsFound')} emptyIcon={GraduationCap}
          hasActiveFilters={hasActiveFilters} clearAllFilters={clearAllFilters}
          hasMoreToLoad={hasMoreToLoad} showLoadLimitPrompt={showLoadLimitPrompt}
          handleLoadMore={handleLoadMore} canLoadMore={canLoadMore}
          hasSubscription={hasSubscription} getRemainingLoads={getRemainingLoads}
        />
      </div>
    </Layout>
  );
};

export default ExpertsDirectory;
