import { useLanguage } from '@/contexts/LanguageContext';
import { getCountryName } from '@/data/countries';
import Layout from '@/components/layout/Layout';
import DirectoryFilters from '@/components/directory/DirectoryFilters';
import DirectoryResults from '@/components/directory/DirectoryResults';
import { useDirectoryQuery } from '@/hooks/useDirectoryQuery';
import { Building2 } from 'lucide-react';

const CompaniesDirectory = () => {
  const { t, isRTL } = useLanguage();

  const {
    visibleProfiles, loading, filterOptions, filters, sortBy, hasActiveFilters,
    hasMoreToLoad, showLoadLimitPrompt, handleLoadMore, canLoadMore, getRemainingLoads,
    updateFilter, clearAllFilters, isAuthenticated, hasSubscription,
  } = useDirectoryQuery({ profileType: 'company', filterKeys: ['search', 'country', 'category'] });

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
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{t('companiesDirectory')}</h1>
          <p className="text-muted-foreground">{t('companiesSubtitle')}</p>
        </div>
        <DirectoryFilters filters={filters} updateFilter={updateFilter} clearAllFilters={clearAllFilters}
          hasActiveFilters={hasActiveFilters} hasSubscription={hasSubscription} isAuthenticated={isAuthenticated}
          searchPlaceholder={t('searchCompanies')} sortBy={sortBy} sortOptions={sortOptions}
          selectFilters={[
            { key: 'country', placeholder: t('country'), allLabel: t('allCountries'), options: filterOptions.countries.map((c: string) => ({ value: c, label: getCountryName(c, isRTL ? 'ar' : 'en') || c })) },
            { key: 'category', placeholder: t('sector'), allLabel: t('allSectors'), options: filterOptions.categories.map((c: string) => ({ value: c, label: c })) },
          ]}
          chipFilters={[
            { key: 'search', label: t('search'), value: filters.search },
            { key: 'country', label: t('country'), value: filters.country },
            { key: 'category', label: t('sector'), value: filters.category },
          ]}
        />
        <DirectoryResults profiles={visibleProfiles} profileType="company" loading={loading}
          emptyTitle={t('noCompaniesFound')} emptyIcon={Building2}
          hasActiveFilters={hasActiveFilters} clearAllFilters={clearAllFilters}
          hasMoreToLoad={hasMoreToLoad} showLoadLimitPrompt={showLoadLimitPrompt}
          handleLoadMore={handleLoadMore} canLoadMore={canLoadMore}
          hasSubscription={hasSubscription} getRemainingLoads={getRemainingLoads}
        />
      </div>
    </Layout>
  );
};

export default CompaniesDirectory;
