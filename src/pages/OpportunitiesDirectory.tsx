import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getCountryName } from '@/data/countries';
import Layout from '@/components/layout/Layout';
import OpportunityCard from '@/components/opportunities/OpportunityCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Briefcase, X, ChevronDown, Plus } from 'lucide-react';

const OpportunitiesDirectory = () => {
  const { isRTL, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [countries, setCountries] = useState<string[]>([]);
  const [hasCompanyProfile, setHasCompanyProfile] = useState(false);
  const lang = language === 'ar' ? 'ar' : 'en';

  const search = searchParams.get('search') || '';
  const country = searchParams.get('country') || '';
  const type = searchParams.get('type') || '';
  const location = searchParams.get('location') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const hasActiveFilters = search || country || type || location || sortBy !== 'newest';

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!user) return;
    supabase.from('directory_profiles').select('profile_id').eq('owner_user_id', user.id).eq('profile_type', 'company').eq('approval_status', 'approved').limit(1)
      .then(({ data }) => setHasCompanyProfile((data?.length || 0) > 0));
  }, [user]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let query = supabase.from('opportunities').select('*, company:directory_profiles!company_profile_id(display_name, display_name_ar, avatar_url, slug)').eq('status', 'published').eq('visibility', 'public');
      if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      if (country) query = query.eq('country_code', country);
      if (type) query = query.eq('opportunity_type', type);
      if (location) query = query.eq('work_location', location);
      if (sortBy === 'budget_high') query = query.order('budget_max', { ascending: false, nullsFirst: false });
      else if (sortBy === 'urgency') query = query.order('urgency_level', { ascending: false });
      else query = query.order('published_at', { ascending: false });
      const { data } = await query.limit(100);
      setOpportunities(data || []);
      setLoading(false);
    };
    fetch();
  }, [search, country, type, location, sortBy]);

  useEffect(() => {
    supabase.from('opportunities').select('country_code').eq('status', 'published').eq('visibility', 'public')
      .then(({ data }) => { if (data) setCountries([...new Set(data.map(d => d.country_code).filter(Boolean) as string[])].sort()); });
  }, []);

  const visible = opportunities.slice(0, visibleCount);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">{isRTL ? 'الفرص' : 'Opportunities'}</h1>
            <p className="text-muted-foreground mt-1">{opportunities.length} {isRTL ? 'فرصة متاحة' : 'opportunities available'}</p>
          </div>
          {hasCompanyProfile && (
            <Button onClick={() => navigate('/opportunities/create')}><Plus className="w-4 h-4 mr-2" />{isRTL ? 'إنشاء فرصة' : 'Post Opportunity'}</Button>
          )}
        </div>

        <div className="grid md:grid-cols-6 gap-4 mb-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder={isRTL ? 'بحث...' : 'Search...'} value={search} onChange={(e) => updateFilter('search', e.target.value)} className="pl-10" />
          </div>
          <Select value={type || 'all'} onValueChange={(v) => updateFilter('type', v === 'all' ? '' : v)}>
            <SelectTrigger><SelectValue placeholder={isRTL ? 'النوع' : 'Type'} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'الكل' : 'All Types'}</SelectItem>
              <SelectItem value="job_full_time">{isRTL ? 'دوام كامل' : 'Full-Time'}</SelectItem>
              <SelectItem value="contract">{isRTL ? 'عقد' : 'Contract'}</SelectItem>
              <SelectItem value="project">{isRTL ? 'مشروع' : 'Project'}</SelectItem>
              <SelectItem value="task">{isRTL ? 'مهمة' : 'Task'}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={country || 'all'} onValueChange={(v) => updateFilter('country', v === 'all' ? '' : v)}>
            <SelectTrigger><SelectValue placeholder={isRTL ? 'البلد' : 'Country'} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
              {countries.map(c => <SelectItem key={c} value={c}>{getCountryName(c, lang)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={location || 'all'} onValueChange={(v) => updateFilter('location', v === 'all' ? '' : v)}>
            <SelectTrigger><SelectValue placeholder={isRTL ? 'الموقع' : 'Location'} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
              <SelectItem value="remote">{isRTL ? 'عن بُعد' : 'Remote'}</SelectItem>
              <SelectItem value="onsite">{isRTL ? 'حضوري' : 'On-site'}</SelectItem>
              <SelectItem value="hybrid">{isRTL ? 'هجين' : 'Hybrid'}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => updateFilter('sort', v === 'newest' ? '' : v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{isRTL ? 'الأحدث' : 'Newest'}</SelectItem>
              <SelectItem value="budget_high">{isRTL ? 'الأعلى ميزانية' : 'Budget: High'}</SelectItem>
              <SelectItem value="urgency">{isRTL ? 'الأكثر إلحاحاً' : 'Most Urgent'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <div className="mb-6"><Button variant="outline" size="sm" onClick={() => setSearchParams({}, { replace: true })}><X className="w-4 h-4 mr-1" />{isRTL ? 'مسح' : 'Clear Filters'}</Button></div>
        )}

        {loading ? <LoadingSpinner className="py-20" size="lg" /> : opportunities.length === 0 ? (
          <EmptyState title={isRTL ? 'لا توجد فرص' : 'No opportunities found'} description={isRTL ? 'جرب تعديل الفلاتر' : 'Try adjusting filters'} icon={Briefcase} />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map(opp => <OpportunityCard key={opp.id} opportunity={opp} />)}
            </div>
            {visibleCount < opportunities.length && (
              <div className="mt-8 text-center"><Button variant="outline" onClick={() => setVisibleCount(p => p + 12)}><ChevronDown className="w-4 h-4 mr-2" />{isRTL ? 'المزيد' : 'Load More'}</Button></div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default OpportunitiesDirectory;
