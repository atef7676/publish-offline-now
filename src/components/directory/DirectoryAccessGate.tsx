import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, UserPlus, LogIn } from 'lucide-react';

export const FilterAccessGate = ({ onBack }: { onBack: () => void }) => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-display text-xl">{isRTL ? 'مطلوب اشتراك' : 'Subscription Required'}</CardTitle>
            <CardDescription>{isRTL ? 'البحث المتقدم والفلترة متاحة للمشتركين فقط' : 'Advanced search and filters are available to subscribers only'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" onClick={() => navigate('/register')}><UserPlus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{isRTL ? 'إنشاء حساب' : 'Create Account'}</Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/login')}><LogIn className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{isRTL ? 'تسجيل الدخول' : 'Sign In'}</Button>
            <Button variant="ghost" className="w-full" onClick={onBack}>{isRTL ? 'العودة للدليل' : 'Back to Directory'}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const LoadLimitPrompt = () => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  return (
    <Card className="mt-8">
      <CardContent className="py-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-lg font-semibold mb-2">{isRTL ? 'وصلت للحد الأقصى' : "You've reached the limit"}</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">{isRTL ? 'سجل الدخول أو اشترك للوصول غير المحدود لجميع الملفات الشخصية والفلاتر المتقدمة' : 'Sign in or subscribe for unlimited access to all profiles and advanced filters'}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate('/register')}><UserPlus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{isRTL ? 'إنشاء حساب مجاني' : 'Create Free Account'}</Button>
          <Button variant="outline" onClick={() => navigate('/login')}><LogIn className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{isRTL ? 'تسجيل الدخول' : 'Sign In'}</Button>
        </div>
      </CardContent>
    </Card>
  );
};
