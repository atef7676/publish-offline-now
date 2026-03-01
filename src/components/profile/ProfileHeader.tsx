import { ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProfileHeader = ({ profile, avatarFallback, children }: { profile: any; avatarFallback?: ReactNode; children?: ReactNode }) => {
  const { isRTL } = useLanguage();

  const avatarUrl = profile.avatar_url
    ? `${profile.avatar_url}${profile.avatar_url.includes('?') ? '&' : '?'}v=${profile.avatar_updated_at || profile.updated_at || Date.now()}`
    : null;

  return (
    <div className={`flex items-start gap-6 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={profile.display_name} className="w-24 h-24 rounded-full object-cover border-4 border-border" />
      ) : (
        avatarFallback || (
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-3xl">{profile.display_name?.charAt(0)}</span>
          </div>
        )
      )}
      <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
        <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">
              {profile.title && `${profile.title} `}{profile.display_name}
            </h1>
            {profile.display_name_ar && <p className="text-muted-foreground text-lg mb-2" dir="rtl">{profile.display_name_ar}</p>}
            {profile.headline && <p className="text-muted-foreground">{profile.headline}</p>}
          </div>
        </div>
        {profile.visits_count > 0 && (
          <p className="text-sm text-muted-foreground mt-2">{profile.visits_count} {isRTL ? 'زيارة' : 'views'}</p>
        )}
        {children}
      </div>
    </div>
  );
};

export default ProfileHeader;
