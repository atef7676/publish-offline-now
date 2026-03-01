import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Lock, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setIsRecovery(true);
    });
    const hash = window.location.hash;
    if (hash?.includes('type=recovery')) setIsRecovery(true);
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); } else { setSuccess(true); toast.success('Password updated successfully'); setTimeout(() => navigate('/login'), 3000); }
  };

  if (!isRecovery && !success) return (
    <Layout><div className="container mx-auto px-4 py-16 max-w-md">
      <Card><CardHeader className="text-center"><CardTitle className="font-display text-2xl">Invalid Reset Link</CardTitle><CardDescription>This password reset link is invalid or has expired.</CardDescription></CardHeader>
        <CardContent><Button className="w-full" onClick={() => navigate('/forgot-password')}>Request New Reset Link</Button></CardContent>
      </Card></div></Layout>
  );

  return (
    <Layout><div className="container mx-auto px-4 py-16 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            {success ? <CheckCircle className="w-6 h-6 text-green-600" /> : <Lock className="w-6 h-6 text-primary" />}
          </div>
          <CardTitle className="font-display text-2xl">{success ? 'Password Updated' : 'Set New Password'}</CardTitle>
          <CardDescription>{success ? 'Your password has been updated. Redirecting...' : 'Enter your new password below.'}</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? <Button className="w-full" onClick={() => navigate('/login')}>Go to Login</Button> : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label htmlFor="password">New Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoFocus /></div>
              <div><Label htmlFor="confirmPassword">Confirm Password</Label><Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} /></div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? <LoadingSpinner size="sm" /> : 'Update Password'}</Button>
            </form>
          )}
        </CardContent>
      </Card></div></Layout>
  );
};

export default ResetPassword;
