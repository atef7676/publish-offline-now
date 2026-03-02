import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, FileText, Users, Building2, Mail, Copy, Check, Loader2, AlertCircle, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const PressReleaseAnalyzer = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAr = language === 'ar';
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!user) { navigate('/login'); return; }
    if (content.trim().length < 20) { toast.error('Content too short'); return; }
    setLoading(true); setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-press-release', { body: { content, language } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
      toast.success('Analysis Complete');
    } catch (err: any) { toast.error(err.message || 'Analysis failed'); }
    finally { setLoading(false); }
  };

  const copy = (text: string, idx: string) => { navigator.clipboard.writeText(text); setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000); toast.success('Copied'); };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"><Sparkles className="w-4 h-4" />AI-Powered</div>
          <h1 className="text-3xl md:text-4xl font-bold">{isAr ? 'محلل البيانات الصحفية' : 'Press Release Analyzer'}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{isAr ? 'الصق معلوماتك وسيقوم الذكاء الاصطناعي بالتحليل' : 'Paste your info and AI will extract topics, write a release, and suggest matching contacts'}</p>
        </div>

        <Card className="border-2 border-dashed border-muted-foreground/20">
          <CardContent className="pt-6 space-y-4">
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={isAr ? 'الصق معلوماتك هنا...' : 'Paste your information here...'} className="min-h-[200px] text-base resize-y" maxLength={10000} />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{content.length}/10,000</span>
              <Button onClick={handleAnalyze} disabled={loading || content.trim().length < 20} size="lg" className="gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />{isAr ? 'جاري التحليل...' : 'Analyzing...'}</> : <><Sparkles className="w-4 h-4" />{isAr ? 'تحليل' : 'Analyze & Generate'}</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" />Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4"><p>{result.summary}</p><div className="flex flex-wrap gap-2">{result.topics?.map((t: string, i: number) => <Badge key={i} variant="secondary">{t}</Badge>)}</div></CardContent>
            </Card>

            <Tabs defaultValue="press_release" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="press_release"><FileText className="w-3.5 h-3.5 mr-1 hidden sm:inline" />Release</TabsTrigger>
                <TabsTrigger value="journalists"><Users className="w-3.5 h-3.5 mr-1 hidden sm:inline" />Journalists</TabsTrigger>
                <TabsTrigger value="publications"><Building2 className="w-3.5 h-3.5 mr-1 hidden sm:inline" />Publications</TabsTrigger>
                <TabsTrigger value="outreach"><Mail className="w-3.5 h-3.5 mr-1 hidden sm:inline" />Outreach</TabsTrigger>
              </TabsList>
              <TabsContent value="press_release">
                <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Press Release</CardTitle><Button variant="outline" size="sm" onClick={() => copy(result.press_release, 'pr')} className="gap-1">{copiedIdx === 'pr' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copiedIdx === 'pr' ? 'Copied' : 'Copy'}</Button></CardHeader>
                  <CardContent><div className="whitespace-pre-wrap bg-muted/30 rounded-lg p-6 text-sm">{result.press_release}</div></CardContent></Card>
              </TabsContent>
              <TabsContent value="journalists"><div className="space-y-3">{result.matched_journalists?.length ? result.matched_journalists.map((j: any, i: number) => (
                <Card key={i}><CardContent className="flex items-center justify-between py-4"><div><span className="font-semibold">{j.name}</span><Badge variant="outline" className="ml-2 text-xs"><Star className="w-3 h-3 mr-1" />{j.match_score}%</Badge><p className="text-sm text-muted-foreground">{j.relevance_reason}</p></div><Link to={`/journalists/${j.slug}`}><Button variant="ghost" size="sm"><ArrowRight className="w-3.5 h-3.5" /></Button></Link></CardContent></Card>
              )) : <Card><CardContent className="py-8 text-center text-muted-foreground"><AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />No matches</CardContent></Card>}</div></TabsContent>
              <TabsContent value="publications"><div className="space-y-3">{result.matched_publications?.length ? result.matched_publications.map((p: any, i: number) => (
                <Card key={i}><CardContent className="flex items-center justify-between py-4"><div><span className="font-semibold">{p.name}</span><Badge variant="outline" className="ml-2 text-xs"><Star className="w-3 h-3 mr-1" />{p.match_score}%</Badge><p className="text-sm text-muted-foreground">{p.relevance_reason}</p></div><Link to={`/publications/${p.slug}`}><Button variant="ghost" size="sm"><ArrowRight className="w-3.5 h-3.5" /></Button></Link></CardContent></Card>
              )) : <Card><CardContent className="py-8 text-center text-muted-foreground">No matches</CardContent></Card>}</div></TabsContent>
              <TabsContent value="outreach"><div className="space-y-4">{result.outreach_templates?.map((tpl: any, i: number) => (
                <Card key={i}><CardHeader className="flex flex-row items-center justify-between pb-2"><div><CardTitle className="text-base">{tpl.subject}</CardTitle><CardDescription className="capitalize">{tpl.tone} tone</CardDescription></div><Button variant="outline" size="sm" onClick={() => copy(`Subject: ${tpl.subject}\n\n${tpl.body}`, `tpl-${i}`)} className="gap-1">{copiedIdx === `tpl-${i}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}</Button></CardHeader><CardContent><div className="whitespace-pre-wrap text-sm bg-muted/30 rounded-lg p-4">{tpl.body}</div></CardContent></Card>
              ))}</div></TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PressReleaseAnalyzer;
