import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageToggle = ({ className = '' }: { className?: string }) => {
  const { language, toggleLanguage, isRTL } = useLanguage();
  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage}
      className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} ${className}`}
      title={language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}>
      <Globe className="w-4 h-4" />
      <span className="font-medium">{language === 'en' ? 'عربي' : 'EN'}</span>
    </Button>
  );
};

export default LanguageToggle;