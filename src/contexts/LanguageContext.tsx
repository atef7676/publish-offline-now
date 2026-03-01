import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations: Record<string, Record<string, string>> = {
  en: {
    home: 'Home', journalists: 'Journalists', experts: 'Experts', companies: 'Companies',
    publications: 'Publications', pricing: 'Pricing', login: 'Login', register: 'Register',
    logout: 'Logout', myListings: 'My Listings', settings: 'Settings', adminPanel: 'Admin Panel',
    dashboard: 'Dashboard', inbox: 'Inbox', wallet: 'Wallet',
    heroTitle: 'Professional Intelligence & Discovery Platform',
    heroSubtitle: 'PublishMe is your trusted directory for journalists, experts, companies, and publications in the media industry.',
    browseJournalists: 'Browse Journalists', browseExperts: 'Browse Experts',
    browseCompanies: 'Browse Companies', browsePublications: 'Browse Publications',
    search: 'Search', searchPlaceholder: 'Search by name...',
    searchByName: 'Search by name, headline, outlet...',
    searchExperts: 'Search experts...', searchCompanies: 'Search companies...',
    searchPublications: 'Search publications...',
    country: 'Country', allCountries: 'All Countries', city: 'City', allCities: 'All Cities',
    sector: 'Sector', allSectors: 'All Sectors', language: 'Language', allLanguages: 'All Languages',
    filter: 'Filter', noResults: 'No results found',
    noResultsDescription: 'Try adjusting your search or filters',
    loading: 'Loading...', back: 'Back', submit: 'Submit', cancel: 'Cancel', save: 'Save',
    edit: 'Edit', delete: 'Delete', view: 'View',
    featuresJournalistsDesc: 'Reporters, editors, correspondents from leading publications.',
    featuresExpertsDesc: 'Analysts, consultants, and industry specialists.',
    featuresCompaniesDesc: 'Media companies, agencies, and organizations.',
    featuresPublicationsDesc: 'News outlets, magazines, and media platforms.',
    verifiedProfiles: 'Verified Profiles',
    verifiedProfilesDesc: 'All listings are reviewed and verified. Claim your profile or submit a new listing to join our trusted network.',
    readyToGetListed: 'Ready to Get Listed?',
    ctaSubtitle: 'Create your profile and join our network of media professionals.',
    createListing: 'Create Listing',
    favorites: 'Favorites', searchEverything: 'Search everything...',
    activityLog: 'Activity Log', auditLogs: 'Audit Logs',
    exportContacts: 'Export Contacts', portfolio: 'Portfolio',
  },
  ar: {
    home: 'الرئيسية', journalists: 'الصحفيون', experts: 'الخبراء', companies: 'الشركات',
    publications: 'المنشورات', pricing: 'الأسعار', login: 'تسجيل الدخول', register: 'التسجيل',
    logout: 'تسجيل الخروج', myListings: 'قوائمي', settings: 'الإعدادات', adminPanel: 'لوحة الإدارة',
    dashboard: 'لوحة التحكم', inbox: 'صندوق الوارد', wallet: 'المحفظة',
    heroTitle: 'منصة مهنية للاستكشاف والتحليل',
    heroSubtitle: 'PublishMe هو دليلك الموثوق للصحفيين والخبراء والشركات والمنشورات في صناعة الإعلام.',
    browseJournalists: 'تصفح الصحفيين', browseExperts: 'تصفح الخبراء',
    browseCompanies: 'تصفح الشركات', browsePublications: 'تصفح المنشورات',
    search: 'بحث', searchPlaceholder: 'البحث بالاسم...',
    searchByName: 'البحث بالاسم أو العنوان أو المؤسسة...',
    loading: 'جارٍ التحميل...', noResults: 'لا توجد نتائج',
    featuresJournalistsDesc: 'مراسلون ومحررون ومراسلون من المنشورات الرائدة.',
    featuresExpertsDesc: 'محللون ومستشارون ومتخصصون في الصناعة.',
    featuresCompaniesDesc: 'شركات إعلامية ووكالات ومؤسسات.',
    featuresPublicationsDesc: 'منافذ إخبارية ومجلات ومنصات إعلامية.',
    verifiedProfiles: 'ملفات شخصية موثقة',
    verifiedProfilesDesc: 'تتم مراجعة جميع القوائم والتحقق منها.',
    readyToGetListed: 'هل أنت مستعد للإدراج؟',
    ctaSubtitle: 'أنشئ ملفك الشخصي وانضم إلى شبكتنا من المهنيين الإعلاميين.',
    createListing: 'إنشاء قائمة',
    favorites: 'المفضلة', searchEverything: 'ابحث في كل شيء...',
  }
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('sahfy_language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('sahfy_language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string, fallback?: string) => {
    return translations[language]?.[key] || translations.en[key] || fallback || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};