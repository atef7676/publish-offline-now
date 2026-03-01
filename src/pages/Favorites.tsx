import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import ProfileCard from '@/components/cards/ProfileCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Users, GraduationCap, Building2 } from 'lucide-react';

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (!authLoading && !user) navigate('/login'); }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase.from('user_favorites' as any).select(`id, created_at, profile:directory_profiles(*)`).eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setFavorites((data as any[] || []).filter((f: any) => f.profile)); setLoading(false); });
  }, [user]);

  const journalists = favorites.filter((f: any) => f.profile?.profile_type === 'journalist');
  const experts = favorites.filter((f: any) => f.profile?.profile_type === 'expert');
  const companies = favorites.filter((f: any) => f.profile?.profile_type === 'company');

  if (authLoading || loading) return <Layout><LoadingSpinner className="py-32" size="lg" /></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className={`flex items-center gap-3 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center"><Heart className="w-6 h-6 text-destructive" /></div>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="font-display text-3xl font-bold">{t('myFavorites') || 'My Favorites'}</h1>
            <p className="text-muted-foreground">{t('favoritesDescription') || 'Profiles you have saved'}</p>
          </div>
        </div>
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all" className="gap-2"><Heart className="w-4 h-4" />{t('all') || 'All'} ({favorites.length})</TabsTrigger>
            <TabsTrigger value="journalists" className="gap-2"><Users className="w-4 h-4" />{t('journalists')} ({journalists.length})</TabsTrigger>
            <TabsTrigger value="experts" className="gap-2"><GraduationCap className="w-4 h-4" />{t('experts')} ({experts.length})</TabsTrigger>
            <TabsTrigger value="companies" className="gap-2"><Building2 className="w-4 h-4" />{t('companies')} ({companies.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {favorites.length === 0 ? <EmptyState icon={Heart} title={t('noFavorites') || 'No favorites yet'} /> : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{favorites.map((fav: any) => <ProfileCard key={fav.id} profile={fav.profile} type={fav.profile.profile_type} />)}</div>
            )}
          </TabsContent>
          <TabsContent value="journalists">
            {journalists.length === 0 ? <EmptyState icon={Users} title={t('noFavoriteJournalists') || 'No favorite journalists'} /> : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{journalists.map((fav: any) => <ProfileCard key={fav.id} profile={fav.profile} type="journalist" />)}</div>
            )}
          </TabsContent>
          <TabsContent value="experts">
            {experts.length === 0 ? <EmptyState icon={GraduationCap} title={t('noFavoriteExperts') || 'No favorite experts'} /> : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{experts.map((fav: any) => <ProfileCard key={fav.id} profile={fav.profile} type="expert" />)}</div>
            )}
          </TabsContent>
          <TabsContent value="companies">
            {companies.length === 0 ? <EmptyState icon={Building2} title={t('noFavoriteCompanies') || 'No favorite companies'} /> : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{companies.map((fav: any) => <ProfileCard key={fav.id} profile={fav.profile} type="company" />)}</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Favorites;
