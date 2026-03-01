import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import DirectoryFilters from '@/components/directory/DirectoryFilters';
import DirectoryResults from '@/components/directory/DirectoryResults';
import { FilterAccessGate } from '@/components/directory/DirectoryAccessGate';
import { useDirectoryQuery } from '@/hooks/useDirectoryQuery';
import { supabase } from '@/integrations/supabase/client';
import { Newspaper } from 'lucide-react';

const PublicationsDirectory = () => {
  const { t, isRTL } = useLanguage();

  const {
    visibleProfiles, loading, filterOptions, filters, sortBy, hasActiveFilters,
    hasMoreToLoad, showLoadLimitPrompt, handleLoadMore, canLoadMore, getRemainingLoads,
    updateFilter, clearAllFilters, accessLoading, isAuthenticated, hasSubscription, canAccessFilters, navigate,
  } = useDirectoryQuery({
    profileType: 'publication',
    filterKeys: ['search', 'country', 'category'],
    buildQuery: (query: any, f: any, { sortBy }: any) => {
      query = supabase.from('directory_profiles').select(`*`)
        .eq('profile_type', 'publication').eq('approval_status', 'approved').eq('is_public', true).eq('is_listed', true);
      if (sortBy === 'views') query = query.order('visits_count', { ascending: false, nullsFirst: false });
      else if (sortBy === 'top') query = query.order('is_top_listing', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });
      else if (sortBy === 'updated') query = query.order('updated_at', { ascending: false });
      else if (sortBy === 'name') query = query.order('display_name', { ascending: true });
      else query = query.order('created_at', { ascending: false });
      if (f.search) query = query.or(`display_name.ilike.%${f.search}%,bio.ilike.%${f.search}%`);
      if (f.country) query = query.eq('country_code', f.country);
      if (f.category) query = query.eq('category', f.category);
      return query;
    },
    transformResults: (data: any[]) => data.map(p => ({ ...p, id: p.profile_id, name: p.display_name, description: p.bio, logo_url: p.avatar_url })),
  });

  if (!accessLoading && hasActiveFilters && !canAccessFilters(hasActiveFilters)) {
    return <Layout><FilterAccessGate onBack={() => navigate('/publications')} /></Layout>;
  }

  const sortOptions = [
    { value: 'recent', label: isRTL ? 'الأحدث' : 'Most Recent' },
    { value: 'updated', label: isRTL ? 'آخر تحديث' : 'Recently Updated' },
    { value: 'views', label: isRTL ? 'الأكثر مشاهدة' : 'Most Viewed' },
    { value: 'top', label: isRTL ? 'المميزون أولاً' : 'Top Listings First' },
    { value: 'name', label: isRTL ? 'أبجدي' : 'Alphabetical' },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{t('publicationsDirectory')}</h1>
          <p className="text-muted-foreground">{t('publicationsSubtitle')}</p>
        </div>
        <DirectoryFilters filters={filters} updateFilter={updateFilter} clearAllFilters={clearAllFilters}
          hasActiveFilters={hasActiveFilters} hasSubscription={hasSubscription} isAuthenticated={isAuthenticated}
          searchPlaceholder={t('searchPublications')} sortBy={sortBy} sortOptions={sortOptions}
          selectFilters={[
            { key: 'country', placeholder: t('country'), allLabel: t('allCountries'), options: filterOptions.countries.map((c: string) => ({ value: c, label: c })) },
            { key: 'category', placeholder: t('sector'), allLabel: t('allSectors'), options: filterOptions.categories.map((c: string) => ({ value: c, label: c })) },
          ]}
          chipFilters={[]}
        />
        <DirectoryResults profiles={visibleProfiles} profileType="publication" loading={loading}
          emptyTitle={t('noPublicationsFound')} emptyIcon={Newspaper}
          hasActiveFilters={hasActiveFilters} clearAllFilters={clearAllFilters}
          hasMoreToLoad={hasMoreToLoad} showLoadLimitPrompt={showLoadLimitPrompt}
          handleLoadMore={handleLoadMore} canLoadMore={canLoadMore}
          hasSubscription={hasSubscription} getRemainingLoads={getRemainingLoads}
        />
      </div>
    </Layout>
  );
};

export default PublicationsDirectory;
