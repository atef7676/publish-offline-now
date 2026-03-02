import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Construction } from 'lucide-react';

const ArticleStudio = () => {
  const { isRTL } = useLanguage();
  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-6">
        <div><h1 className="text-3xl font-bold">{isRTL ? 'استوديو المقالات' : 'Article Studio'}</h1><p className="text-muted-foreground mt-1">{isRTL ? 'إنشاء تقارير ذكاء من البيانات الاجتماعية' : 'Generate intelligence reports from archived social data'}</p></div>
        <Card><CardContent className="py-16 text-center"><Construction className="w-16 h-16 mx-auto text-muted-foreground mb-4" /><h2 className="text-xl font-semibold mb-2">{isRTL ? 'قيد التطوير' : 'Coming Soon'}</h2><p className="text-muted-foreground">{isRTL ? 'هذه الميزة قيد التطوير' : 'Article generation requires monitoring data pipeline.'}</p></CardContent></Card>
      </div>
    </Layout>
  );
};

export default ArticleStudio;
