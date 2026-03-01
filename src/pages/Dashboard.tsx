import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCoins } from '@/hooks/useCoins';
import { useUserRole } from '@/hooks/useUserRole';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Coins, MessageSquare, Unlock, Shield, Bell, ArrowRight, ArrowLeft, Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useUnlockedProfiles } from '@/hooks/useUnlockedProfiles';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { balance, loading: coinsLoading } = useCoins();
  const { isAdmin, isSubAdmin, loading: rolesLoading } = useUserRole();
  const { t, isRTL } = useLanguage();
  const { favorites } = useFavorites();
  const { unlockedProfiles } = useUnlockedProfiles();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (!authLoading && !user) navigate('/login'); }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      supabase.from('coin_transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('contact_requests').select(`*, profile:directory_profiles!recipient_profile_id(display_name, profile_type, slug)`).eq('sender_id', user.id).order('created_at', { ascending: false }).limit(10),
    ]).then(([txRes, msgRes]) => {
      setTransactions(txRes.data || []);
      setMessages(msgRes.data || []);
    }).finally(() => setLoading(false));
  }, [user]);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  if (authLoading || loading) return <Layout><LoadingSpinner className="py-32" size="lg" /></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h1 className="font-display text-3xl font-bold">{t('dashboard')}</h1>
          {(isAdmin || isSubAdmin) && (
            <Button asChild><Link to="/admin/review">{t('adminPanel')}<ArrowIcon className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} /></Link></Button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="sahfy-card p-6">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center"><Coins className="w-5 h-5 text-secondary" /></div>
              <div className={isRTL ? 'text-right' : ''}><p className="text-2xl font-bold">{balance}</p><p className="text-sm text-muted-foreground">{t('coinsBalance')}</p></div>
            </div>
          </div>
          <div className="sahfy-card p-6">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"><Unlock className="w-5 h-5 text-primary" /></div>
              <div className={isRTL ? 'text-right' : ''}><p className="text-2xl font-bold">{unlockedProfiles.length}</p><p className="text-sm text-muted-foreground">{t('profilesUnlocked')}</p></div>
            </div>
          </div>
          <div className="sahfy-card p-6">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-accent-foreground" /></div>
              <div className={isRTL ? 'text-right' : ''}><p className="text-2xl font-bold">{messages.length}</p><p className="text-sm text-muted-foreground">{t('messagesSent')}</p></div>
            </div>
          </div>
          <div className="sahfy-card p-6">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center"><Heart className="w-5 h-5 text-destructive" /></div>
              <div className={isRTL ? 'text-right' : ''}><p className="text-2xl font-bold">{favorites.length}</p><p className="text-sm text-muted-foreground">{t('favorites') || 'Favorites'}</p></div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="transactions">
          <TabsList className="mb-6">
            <TabsTrigger value="transactions">{t('transactions')}</TabsTrigger>
            <TabsTrigger value="messages">{t('messages')}</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            {transactions.length === 0 ? <EmptyState title={t('noTransactions')} icon={Coins} /> : (
              <div className="sahfy-card divide-y divide-border">
                {transactions.map((tx) => (
                  <div key={tx.id} className={`p-4 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-500/20' : 'bg-destructive/20'}`}>
                        <Coins className={`w-4 h-4 ${tx.amount > 0 ? 'text-green-500' : 'text-destructive'}`} />
                      </div>
                      <div className={isRTL ? 'text-right' : ''}><p className="font-medium text-sm">{tx.reason}</p></div>
                    </div>
                    <div className={isRTL ? 'text-left' : 'text-right'}>
                      <p className={`font-semibold ${tx.amount > 0 ? 'text-green-500' : 'text-destructive'}`}>{tx.amount > 0 ? '+' : ''}{tx.amount}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="messages">
            {messages.length === 0 ? <EmptyState title={t('noMessages')} icon={MessageSquare} /> : (
              <div className="sahfy-card divide-y divide-border">
                {messages.map((msg) => (
                  <div key={msg.id} className="p-4">
                    <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <p className="font-medium">{msg.profile?.display_name || t('unknown')}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${msg.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'}`}>{msg.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{msg.subject}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/journalists" className="sahfy-card p-6 hover:border-primary/50 transition-colors"><h3 className="font-semibold mb-2">{t('browseJournalists')}</h3><p className="text-sm text-muted-foreground">{t('findAndConnect')}</p></Link>
          <Link to="/experts" className="sahfy-card p-6 hover:border-primary/50 transition-colors"><h3 className="font-semibold mb-2">{t('browseExperts')}</h3><p className="text-sm text-muted-foreground">{t('discoverExperts')}</p></Link>
          <Link to="/pricing" className="sahfy-card p-6 hover:border-primary/50 transition-colors"><h3 className="font-semibold mb-2">{t('getMoreCoins')}</h3><p className="text-sm text-muted-foreground">{t('upgradeForMore')}</p></Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
