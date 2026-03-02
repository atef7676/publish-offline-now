import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Briefcase, Users, Play, Pause, Archive, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<string, any> = {
  draft: { label: 'Draft', labelAr: 'مسودة', color: 'bg-muted text-muted-foreground' },
  published: { label: 'Published', labelAr: 'منشور', color: 'bg-emerald-500/10 text-emerald-700' },
  paused: { label: 'Paused', labelAr: 'متوقف', color: 'bg-secondary/20 text-secondary-foreground' },
  closed: { label: 'Closed', labelAr: 'مغلق', color: 'bg-destructive/10 text-destructive' },
};

const APP_STATUS: Record<string, any> = {
  pending: { label: 'Pending', labelAr: 'قيد الانتظار', color: 'bg-secondary/20 text-secondary-foreground' },
  shortlisted: { label: 'Shortlisted', labelAr: 'مرشح', color: 'bg-primary/10 text-primary' },
  accepted: { label: 'Accepted', labelAr: 'مقبول', color: 'bg-emerald-500/10 text-emerald-700' },
  rejected: { label: 'Rejected', labelAr: 'مرفوض', color: 'bg-destructive/10 text-destructive' },
  withdrawn: { label: 'Withdrawn', labelAr: 'منسحب', color: 'bg-muted text-muted-foreground' },
};

const ManageOpportunities = () => {
  const { isRTL, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const lang = language === 'ar' ? 'ar' : 'en';
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpp, setSelectedOpp] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);

  useEffect(() => { if (!user) navigate('/login'); else fetchOpportunities(); }, [user]);

  const fetchOpportunities = async () => {
    setLoading(true);
    const { data: companies } = await supabase.from('directory_profiles').select('profile_id').eq('owner_user_id', user!.id).eq('profile_type', 'company');
    if (!companies?.length) { setLoading(false); return; }
    const { data } = await supabase.from('opportunities').select('*, company:directory_profiles!company_profile_id(display_name)').in('company_profile_id', companies.map(c => c.profile_id)).order('created_at', { ascending: false });
    setOpportunities(data || []);
    setLoading(false);
  };

  const fetchApplications = async (oppId: string) => {
    setAppsLoading(true); setSelectedOpp(oppId);
    const { data } = await supabase.from('opportunity_applications')
      .select('*, journalist:directory_profiles!journalist_profile_id(display_name, display_name_ar, slug, profile_type, headline)')
      .eq('opportunity_id', oppId).order('created_at', { ascending: false });
    setApplications(data || []);
    setAppsLoading(false);
  };

  const updateOppStatus = async (oppId: string, s: string) => {
    const update: any = { status: s };
    if (s === 'published') update.published_at = new Date().toISOString();
    await supabase.from('opportunities').update(update).eq('id', oppId);
    toast.success('Updated'); fetchOpportunities();
  };

  const updateAppStatus = async (appId: string, s: string) => {
    await supabase.from('opportunity_applications').update({ status: s }).eq('id', appId);
    toast.success('Updated'); if (selectedOpp) fetchApplications(selectedOpp);
  };

  if (loading) return <Layout><LoadingSpinner className="py-20" size="lg" /></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{isRTL ? 'إدارة الفرص' : 'Manage Opportunities'}</h1>
          <Button onClick={() => navigate('/opportunities/create')}><Plus className="w-4 h-4 mr-2" />{isRTL ? 'جديد' : 'New'}</Button>
        </div>
        {opportunities.length === 0 ? (
          <EmptyState title={isRTL ? 'لا توجد فرص' : 'No opportunities'} description={isRTL ? 'أنشئ أولى فرصك' : 'Create your first opportunity'} icon={Briefcase} />
        ) : (
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {opportunities.map(opp => {
                const st = STATUS_CONFIG[opp.status] || STATUS_CONFIG.draft;
                return (
                  <div key={opp.id} onClick={() => fetchApplications(opp.id)} className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedOpp === opp.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{opp.title}</h3>
                        <Badge className={`text-xs mt-1 ${st.color}`}>{lang === 'ar' ? st.labelAr : st.label}</Badge>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {opp.status === 'draft' && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={e => { e.stopPropagation(); updateOppStatus(opp.id, 'published'); }}><Play className="w-3.5 h-3.5" /></Button>}
                        {opp.status === 'published' && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={e => { e.stopPropagation(); updateOppStatus(opp.id, 'paused'); }}><Pause className="w-3.5 h-3.5" /></Button>}
                        {['published', 'paused'].includes(opp.status) && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={e => { e.stopPropagation(); updateOppStatus(opp.id, 'closed'); }}><Archive className="w-3.5 h-3.5" /></Button>}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="lg:col-span-3">
              {!selectedOpp ? (
                <div className="text-center py-16 text-muted-foreground"><Users className="w-12 h-12 mx-auto mb-3 opacity-40" /><p>{isRTL ? 'اختر فرصة' : 'Select an opportunity'}</p></div>
              ) : appsLoading ? <LoadingSpinner className="py-16" /> : applications.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground"><p>{isRTL ? 'لا يوجد متقدمون' : 'No applicants yet'}</p></div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">{isRTL ? 'المتقدمون' : 'Applicants'} ({applications.length})</h2>
                  {applications.map(app => {
                    const ast = APP_STATUS[app.status] || APP_STATUS.pending;
                    return (
                      <div key={app.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <Link to={`/${app.journalist?.profile_type === 'expert' ? 'experts' : 'journalists'}/${app.journalist?.slug}`} className="font-semibold hover:text-primary">{app.journalist?.display_name}</Link>
                            {app.journalist?.headline && <p className="text-sm text-muted-foreground">{app.journalist.headline}</p>}
                          </div>
                          <Select value={app.status} onValueChange={v => updateAppStatus(app.id, v)}>
                            <SelectTrigger className="w-36 h-8"><Badge className={`text-xs ${ast.color}`}>{ast.label}</Badge></SelectTrigger>
                            <SelectContent>{Object.entries(APP_STATUS).map(([k, v]: [string, any]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        {app.cover_note && <p className="text-sm bg-muted/30 p-2 rounded mb-2">{app.cover_note}</p>}
                        {app.proposal_text && <p className="text-sm bg-muted/30 p-2 rounded mb-2 whitespace-pre-wrap">{app.proposal_text}</p>}
                        <Textarea className="text-sm h-16 mt-2" defaultValue={app.company_notes || ''} onBlur={e => supabase.from('opportunity_applications').update({ company_notes: e.target.value }).eq('id', app.id)} placeholder="Add notes..." />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageOpportunities;
