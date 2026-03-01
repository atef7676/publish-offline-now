import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, XCircle, AlertTriangle, Eye, Unlock, MessageSquare, Edit, LogIn, LogOut, Heart, Search, Download } from 'lucide-react';
import { format, subDays } from 'date-fns';

const AccountActivity = () => {
  const { user, loading: authLoading } = useAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (!authLoading && !user) navigate('/login'); }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase.from('audit_logs').select('*').eq('actor_user_id', user.id).gte('created_at', subDays(new Date(), 30).toISOString()).order('created_at', { ascending: false }).limit(100);
      setLogs(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const getActionIcon = (action: string) => {
    if (action.includes('login')) return <LogIn className="w-4 h-4 text-green-500" />;
    if (action.includes('logout')) return <LogOut className="w-4 h-4 text-muted-foreground" />;
    if (action.includes('favorite')) return <Heart className="w-4 h-4 text-red-500" />;
    if (action.includes('view')) return <Eye className="w-4 h-4 text-blue-500" />;
    if (action.includes('unlock')) return <Unlock className="w-4 h-4 text-amber-500" />;
    if (action.includes('message')) return <MessageSquare className="w-4 h-4 text-primary" />;
    if (action.includes('edit')) return <Edit className="w-4 h-4 text-purple-500" />;
    if (action.includes('search')) return <Search className="w-4 h-4 text-blue-500" />;
    if (action.includes('export')) return <Download className="w-4 h-4 text-green-600" />;
    return <Activity className="w-4 h-4 text-muted-foreground" />;
  };

  if (authLoading) return <Layout><LoadingSpinner className="py-20" size="lg" /></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2"><Activity className="w-7 h-7 text-primary" />{isRTL ? 'سجل النشاط' : 'Activity Log'}</h1>
          <p className="text-muted-foreground mt-1">{isRTL ? 'سجل نشاطك خلال آخر 30 يوم' : 'Your activity history from the last 30 days'}</p>
        </div>
        <Card>
          <CardHeader><CardTitle>{isRTL ? 'النشاط الأخير' : 'Recent Activity'}</CardTitle><CardDescription>{logs.length} activities</CardDescription></CardHeader>
          <CardContent>
            {loading ? <LoadingSpinner className="py-10" /> : logs.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground"><Activity className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No activity recorded yet</p></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Activity</TableHead><TableHead>Result</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {logs.map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{format(new Date(log.created_at), 'MMM dd, HH:mm')}</TableCell>
                        <TableCell><div className="flex items-center gap-2">{getActionIcon(log.action)}<span className="text-sm">{log.action}</span></div></TableCell>
                        <TableCell>
                          <Badge variant={log.result === 'success' ? 'outline' : 'destructive'} className={log.result === 'success' ? 'text-green-600 border-green-600' : ''}>
                            {log.result === 'success' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}{log.result}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AccountActivity;
