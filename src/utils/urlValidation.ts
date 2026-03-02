// URL validation utilities

export const isValidWebsiteUrl = (url: string): boolean => {
  if (!url) return true;
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return ['http:', 'https:'].includes(u.protocol);
  } catch {
    return false;
  }
};

export const isValidLinkedInUrl = (url: string): boolean => {
  if (!url) return true;
  return /^https?:\/\/(www\.)?linkedin\.com\//i.test(url);
};

export const normalizeProfileUrls = (formData: any) => {
  const result: Record<string, string | null> = {};

  const urlFields = ['website_url', 'linkedin_url', 'facebook_url', 'instagram_url', 'youtube_url', 'tumblr_url'];
  for (const field of urlFields) {
    const val = formData[field]?.trim();
    if (!val) { result[field] = null; continue; }
    result[field] = val.startsWith('http') ? val : `https://${val}`;
  }

  // Twitter/X handle normalization
  const tw = formData.twitter_handle?.trim() || '';
  if (tw) {
    // Extract handle from URL or clean @
    const match = tw.match(/(?:twitter\.com|x\.com)\/([^/?]+)/i);
    result.twitter_handle = match ? match[1] : tw.replace(/^@/, '');
    result.x_url = `https://x.com/${result.twitter_handle}`;
  } else {
    result.twitter_handle = null;
    result.x_url = null;
  }

  return result;
};
