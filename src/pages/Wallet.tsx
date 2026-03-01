import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCoinBalance } from '@/contexts/CoinContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Coins, ArrowDownRight, Plus } from 'lucide-react';

const Wallet = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, isRTL } = useLanguage();
  const { balance, loading: balanceLoading } = useCoinBalance();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase.from('coin_transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50)
      .then(({ data }) => { setTransactions(data || []); setLoading(false); });
  }, [user]);

  if (authLoading) return <Layout><LoadingSpinner className="py-32" size="lg" /></Layout>;
  if (!user) return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">{t('wallet')}</h1>
        <p className="text-muted-foreground mb-6">{t('loginToViewWallet')}</p>
        <Button asChild><Link to="/login">{t('login')}</Link></Button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl" dir={isRTL ? 'rtl' : 'ltr'}>
        <h1 className="font-display text-3xl font-bold mb-8">{t('myWallet')}</h1>
        <div className="sahfy-card p-6 mb-8 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('currentBalanceLabel')}</p>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Coins className="w-8 h-8 text-secondary" />
                <span className="text-4xl font-bold">{balanceLoading ? '...' : balance}</span>
                <span className="text-lg text-muted-foreground">mCoins</span>
              </div>
            </div>
            <Button asChild><Link to="/pricing"><Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{t('getMoreCoins')}</Link></Button>
          </div>
        </div>
        <div className="sahfy-card">
          <div className="p-4 border-b border-border"><h3 className="font-semibold">{t('transactionHistory')}</h3></div>
          {loading ? <LoadingSpinner className="py-12" /> : transactions.length === 0 ? (
            <EmptyState title={t('noTransactionsYet')} description={t('transactionsAppearHere')} icon={Coins} />
          ) : (
            <div className="divide-y divide-border">
              {transactions.map((tx) => (
                <div key={tx.id} className={`p-4 flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                    {tx.amount > 0 ? <ArrowDownRight className="w-5 h-5" /> : <Coins className="w-4 h-4" />}
                  </div>
                  <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}><p className="font-medium text-sm">{tx.reason}</p></div>
                  <div className={isRTL ? 'text-left' : 'text-right'}>
                    <p className={`font-semibold ${tx.amount > 0 ? 'text-green-500' : 'text-foreground'}`}>{tx.amount > 0 ? '+' : ''}{tx.amount}</p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Wallet;
