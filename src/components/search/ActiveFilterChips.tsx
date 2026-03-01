import { useLanguage } from '@/contexts/LanguageContext';
import { X } from 'lucide-react';

interface FilterChip { key: string; label: string; value: string; }

const ActiveFilterChips = ({ filters = [], onRemove }: { filters: FilterChip[]; onRemove: (key: string) => void }) => {
  const { t, isRTL } = useLanguage();
  const activeFilters = filters.filter(f => f.value);
  if (activeFilters.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <span className="text-xs text-muted-foreground font-medium">{t('activeFilters')}:</span>
      {activeFilters.map(({ key, label, value }) => (
        <button key={key} onClick={() => onRemove(key)} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span>{label}: {value}</span>
          <X className="w-3 h-3" />
        </button>
      ))}
      {activeFilters.length > 1 && (
        <button onClick={() => activeFilters.forEach(f => onRemove(f.key))} className="text-xs text-muted-foreground hover:text-foreground underline">
          {t('clearFilters')}
        </button>
      )}
    </div>
  );
};

export default ActiveFilterChips;
