import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { MapPin } from 'lucide-react';

const Sitemap = () => {
  const { t } = useLanguage();
  const pages = [
    { path: '/', label: t('home') }, { path: '/journalists', label: t('journalists') },
    { path: '/experts', label: t('experts') }, { path: '/companies', label: t('companies') },
    { path: '/publications', label: t('publications') }, { path: '/pricing', label: t('pricing') },
    { path: '/register', label: t('register') }, { path: '/login', label: t('login') },
  ];
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8"><MapPin className="w-8 h-8 text-primary" /><h1 className="font-display text-3xl md:text-4xl font-bold">{t('sitemap', 'Sitemap')}</h1></div>
        <ul className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
          {pages.map(p => <li key={p.path}><Link to={p.path} className="text-primary hover:underline text-sm">{p.label}</Link></li>)}
        </ul>
      </div>
    </Layout>
  );
};

export default Sitemap;