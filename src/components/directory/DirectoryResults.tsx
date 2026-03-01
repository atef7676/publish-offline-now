import { useLanguage } from '@/contexts/LanguageContext';
import ProfileCard from '@/components/cards/ProfileCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { LoadLimitPrompt } from '@/components/directory/DirectoryAccessGate';
import { Button } from '@/components/ui/button';
import { ChevronDown, X, LucideIcon } from 'lucide-react';

const DirectoryResults = ({
  profiles, profileType, loading, emptyTitle, emptyIcon, hasActiveFilters, clearAllFilters,
  hasMoreToLoad, showLoadLimitPrompt, handleLoadMore, canLoadMore, hasSubscription, getRemainingLoads,
}: {
  profiles: any[]; profileType: string; loading: boolean; emptyTitle: string; emptyIcon: LucideIcon;
  hasActiveFilters: boolean; clearAllFilters: () => void; hasMoreToLoad: boolean;
  showLoadLimitPrompt: boolean; handleLoadMore: () => void; canLoadMore: () => boolean;
  hasSubscription: boolean; getRemainingLoads: () => number;
}) => {
  const { isRTL, t } = useLanguage();

  if (loading) return <LoadingSpinner className="py-20" size="lg" />;

  if (profiles.length === 0) {
    return (
      <div className="text-center py-16">
        <EmptyState title={emptyTitle} description={hasActiveFilters ? (isRTL ? 'جرب تعديل الفلاتر' : 'Try adjusting your filters') : t('noResultsDescription')} icon={emptyIcon} />
        {hasActiveFilters && (
          <Button variant="outline" className="mt-4" onClick={clearAllFilters}><X className="w-4 h-4 mr-1" />{isRTL ? 'مسح الفلاتر' : 'Reset Filters'}</Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile: any) => <ProfileCard key={profile.profile_id || profile.id} profile={profile} type={profileType} />)}
      </div>
      {hasMoreToLoad && !showLoadLimitPrompt && (
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={handleLoadMore} disabled={!canLoadMore()}>
            <ChevronDown className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{isRTL ? 'تحميل المزيد' : 'Load More'}
            {!hasSubscription && getRemainingLoads() < Infinity && <span className="text-muted-foreground ml-2">({getRemainingLoads()} {isRTL ? 'متبقية' : 'left'})</span>}
          </Button>
        </div>
      )}
      {showLoadLimitPrompt && <LoadLimitPrompt />}
    </>
  );
};

export default DirectoryResults;
