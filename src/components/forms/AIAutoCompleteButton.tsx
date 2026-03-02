import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CountrySelect from '@/components/ui/CountrySelect';
import { toast } from 'sonner';
import { Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface AIAutoCompleteButtonProps {
  formData: any;
  profileType?: string;
  onComplete?: (data: any, filledKeys: Set<string>) => void;
  disabled?: boolean;
  className?: string;
}

const AIAutoCompleteButton = ({ 
  formData, 
  profileType = 'journalist', 
  onComplete, 
  disabled = false,
  className = '',
}: AIAutoCompleteButtonProps) => {
  const { isRTL, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hintCountry, setHintCountry] = useState(formData?.country_code || '');
  const [hintUrl, setHintUrl] = useState(formData?.website_url || '');

  const handleAutoComplete = async () => {
    if (!formData?.display_name) {
      toast.error(isRTL ? 'يرجى إدخال الاسم أولاً' : 'Please enter a name first');
      return;
    }

    setLoading(true);
    try {
      const enrichedFormData = { ...formData };
      if (hintCountry && !enrichedFormData.country_code) enrichedFormData.country_code = hintCountry;
      if (hintUrl && !enrichedFormData.website_url) enrichedFormData.website_url = hintUrl;

      const { data, error } = await supabase.functions.invoke('auto-complete-profile', {
        body: {
          profile_data: enrichedFormData,
          profile_type: profileType,
          hint_country: hintCountry || undefined,
          hint_url: hintUrl || undefined,
        },
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'AI auto-complete failed');
      }

      if (data.message === 'Profile is already complete') {
        toast.info(isRTL ? 'الملف الشخصي مكتمل بالفعل' : 'Profile is already complete!');
        return;
      }

      const filledCount = data.fields_filled?.length || 0;
      if (filledCount === 0) {
        toast.info(isRTL ? 'لم يتمكن الذكاء الاصطناعي من العثور على معلومات إضافية' : 'AI could not find additional information');
        return;
      }

      onComplete?.(data.data, new Set(data.fields_filled));
      toast.success(
        isRTL 
          ? `تم ملء ${filledCount} حقول بواسطة الذكاء الاصطناعي — يرجى المراجعة` 
          : `AI filled ${filledCount} field${filledCount > 1 ? 's' : ''} — please review highlighted fields`
      );
    } catch (err: any) {
      console.error('AI auto-complete error:', err);
      const msg = err?.message || 'Unknown error';
      if (msg.includes('Rate limit')) {
        toast.error(isRTL ? 'تم تجاوز الحد. يرجى الانتظار.' : 'Rate limit exceeded. Please wait.');
      } else {
        toast.error(isRTL ? 'فشل الإكمال التلقائي' : 'Auto-complete failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          onClick={() => setExpanded(!expanded)}
          className={`gap-2 border-amber-400/50 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30 ${className}`}
        >
          <Sparkles className="w-4 h-4" />
          {isRTL ? 'إكمال تلقائي بالذكاء الاصطناعي' : 'AI Auto-Complete'}
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </Button>
      </div>

      {expanded && (
        <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-4 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
          <p className="text-xs text-muted-foreground">
            {isRTL 
              ? 'أضف البلد والرابط لتحسين نتائج البحث بالذكاء الاصطناعي'
              : 'Add country and URL to improve AI search accuracy'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">{isRTL ? 'البلد (اختياري)' : 'Country (optional)'}</Label>
              <CountrySelect
                value={hintCountry}
                onChange={setHintCountry}
                // placeholder={isRTL ? 'اختر البلد' : 'Select country'}
                // className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{isRTL ? 'الرابط (اختياري)' : 'URL (optional)'}</Label>
              <Input
                type="url"
                value={hintUrl}
                onChange={(e) => setHintUrl(e.target.value)}
                placeholder="https://..."
                className="h-9"
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={handleAutoComplete}
            disabled={disabled || loading}
            className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading 
              ? (isRTL ? 'جارٍ البحث...' : 'Searching...') 
              : (isRTL ? 'ابدأ الإكمال التلقائي' : 'Start Auto-Complete')
            }
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIAutoCompleteButton;
