import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Newspaper, GraduationCap, User, ArrowRight, ArrowLeft } from 'lucide-react';

const Register = () => {
  const { t, isRTL } = useLanguage();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const ACCOUNT_TYPES = [
    { value: 'journalist', label: t('journalist'), icon: Newspaper, description: t('journalistDesc') },
    { value: 'expert', label: t('expert'), icon: GraduationCap, description: t('expertDesc') },
    { value: 'subscriber', label: t('subscriber'), icon: User, description: t('subscriberDesc') },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error(t('passwordMinLength')); return; }
    if (!accountType) { toast.error(t('selectAccountType')); return; }
    setLoading(true);
    const { error } = await signUp(email, password, { account_type: accountType });
    setLoading(false);
    if (error) { toast.error(error.message); } else { toast.success(t('checkEmailConfirmation')); navigate('/login'); }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-lg">
        {step === 1 ? (
          <Card>
            <CardHeader className="text-center"><CardTitle className="font-display text-2xl">{t('joinNetwork')}</CardTitle><CardDescription>{t('chooseAccountType')}</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {ACCOUNT_TYPES.map(type => {
                const Icon = type.icon;
                return (
                  <button key={type.value} onClick={() => setAccountType(type.value)}
                    className={`w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-colors ${isRTL ? 'text-right flex-row-reverse' : 'text-left'} ${accountType === type.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${accountType === type.value ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}><Icon className="w-6 h-6" /></div>
                    <div className="flex-1"><h3 className="font-semibold">{type.label}</h3><p className="text-sm text-muted-foreground">{type.description}</p></div>
                  </button>
                );
              })}
              <Button className="w-full mt-6" disabled={!accountType} onClick={() => setStep(2)}>{t('continue')} <ArrowIcon className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} /></Button>
              <p className="text-center text-sm text-muted-foreground">{t('alreadyHaveAccount')}{' '}<Link to="/login" className="text-primary font-medium hover:underline">{t('login')}</Link></p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="text-center"><CardTitle className="font-display text-2xl">{t('createAccount')}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label htmlFor="email">{t('email')}</Label><Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" /></div>
                <div><Label htmlFor="password">{t('password')}</Label><Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder={t('passwordMinLength')} /></div>
                {(accountType === 'journalist' || accountType === 'expert') && (
                  <div className="p-4 bg-muted rounded-lg text-sm"><p className="font-medium mb-1">{t('approvalRequired')}</p><p className="text-muted-foreground">{accountType === 'journalist' ? t('journalistApprovalMsg') : t('expertApprovalMsg')}</p></div>
                )}
                <div className={`flex gap-3 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>{t('back')}</Button>
                  <Button type="submit" className="flex-1" disabled={loading}>{loading ? <LoadingSpinner size="sm" /> : t('createAccount')}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Register;