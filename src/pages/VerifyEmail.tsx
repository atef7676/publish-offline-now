import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) { setStatus('error'); return; }
    supabase.functions.invoke('verify-email', { body: { token } })
      .then(({ data, error }) => {
        if (error || !data?.success) setStatus('error');
        else setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <Layout>
      <div className="container max-w-md mx-auto py-16">
        <Card>
          <CardHeader className="text-center">
            {status === 'verifying' && <><Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-4" /><CardTitle>Verifying...</CardTitle><CardDescription>Please wait.</CardDescription></>}
            {status === 'success' && <><CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" /><CardTitle className="text-green-700">Email Verified!</CardTitle><CardDescription>Your email has been verified successfully.</CardDescription></>}
            {status === 'error' && <><XCircle className="w-12 h-12 mx-auto text-destructive mb-4" /><CardTitle className="text-destructive">Verification Failed</CardTitle><CardDescription>This link may have expired.</CardDescription></>}
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {status === 'success' && <Button onClick={() => navigate('/dashboard')} className="w-full">Go to Dashboard</Button>}
            {status === 'error' && <Button variant="outline" onClick={() => navigate('/')} className="w-full">Go Home</Button>}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
