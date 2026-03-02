import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Radio, Bell, Brain, Search, FileText, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MonitoringDashboard = () => {
  const { isRTL } = useLanguage();

  const features = [
    { icon: Radio, title: isRTL ? 'البث المباشر' : 'Live Stream', desc: isRTL ? 'تابع الأخبار في الوقت الفعلي' : 'Real-time news feed with AI signals', link: '/monitoring/stream' },
    { icon: Brain, title: isRTL ? 'ذكاء الأخبار' : 'News Intelligence', desc: isRTL ? 'تحليل وتصنيف التغريدات' : 'AI-powered tweet classification', link: '/monitoring/intelligence' },
    { icon: Bell, title: isRTL ? 'التنبيهات والملخصات' : 'Alerts & Digests', desc: isRTL ? 'إدارة التنبيهات' : 'Manage alerts and digests', link: '/monitoring/alerts' },
    { icon: Search, title: isRTL ? 'بحث الأرشيف' : 'Archive Search', desc: isRTL ? 'البحث في المنشورات المؤرشفة' : 'Search archived posts', link: '/monitoring/archive' },
    { icon: FileText, title: isRTL ? 'استوديو المقالات' : 'Article Studio', desc: isRTL ? 'إنشاء تقارير ذكاء' : 'Generate intelligence reports', link: '/monitoring/articles' },
    { icon: Newspaper, title: isRTL ? 'تحليل البيانات الصحفية' : 'Press Release Analyzer', desc: isRTL ? 'تحليل بالذكاء الاصطناعي' : 'AI-powered press release analysis', link: '/press-release-analyzer' },
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{isRTL ? 'الذكاء الاجتماعي' : 'Social Intelligence'}</h1>
          <p className="text-muted-foreground mt-1">{isRTL ? 'رصد وتحليل منصات التواصل الاجتماعي' : 'Monitor X/Twitter accounts, keywords, and trends'}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Link key={i} to={f.link} className="block group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MonitoringDashboard;
