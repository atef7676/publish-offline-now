import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, RefreshCw, Eye } from 'lucide-react';
import { format } from 'date-fns';

const AdminAuditLogs = () => {
  const { isRTL } = useLanguage();
  const { isAdmin, isSubAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState('100');

  useEffect(() => {
    if (!roleLoading && !isAdmin && !isSubAdmin) navigate('/');
  }, [roleLoading, isAdmin, isSubAdmin, navigate]);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));
    if (error) console.error(error);
    setLogs(data || []);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin || isSubAdmin) fetchLogs(); }, [isAdmin, isSubAdmin, limit]);

  if (roleLoading) return <Layout><LoadingSpinner className="py-20" size="lg" /></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Eye className="w-7 h-7 text-primary" />
            {isRTL ? 'سجل النشاط' : 'Audit Logs'}
          </h1>
          <div className="flex gap-2 items-center">
            <Select value={limit} onValueChange={setLimit}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50 rows</SelectItem>
                <SelectItem value="100">100 rows</SelectItem>
                <SelectItem value="500">500 rows</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchLogs} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? 'السجلات' : 'Log Entries'}</CardTitle>
            <CardDescription>{logs.length} {isRTL ? 'سجل' : 'entries'}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <LoadingSpinner className="py-10" /> : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No logs found</TableCell></TableRow>
                    ) : logs.map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          <div>{format(new Date(log.created_at), 'MMM dd, yyyy')}</div>
                          <div>{format(new Date(log.created_at), 'HH:mm:ss')}</div>
                        </TableCell>
                        <TableCell className="text-xs font-mono">{log.actor_user_id?.slice(0, 8)}…</TableCell>
                        <TableCell>
                          <Badge variant={log.action.includes('delete') || log.action.includes('reject') ? 'destructive' : 'secondary'} className="text-xs">{log.action}</Badge>
                        </TableCell>
                        <TableCell className="text-xs capitalize text-muted-foreground">{log.actor_role}</TableCell>
                        <TableCell>
                          <Badge variant={log.result === 'success' ? 'outline' : 'destructive'} className={log.result === 'success' ? 'text-green-600 border-green-600 text-xs' : 'text-xs'}>{log.result}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                          {log.target_type && <span className="capitalize">{log.target_type}</span>}
                          {log.metadata && typeof log.metadata === 'object' && Object.keys(log.metadata).length > 0 && (
                            <span className="ml-1">{JSON.stringify(log.metadata).slice(0, 80)}</span>
                          )}
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

export default AdminAuditLogs;
