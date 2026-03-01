import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import useUserRole from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { toast } from 'sonner';
import { Users, Shield, Coins, RefreshCw } from 'lucide-react';

interface UserRow {
  user_id: string;
  role: string;
  status: string;
}

const AdminUsers = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, canManageUsers, loading: rolesLoading } = useUserRole();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !rolesLoading && (!user || !canManageUsers)) navigate('/');
  }, [user, canManageUsers, authLoading, rolesLoading, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('user_roles').select('*').order('user_id');
    if (error) { toast.error('Failed to load users'); console.error(error); }
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { if (canManageUsers) fetchUsers(); }, [canManageUsers]);

  if (authLoading || rolesLoading) return <Layout><LoadingSpinner className="py-32" size="lg" /></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold">User Management</h1>
          <Button variant="outline" onClick={fetchUsers}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
        </div>

        {loading ? <LoadingSpinner className="py-12" /> : users.length === 0 ? (
          <EmptyState title="No users found" icon={Users} />
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{users.length} user role entries</p>
            {users.map((u, i) => (
              <div key={i} className="sahfy-card p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-sm">{u.user_id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>{u.role}</Badge>
                  <Badge variant="outline" className={u.status === 'active' ? 'text-green-600 border-green-600' : 'text-yellow-600 border-yellow-600'}>{u.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminUsers;
