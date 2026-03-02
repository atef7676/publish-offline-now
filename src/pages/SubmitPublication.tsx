import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import usePermissions from '@/hooks/usePermissions';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PublicationProfileForm from '@/components/forms/PublicationProfileForm';
import { ArrowLeft, Search, Sparkles, AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const SubmitPublication = () => {
  const { user, loading: authLoading } = useAuth();
  const { isRTL } = useLanguage();
  const { isAdminOrSubAdmin } = usePermissions();
  const navigate = useNavigate();

  const [step, setStep] = useState<'search' | 'form'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [websiteHint, setWebsiteHint] = useState('');
  const [searching, setSearching] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [existingMatches, setExistingMatches] = useState<any[]>([]);
  const [searchDone, setSearchDone] = useState(false);
  const [aiData, setAiData] = useState<any>(null);
  const [aiFieldKeys, setAiFieldKeys] = useState(new Set<string>());

  const handleSearch = useCallback(async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearching(true); setSearchDone(false); setExistingMatches([]);
    try {
      const { data, error } = await supabase
        .from('directory_profiles')
        .select('profile_id, display_name, display_name_ar, slug, country_code, approval_status, avatar_url')
        .eq('profile_type', 'publication')
        .or(`display_name.ilike.%${q}%,display_name_ar.ilike.%${q}%`)
        .limit(10);
      if (error) throw error;
      setExistingMatches(data || []);
    } catch { toast.error(isRTL ? 'خطأ في البحث' : 'Search failed'); }
    finally { setSearching(false); setSearchDone(true); }
  }, [searchQuery, isRTL]);

  const handleAiEnrich = useCallback(async () => {
    const name = searchQuery.trim();
    if (!name) return;
    setEnriching(true);
    try {
      const { data, error } = await supabase.functions.invoke('enrich-publication', {
        body: { publication_name: name, website_url: websiteHint.trim() || undefined },
      });
      if (error) throw error;
      if (!data?.success) { toast.error(data?.error || 'AI generation failed'); return; }
      const enriched = data.data;
      const populated = new Set<string>();
      for (const [key, val] of Object.entries(enriched)) {
        if (val !== null && val !== undefined && val !== '') populated.add(key);
      }
      setAiFieldKeys(populated);
      setAiData(enriched);
      setStep('form');
      toast.success(isRTL ? 'تم التوليد! راجع البيانات قبل الحفظ.' : 'Generated! Review all fields before saving.');
    } catch { toast.error(isRTL ? 'خطأ في الذكاء الاصطناعي' : 'AI enrichment error'); }
    finally { setEnriching(false); }
  }, [searchQuery, websiteHint, isRTL]);

  const handleSkipToManual = () => { setAiData(null); setAiFieldKeys(new Set()); setStep('form'); };
  const handleSave = () => navigate('/me/listings');

  if (authLoading) return <Layout><LoadingSpinner className="py-32" size="lg" /></Layout>;
  if (!user) return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{isRTL ? 'يجب تسجيل الدخول' : 'Login Required'}</h1>
        <p className="text-muted-foreground mb-6">{isRTL ? 'يجب تسجيل الدخول لإضافة منشور.' : 'You need to be logged in to submit a publication.'}</p>
        <Button asChild><Link to="/login">{isRTL ? 'تسجيل الدخول' : 'Login'}</Link></Button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/publications"><ArrowLeft className="w-4 h-4 mr-2" />{isRTL ? 'العودة إلى المنشورات' : 'Back to Publications'}</Link>
        </Button>
        <h1 className="text-3xl font-bold mb-6">{isRTL ? 'إضافة منشور جديد' : 'Submit a Publication'}</h1>

        {step === 'search' && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label className="text-base font-semibold">{isRTL ? 'ابحث عن المنشور أولاً' : 'Search for the publication first'}</Label>
                <p className="text-sm text-muted-foreground mt-1">{isRTL ? 'تحقق مما إذا كان المنشور موجوداً بالفعل قبل إضافته.' : 'Check if the publication already exists before adding it.'}</p>
              </div>
              <div className="flex gap-2">
                <Input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setSearchDone(false); setExistingMatches([]); }} placeholder={isRTL ? 'اسم المنشور...' : 'Publication name...'} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="flex-1" />
                <Button onClick={handleSearch} disabled={!searchQuery.trim() || searching}>
                  {searching ? <LoadingSpinner size="sm" /> : <Search className="w-4 h-4 mr-2" />}{isRTL ? 'بحث' : 'Search'}
                </Button>
              </div>

              {existingMatches.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-amber-600 flex items-center gap-1"><AlertTriangle className="w-4 h-4" />{isRTL ? `وُجد ${existingMatches.length} منشور(ات) مطابقة` : `Found ${existingMatches.length} existing match(es)`}</p>
                  {existingMatches.map((match) => (
                    <div key={match.profile_id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                      <div className="flex items-center gap-3">
                        {match.avatar_url ? <img src={match.avatar_url} className="w-8 h-8 rounded object-cover" alt="" /> : <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">{match.display_name?.[0]}</div>}
                        <span className="font-medium text-sm">{match.display_name}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild><Link to={`/publications/${match.slug || match.profile_id}`}><ExternalLink className="w-3 h-3 mr-1" />{isRTL ? 'عرض' : 'View'}</Link></Button>
                    </div>
                  ))}
                </div>
              )}

              {searchDone && existingMatches.length === 0 && searchQuery.trim() && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground">{isRTL ? 'لم يتم العثور على منشور بهذا الاسم.' : 'No publication found with that name.'}</p>
                  {isAdminOrSubAdmin && (
                    <>
                      <div><Label className="text-sm">{isRTL ? 'رابط الموقع (اختياري)' : 'Website URL (optional)'}</Label><Input value={websiteHint} onChange={(e) => setWebsiteHint(e.target.value)} type="url" className="mt-1" /></div>
                      <Button onClick={handleAiEnrich} disabled={enriching} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        {enriching ? <LoadingSpinner size="sm" className="mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                        {enriching ? (isRTL ? 'جارٍ التوليد...' : 'Generating...') : (isRTL ? 'توليد بالذكاء الاصطناعي' : 'Generate with AI')}
                      </Button>
                    </>
                  )}
                  <Button variant="outline" onClick={handleSkipToManual}>{isRTL ? 'إضافة يدوية' : 'Add Manually'}</Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 'form' && (
          <div className="space-y-4">
            {aiFieldKeys.size > 0 && (
              <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
                <Sparkles className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm font-medium">{isRTL ? 'تم ملء الحقول المظللة بواسطة الذكاء الاصطناعي. يرجى مراجعتها.' : 'Highlighted fields were AI-generated. Please review before saving.'}</p>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => { setStep('search'); setAiData(null); setAiFieldKeys(new Set()); }}>
              <ArrowLeft className="w-4 h-4 mr-1" />{isRTL ? 'العودة للبحث' : 'Back to search'}
            </Button>
            <PublicationProfileForm userId={user.id} onSave={handleSave} onCancel={() => navigate('/publications')} mode="register" aiPrefill={aiData} aiFieldKeys={aiFieldKeys} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubmitPublication;
