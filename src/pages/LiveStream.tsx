import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Radio, Construction } from 'lucide-react';

const LiveStream = () => {
  const { isRTL } = useLanguage();
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 mb-2">
          <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" /></span>
          {isRTL ? 'البث المباشر' : 'Live Stream'}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">{isRTL ? 'أخبار عاجلة في الوقت الفعلي' : 'Real-time news feed with AI-powered signals'}</p>
        <Card><CardContent className="py-16 text-center"><Construction className="w-16 h-16 mx-auto text-muted-foreground mb-4" /><h2 className="text-xl font-semibold mb-2">{isRTL ? 'قيد التطوير' : 'Coming Soon'}</h2><p className="text-muted-foreground">{isRTL ? 'البث المباشر يحتاج لربط البيانات' : 'Live stream requires real-time monitoring pipeline.'}</p></CardContent></Card>
      </div>
    </Layout>
  );
};

export default LiveStream;
