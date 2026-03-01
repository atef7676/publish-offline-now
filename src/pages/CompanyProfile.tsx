import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCountryName } from '@/data/countries';
import { useProfileDetail } from '@/hooks/useProfileDetail';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProfileHeader from '@/components/profile/ProfileHeader';
import LinkableTag from '@/components/tags/LinkableTag';
import useTagTranslations from '@/hooks/useTagTranslations';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, MapPin, Tag } from 'lucide-react';

const CompanyProfile = () => {
  const { t, isRTL, language } = useLanguage();
  const { profile, loading, notFound } = useProfileDetail('company');
  const tagArMap = useTagTranslations(profile?.tags);
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  if (loading) return <Layout><LoadingSpinner className="py-32" size="lg" /></Layout>;
  if (notFound) return (
    <Layout>
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">{t('profileNotFound')}</h1>
        <Button asChild><Link to="/companies"><BackIcon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{isRTL ? 'العودة للشركات' : 'Back to Companies'}</Link></Button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/companies"><BackIcon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{isRTL ? 'العودة للشركات' : 'Back to Companies'}</Link>
        </Button>
        <div className="max-w-4xl">
          <div className="sahfy-card p-8">
            <ProfileHeader profile={profile} />
            {(profile.city || profile.country_code) && (
              <div className={`flex items-center gap-1 mb-6 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className="w-4 h-4" />{[profile.city, profile.country_code ? getCountryName(profile.country_code, language) : null].filter(Boolean).join(', ')}
              </div>
            )}
            {profile.tags?.length > 0 && (
              <div className="mb-6">
                <h3 className={`font-display font-semibold text-sm mb-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Tag className="w-4 h-4" />{isRTL ? 'الوسوم' : 'Tags'}</h3>
                <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>{profile.tags.map((tag: string, i: number) => <LinkableTag key={i} tag={tag} tagAr={tagArMap[tag]} />)}</div>
              </div>
            )}
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

export default CompanyProfile;
