import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useUnlockedProfiles } from '@/hooks/useUnlockedProfiles';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Heart, Unlock, Users, GraduationCap, Building2, Newspaper, Calendar, ExternalLink, User } from 'lucide-react';

const UnlockedProfileCard = ({ unlock, isRTL, t }: any) => {
  const profile = unlock.profile;
  const profileUrl = `/${profile.profile_type}s/${profile.slug}`;
  const getTypeIcon = () => {
    switch (profile.profile_type) {
      case 'journalist': return <Users className="w-4 h-4" />;
      case 'expert': return <GraduationCap className="w-4 h-4" />;
      case 'company': return <Building2 className="w-4 h-4" />;
      case 'publication': return <Newspaper className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <Link to={profileUrl} className="sahfy-card p-4 hover:border-primary/50 transition-all group block">
      <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
          {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-muted-foreground" />}
        </div>
        <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{isRTL && profile.display_name_ar ? profile.display_name_ar : profile.display_name}</h3>
          <p className="text-sm text-muted-foreground truncate">{profile.headline || '—'}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="gap-1 text-xs">{getTypeIcon()}{profile.profile_type}</Badge>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(unlock.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Portfolio = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { favorites, loading: favoritesLoading } = useFavorites();
  const { unlockedProfiles, loading: unlocksLoading } = useUnlockedProfiles();
  const defaultTab = searchParams.get('tab') || 'unlocked';

  useEffect(() => { if (!authLoading && !user) navigate('/login'); }, [user, authLoading, navigate]);

  if (authLoading || favoritesLoading || unlocksLoading) return <Layout><LoadingSpinner className="py-32" size="lg" /></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className={`flex items-center gap-3 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><Briefcase className="w-6 h-6 text-primary" /></div>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="font-display text-3xl font-bold">{t('portfolio') || 'Portfolio'}</h1>
            <p className="text-muted-foreground">{t('portfolioDescription') || 'Your saved and unlocked profiles'}</p>
          </div>
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="favorites" className="gap-2"><Heart className="w-4 h-4" />Favorites ({favorites.length})</TabsTrigger>
            <TabsTrigger value="unlocked" className="gap-2"><Unlock className="w-4 h-4" />Unlocked ({unlockedProfiles.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="favorites">
            <div className="sahfy-card p-6 text-center">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Favorites</h3>
              <Link to="/favorites" className="inline-flex items-center gap-2 text-primary hover:underline">Go to Favorites <ExternalLink className="w-4 h-4" /></Link>
            </div>
          </TabsContent>

          <TabsContent value="unlocked">
            {unlockedProfiles.length === 0 ? <EmptyState icon={Unlock} title="No unlocked profiles" description="Profiles you unlock will appear here" /> : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unlockedProfiles.map((u: any) => <UnlockedProfileCard key={u.id} unlock={u} isRTL={isRTL} t={t} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Portfolio;
