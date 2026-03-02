import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { Flag, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface ClaimProfileButtonProps {
  profileId: string;
  profileName: string;
  ownerId?: string | null;
  className?: string;
}

const ClaimProfileButton = ({ profileId, profileName, ownerId, className = '' }: ClaimProfileButtonProps) => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [evidence, setEvidence] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [existingClaim, setExistingClaim] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profileId) {
      supabase
        .from('profile_claims' as any)
        .select('*')
        .eq('profile_id', profileId)
        .eq('claimant_id', user.id)
        .maybeSingle()
        .then(({ data }) => { setExistingClaim(data); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, [user, profileId]);

  const handleSubmit = async () => {
    if (!evidence.trim()) { toast.error('Please provide evidence'); return; }
    setSubmitting(true);
    try {
      const { error } = await (supabase.from('profile_claims' as any) as any).insert({
        profile_id: profileId,
        claimant_id: user!.id,
        evidence: evidence.trim(),
        status: 'pending'
      });
      if (error) { if (error.code === '23505') toast.error('Already claimed'); else throw error; }
      else {
        toast.success('Claim submitted!');
        setDialogOpen(false);
      }
    } catch { toast.error('Failed to submit claim'); }
    finally { setSubmitting(false); }
  };

  if (!user || user.id === ownerId || loading) return null;

  if (existingClaim) {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        {existingClaim.status === 'pending' && <><Clock className="w-4 h-4 text-yellow-500" /><span>Claim pending</span></>}
        {existingClaim.status === 'approved' && <><CheckCircle className="w-4 h-4 text-green-500" /><span>Claim approved</span></>}
        {existingClaim.status === 'rejected' && <><AlertTriangle className="w-4 h-4 text-destructive" /><span>Claim rejected</span></>}
      </div>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}><Flag className="w-4 h-4 mr-2" />Claim this profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Claim Profile</DialogTitle>
          <DialogDescription>Submit a request to claim "{profileName}"</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Evidence / Verification</Label>
            <Textarea value={evidence} onChange={(e) => setEvidence(e.target.value)} placeholder="Explain why you should own this profile..." rows={5} className="mt-1" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting || !evidence.trim()}>
              {submitting ? <LoadingSpinner size="sm" /> : 'Submit Claim'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimProfileButton;
