import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { Trash2, Plus, Edit, Eye, AlertCircle, CheckCircle, Clock, Info } from 'lucide-react';

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'approved') return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
  if (status === 'pending') return <Badge variant="secondary" className="bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
  return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
};

const ProfileCard = ({ profile, type, onEdit, onDelete, rejectionReason }: any) => {
  const typePath = type === 'journalist' ? 'journalists' : type === 'expert' ? 'experts' : type === 'publication' ? 'publications' : 'companies';
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.display_name} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">{profile.display_name?.charAt(0)}</span>
            </div>
          )}
          <div>
            <h3 className="font-semibold">{profile.display_name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{type}</p>
          </div>
        </div>
        <StatusBadge status={profile.approval_status} />
      </div>
      {profile.headline && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{profile.headline}</p>}
      {profile.approval_status === 'rejected' && rejectionReason && (
        <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 text-destructive" />
            <div><p className="text-sm font-medium text-destructive">Changes Required</p><p className="text-sm text-destructive/80">{rejectionReason}</p></div>
          </div>
        </div>
      )}
      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={onEdit} className="flex-1"><Edit className="w-4 h-4 mr-1" />Edit</Button>
        {profile.approval_status === 'approved' && (
          <Button variant="outline" size="sm" asChild><Link to={`/${typePath}/${profile.slug}`}><Eye className="w-4 h-4" /></Link></Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild><Button variant="outline" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Profile?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently delete "{profile.display_name}". This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

const MyListings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (!authLoading && !user) navigate('/login'); }, [user, authLoading, navigate]);

  const fetchProfiles = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from('directory_profiles').select('*').eq('owner_user_id', user.id).order('created_at', { ascending: false });
    setProfiles(data || []);
    const rejectedIds = (data || []).filter((p: any) => p.approval_status === 'rejected').map((p: any) => p.profile_id);
    if (rejectedIds.length > 0) {
      const { data: events } = await supabase.from('audit_events').select('target_profile_id, metadata').eq('event_type', 'admin_action').in('target_profile_id', rejectedIds).order('created_at', { ascending: false });
      const reasons: Record<string, string> = {};
      events?.forEach((e: any) => { if (!reasons[e.target_profile_id] && e.metadata?.reason) reasons[e.target_profile_id] = e.metadata.reason; });
      setRejectionReasons(reasons);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { if (user) fetchProfiles(); }, [user, fetchProfiles]);

  const handleDelete = async (profileId: string) => {
    try {
      const { error } = await supabase.from('directory_profiles').delete().eq('profile_id', profileId);
      if (error) throw error;
      toast.success('Profile deleted');
      fetchProfiles();
    } catch (err: any) { toast.error(err.message); }
  };

  if (authLoading || loading) return <Layout><LoadingSpinner className="py-32" size="lg" /></Layout>;

  const byType = (type: string) => profiles.filter(p => p.profile_type === type);
  const types = [
    { key: 'journalist', label: 'Journalist' },
    { key: 'expert', label: 'Expert' },
    { key: 'company', label: 'Company' },
    { key: 'publication', label: 'Publication' },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-3xl font-bold mb-4">My Listings</h1>
        <Alert className="mb-6"><Info className="h-4 w-4" /><AlertDescription>New profiles and edits are reviewed by our admin team before appearing publicly.</AlertDescription></Alert>
        <Tabs defaultValue="journalist">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {types.map(t => <TabsTrigger key={t.key} value={t.key}>{t.label} ({byType(t.key).length})</TabsTrigger>)}
          </TabsList>
          {types.map(t => (
            <TabsContent key={t.key} value={t.key}>
              <div className="space-y-4">
                {byType(t.key).length === 0 ? (
                  <div className="sahfy-card p-8 text-center">
                    <p className="text-muted-foreground mb-4">No {t.label.toLowerCase()} profile yet</p>
                    <Button onClick={() => navigate(`/complete-profile?type=${t.key}`)}><Plus className="w-4 h-4 mr-2" />Create {t.label} Profile</Button>
                  </div>
                ) : byType(t.key).map(p => (
                  <ProfileCard key={p.profile_id} profile={p} type={t.key} onEdit={() => toast.info('Edit coming soon')} onDelete={() => handleDelete(p.profile_id)} rejectionReason={rejectionReasons[p.profile_id]} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyListings;
