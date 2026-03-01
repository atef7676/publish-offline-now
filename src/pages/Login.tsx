import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Login = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t('welcomeBack'));
    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="sahfy-card p-8">
          <h1 className="font-display text-2xl font-bold text-center mb-6">{t('welcomeBack')}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label htmlFor="email">{t('email')}</Label><Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <div><Label htmlFor="password">{t('password')}</Label><Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
            <div className="text-right"><Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? <LoadingSpinner size="sm" /> : t('login')}</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">{t('dontHaveAccount')}{' '}<Link to="/register" className="text-primary font-medium hover:underline">{t('register')}</Link></p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;