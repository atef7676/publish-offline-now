import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUnlockedProfiles } from '@/hooks/useUnlockedProfiles';
import { getCountryName } from '@/data/countries';
import { MapPin, Briefcase, GraduationCap, Calendar } from 'lucide-react';
import LinkableTag from '@/components/tags/LinkableTag';
import useTagTranslations from '@/hooks/useTagTranslations';

const ProfileCard = ({ profile, type = 'journalist', showFavorite = true }: any) => {
  const { isRTL, language } = useLanguage();
  const { user } = useAuth();
  const tagArMap = useTagTranslations(profile?.tags);
  const { isUnlocked } = useUnlockedProfiles();

  const getBasePath = () => {
    switch (type) {
      case 'journalist': return '/journalists';
      case 'expert': return '/experts';
      case 'company': return '/companies';
      case 'publication': return '/publications';
      default: return '/journalists';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getDisplayName = () => {
    if (profile.first_name && profile.last_name) {
      const fullName = `${profile.first_name} ${profile.last_name}`;
      return profile.title ? `${profile.title} ${fullName}` : fullName;
    }
    const name = profile.display_name || '';
    return profile.title ? `${profile.title} ${name}` : name;
  };

  const getJobTitle = () => {
    if (language === 'ar') return profile.headline_ar || profile.headline || profile.journalist_profile?.job_title_ar;
    return profile.headline || profile.headline_ar || profile.journalist_profile?.job_title_ar;
  };

  const formatLastUpdated = () => {
    if (!profile.updated_at) return null;
    const date = new Date(profile.updated_at);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const avatarUrl = profile.avatar_url
    ? `${profile.avatar_url}${profile.avatar_url.includes('?') ? '&' : '?'}v=${profile.avatar_updated_at || profile.updated_at || Date.now()}`
    : null;

  return (
    <div className="sahfy-card p-6 group relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
      <Link to={`${getBasePath()}/${profile.slug}`} className="block">
        <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={profile.display_name} loading="lazy" className="w-16 h-16 rounded-full object-cover border-2 border-border group-hover:border-primary group-hover:scale-105 transition-all duration-300" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center border-2 border-primary">
                <span className="text-primary-foreground font-display font-semibold text-xl">{getInitials(profile.display_name)}</span>
              </div>
            )}
          </div>
          <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">{getDisplayName()}</h3>
            {getJobTitle() && <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{getJobTitle()}</p>}
            {profile.outlet_name && type === 'journalist' && <p className="text-sm font-medium text-primary mt-1">{profile.outlet_name}</p>}

            <div className={`flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
              {profile.category && type === 'company' && (
                <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}><Briefcase className="w-4 h-4" />{profile.category}</span>
              )}
              {profile.specializations?.length > 0 && type === 'expert' && (
                <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}><GraduationCap className="w-4 h-4" />{profile.specializations[0]}{profile.specializations.length > 1 && ` +${profile.specializations.length - 1}`}</span>
              )}
              {(profile.country_code || profile.city) && (
                <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <MapPin className="w-4 h-4" />
                  {[profile.city, profile.country_code ? getCountryName(profile.country_code, language) : null].filter(Boolean).join(', ')}
                </span>
              )}
            </div>

            {profile.tags?.length > 0 && (
              <div className={`flex flex-wrap gap-1.5 mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {profile.tags.slice(0, 3).map((tag: string, i: number) => (
                  <LinkableTag key={i} tag={tag} tagAr={tagArMap[tag]} />
                ))}
                {profile.tags.length > 3 && <span className="sahfy-chip">+{profile.tags.length - 3}</span>}
              </div>
            )}

            {profile.languages?.length > 0 && (
              <div className={`flex flex-wrap gap-1.5 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {profile.languages.slice(0, 3).map((lang: string, i: number) => (
                  <span key={i} className="sahfy-chip-gold">{lang}</span>
                ))}
              </div>
            )}

            {formatLastUpdated() && (
              <div className={`flex items-center gap-1 mt-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Calendar className="w-3 h-3" />
                <span>{isRTL ? 'آخر تحديث:' : 'Updated:'} {formatLastUpdated()}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProfileCard;
