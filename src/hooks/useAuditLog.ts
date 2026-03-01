import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuditLog = () => {
  const lastLogTime = useRef<Record<string, number>>({});

  const shouldThrottle = useCallback((action: string) => {
    const now = Date.now();
    if (now - (lastLogTime.current[action] || 0) < 1000) return true;
    lastLogTime.current[action] = now;
    return false;
  }, []);

  const logEvent = useCallback(async (action: string, options: any = {}) => {
    try {
      if (!options.skipThrottle && shouldThrottle(action)) return;
      await supabase.rpc('log_event' as any, {
        p_action: action,
        p_target_type: options.targetType || null,
        p_target_id: options.targetId || null,
        p_result: options.result || 'success',
        p_reason: options.reason || null,
        p_metadata: options.metadata || {},
        p_severity: options.severity || 'info'
      });
    } catch { /* silent */ }
  }, [shouldThrottle]);

  const logDirectoryView = useCallback((type: string, filters: any = {}) =>
    logEvent('directory.view', { targetType: type, metadata: { filters } }), [logEvent]);
  const logProfileView = useCallback((type: string, id: string) =>
    logEvent('profile.view', { targetType: type, targetId: id }), [logEvent]);
  const logMessageSend = useCallback((id: string, result: string, reason?: string) =>
    logEvent('message.send', { targetType: 'profile', targetId: id, result, reason, skipThrottle: true }), [logEvent]);

  return { logEvent, logDirectoryView, logProfileView, logMessageSend };
};

export default useAuditLog;
