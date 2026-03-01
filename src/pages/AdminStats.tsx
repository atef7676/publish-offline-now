import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users, Briefcase, Building2, BookOpen,
  Shield, RefreshCw, ArrowRight, ArrowLeft,
  CheckCircle, XCircle, Clock
} from 'lucide-react';

const AdminStats = () => {
  const { isRTL } = useLanguage();
  const { isAdmin, isSubAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && !isAdmin && !isSubAdmin) navigate('/');
  }, [roleLoading, isAdmin, isSubAdmin, navigate]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data: profiles } = await supabase.from('directory_profiles').select('profile_type, approval_status');
      const byType: Record<string, { total: number; approved: number; pending: number; rejected: number }> = {};
      ['journalist', 'expert', 'company', 'publication'].forEach(t => { byType[t] = { total: 0, approved: 0, pending: 0, rejected: 0 }; });
      (profiles || []).forEach((p: any) => {
        const t = byType[p.profile_type];
        if (t) { t.total++; if (p.approval_status === 'approved') t.approved++; else if (p.approval_status === 'pending') t.pending++; else if (p.approval_status === 'rejected') t.rejected++; }
      });
      setStats({ profiles: { journalists: byType.journalist, experts: byType.expert, companies: byType.company, publications: byType.publication } });
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { if (isAdmin || isSubAdmin) fetchStats(); }, [isAdmin, isSubAdmin]);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  if (roleLoading || loading) return <Layout><LoadingSpinner className="py-20" size="lg" /></Layout>;

  const profileTypes = [
    { key: 'journalists', label: isRTL ? 'الصحفيين' : 'Journalists', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { key: 'experts', label: isRTL ? 'الخبراء' : 'Experts', icon: Briefcase, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { key: 'companies', label: isRTL ? 'الشركات' : 'Companies', icon: Building2, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { key: 'publications', label: isRTL ? 'المنشورات' : 'Publications', icon: BookOpen, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Shield className="w-7 h-7 text-primary" />
              {isRTL ? 'لوحة الإحصائيات' : 'Platform Statistics'}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchStats} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh
            </Button>
            <Button asChild><Link to="/admin/review">Review Profiles <ArrowIcon className="w-4 h-4 ml-2" /></Link></Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {profileTypes.map(({ key, label, icon: Icon, color, bgColor }) => {
            const s = stats?.profiles?.[key] || { total: 0, approved: 0, pending: 0, rejected: 0 };
            return (
              <Card key={key}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center`}><Icon className={`w-4 h-4 ${color}`} /></div>
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-3">{s.total}</div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="text-green-600 border-green-600 gap-1"><CheckCircle className="w-3 h-3" />{s.approved}</Badge>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 gap-1"><Clock className="w-3 h-3" />{s.pending}</Badge>
                    <Badge variant="outline" className="text-red-600 border-red-600 gap-1"><XCircle className="w-3 h-3" />{s.rejected}</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/review" className="sahfy-card p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-primary" /><span className="font-medium">Review Profiles</span><ArrowIcon className="w-4 h-4 text-muted-foreground ml-auto" /></div>
          </Link>
          <Link to="/admin/users" className="sahfy-card p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3"><Users className="w-5 h-5 text-primary" /><span className="font-medium">Manage Users</span><ArrowIcon className="w-4 h-4 text-muted-foreground ml-auto" /></div>
          </Link>
          <Link to="/admin/logs" className="sahfy-card p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-primary" /><span className="font-medium">Audit Logs</span><ArrowIcon className="w-4 h-4 text-muted-foreground ml-auto" /></div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AdminStats;
