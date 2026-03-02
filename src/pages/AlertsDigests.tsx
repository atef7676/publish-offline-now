import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Construction } from 'lucide-react';

const AlertsDigests = () => {
  const { isRTL } = useLanguage();
  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-6 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2"><Bell className="h-7 w-7 text-primary" />{isRTL ? 'التنبيهات والملخصات' : 'Alerts & Digests'}</h1>
        <Card><CardContent className="py-16 text-center"><Construction className="w-16 h-16 mx-auto text-muted-foreground mb-4" /><h2 className="text-xl font-semibold mb-2">{isRTL ? 'قيد التطوير' : 'Coming Soon'}</h2><p className="text-muted-foreground">{isRTL ? 'هذه الميزة قيد التطوير' : 'Alert rules and digest generation will be available here.'}</p></CardContent></Card>
      </div>
    </Layout>
  );
};

export default AlertsDigests;
