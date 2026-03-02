import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Loader2, AtSign, Link2 } from 'lucide-react';

const REASON_MESSAGES: Record<string, string> = {
  too_short: 'Must be at least 3 characters',
  too_long: 'Must be 60 characters or less',
  invalid_characters: 'Only letters, numbers, hyphens, underscores',
  reserved: 'This name is reserved',
  taken: 'Already taken',
};

const REASON_MESSAGES_AR: Record<string, string> = {
  too_short: 'يجب أن يكون 3 أحرف على الأقل',
  too_long: 'يجب أن يكون 60 حرفاً أو أقل',
  invalid_characters: 'أحرف وأرقام وشرطات فقط',
  reserved: 'هذا الاسم محجوز',
  taken: 'مأخوذ بالفعل',
};

function useAvailabilityCheck(field: string, profileId?: string) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [reason, setReason] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastValueRef = useRef('');

  const check = useCallback((value: string) => {
    const normalized = (value || '').trim().toLowerCase();
    lastValueRef.current = normalized;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (!normalized || normalized.length < 3) {
      setStatus(normalized.length > 0 ? 'unavailable' : 'idle');
      setReason(normalized.length > 0 ? 'too_short' : '');
      return;
    }

    setStatus('checking');
    setReason('');

    timerRef.current = setTimeout(async () => {
      try {
        const { data, error } = await supabase.rpc('search_tags' as any, {
          p_identifier: normalized,
          p_field: field,
          p_exclude_profile_id: profileId || null,
        });
        if (lastValueRef.current !== normalized) return;
        if (error) throw error;
        const result = data as any;
        if (result?.available) {
          setStatus('available');
          setReason('');
        } else {
          setStatus('unavailable');
          setReason(result?.reason || 'taken');
        }
      } catch {
        if (lastValueRef.current === normalized) {
          setStatus('idle');
        }
      }
    }, 500);
  }, [field, profileId]);

  return { status, reason, check };
}

function StatusIndicator({ status, reason, isRTL }: { status: string, reason: string, isRTL: boolean }) {
  const messages = isRTL ? REASON_MESSAGES_AR : REASON_MESSAGES;
  if (status === 'checking') return <span className="flex items-center gap-1 text-xs text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin" /> {isRTL ? 'جارٍ التحقق...' : 'Checking...'}</span>;
  if (status === 'available') return <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle className="w-3 h-3" /> {isRTL ? 'متاح' : 'Available'}</span>;
  if (status === 'unavailable') return <span className="flex items-center gap-1 text-xs text-destructive"><XCircle className="w-3 h-3" /> {messages[reason] || (isRTL ? 'غير متاح' : 'Unavailable')}</span>;
  return null;
}

export default function ProfileIdentifierFields({ 
  slug, 
  username, 
  onSlugChange, 
  onUsernameChange, 
  profileId, 
  mode 
}: {
  slug: string,
  username: string,
  onSlugChange: (val: string) => void,
  onUsernameChange: (val: string) => void,
  profileId?: string,
  mode: string
}) {
  const { isRTL } = useLanguage();
  const slugCheck = useAvailabilityCheck('slug', profileId);
  const usernameCheck = useAvailabilityCheck('username', profileId);

  const showSlug = mode !== 'register';

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '').slice(0, 60);
    onSlugChange(val);
    slugCheck.check(val);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '').slice(0, 60);
    onUsernameChange(val);
    usernameCheck.check(val);
  };

  useEffect(() => {
    if (slug && showSlug) slugCheck.check(slug);
    if (username) usernameCheck.check(username);
  }, []);

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {showSlug && (
        <div>
          <Label className="flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5" />
            {isRTL ? 'رابط الملف الشخصي' : 'Profile URL'}
          </Label>
          <Input
            value={slug || ''}
            onChange={handleSlugChange}
            placeholder="my-profile-name"
            className="font-mono text-sm"
          />
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs text-muted-foreground truncate">
              /…/{slug || '...'}
            </span>
            <StatusIndicator status={slugCheck.status} reason={slugCheck.reason} isRTL={isRTL} />
          </div>
        </div>
      )}

      <div>
        <Label className="flex items-center gap-1.5">
          <AtSign className="w-3.5 h-3.5" />
          {isRTL ? 'اسم المستخدم' : 'Username'}
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
          <Input
            value={username || ''}
            onChange={handleUsernameChange}
            placeholder="username"
            className="pl-8 font-mono text-sm"
          />
        </div>
        <div className="mt-1 flex justify-end">
          <StatusIndicator status={usernameCheck.status} reason={usernameCheck.reason} isRTL={isRTL} />
        </div>
      </div>
    </div>
  );
}

export function isIdentifierValid(checkStatus: string) {
  return checkStatus === 'available' || checkStatus === 'idle';
}
