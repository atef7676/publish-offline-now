import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { toast } from 'sonner';
import { MessageSquare, Send, Check, X } from 'lucide-react';

const Inbox = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => { if (!authLoading && !user) navigate('/login'); }, [user, authLoading, navigate]);

  const fetchRequests = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: profiles } = await supabase.from('directory_profiles').select('profile_id').eq('owner_user_id', user.id);
      const profileIds = profiles?.map((p: any) => p.profile_id) || [];
      if (profileIds.length > 0) {
        const { data: received } = await supabase.from('contact_requests').select('*').in('recipient_profile_id', profileIds).order('created_at', { ascending: false });
        setReceivedRequests(received || []);
      }
      const { data: sent } = await supabase.from('contact_requests').select(`*, profile:directory_profiles!recipient_profile_id(display_name, profile_type)`).eq('sender_id', user.id).order('created_at', { ascending: false });
      setSentRequests(sent || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchMessages = async (requestId: string) => {
    const { data } = await supabase.from('messages').select('*').eq('contact_request_id', requestId).order('created_at', { ascending: true });
    setMessages(data || []);
  };

  useEffect(() => { if (user) fetchRequests(); }, [user]);
  useEffect(() => { if (selectedRequest) fetchMessages(selectedRequest.id); }, [selectedRequest]);

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from('contact_requests').update({ status: 'approved', responded_at: new Date().toISOString() }).eq('id', id);
    if (error) toast.error('Failed'); else { toast.success(t('requestApproved')); fetchRequests(); }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase.from('contact_requests').update({ status: 'rejected', responded_at: new Date().toISOString() }).eq('id', id);
    if (error) toast.error('Failed'); else { toast.success(t('requestRejected')); fetchRequests(); }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRequest) return;
    setSending(true);
    try {
      const { data, error } = await supabase.rpc('send_message_with_cost' as any, { p_contact_request_id: selectedRequest.id, p_content: newMessage.trim() });
      if (error) throw error;
      if ((data as any)?.ok) { toast.success(t('messageSent')); setNewMessage(''); fetchMessages(selectedRequest.id); }
      else { toast.error((data as any)?.reason || 'Failed'); }
    } catch (err: any) { toast.error(err.message || 'Failed'); }
    finally { setSending(false); }
  };

  if (authLoading || loading) return <Layout><LoadingSpinner className="py-32" size="lg" /></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <h1 className="font-display text-3xl font-bold mb-8">{t('inbox')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Tabs defaultValue="received">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="received" className="flex-1">{t('received')}</TabsTrigger>
                <TabsTrigger value="sent" className="flex-1">{t('sent')}</TabsTrigger>
              </TabsList>
              <TabsContent value="received">
                {receivedRequests.length === 0 ? <EmptyState title={t('noRequestsReceived')} icon={MessageSquare} /> : (
                  <div className="space-y-2">
                    {receivedRequests.map(req => (
                      <div key={req.id} onClick={() => setSelectedRequest(req)} className={`sahfy-card p-4 cursor-pointer hover:border-primary/50 transition-colors ${selectedRequest?.id === req.id ? 'border-primary' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm truncate">{req.subject}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${req.status === 'approved' ? 'bg-green-500/20 text-green-500' : req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>{req.status}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{req.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="sent">
                {sentRequests.length === 0 ? <EmptyState title={t('noRequestsSent')} icon={MessageSquare} /> : (
                  <div className="space-y-2">
                    {sentRequests.map(req => (
                      <div key={req.id} onClick={() => setSelectedRequest(req)} className={`sahfy-card p-4 cursor-pointer hover:border-primary/50 transition-colors ${selectedRequest?.id === req.id ? 'border-primary' : ''}`}>
                        <p className="font-medium text-sm truncate">{t('to')}: {req.profile?.display_name}</p>
                        <p className="text-xs text-muted-foreground">{req.subject}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-2">
            {selectedRequest ? (
              <div className="sahfy-card h-[600px] flex flex-col">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{selectedRequest.subject}</h3>
                      <p className="text-sm text-muted-foreground">{selectedRequest.status}</p>
                    </div>
                    {selectedRequest.status === 'pending' && receivedRequests.find(r => r.id === selectedRequest.id) && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(selectedRequest.id)}><Check className="w-4 h-4 mr-1" />{t('approve')}</Button>
                        <Button size="sm" variant="outline" onClick={() => handleReject(selectedRequest.id)}><X className="w-4 h-4 mr-1" />{t('reject')}</Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 border-b border-border bg-muted/20">
                  <p className="text-sm">{selectedRequest.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(selectedRequest.created_at).toLocaleString()}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-lg p-3 ${msg.sender_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.sender_id === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{new Date(msg.created_at).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedRequest.status === 'approved' && (
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <Textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder={t('typeYourMessage')} className="resize-none" rows={2} />
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim() || sending} className="self-end">
                        {sending ? <LoadingSpinner size="sm" /> : <Send className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="sahfy-card h-[600px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t('selectConversation')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Inbox;
