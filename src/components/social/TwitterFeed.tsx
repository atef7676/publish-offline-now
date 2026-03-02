import { useState, useEffect, forwardRef, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Heart, Repeat2, MessageCircle, Eye } from 'lucide-react';

function extractUsername(url: string | null) {
  if (!url) return null;
  const s = url.trim();
  const m = s.match(/(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]{1,15})(?:\?|\/|$)/i);
  if (m) return m[1];
  if (s.startsWith('@')) return s.slice(1);
  if (/^[a-zA-Z0-9_]{1,15}$/.test(s)) return s;
  return null;
}

const fmt = (n: number) => {
  if (!n) return '0';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
};

interface TwitterFeedProps {
  xUrl: string;
  displayName: string;
  maxTweets?: number;
}

const TwitterFeed = forwardRef<HTMLDivElement, TwitterFeedProps>(({ xUrl, displayName, maxTweets = 3 }, ref) => {
  const { isRTL } = useLanguage();
  const [tweets, setTweets] = useState<any[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'error' | 'empty'>('idle');
  const [isVisible, setIsVisible] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  const username = extractUsername(xUrl);
  const profileUrl = username ? `https://x.com/${username}` : null;

  const setRefs = useCallback((node: HTMLDivElement | null) => {
    (hostRef as any).current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as any).current = node;
  }, [ref]);

  useEffect(() => {
    if (!hostRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { setIsVisible(true); observer.disconnect(); }
    }, { rootMargin: '250px 0px', threshold: 0.1 });
    observer.observe(hostRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!username || !isVisible) return;
    let cancelled = false;
    setStatus('loading');

    supabase.functions.invoke('fetch-twitter-feed', {
      body: { username, max_tweets: maxTweets }
    }).then(({ data }) => {
      if (cancelled) return;
      if (data?.ok && Array.isArray(data.tweets) && data.tweets.length > 0) {
        setTweets(data.tweets);
        setStatus('loaded');
      } else {
        setStatus('empty');
      }
    }).catch(() => { if (!cancelled) setStatus('error'); });

    return () => { cancelled = true; };
  }, [username, maxTweets, isVisible]);

  if (!username) return null;

  return (
    <div ref={setRefs} className="bg-card border border-border rounded-xl p-4">
      <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
        Latest Posts
      </h3>

      {(status === 'idle' || status === 'loading') && (
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      )}
      {status === 'error' && <p className="text-sm text-muted-foreground text-center py-6">Could not load tweets</p>}
      {status === 'empty' && <p className="text-sm text-muted-foreground text-center py-6">No recent posts</p>}
      {status === 'loaded' && (
        <div className="space-y-3">
          {tweets.map((tweet: any) => (
            <a key={tweet.id} href={tweet.url || profileUrl || '#'} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors">
              <p className="text-sm leading-relaxed mb-2 whitespace-pre-line">{tweet.text}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{fmt(tweet.like_count)}</span>
                <span className="flex items-center gap-1"><Repeat2 className="w-3 h-3" />{fmt(tweet.repost_count)}</span>
                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{fmt(tweet.reply_count)}</span>
                {tweet.view_count > 0 && <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{fmt(tweet.view_count)}</span>}
              </div>
            </a>
          ))}
        </div>
      )}
      <div className="mt-3 pt-2 border-t border-border">
        <a href={profileUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm inline-flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />Visit @{username}
        </a>
      </div>
    </div>
  );
});

TwitterFeed.displayName = 'TwitterFeed';

export default TwitterFeed;
