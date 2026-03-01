import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCoinBalance } from '@/contexts/CoinContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { Check, Zap, Coins } from 'lucide-react';

const Pricing = () => {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const { balance } = useCoinBalance();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (user) {
      supabase.from('subscriptions' as any).select('*').eq('user_id', user.id).maybeSingle().then(({ data }) => { setSubscription(data); setLoading(false); });
    } else { setLoading(false); }
  }, [user]);

  const isPro = subscription?.plan_key === 'pro_test';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold mb-4">{t('pricingTitle')}</h1>
          <p className="text-muted-foreground text-lg">{t('pricingSubtitle')}</p>
          {user && (
            <div className="flex items-center justify-center gap-2 mt-4 text-lg">
              <Coins className="w-5 h-5 text-secondary" />
              <span>{t('currentBalance')}: <strong>{balance} {t('coins')?.toLowerCase()}</strong></span>
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className={`sahfy-card p-8 ${!isPro ? 'ring-2 ring-primary' : ''}`}>
            <h3 className="font-display text-2xl font-bold mb-2">{t('free')}</h3>
            <p className="text-muted-foreground mb-6">{t('freePlanDesc')}</p>
            <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-muted-foreground font-normal">{t('perMonth')}</span></div>
            <ul className={`space-y-3 mb-8 text-sm ${isRTL ? 'text-right' : ''}`}>
              <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Check className="w-4 h-4 text-secondary" />{t('browseAllListings')}</li>
              <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Check className="w-4 h-4 text-secondary" />{t('createYourProfile')}</li>
              <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Check className="w-4 h-4 text-secondary" />{t('coinsOnSignup')}</li>
            </ul>
            {!user ? <Button variant="outline" asChild className="w-full"><Link to="/login">{t('loginToContinue')}</Link></Button>
              : !isPro ? <Button variant="outline" disabled className="w-full">{t('currentPlan')}</Button>
              : <Button variant="outline" className="w-full">{t('switchToFree')}</Button>}
          </div>
          <div className={`sahfy-card p-8 relative ${isPro ? 'ring-2 ring-secondary' : ''}`}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">{t('popular')}</div>
            <h3 className="font-display text-2xl font-bold mb-2">{t('pro')}</h3>
            <p className="text-muted-foreground mb-6">{t('proPlanDesc')}</p>
            <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-muted-foreground font-normal">{t('perMonth')}</span></div>
            <ul className={`space-y-3 mb-8 text-sm ${isRTL ? 'text-right' : ''}`}>
              <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Check className="w-4 h-4 text-secondary" />{t('everythingInFree')}</li>
              <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Check className="w-4 h-4 text-secondary" /><strong>{t('coinsAdded')}</strong></li>
              <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Check className="w-4 h-4 text-secondary" />{t('unlockProfiles')}</li>
              <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Check className="w-4 h-4 text-secondary" />{t('prioritySupport')}</li>
            </ul>
            {!user ? <Button asChild className="w-full"><Link to="/login">{t('loginToSubscribe')}</Link></Button>
              : isPro ? <Button disabled className="w-full">{t('currentPlan')}</Button>
              : <Button className="w-full"><Zap className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{t('activatePro')}</Button>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
