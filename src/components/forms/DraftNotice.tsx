import { AlertTriangle, Trash2, Clock, Check, Loader2, Cloud } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

interface DraftNoticeProps {
  lastSaved: Date | null;
  onDiscard: () => void;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  className?: string;
}

const DraftNotice = ({ lastSaved, onDiscard, saveStatus = 'idle', className = '' }: DraftNoticeProps) => {
  const { isRTL } = useLanguage();

  const renderStatusIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-medium">
            <Loader2 className="w-3 h-3 animate-spin" />
            {isRTL ? 'جارٍ الحفظ...' : 'Saving...'}
          </span>
        );
      case 'saved':
        return (
          <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs font-medium">
            <Cloud className="w-3 h-3" />
            {isRTL ? 'تم الحفظ محلياً' : 'Saved locally'}
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-medium">
            <AlertTriangle className="w-3 h-3" />
            {isRTL ? 'خطأ في الحفظ' : 'Save error'}
          </span>
        );
      default:
        return null;
    }
  };

  if (!lastSaved && saveStatus === 'idle') return null;

  if (!lastSaved && saveStatus !== 'idle') {
    return (
      <div className={`flex items-center justify-end gap-2 py-2 ${className}`}>
        {renderStatusIndicator()}
      </div>
    );
  }

  const timeAgo = lastSaved ? formatDistanceToNow(lastSaved, { 
    addSuffix: true, 
    locale: isRTL ? ar : enUS 
  }) : '';

  return (
    <Alert className={`border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 ${className}`}>
      <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-amber-800 dark:text-amber-200 text-sm">
            {isRTL 
              ? `تم استعادة المسودة المحفوظة ${timeAgo}` 
              : `Draft restored from ${timeAgo}`
            }
          </span>
          {renderStatusIndicator()}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDiscard}
          className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/30 h-7 px-2 shrink-0"
        >
          <Trash2 className={`w-3.5 h-3.5 ${isRTL ? 'ml-1' : 'mr-1'}`} />
          {isRTL ? 'تجاهل' : 'Discard'}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export const SaveStatusIndicator = ({ saveStatus, className = '' }: { saveStatus: string, className?: string }) => {
  const { isRTL } = useLanguage();

  switch (saveStatus) {
    case 'saving':
      return (
        <span className={`flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs ${className}`}>
          <Loader2 className="w-3 h-3 animate-spin" />
          {isRTL ? 'جارٍ الحفظ...' : 'Saving...'}
        </span>
      );
    case 'saved':
      return (
        <span className={`flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs ${className}`}>
          <Check className="w-3 h-3" />
          {isRTL ? 'تم الحفظ محلياً' : 'Saved locally'}
        </span>
      );
    case 'error':
      return (
        <span className={`flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs ${className}`}>
          <AlertTriangle className="w-3 h-3" />
          {isRTL ? 'خطأ في الحفظ' : 'Save error'}
        </span>
      );
    default:
      return null;
  }
};

export default DraftNotice;
