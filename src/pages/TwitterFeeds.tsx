import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import TwitterFeed from '@/components/social/TwitterFeed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowLeft, Users, Newspaper } from 'lucide-react';

function extractUsername(url: string | null) {
  if (!url) return null;
  const s = url.trim();
  const m = s.match(/(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]{1,15})(?:\?|\/|$)/i);
  if (m) return m[1];
  if (s.startsWith('@')) return s.slice(1);
  if (/^[a-zA-Z0-9_]{1,15}$/.test(s)) return s;
  return null;
}

const TwitterFeeds = () => {
  const { isRTL } = useLanguage();
  const [journalists, setJournalists] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('journalists');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const [jRes, pRes] = await Promise.all([
        supabase.from('directory_profiles').select('profile_id, slug, display_name, display_name_ar, twitter_handle, avatar_url, is_top_listing').eq('profile_type', 'journalist').eq('approval_status', 'approved').eq('is_public', true).not('twitter_handle', 'is', null).neq('twitter_handle', '').order('is_top_listing', { ascending: false }).limit(10),
        supabase.from('directory_profiles').select('profile_id, slug, display_name, display_name_ar, twitter_handle, avatar_url, is_top_listing').eq('profile_type', 'publication').eq('approval_status', 'approved').eq('is_public', true).not('twitter_handle', 'is', null).neq('twitter_handle', '').order('is_top_listing', { ascending: false }).limit(10),
      ]);
      const valid = (item: any) => !!extractUsername(item.twitter_handle);
      if (!jRes.error) setJournalists((jRes.data || []).filter(valid));
      if (!pRes.error) setPublications((pRes.data || []).filter(valid));
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = useMemo(() => {
    const items = activeTab === 'journalists' ? journalists : publications;
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(i => i.display_name?.toLowerCase().includes(q) || extractUsername(i.twitter_handle)?.toLowerCase().includes(q));
  }, [searchQuery, journalists, publications, activeTab]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-4"><Link to="/journalists"><ArrowLeft className="w-4 h-4 mr-2" />{isRTL ? 'العودة' : 'Back'}</Link></Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div><h1 className="text-3xl font-bold">{isRTL ? 'موجز التغريدات' : 'X / Twitter Feeds'}</h1><p className="text-muted-foreground mt-2">{isRTL ? 'آخر التغريدات' : `Latest posts from ${journalists.length} journalists and ${publications.length} publications`}</p></div>
          <div className="relative w-full md:w-72"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="journalists" className="flex items-center gap-2"><Users className="w-4 h-4" />Journalists ({journalists.length})</TabsTrigger>
            <TabsTrigger value="publications" className="flex items-center gap-2"><Newspaper className="w-4 h-4" />Publications ({publications.length})</TabsTrigger>
          </TabsList>
          {loading ? <LoadingSpinner className="py-16" size="lg" /> : (
            <>
              <TabsContent value="journalists">
                {filtered.length === 0 ? <p className="text-center py-16 text-muted-foreground">No results</p> : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.map(item => {
                    const username = extractUsername(item.twitter_handle);
                    if (!username) return null;
                    return <div key={item.profile_id}><Link to={`/journalists/${item.slug}`} className="block mb-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"><div className="flex items-center gap-3">{item.avatar_url ? <img src={item.avatar_url} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">{item.display_name?.[0]}</div>}<div><p className="font-medium">{item.display_name}</p><p className="text-sm text-muted-foreground">@{username}</p></div></div></Link><TwitterFeed xUrl={item.twitter_handle} displayName={item.display_name} maxTweets={3} /></div>;
                  })}</div>
                )}
              </TabsContent>
              <TabsContent value="publications">
                {filtered.length === 0 ? <p className="text-center py-16 text-muted-foreground">No results</p> : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.map(item => {
                    const username = extractUsername(item.twitter_handle);
                    if (!username) return null;
                    return <div key={item.profile_id}><Link to={`/publications/${item.slug}`} className="block mb-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"><div className="flex items-center gap-3">{item.avatar_url ? <img src={item.avatar_url} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">{item.display_name?.[0]}</div>}<div><p className="font-medium">{item.display_name}</p><p className="text-sm text-muted-foreground">@{username}</p></div></div></Link><TwitterFeed xUrl={item.twitter_handle} displayName={item.display_name} maxTweets={3} /></div>;
                  })}</div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default TwitterFeeds;
