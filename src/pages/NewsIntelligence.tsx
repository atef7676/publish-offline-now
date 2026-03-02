import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Construction } from 'lucide-react';

const NewsIntelligence = () => {
  const { isRTL } = useLanguage();
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-4"><Brain className="w-8 h-8 text-primary" />{isRTL ? 'ذكاء الأخبار' : 'News Intelligence'}</h1>
        <p className="text-muted-foreground mb-8">{isRTL ? 'تحليل وتصنيف تلقائي' : 'AI-powered tweet classification & signal detection'}</p>
        <Card><CardContent className="py-16 text-center"><Construction className="w-16 h-16 mx-auto text-muted-foreground mb-4" /><h2 className="text-xl font-semibold mb-2">{isRTL ? 'قيد التطوير' : 'Coming Soon'}</h2><p className="text-muted-foreground">{isRTL ? 'هذه الميزة قيد التطوير' : 'This feature requires the monitoring hooks to be fully connected.'}</p></CardContent></Card>
      </div>
    </Layout>
  );
};

export default NewsIntelligence;
