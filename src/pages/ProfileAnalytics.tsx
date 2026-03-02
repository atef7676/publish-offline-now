import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { BarChart3, Eye, Users, TrendingUp, ArrowLeft, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { useEffect } from 'react';

const ProfileAnalytics = () => {
  const { user, loading: authLoading } = useAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [period, setPeriod] = useState(30);

  useEffect(() => { if (!authLoading && !user) navigate('/login'); }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      const { data: profileData } = await supabase.from('directory_profiles')
        .select('profile_id, display_name, profile_type, slug, visits_count, avatar_url')
        .eq('owner_user_id', user.id);
      setProfiles(profileData || []);
      if (!profileData?.length) { setLoading(false); return; }
      const since = subDays(new Date(), period).toISOString();
      const { data: visitData } = await supabase.from('profile_view_log')
        .select('profile_id, viewed_on, charged')
        .in('profile_id', profileData.map(p => p.profile_id))
        .gte('viewed_at', since)
        .order('viewed_at', { ascending: true });
      setVisits(visitData || []);
      setLoading(false);
    };
    fetch();
  }, [user, period]);

  const dailyData = useMemo(() => {
    const days = [];
    for (let i = period - 1; i >= 0; i--) {
      const d = startOfDay(subDays(new Date(), i));
      const key = format(d, 'yyyy-MM-dd');
      const label = format(d, period > 14 ? 'MMM d' : 'EEE d');
      const count = visits.filter(v => v.viewed_on === key).length;
      days.push({ date: label, visits: count });
    }
    return days;
  }, [visits, period]);

  const totalVisits = visits.length;
  const avgDaily = period > 0 ? (totalVisits / period).toFixed(1) : '0';

  if (authLoading || loading) return <Layout><LoadingSpinner className="py-32" size="lg" /></Layout>;
  if (!profiles.length) return <Layout><div className="container mx-auto px-4 py-16"><EmptyState title="No profiles yet" description="Create a profile to see analytics" icon={BarChart3} /></div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild><Link to="/dashboard"><ArrowLeft className="w-5 h-5" /></Link></Button>
            <div><h1 className="text-3xl font-bold">{isRTL ? 'تحليلات الملف' : 'Profile Analytics'}</h1><p className="text-muted-foreground text-sm mt-1">{isRTL ? 'تتبع أداء ملفاتك' : 'Track profile performance'}</p></div>
          </div>
          <div className="flex gap-2">{[7, 30, 90].map(d => <Button key={d} variant={period === d ? 'default' : 'outline'} size="sm" onClick={() => setPeriod(d)}>{d}d</Button>)}</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Eye} label="Total Visits" value={totalVisits} />
          <StatCard icon={TrendingUp} label="Daily Average" value={avgDaily} />
          <StatCard icon={Users} label="Profiles" value={profiles.length} />
          <StatCard icon={Calendar} label="Period" value={`${period}d`} />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-lg mb-4">Daily Visits</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs><linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} interval={period > 30 ? 6 : period > 14 ? 2 : 0} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="visits" stroke="hsl(var(--primary))" fill="url(#vg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: any }) => (
  <div className="bg-card border border-border rounded-xl p-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></div>
      <div><p className="text-2xl font-bold">{value}</p><p className="text-sm text-muted-foreground">{label}</p></div>
    </div>
  </div>
);

export default ProfileAnalytics;
