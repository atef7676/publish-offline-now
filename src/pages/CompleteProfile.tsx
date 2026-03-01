import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Newspaper, GraduationCap, Building2, ArrowLeft, ArrowRight } from 'lucide-react';

const PROFILE_TYPES = [
  { value: 'journalist', label: 'Journalist', label_ar: 'صحفي', icon: Newspaper, description: 'Media professional, reporter, or editor', description_ar: 'مهني إعلامي أو مراسل أو محرر' },
  { value: 'expert', label: 'Expert', label_ar: 'خبير', icon: GraduationCap, description: 'Industry expert or thought leader', description_ar: 'خبير في الصناعة أو قائد فكري' },
  { value: 'company', label: 'Company', label_ar: 'شركة', icon: Building2, description: 'Media company or organization', description_ar: 'شركة أو مؤسسة إعلامية' },
];

const CompleteProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');

  useEffect(() => { if (!authLoading && !user) navigate('/register'); }, [user, authLoading, navigate]);

  if (authLoading) return <Layout><LoadingSpinner className="py-32" size="lg" /></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold mb-2">{t('completeProfile')}</h1>
          <p className="text-muted-foreground">{isRTL ? 'اختر نوع الملف الشخصي' : 'Choose your profile type'}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? 'اختر نوع الملف الشخصي' : 'Choose Profile Type'}</CardTitle>
            <CardDescription>{isRTL ? 'اختر النوع الذي يصف دورك بشكل أفضل' : 'Select the type that best describes your role'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {PROFILE_TYPES.map(type => {
              const Icon = type.icon;
              return (
                <button key={type.value} type="button" onClick={() => setSelectedType(type.value)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${selectedType === type.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'} ${isRTL ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`p-2 rounded-lg ${selectedType === type.value ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}><Icon className="w-5 h-5" /></div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{isRTL ? type.label_ar : type.label}</h3>
                      <p className="text-sm text-muted-foreground">{isRTL ? type.description_ar : type.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
            <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button onClick={() => navigate('/me/listings')} disabled={!selectedType} className="flex-1">
                {isRTL ? <><ArrowLeft className="w-4 h-4 ml-2" />متابعة</> : <>Continue<ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CompleteProfile;
