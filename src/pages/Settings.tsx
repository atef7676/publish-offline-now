import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { Coins, Lock, User } from 'lucide-react';
import { useCoinBalance } from '@/contexts/CoinContext';

const Settings = () => {
  const { t } = useLanguage();
  const { user, signOut, loading } = useAuth();
  const { balance } = useCoinBalance();
  const navigate = useNavigate();
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !user) navigate('/login'); }, [user, loading, navigate]);

  const handleSignOut = async () => { await signOut(); toast.success(t('loggedOut')); navigate('/'); };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { toast.error(t('passwordMinLength')); return; }
    if (newPassword !== confirmPassword) { toast.error(t('passwordsDontMatch')); return; }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success(t('passwordUpdated'));
      setNewPassword(''); setConfirmPassword(''); setChangingPassword(false);
    } catch (error: any) { toast.error(error.message); }
    finally { setSaving(false); }
  };

  if (loading) return <Layout><LoadingSpinner className="py-32" size="lg" /></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="font-display text-3xl font-bold mb-8">{t('settings')}</h1>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5" />{t('account')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label className="text-muted-foreground">{t('email')}</Label><p className="font-medium">{user?.email}</p></div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Coins className="w-5 h-5 text-secondary" /><span className="font-medium">{t('coinsBalance')}</span></div>
                <span className="text-2xl font-bold">{balance}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5" />{t('password')}</CardTitle></CardHeader>
            <CardContent>
              {changingPassword ? (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div><Label htmlFor="newPassword">{t('newPassword')}</Label><Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
                  <div><Label htmlFor="confirmPassword">{t('confirmPassword')}</Label><Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={saving}>{saving ? <LoadingSpinner size="sm" /> : t('updatePassword')}</Button>
                    <Button type="button" variant="outline" onClick={() => setChangingPassword(false)}>{t('cancel')}</Button>
                  </div>
                </form>
              ) : (
                <Button variant="outline" onClick={() => setChangingPassword(true)}>{t('changePassword')}</Button>
              )}
            </CardContent>
          </Card>
          <Card><CardContent className="pt-6"><Button variant="destructive" onClick={handleSignOut}>{t('logout')}</Button></CardContent></Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
