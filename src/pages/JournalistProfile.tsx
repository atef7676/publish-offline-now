import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import useTaxonomies from '@/hooks/useTaxonomies';
import { getCountryName } from '@/data/countries';
import { useProfileDetail } from '@/hooks/useProfileDetail';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProfileHeader from '@/components/profile/ProfileHeader';
import LinkableTag from '@/components/tags/LinkableTag';
import useTagTranslations from '@/hooks/useTagTranslations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, MapPin, Briefcase, Building2, Languages, Tag } from 'lucide-react';

const JournalistProfile = () => {
  const { t, isRTL, language } = useLanguage();
  const navigate = useNavigate();
  const { sectors, mediaRoles, employmentStatus, getLabel } = useTaxonomies();
  const { profile, loading, notFound } = useProfileDetail('journalist');
  const tagArMap = useTagTranslations(profile?.tags);
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const getMediaRoleLabel = (key: string) => { const role = mediaRoles.find((r: any) => r.key === key); return role ? (isRTL ? role.name_ar : role.name_en) : key; };
  const getEmploymentLabel = (key: string) => { const status = employmentStatus.find((s: any) => s.key === key); return status ? (isRTL ? status.name_ar : status.name_en) : key; };
  const getSectorLabel = (id: string) => { const sector = sectors.find((s: any) => s.id === id); return sector ? (isRTL ? sector.name_ar : sector.name) : null; };
  const getSectorSlug = (id: string) => sectors.find((s: any) => s.id === id)?.slug || null;

  const allSectorIds: string[] = [];
  if (profile?.sector_id) allSectorIds.push(profile.sector_id);
  if (profile?.specializations?.length) profile.specializations.forEach((s: string) => { if (!allSectorIds.includes(s)) allSectorIds.push(s); });

  if (loading) return <Layout><LoadingSpinner className="py-32" size="lg" /></Layout>;
  if (notFound) return (
    <Layout>
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">{t('profileNotFound')}</h1>
        <Button asChild><Link to="/journalists"><BackIcon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{t('backToJournalists')}</Link></Button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/journalists"><BackIcon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{t('backToJournalists')}</Link>
        </Button>

        <div className="max-w-4xl">
          <div className="sahfy-card p-8">
            <ProfileHeader profile={profile}>
              {profile.media_role && (
                <Badge variant="secondary" className="mt-2 cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => navigate(`/journalists?media_role=${encodeURIComponent(profile.media_role)}`)}>
                  {getMediaRoleLabel(profile.media_role)}
                </Badge>
              )}
            </ProfileHeader>

            <div className={`flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
              {profile.employment_status && <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}><Briefcase className="w-4 h-4" />{getEmploymentLabel(profile.employment_status)}</span>}
              {profile.outlet_name && <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}><Building2 className="w-4 h-4" />{profile.outlet_name}</span>}
              {(profile.city || profile.country_code) && (
                <button onClick={() => profile.country_code && navigate(`/journalists?country=${encodeURIComponent(profile.country_code)}`)}
                  className={`flex items-center gap-1 hover:text-primary transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <MapPin className="w-4 h-4" />{[profile.city, profile.country_code ? getCountryName(profile.country_code, language) : null].filter(Boolean).join(', ')}
                </button>
              )}
            </div>

            {allSectorIds.length > 0 && (
              <div className="mb-6">
                <h3 className={`font-display font-semibold text-sm mb-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Tag className="w-4 h-4" />{isRTL ? 'المواضيع' : 'Topics'}</h3>
                <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {allSectorIds.map((sectorId, i) => { const label = getSectorLabel(sectorId); return label ? <button key={i} onClick={() => { const s = getSectorSlug(sectorId); if (s) navigate(`/journalists?sector=${encodeURIComponent(s)}`); }} className="sahfy-chip cursor-pointer hover:bg-primary/20 transition-colors">{label}</button> : null; })}
                </div>
              </div>
            )}

            {profile.languages?.length > 0 && (
              <div className="mb-6">
                <h3 className={`font-display font-semibold text-sm mb-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Languages className="w-4 h-4" />{isRTL ? 'اللغات' : 'Languages'}</h3>
                <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {profile.languages.map((lang: string, i: number) => <span key={i} className="sahfy-chip-gold">{lang}</span>)}
                </div>
              </div>
            )}

            {profile.tags?.length > 0 && (
              <div className="mb-6">
                <h3 className={`font-display font-semibold text-sm mb-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Tag className="w-4 h-4" />{isRTL ? 'الوسوم' : 'Tags'}</h3>
                <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {profile.tags.map((tag: string, i: number) => <LinkableTag key={i} tag={tag} tagAr={tagArMap[tag]} />)}
                </div>
              </div>
            )}

            {profile.bio && (
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="font-display font-semibold text-lg mb-2">{t('about')}</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}

            {profile.updated_at && (
              <div className={`mt-6 pt-4 border-t text-sm text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
                {isRTL ? 'آخر تحديث: ' : 'Last updated: '}
                {new Date(profile.updated_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JournalistProfile;
