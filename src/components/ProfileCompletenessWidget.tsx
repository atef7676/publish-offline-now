import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Camera, FileText, MapPin, Link2, Tag, Type } from 'lucide-react';

const FIELD_CHECKS = [
  { key: 'avatar', icon: Camera, check: (p: any) => !!p.avatar_url, tip: { en: 'Add a photo', ar: 'أضف صورة' } },
  { key: 'bio', icon: FileText, check: (p: any) => !!p.bio && p.bio.length > 10, tip: { en: 'Add a bio', ar: 'أضف سيرة ذاتية' } },
  { key: 'headline', icon: Type, check: (p: any) => !!p.headline, tip: { en: 'Add a headline', ar: 'أضف عنوان' } },
  { key: 'country', icon: MapPin, check: (p: any) => !!p.country_code, tip: { en: 'Add country', ar: 'أضف البلد' } },
  { key: 'social', icon: Link2, check: (p: any) => !!(p.twitter_handle || p.linkedin_url || p.website_url), tip: { en: 'Add a social link', ar: 'أضف رابط' } },
  { key: 'tags', icon: Tag, check: (p: any) => p.tags?.length > 0, tip: { en: 'Add tags', ar: 'أضف وسوم' } },
];

const ProfileCompletenessWidget = () => {
  const { user } = useAuth();
  const { isRTL } = useLanguage();
  const lang = isRTL ? 'ar' : 'en';
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('directory_profiles')
      .select('*')
      .eq('owner_user_id', user.id)
      .limit(5)
      .then(({ data }) => { setProfiles(data || []); setLoading(false); });
  }, [user]);

  if (loading || profiles.length === 0) return null;

  const profile = profiles[0];
  const completed = FIELD_CHECKS.filter(f => f.check(profile));
  const missing = FIELD_CHECKS.filter(f => !f.check(profile));
  const score = Math.round((completed.length / FIELD_CHECKS.length) * 100);

  if (score === 100) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">{isRTL ? 'اكتمال الملف' : 'Profile Completeness'}</h3>
        <span className={`text-sm font-bold ${score >= 80 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-destructive'}`}>{score}%</span>
      </div>
      <Progress value={score} className="h-2 mb-4" />
      <div className="space-y-2">
        {missing.map(({ key, icon: Icon, tip }) => (
          <Link key={key} to="/me/listings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <AlertCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
            <span>{tip[lang]}</span>
          </Link>
        ))}
      </div>
      {completed.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-1 text-xs text-green-600">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{completed.length}/{FIELD_CHECKS.length} completed</span>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletenessWidget;
