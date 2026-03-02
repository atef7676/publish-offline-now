import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ContactExport = () => {
  const { isRTL } = useLanguage();
  return (
    <Button variant="outline" size="sm" asChild>
      <Link to="/admin/export"><Download className="w-4 h-4 mr-2" />{isRTL ? 'تصدير' : 'Export Contacts'}</Link>
    </Button>
  );
};

export default ContactExport;
