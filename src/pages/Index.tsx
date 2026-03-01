import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePublicStats } from '@/hooks/usePublicStats';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { ArrowRight, ArrowLeft, Users, Building2, Shield, BookOpen, Briefcase, Sparkles } from 'lucide-react';

const Index = () => {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const { stats, loading: statsLoading } = usePublicStats();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const directories = [
    { key: 'journalists', path: '/journalists', icon: Users, label: t('journalists'), desc: t('featuresJournalistsDesc'), count: stats.journalists_count },
    { key: 'experts', path: '/experts', icon: Briefcase, label: t('experts'), desc: t('featuresExpertsDesc'), count: stats.experts_count },
    { key: 'companies', path: '/companies', icon: Building2, label: t('companies'), desc: t('featuresCompaniesDesc'), count: stats.companies_count },
    { key: 'publications', path: '/publications', icon: BookOpen, label: t('publications'), desc: t('featuresPublicationsDesc'), count: stats.publications_count },
  ];

  return (
    <Layout>
      <section className="relative overflow-hidden gradient-hero py-28 lg:py-36">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/30 text-white text-sm font-medium mb-6 animate-fade-in backdrop-blur-sm border border-white/20">
              <Sparkles className="w-4 h-4" />
              {isRTL ? 'دليل الإعلام العربي الأول' : 'The Arab Media Directory'}
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in leading-tight">{t('heroTitle')}</h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 animate-slide-up font-body" style={{ animationDelay: '0.1s' }}>{t('heroSubtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button size="lg" asChild className="text-base px-8 shadow-gold">
                <Link to={user ? '/me/listings' : '/register'}>{user ? t('createListing') : t('register')} <ArrowIcon className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 border-white/50 text-white hover:bg-white/10">
                <Link to="/journalists">{isRTL ? 'تصفح الدليل' : 'Browse Directory'}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">{isRTL ? 'استكشف الدليل' : 'Explore the Directory'}</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">{isRTL ? 'ابحث في أكبر قاعدة بيانات للإعلاميين العرب' : 'Search the largest database of Arab media professionals'}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {directories.map(({ key, path, icon: Icon, label, desc, count }, i) => (
              <Link key={key} to={path} className="group relative bg-card rounded-xl border border-border p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{label}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{desc}</p>
                  {!statsLoading && count > 0 && <div className="text-3xl font-bold text-primary"><AnimatedCounter value={count} /></div>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">{t('verifiedProfiles')}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{t('verifiedProfilesDesc')}</p>
        </div>
      </section>

      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{t('readyToGetListed')}</h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">{t('ctaSubtitle')}</p>
          <Button size="lg" asChild className="text-base px-10 shadow-gold">
            <Link to={user ? '/me/listings' : '/register'}>{user ? t('createListing') : t('register')} <ArrowIcon className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;