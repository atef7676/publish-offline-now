import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const STATUS_LABELS: Record<string, any> = {
  pending: { en: 'Pending', ar: 'قيد الانتظار', color: 'bg-secondary/20 text-secondary-foreground' },
  shortlisted: { en: 'Shortlisted', ar: 'مرشح', color: 'bg-primary/10 text-primary' },
  accepted: { en: 'Accepted', ar: 'مقبول', color: 'bg-emerald-500/10 text-emerald-700' },
  rejected: { en: 'Rejected', ar: 'مرفوض', color: 'bg-destructive/10 text-destructive' },
  withdrawn: { en: 'Withdrawn', ar: 'منسحب', color: 'bg-muted text-muted-foreground' },
};

const MyApplications = () => {
  const { isRTL, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const lang = language === 'ar' ? 'ar' : 'en';
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetch = async () => {
      const { data: profiles } = await supabase.from('directory_profiles').select('profile_id').eq('owner_user_id', user.id).in('profile_type', ['journalist', 'expert']);
      if (!profiles?.length) { setLoading(false); return; }
      const { data } = await supabase.from('opportunity_applications')
        .select('*, opportunity:opportunities(id, title, title_ar, status, company:directory_profiles!company_profile_id(display_name))')
        .in('journalist_profile_id', profiles.map(p => p.profile_id)).order('created_at', { ascending: false });
      setApplications(data || []);
      setLoading(false);
    };
    fetch();
  }, [user, navigate]);

  if (loading) return <Layout><LoadingSpinner className="py-20" size="lg" /></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">{isRTL ? 'طلباتي' : 'My Applications'}</h1>
        {applications.length === 0 ? (
          <EmptyState title={isRTL ? 'لا توجد طلبات' : 'No applications'} description={isRTL ? 'تصفح الفرص' : 'Browse opportunities and apply'} icon={ClipboardList} />
        ) : (
          <div className="space-y-3">
            {applications.map(app => {
              const st = STATUS_LABELS[app.status] || STATUS_LABELS.pending;
              return (
                <div key={app.id} className="p-4 border border-border rounded-lg flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link to={`/opportunities/${app.opportunity?.id}`} className="font-semibold hover:text-primary truncate block">{lang === 'ar' && app.opportunity?.title_ar ? app.opportunity.title_ar : app.opportunity?.title}</Link>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span>{app.opportunity?.company?.display_name}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <Badge className={`shrink-0 ${st.color}`}>{st[lang]}</Badge>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate('/opportunities')}><ExternalLink className="w-4 h-4 mr-2" />{isRTL ? 'تصفح الفرص' : 'Browse Opportunities'}</Button>
        </div>
      </div>
    </Layout>
  );
};

export default MyApplications;
