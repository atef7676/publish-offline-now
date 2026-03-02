import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, DollarSign, Briefcase, Zap, Bookmark, BookmarkCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getCountryName } from '@/data/countries';
import { formatDistanceToNow } from 'date-fns';

export const TYPE_LABELS: Record<string, Record<string, string>> = {
  job_full_time: { en: 'Full-Time', ar: 'دوام كامل' },
  job_part_time: { en: 'Part-Time', ar: 'دوام جزئي' },
  contract: { en: 'Contract', ar: 'عقد' },
  retainer: { en: 'Retainer', ar: 'تعاقد مستمر' },
  project: { en: 'Project', ar: 'مشروع' },
  task: { en: 'Task', ar: 'مهمة' },
  commission_story: { en: 'Story Commission', ar: 'تكليف قصة' },
  commission_research: { en: 'Research', ar: 'بحث' },
  commission_translation: { en: 'Translation', ar: 'ترجمة' },
  commission_event_coverage: { en: 'Event Coverage', ar: 'تغطية حدث' },
  consulting_editorial: { en: 'Editorial Consulting', ar: 'استشارات تحريرية' },
  training_media: { en: 'Media Training', ar: 'تدريب إعلامي' },
};

export const LOCATION_LABELS: Record<string, Record<string, string>> = {
  remote: { en: 'Remote', ar: 'عن بُعد' },
  onsite: { en: 'On-site', ar: 'حضوري' },
  hybrid: { en: 'Hybrid', ar: 'هجين' },
};

export const COMPENSATION_LABELS: Record<string, Record<string, string>> = {
  fixed_fee: { en: 'Fixed Fee', ar: 'مبلغ ثابت' },
  monthly: { en: 'Monthly', ar: 'شهري' },
  hourly: { en: 'Hourly', ar: 'بالساعة' },
  per_story: { en: 'Per Story', ar: 'لكل قصة' },
  per_day: { en: 'Per Day', ar: 'لكل يوم' },
  request_quote: { en: 'Request Quote', ar: 'طلب عرض سعر' },
};

interface OpportunityCardProps {
  opportunity: any;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

const OpportunityCard = ({ opportunity, isSaved, onToggleSave }: OpportunityCardProps) => {
  const { isRTL, language } = useLanguage();
  const lang = language === 'ar' ? 'ar' : 'en';

  const typeLabel = TYPE_LABELS[opportunity.opportunity_type]?.[lang] || opportunity.opportunity_type;
  const locationLabel = LOCATION_LABELS[opportunity.work_location]?.[lang] || opportunity.work_location;

  const formatBudget = () => {
    if (!opportunity.budget_min && !opportunity.budget_max) {
      return COMPENSATION_LABELS[opportunity.compensation_type]?.[lang] || '';
    }
    const currency = opportunity.budget_currency || 'USD';
    if (opportunity.budget_min && opportunity.budget_max) {
      return `${currency} ${opportunity.budget_min.toLocaleString()} – ${opportunity.budget_max.toLocaleString()}`;
    }
    if (opportunity.budget_min) return `${currency} ${opportunity.budget_min.toLocaleString()}+`;
    return `${lang === 'ar' ? 'حتى' : 'Up to'} ${currency} ${opportunity.budget_max.toLocaleString()}`;
  };

  const companyName = opportunity.company?.display_name || '';
  const timeAgo = opportunity.published_at
    ? formatDistanceToNow(new Date(opportunity.published_at), { addSuffix: true })
    : '';

  return (
    <Link to={`/opportunities/${opportunity.id}`} className="block group">
      <div className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-md hover:border-primary/30 relative">
        {onToggleSave && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSave(opportunity.id); }}
            className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5 text-primary" /> : <Bookmark className="w-5 h-5" />}
          </button>
        )}

        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge variant="secondary" className="text-xs font-medium">{typeLabel}</Badge>
            <Badge variant="outline" className="text-xs">{locationLabel}</Badge>
            {opportunity.nda_required && (
              <Badge variant="outline" className="text-xs border-destructive/30 text-destructive">NDA</Badge>
            )}
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {lang === 'ar' && opportunity.title_ar ? opportunity.title_ar : opportunity.title}
          </h3>
        </div>

        {companyName && (
          <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 shrink-0" />
            {companyName}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground mb-3">
          {opportunity.country_code && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {getCountryName(opportunity.country_code, lang)}
              {opportunity.city ? `, ${opportunity.city}` : ''}
            </span>
          )}
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            {formatBudget()}
          </span>
          {opportunity.urgency_level >= 4 && (
            <span className="flex items-center gap-1 text-destructive">
              <Zap className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'عاجل' : 'Urgent'}
            </span>
          )}
        </div>

        {opportunity.sector_tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {opportunity.sector_tags.slice(0, 3).map((tag: string) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{tag}</span>
            ))}
            {opportunity.sector_tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{opportunity.sector_tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <span>{timeAgo}</span>
          {opportunity.closes_at && (
            <span>{lang === 'ar' ? 'يغلق' : 'Closes'}: {new Date(opportunity.closes_at).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default OpportunityCard;
