import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProfileCard from '@/components/cards/ProfileCard';
import EmptyState from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Tag, Users, GraduationCap, Newspaper } from 'lucide-react';

const TagResults = () => {
  const { slug } = useParams();
  const { t, isRTL } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [tag, setTag] = useState<any>(null);
  const [journalists, setJournalists] = useState<any[]>([]);
  const [experts, setExperts] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const tagName = slug.replace(/-/g, ' ');
    Promise.all([
      supabase.from('directory_profiles').select('*').eq('profile_type', 'journalist').eq('approval_status', 'approved').eq('is_public', true).eq('is_listed', true).contains('tags', [tagName]),
      supabase.from('directory_profiles').select('*').eq('profile_type', 'expert').eq('approval_status', 'approved').eq('is_public', true).eq('is_listed', true).contains('tags', [tagName]),
      supabase.from('directory_profiles').select('*').eq('profile_type', 'publication').eq('approval_status', 'approved').eq('is_public', true).eq('is_listed', true).contains('tags', [tagName]),
    ]).then(([j, e, p]) => {
      setJournalists(j.data || []);
      setExperts(e.data || []);
      setPublications(p.data || []);
      setTag({ name: tagName, slug });
    }).finally(() => setLoading(false));
  }, [slug]);

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const totalResults = journalists.length + experts.length + publications.length;

  if (loading) return <Layout><LoadingSpinner className="py-32" size="lg" /></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6"><Link to="/"><BackIcon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{isRTL ? 'العودة للرئيسية' : 'Back to Home'}</Link></Button>
        <div className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
          <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Tag className="w-8 h-8 text-primary" />
            <h1 className="font-display text-3xl md:text-4xl font-bold">{tag?.name || slug?.replace(/-/g, ' ')}</h1>
          </div>
          <p className="text-muted-foreground">{isRTL ? `${totalResults} نتيجة تحمل هذا الوسم` : `${totalResults} results tagged with this`}</p>
        </div>
        {totalResults === 0 ? <EmptyState icon={Tag} title={isRTL ? 'لا توجد نتائج' : 'No results found'} /> : (
          <div className="space-y-12">
            {journalists.length > 0 && (
              <section>
                <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}><Users className="w-5 h-5 text-primary" /><h2 className="font-display text-xl font-semibold">{isRTL ? 'الصحفيون' : 'Journalists'}</h2><span className="text-muted-foreground text-sm">({journalists.length})</span></div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{journalists.map(p => <ProfileCard key={p.profile_id} profile={p} type="journalist" />)}</div>
              </section>
            )}
            {experts.length > 0 && (
              <section>
                <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}><GraduationCap className="w-5 h-5 text-primary" /><h2 className="font-display text-xl font-semibold">{isRTL ? 'الخبراء' : 'Experts'}</h2><span className="text-muted-foreground text-sm">({experts.length})</span></div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{experts.map(p => <ProfileCard key={p.profile_id} profile={p} type="expert" />)}</div>
              </section>
            )}
            {publications.length > 0 && (
              <section>
                <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}><Newspaper className="w-5 h-5 text-primary" /><h2 className="font-display text-xl font-semibold">{isRTL ? 'المؤسسات الإعلامية' : 'Publications'}</h2><span className="text-muted-foreground text-sm">({publications.length})</span></div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{publications.map(p => <ProfileCard key={p.profile_id} profile={p} type="publication" />)}</div>
              </section>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TagResults;
