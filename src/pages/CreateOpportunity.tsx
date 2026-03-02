import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TagInput from '@/components/ui/TagInput';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { toast } from 'sonner';
import { countries } from '@/data/countries';

const OPPORTUNITY_TYPES = [
  { value: 'job_full_time', en: 'Full-Time Job', ar: 'وظيفة دوام كامل' },
  { value: 'job_part_time', en: 'Part-Time Job', ar: 'وظيفة دوام جزئي' },
  { value: 'contract', en: 'Contract', ar: 'عقد' },
  { value: 'project', en: 'Project', ar: 'مشروع' },
  { value: 'task', en: 'Task', ar: 'مهمة' },
  { value: 'commission_story', en: 'Story Commission', ar: 'تكليف قصة' },
];

const COMPENSATION_TYPES = [
  { value: 'fixed_fee', en: 'Fixed Fee', ar: 'مبلغ ثابت' },
  { value: 'monthly', en: 'Monthly', ar: 'شهري' },
  { value: 'hourly', en: 'Hourly', ar: 'بالساعة' },
  { value: 'per_story', en: 'Per Story', ar: 'لكل قصة' },
  { value: 'request_quote', en: 'Request Quote', ar: 'طلب عرض سعر' },
];

const CreateOpportunity = () => {
  const { isRTL, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const lang = language === 'ar' ? 'ar' : 'en';
  const [companyProfiles, setCompanyProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    company_profile_id: '', title: '', title_ar: '', description: '', description_ar: '',
    opportunity_type: 'project', sector_tags: [] as string[], country_code: '', city: '',
    work_location: 'remote', language_required: [] as string[], compensation_type: 'fixed_fee',
    budget_currency: 'USD', budget_min: '', budget_max: '', urgency_level: 3,
    required_experience_years: '', nda_required: false, visibility: 'public', closes_at: '',
  });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    supabase.from('directory_profiles').select('profile_id, display_name, display_name_ar')
      .eq('owner_user_id', user.id).eq('profile_type', 'company').eq('approval_status', 'approved')
      .then(({ data }) => {
        if (!data?.length) { navigate('/opportunities'); toast.error('Need an approved company profile'); return; }
        setCompanyProfiles(data);
        setForm(f => ({ ...f, company_profile_id: data[0].profile_id }));
        setLoading(false);
      });
  }, [user, navigate]);

  const u = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (status = 'draft') => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.description.trim()) { toast.error('Description is required'); return; }
    if (!form.country_code) { toast.error('Country is required'); return; }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('opportunities').insert({
        ...form, created_by_user_id: user!.id, status,
        budget_min: form.budget_min ? parseFloat(form.budget_min) : null,
        budget_max: form.budget_max ? parseFloat(form.budget_max) : null,
        required_experience_years: form.required_experience_years ? parseInt(form.required_experience_years) : null,
        closes_at: form.closes_at || null,
        published_at: status === 'published' ? new Date().toISOString() : null,
      });
      if (error) throw error;
      toast.success(status === 'published' ? 'Published!' : 'Draft saved');
      navigate('/opportunities/manage');
    } catch { toast.error('Failed to create'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <Layout><LoadingSpinner className="py-20" size="lg" /></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" size="sm" onClick={() => navigate('/opportunities')} className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" />{isRTL ? 'العودة' : 'Back'}</Button>
        <h1 className="text-2xl font-bold mb-6">{isRTL ? 'إنشاء فرصة جديدة' : 'Create New Opportunity'}</h1>
        <div className="space-y-6 bg-card border border-border rounded-xl p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Title (English) *</Label><Input value={form.title} onChange={e => u('title', e.target.value)} /></div>
            <div><Label>Title (Arabic)</Label><Input value={form.title_ar} onChange={e => u('title_ar', e.target.value)} dir="rtl" /></div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div><Label>Type</Label><Select value={form.opportunity_type} onValueChange={v => u('opportunity_type', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{OPPORTUNITY_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t[lang as 'en'|'ar']}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Location</Label><Select value={form.work_location} onValueChange={v => u('work_location', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="remote">Remote</SelectItem><SelectItem value="onsite">On-site</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem></SelectContent></Select></div>
            <div><Label>Visibility</Label><Select value={form.visibility} onValueChange={v => u('visibility', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="public">Public</SelectItem><SelectItem value="invite_only">Invite Only</SelectItem></SelectContent></Select></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Country *</Label><Select value={form.country_code} onValueChange={v => u('country_code', v)}><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{countries.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>City</Label><Input value={form.city} onChange={e => u('city', e.target.value)} /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Description (English) *</Label><Textarea value={form.description} onChange={e => u('description', e.target.value)} rows={6} /></div>
            <div><Label>Description (Arabic)</Label><Textarea value={form.description_ar} onChange={e => u('description_ar', e.target.value)} rows={6} dir="rtl" /></div>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div><Label>Compensation</Label><Select value={form.compensation_type} onValueChange={v => u('compensation_type', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{COMPENSATION_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t[lang as 'en'|'ar']}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Currency</Label><Select value={form.budget_currency} onValueChange={v => u('budget_currency', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="AED">AED</SelectItem><SelectItem value="SAR">SAR</SelectItem><SelectItem value="EUR">EUR</SelectItem></SelectContent></Select></div>
            <div><Label>Budget Min</Label><Input type="number" value={form.budget_min} onChange={e => u('budget_min', e.target.value)} /></div>
            <div><Label>Budget Max</Label><Input type="number" value={form.budget_max} onChange={e => u('budget_max', e.target.value)} /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Sector Tags</Label><TagInput value={form.sector_tags} onChange={v => u('sector_tags', v)} placeholder="Add sector..." /></div>
            <div><Label>Required Languages</Label><TagInput value={form.language_required} onChange={v => u('language_required', v)} placeholder="Add language..." /></div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div><Label>Urgency (1-5)</Label><Input type="number" min={1} max={5} value={form.urgency_level} onChange={e => u('urgency_level', parseInt(e.target.value) || 3)} /></div>
            <div><Label>Experience (years)</Label><Input type="number" value={form.required_experience_years} onChange={e => u('required_experience_years', e.target.value)} /></div>
            <div><Label>Closing Date</Label><Input type="date" value={form.closes_at} onChange={e => u('closes_at', e.target.value)} /></div>
          </div>
          <div className="flex items-center gap-3"><Switch checked={form.nda_required} onCheckedChange={v => u('nda_required', v)} /><Label>NDA Required</Label></div>
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => handleSubmit('draft')} disabled={submitting}><Save className="w-4 h-4 mr-2" />Save Draft</Button>
            <Button onClick={() => handleSubmit('published')} disabled={submitting}><Send className="w-4 h-4 mr-2" />Publish</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateOpportunity;
