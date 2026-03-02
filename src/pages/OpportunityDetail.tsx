import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getCountryName } from '@/data/countries';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TYPE_LABELS, LOCATION_LABELS, COMPENSATION_LABELS } from '@/components/opportunities/OpportunityCard';
import { MapPin, Clock, DollarSign, Briefcase, Zap, Shield, ArrowLeft, Send, Bookmark, BookmarkCheck, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const OpportunityDetail = () => {
  const { id } = useParams();
  const { isRTL, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const lang = language === 'ar' ? 'ar' : 'en';
  const [opportunity, setOpportunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [journalistProfileId, setJournalistProfileId] = useState<string | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [proposalText, setProposalText] = useState('');
  const [proposedFee, setProposedFee] = useState('');
  const [proposedTimeline, setProposedTimeline] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('opportunities')
        .select('*, company:directory_profiles!company_profile_id(display_name, display_name_ar, avatar_url, slug, profile_id)')
        .eq('id', id!).single();
      if (error || !data) { navigate('/opportunities'); return; }
      setOpportunity(data);
      if (user) {
        const { data: profiles } = await supabase.from('directory_profiles').select('profile_id').eq('owner_user_id', user.id).in('profile_type', ['journalist', 'expert']).limit(1);
        if (profiles?.length) {
          const pid = profiles[0].profile_id;
          setJournalistProfileId(pid);
          const { data: apps } = await supabase.from('opportunity_applications').select('id').eq('opportunity_id', id!).eq('journalist_profile_id', pid).limit(1);
          setHasApplied((apps?.length || 0) > 0);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [id, user, navigate]);

  const isJobType = opportunity?.opportunity_type?.startsWith('job_');

  const handleApply = async () => {
    if (!journalistProfileId) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('opportunity_applications').insert({
        opportunity_id: id,
        journalist_profile_id: journalistProfileId,
        application_type: isJobType ? 'job_application' : 'proposal',
        cover_note: coverNote || null,
        proposal_text: proposalText || null,
        proposed_fee: proposedFee ? parseFloat(proposedFee) : null,
        proposed_timeline_days: proposedTimeline ? parseInt(proposedTimeline) : null,
      });
      if (error) throw error;
      setHasApplied(true);
      setApplyOpen(false);
      toast.success(isRTL ? 'تم تقديم طلبك' : 'Application submitted');
    } catch { toast.error(isRTL ? 'فشل التقديم' : 'Failed to submit'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <Layout><LoadingSpinner className="py-20" size="lg" /></Layout>;
  if (!opportunity) return null;

  const typeLabel = TYPE_LABELS[opportunity.opportunity_type]?.[lang] || opportunity.opportunity_type;
  const locationLabel = LOCATION_LABELS[opportunity.work_location]?.[lang] || opportunity.work_location;

  const formatBudget = () => {
    if (!opportunity.budget_min && !opportunity.budget_max) return COMPENSATION_LABELS[opportunity.compensation_type]?.[lang] || '';
    const c = opportunity.budget_currency || 'USD';
    if (opportunity.budget_min && opportunity.budget_max) return `${c} ${opportunity.budget_min.toLocaleString()} – ${opportunity.budget_max.toLocaleString()}`;
    if (opportunity.budget_min) return `${c} ${opportunity.budget_min.toLocaleString()}+`;
    return `Up to ${c} ${opportunity.budget_max.toLocaleString()}`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" size="sm" onClick={() => navigate('/opportunities')} className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" />{isRTL ? 'العودة' : 'Back'}</Button>
        <div className="bg-card border border-border rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="secondary">{typeLabel}</Badge>
            <Badge variant="outline">{locationLabel}</Badge>
            {opportunity.nda_required && <Badge variant="outline" className="border-destructive/30 text-destructive"><Shield className="w-3 h-3 mr-1" />NDA</Badge>}
            {opportunity.urgency_level >= 4 && <Badge variant="outline" className="border-destructive/30 text-destructive"><Zap className="w-3 h-3 mr-1" />{isRTL ? 'عاجل' : 'Urgent'}</Badge>}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{lang === 'ar' && opportunity.title_ar ? opportunity.title_ar : opportunity.title}</h1>
          {opportunity.company && <Link to={`/companies/${opportunity.company.slug}`} className="text-primary hover:underline flex items-center gap-1.5"><Briefcase className="w-4 h-4" />{opportunity.company.display_name}</Link>}

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 my-8 p-4 bg-muted/30 rounded-lg">
            <div><p className="text-xs text-muted-foreground">{isRTL ? 'الموقع' : 'Location'}</p><p className="text-sm font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{getCountryName(opportunity.country_code, lang)}{opportunity.city && `, ${opportunity.city}`}</p></div>
            <div><p className="text-xs text-muted-foreground">{isRTL ? 'التعويض' : 'Compensation'}</p><p className="text-sm font-medium flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{formatBudget()}</p></div>
            <div><p className="text-xs text-muted-foreground">{isRTL ? 'نشر' : 'Posted'}</p><p className="text-sm font-medium flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{opportunity.published_at ? formatDistanceToNow(new Date(opportunity.published_at), { addSuffix: true }) : '—'}</p></div>
          </div>

          <div className="mb-8"><h2 className="text-lg font-semibold mb-3">{isRTL ? 'الوصف' : 'Description'}</h2><div className="whitespace-pre-wrap text-foreground/90">{lang === 'ar' && opportunity.description_ar ? opportunity.description_ar : opportunity.description}</div></div>

          {opportunity.sector_tags?.length > 0 && <div className="mb-8 flex flex-wrap gap-2">{opportunity.sector_tags.map((t: string) => <Badge key={t} variant="outline">{t}</Badge>)}</div>}

          <div className="flex items-center gap-3 pt-6 border-t border-border">
            {hasApplied ? (
              <Button disabled className="gap-2"><CheckCircle className="w-4 h-4" />{isRTL ? 'تم التقديم' : 'Applied'}</Button>
            ) : journalistProfileId ? (
              <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
                <DialogTrigger asChild><Button className="gap-2"><Send className="w-4 h-4" />{isJobType ? (isRTL ? 'تقديم' : 'Apply') : (isRTL ? 'عرض' : 'Propose')}</Button></DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>{isJobType ? 'Apply' : 'Submit Proposal'}</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div><Label>Cover Note</Label><Textarea value={coverNote} onChange={e => setCoverNote(e.target.value)} rows={3} /></div>
                    {!isJobType && (
                      <>
                        <div><Label>Proposal Details</Label><Textarea value={proposalText} onChange={e => setProposalText(e.target.value)} rows={4} /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><Label>Fee ({opportunity.budget_currency || 'USD'})</Label><Input type="number" value={proposedFee} onChange={e => setProposedFee(e.target.value)} /></div>
                          <div><Label>Timeline (days)</Label><Input type="number" value={proposedTimeline} onChange={e => setProposedTimeline(e.target.value)} /></div>
                        </div>
                      </>
                    )}
                    <Button onClick={handleApply} disabled={submitting} className="w-full">{submitting ? <LoadingSpinner size="sm" /> : (isRTL ? 'إرسال' : 'Submit')}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : !user ? (
              <Button onClick={() => navigate('/login')}>{isRTL ? 'سجل دخول' : 'Sign in to Apply'}</Button>
            ) : <p className="text-sm text-muted-foreground">Need a journalist/expert profile to apply</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OpportunityDetail;
