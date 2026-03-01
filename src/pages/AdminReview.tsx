import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import usePermissions, { PERMISSIONS } from '@/hooks/usePermissions';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Shield, Coins, Eye, EyeOff, Edit } from 'lucide-react';

const AdminReview = () => {
  const { user, loading: authLoading } = useAuth();
  const { can, canReview, isAdmin, loading: rolesLoading } = usePermissions();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [countryFilter, setCountryFilter] = useState('all');
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);

  // Rejection dialog
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingProfile, setRejectingProfile] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  // Grant coins dialog
  const [coinsDialogOpen, setCoinsDialogOpen] = useState(false);
  const [coinsAmount, setCoinsAmount] = useState(10);
  const [coinsTargetEmail, setCoinsTargetEmail] = useState('');
  const [grantingCoins, setGrantingCoins] = useState(false);

  useEffect(() => {
    if (!authLoading && !rolesLoading && (!user || !canReview)) navigate('/');
  }, [user, canReview, authLoading, rolesLoading, navigate]);

  const fetchProfiles = async () => {
    setLoading(true);
    let query = supabase.from('directory_profiles').select('*').order('created_at', { ascending: false });
    if (statusFilter !== 'all') query = query.eq('approval_status', statusFilter);
    if (typeFilter !== 'all') query = query.eq('profile_type', typeFilter);
    if (countryFilter !== 'all') query = query.eq('country_code', countryFilter);
    const { data } = await query;
    setProfiles(data || []);
    setSelectedProfiles([]);
    setLoading(false);
  };

  const fetchCountries = async () => {
    const { data } = await supabase.from('directory_profiles').select('country_code');
    if (data) setCountries([...new Set(data.map((d: any) => d.country_code).filter(Boolean))] as string[]);
  };

  useEffect(() => {
    if (canReview) { fetchProfiles(); fetchCountries(); }
  }, [canReview, typeFilter, countryFilter, statusFilter]);

  const handleApprove = async (id: string, displayName: string) => {
    const { error } = await supabase.from('directory_profiles').update({ approval_status: 'approved' }).eq('profile_id', id);
    if (error) { toast.error('Failed to approve profile'); return; }
    await supabase.from('audit_events').insert({
      actor_user_id: user!.id, event_type: 'admin_action', target_profile_id: id,
      metadata: { action: 'approve_profile' }
    });
    setProfiles(prev => prev.filter(p => p.profile_id !== id));
    toast.success(`Profile "${displayName}" approved`);
  };

  const handleBulkApprove = async () => {
    if (selectedProfiles.length === 0) return;
    const toApprove = profiles.filter(p => selectedProfiles.includes(p.profile_id) && p.approval_status === 'pending');
    let count = 0;
    for (const p of toApprove) {
      const { error } = await supabase.from('directory_profiles').update({ approval_status: 'approved' }).eq('profile_id', p.profile_id);
      if (!error) { count++; await supabase.from('audit_events').insert({ actor_user_id: user!.id, event_type: 'admin_action', target_profile_id: p.profile_id, metadata: { action: 'approve_profile', bulk: true } }); }
    }
    toast.success(`${count} profiles approved`);
    fetchProfiles();
  };

  const openRejectDialog = (profile: any) => { setRejectingProfile(profile); setRejectionReason(''); setRejectDialogOpen(true); };

  const handleReject = async () => {
    if (!rejectionReason.trim()) { toast.error('Please provide a rejection reason'); return; }
    setRejecting(true);
    try {
      const { error } = await supabase.from('directory_profiles').update({ approval_status: 'rejected' }).eq('profile_id', rejectingProfile.profile_id);
      if (error) throw error;
      await supabase.from('audit_events').insert({ actor_user_id: user!.id, event_type: 'admin_action', target_profile_id: rejectingProfile.profile_id, metadata: { action: 'reject_profile', reason: rejectionReason.trim() } });
      setProfiles(prev => prev.filter(p => p.profile_id !== rejectingProfile.profile_id));
      toast.success(`Profile "${rejectingProfile.display_name}" rejected`);
      setRejectDialogOpen(false);
    } catch { toast.error('Failed to reject'); }
    finally { setRejecting(false); }
  };

  const handleToggle = async (id: string, field: string, value: boolean) => {
    const { error } = await supabase.from('directory_profiles').update({ [field]: value }).eq('profile_id', id);
    if (error) toast.error('Failed');
    else setProfiles(prev => prev.map(p => p.profile_id === id ? { ...p, [field]: value } : p));
  };

  const toggleProfileSelection = (profileId: string) => {
    setSelectedProfiles(prev => prev.includes(profileId) ? prev.filter(id => id !== profileId) : [...prev, profileId]);
  };

  const toggleSelectAll = () => {
    const pending = profiles.filter(p => p.approval_status === 'pending');
    setSelectedProfiles(selectedProfiles.length === pending.length && pending.length > 0 ? [] : pending.map(p => p.profile_id));
  };

  const pendingProfiles = profiles.filter(p => p.approval_status === 'pending');

  if (authLoading || rolesLoading) return <Layout><LoadingSpinner className="py-32" size="lg" /></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold mb-8">Admin Panel</h1>

        <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
          <div className="flex gap-2">
            {can(PERMISSIONS.CAN_GRANT_COINS) && (
              <Button variant="outline" onClick={() => setCoinsDialogOpen(true)}>
                <Coins className="w-4 h-4 mr-2" /> Grant Coins
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link to="/admin/users"><Shield className="w-4 h-4 mr-2" />User Management</Link></Button>
            <Button variant="outline" asChild><Link to="/admin/stats">Stats</Link></Button>
            <Button variant="outline" asChild><Link to="/admin/logs">Audit Logs</Link></Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-wrap items-end">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="journalist">Journalist</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
              <SelectItem value="publication">Publication</SelectItem>
            </SelectContent>
          </Select>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {pendingProfiles.length > 0 && (
          <div className="mb-4 p-4 bg-muted/50 rounded-lg flex items-center justify-between flex-wrap gap-4 border border-border">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedProfiles.length === pendingProfiles.length && pendingProfiles.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-sm font-medium">
                {selectedProfiles.length > 0 ? `${selectedProfiles.length} of ${pendingProfiles.length} selected` : `Select all ${pendingProfiles.length} pending`}
              </span>
            </div>
            {selectedProfiles.length > 0 && (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleBulkApprove} className="gap-1"><CheckCircle className="w-4 h-4" />Approve {selectedProfiles.length}</Button>
              </div>
            )}
          </div>
        )}

        {loading ? <LoadingSpinner className="py-12" /> : profiles.length === 0 ? (
          <EmptyState title="No profiles found" icon={Shield} />
        ) : (
          <div className="space-y-4">
            {profiles.map(p => (
              <div key={p.profile_id} className="sahfy-card p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    {p.approval_status === 'pending' && (
                      <Checkbox checked={selectedProfiles.includes(p.profile_id)} onCheckedChange={() => toggleProfileSelection(p.profile_id)} className="mt-1" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="sahfy-chip">{p.profile_type}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          p.approval_status === 'approved' ? 'bg-green-500/20 text-green-500' :
                          p.approval_status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                          'bg-yellow-500/20 text-yellow-500'
                        }`}>{p.approval_status}</span>
                      </div>
                      <h3 className="font-semibold text-lg">{p.display_name}</h3>
                      <p className="text-sm text-muted-foreground">{p.headline || p.bio?.slice(0, 100)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{p.country_code} · {new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex gap-2">
                      {p.approval_status === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => handleApprove(p.profile_id, p.display_name)}><CheckCircle className="w-4 h-4 mr-1" />Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => openRejectDialog(p)}><XCircle className="w-4 h-4 mr-1" />Reject</Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/${p.profile_type}s/${p.slug}`}><Eye className="w-4 h-4" /></Link>
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`listed-${p.profile_id}`} className="text-xs">Listed</Label>
                        <Switch id={`listed-${p.profile_id}`} checked={p.is_listed} onCheckedChange={v => handleToggle(p.profile_id, 'is_listed', v)} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`public-${p.profile_id}`} className="text-xs">Public</Label>
                        <Switch id={`public-${p.profile_id}`} checked={p.is_public} onCheckedChange={v => handleToggle(p.profile_id, 'is_public', v)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Profile</DialogTitle>
            <DialogDescription>Provide a reason for rejecting "{rejectingProfile?.display_name}"</DialogDescription>
          </DialogHeader>
          <Textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} placeholder="Rejection reason..." rows={4} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={rejecting}>{rejecting ? 'Rejecting...' : 'Reject'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Grant Coins Dialog */}
      <Dialog open={coinsDialogOpen} onOpenChange={setCoinsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grant Coins</DialogTitle>
            <DialogDescription>Enter user ID and amount</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>User ID</Label>
              <Input value={coinsTargetEmail} onChange={e => setCoinsTargetEmail(e.target.value)} placeholder="User UUID" />
            </div>
            <div>
              <Label>Amount</Label>
              <Input type="number" value={coinsAmount} onChange={e => setCoinsAmount(Number(e.target.value))} min={1} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCoinsDialogOpen(false)}>Cancel</Button>
            <Button onClick={async () => {
              setGrantingCoins(true);
              try {
                const { data, error } = await supabase.rpc('admin_add_coins' as any, { p_target_user_id: coinsTargetEmail.trim(), p_amount: coinsAmount, p_description: `Admin grant by ${user?.email}` });
                if (error) throw error;
                toast.success(`Granted ${coinsAmount} coins`);
                setCoinsDialogOpen(false);
              } catch (err: any) { toast.error(err.message || 'Failed'); }
              finally { setGrantingCoins(false); }
            }} disabled={grantingCoins}>{grantingCoins ? 'Granting...' : 'Grant'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminReview;
