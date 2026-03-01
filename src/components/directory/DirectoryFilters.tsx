import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import ActiveFilterChips from '@/components/search/ActiveFilterChips';

interface SelectFilter { key: string; placeholder: string; allLabel: string; options: { value: string; label: string }[]; }
interface ChipFilter { key: string; label: string; value: string; }
interface SortOption { value: string; label: string; }

const DirectoryFilters = ({
  filters, updateFilter, clearAllFilters, hasActiveFilters, hasSubscription, isAuthenticated,
  selectFilters = [], searchPlaceholder, chipFilters = [], sortBy, sortOptions,
}: {
  filters: Record<string, string>; updateFilter: (key: string, value: string) => void;
  clearAllFilters: () => void; hasActiveFilters: boolean; hasSubscription: boolean; isAuthenticated: boolean;
  selectFilters?: SelectFilter[]; searchPlaceholder?: string; chipFilters?: ChipFilter[];
  sortBy?: string; sortOptions?: SortOption[];
}) => {
  const { isRTL, t } = useLanguage();
  const disabled = !hasSubscription && !isAuthenticated;
  const totalCols = 2 + selectFilters.length + (sortOptions ? 1 : 0);

  return (
    <>
      {(hasSubscription || !hasActiveFilters) && (
        <div className={`grid gap-4 mb-6 ${isRTL ? 'md:grid-flow-dense' : ''}`} style={{ gridTemplateColumns: `repeat(${Math.min(totalCols, 7)}, minmax(0, 1fr))` }}>
          <div className="relative" style={{ gridColumn: 'span 2' }}>
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input placeholder={searchPlaceholder || t('searchByName')} value={filters.search || ''} onChange={(e) => updateFilter('search', e.target.value)} className={isRTL ? 'pr-10' : 'pl-10'} disabled={disabled} />
          </div>
          {selectFilters.map(sf => (
            <Select key={sf.key} value={filters[sf.key] || ''} onValueChange={(v) => updateFilter(sf.key, v === 'all' ? '' : v)} disabled={disabled}>
              <SelectTrigger><SelectValue placeholder={sf.placeholder} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{sf.allLabel}</SelectItem>
                {sf.options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          ))}
          {sortOptions && (
            <Select value={sortBy} onValueChange={(v) => updateFilter('sort', v === 'recent' ? '' : v)}>
              <SelectTrigger><SelectValue placeholder={isRTL ? 'ترتيب حسب' : 'Sort by'} /></SelectTrigger>
              <SelectContent>
                {sortOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {chipFilters.length > 0 && <ActiveFilterChips filters={chipFilters} onRemove={(key) => updateFilter(key, '')} />}

      {!hasSubscription && !isAuthenticated && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">{isRTL ? 'سجل الدخول للوصول للبحث والفلاتر المتقدمة' : 'Sign in to access search and advanced filters'}</p>
        </div>
      )}

      {hasActiveFilters && (
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={clearAllFilters}><X className="w-4 h-4 mr-1" />{isRTL ? 'مسح الفلاتر' : 'Clear Filters'}</Button>
        </div>
      )}
    </>
  );
};

export default DirectoryFilters;
