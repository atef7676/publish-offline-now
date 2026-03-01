import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfileDetail } from '@/hooks/useProfileDetail';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, MapPin, Globe } from 'lucide-react';
import { getCountryName } from '@/data/countries';

const PublicationProfile = () => {
  const { t, isRTL, language } = useLanguage();
  const { profile, loading, notFound } = useProfileDetail('publication');
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  if (loading) return <Layout><LoadingSpinner className="py-32" size="lg" /></Layout>;
  if (notFound) return (
    <Layout>
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">{t('profileNotFound')}</h1>
        <Button asChild><Link to="/publications"><BackIcon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{isRTL ? 'العودة للمؤسسات' : 'Back to Publications'}</Link></Button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/publications"><BackIcon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{isRTL ? 'العودة للمؤسسات' : 'Back to Publications'}</Link>
        </Button>
        <div className="max-w-4xl">
          <div className="sahfy-card p-8">
            <ProfileHeader profile={profile} />
            <div className={`flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
              {(profile.city || profile.country_code) && (
                <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <MapPin className="w-4 h-4" />{[profile.city, profile.country_code ? getCountryName(profile.country_code, language) : null].filter(Boolean).join(', ')}
                </span>
              )}
              {profile.website_url && (
                <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1 text-primary hover:underline ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Globe className="w-4 h-4" />{isRTL ? 'الموقع' : 'Website'}
                </a>
              )}
            </div>
            {profile.bio && (
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="font-display font-semibold text-lg mb-2">{t('about')}</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PublicationProfile;
