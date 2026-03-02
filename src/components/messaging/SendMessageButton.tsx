import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MessageSquare, Send, Coins, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';
import { useCoins } from '@/hooks/useCoins';

interface SendMessageButtonProps {
  profileId: string;
  profileName: string;
  ownerId?: string | null;
  hasContactMethods?: boolean;
  className?: string;
}

const SendMessageButton = ({ profileId, profileName, ownerId, hasContactMethods = true, className = '' }: SendMessageButtonProps) => {
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const { balance, refresh: refreshCoins } = useCoins();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('other');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messageCost] = useState(2);
  const [existingRequest, setExistingRequest] = useState<any>(null);

  const isOwner = user?.id === ownerId;

  useEffect(() => {
    if (!user || !profileId) return;
    supabase
      .from('contact_requests')
      .select('id, status')
      .eq('sender_id', user.id)
      .eq('recipient_profile_id', profileId)
      .maybeSingle()
      .then(({ data }) => setExistingRequest(data));
  }, [user, profileId]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) { toast.error('Message is required'); return; }
    if (balance < messageCost) { toast.error('Insufficient coins'); return; }

    setSending(true);
    try {
      const { error } = await supabase.from('contact_requests').insert({
        sender_id: user!.id,
        recipient_profile_id: profileId,
        subject,
        message: trimmedMessage,
        coins_spent: messageCost,
      });
      if (error) throw error;
      await refreshCoins();
      setOpen(false);
      setMessage('');
      toast.success(isRTL ? 'تم إرسال الرسالة!' : 'Message sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!user) return (
    <Button asChild className={className}>
      <Link to="/login"><MessageSquare className="w-4 h-4 mr-2" />{isRTL ? 'سجل دخول' : 'Login to Message'}</Link>
    </Button>
  );

  if (isOwner) return null;
  if (!ownerId) return (
    <Button disabled className={`${className} opacity-50`}>
      <AlertCircle className="w-4 h-4 mr-2" />{isRTL ? 'الرسائل غير متاحة' : 'Messaging unavailable'}
    </Button>
  );

  if (existingRequest) return (
    <Button variant="outline" asChild className={className}>
      <Link to="/inbox"><MessageSquare className="w-4 h-4 mr-2" />{existingRequest.status === 'pending' ? (isRTL ? 'قيد الانتظار' : 'Pending') : (isRTL ? 'البريد' : 'Inbox')}</Link>
    </Button>
  );

  return (
    <>
      <Button onClick={() => setOpen(true)} className={className}>
        <MessageSquare className="w-4 h-4 mr-2" />
        {isRTL ? 'إرسال رسالة' : 'Send Message'}
        <span className="flex items-center gap-1 text-xs opacity-80 ml-2"><Coins className="w-3 h-3" />{messageCost}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isRTL ? 'إرسال رسالة' : 'Send Message'} - {profileName}</DialogTitle>
            <DialogDescription>{messageCost} coins • Balance: {balance}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>{isRTL ? 'الموضوع' : 'Subject'}</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="pr">PR / Media</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="hiring">Hiring</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{isRTL ? 'الرسالة' : 'Message'}</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} maxLength={500} dir={isRTL ? 'rtl' : 'ltr'} />
            </div>
            {balance < messageCost && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Insufficient coins. <Link to="/pricing" className="underline font-medium">Get more</Link>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
              <Button onClick={handleSend} disabled={sending || balance < messageCost} className="gap-2">
                {sending ? <LoadingSpinner size="sm" /> : <Send className="w-4 h-4" />}
                {isRTL ? 'إرسال' : 'Submit'} ({messageCost})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SendMessageButton;
