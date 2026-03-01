import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    setLoading(false);
    if (error) { toast.error(error.message); } else { setSent(true); toast.success('Password reset email sent'); }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4"><Mail className="w-6 h-6 text-primary" /></div>
            <CardTitle className="font-display text-2xl">{sent ? 'Check Your Email' : 'Forgot Password'}</CardTitle>
            <CardDescription>{sent ? 'We sent a password reset link to your email.' : "Enter your email and we'll send you a reset link."}</CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="space-y-4">
                <Button variant="outline" className="w-full" onClick={() => setSent(false)}>Try Again</Button>
                <div className="text-center"><Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Back to Login</Link></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label htmlFor="email">{t('email')}</Label><Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? <LoadingSpinner size="sm" /> : 'Send Reset Link'}</Button>
                <div className="text-center"><Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Back to Login</Link></div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ForgotPassword;