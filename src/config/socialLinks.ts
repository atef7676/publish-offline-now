import { Globe, Linkedin, Twitter, Instagram, Youtube, Facebook, BookOpen } from 'lucide-react';

export const SOCIAL_PRIORITY_ORDER = ['website', 'linkedin', 'x', 'instagram', 'youtube', 'facebook', 'tumblr'];

export const SOCIAL_PLATFORMS: Record<string, any> = {
  website: { key: 'website', fieldName: 'website_url', icon: Globe, label: 'Website', label_ar: 'الموقع' },
  linkedin: { key: 'linkedin', fieldName: 'linkedin_url', icon: Linkedin, label: 'LinkedIn', label_ar: 'لينكدإن' },
  x: { key: 'x', fieldName: 'x_url', icon: Twitter, label: 'X (Twitter)', label_ar: 'إكس (تويتر)' },
  instagram: { key: 'instagram', fieldName: 'instagram_url', icon: Instagram, label: 'Instagram', label_ar: 'إنستغرام' },
  youtube: { key: 'youtube', fieldName: 'youtube_url', icon: Youtube, label: 'YouTube', label_ar: 'يوتيوب' },
  facebook: { key: 'facebook', fieldName: 'facebook_url', icon: Facebook, label: 'Facebook', label_ar: 'فيسبوك' },
  tumblr: { key: 'tumblr', fieldName: 'tumblr_url', icon: BookOpen, label: 'Tumblr', label_ar: 'تمبلر' },
};

export const getProfileSocialLinks = (profile: any, maxCount = 3) => {
  if (!profile) return [];
  const links: any[] = [];
  for (const platform of SOCIAL_PRIORITY_ORDER) {
    if (links.length >= maxCount) break;
    const config = SOCIAL_PLATFORMS[platform];
    let url = profile[config.fieldName];
    if (!url && platform === 'x') url = profile.twitter_handle || profile.twitter_url;
    if (!url && platform === 'website') url = profile.website_url;
    if (url && url.trim()) {
      links.push({ platform, url: url.trim(), icon: config.icon, label: config.label, label_ar: config.label_ar });
    }
  }
  return links;
};

export const hasSocialLinks = (profile: any) => getProfileSocialLinks(profile, 1).length > 0;

export const getLevel1UnlockCost = (profileType: string) => profileType === 'journalist' ? 2 : 1;
