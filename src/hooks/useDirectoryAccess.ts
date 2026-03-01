import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';

const DEFAULT_CONFIG = { guest_load_limit: 3, batch_size: 6, guest_max_listings: 18, filtered_urls_require_subscription: true, seo_index_main_pages_only: true };

export const useDirectoryAccess = () => {
  const { user, loading: authLoading } = useAuth();
  const { isSubscriber, isAdmin, isSubAdmin, isGeneralSubAdmin, isContentSubAdmin, loading: roleLoading } = useUserRole();
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loadCount, setLoadCount] = useState(0);
  const [configLoading, setConfigLoading] = useState(true);

  const hasSubscription = !roleLoading && (isSubscriber || isAdmin || isSubAdmin || isGeneralSubAdmin || isContentSubAdmin);
  const isAuthenticated = !!user;
  const loading = authLoading || roleLoading || configLoading;
  const subscriptionLoading = authLoading || roleLoading;

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await supabase.from('platform_config' as any).select('value').eq('key', 'directory_access_policy').maybeSingle();
        if (data && typeof data === 'object' && 'value' in (data as any)) {
          setConfig({ ...DEFAULT_CONFIG, ...(data as any).value });
        }
      } catch { /* ignore */ }
      finally { setConfigLoading(false); }
    };
    fetchConfig();
  }, []);

  useEffect(() => { if (!roleLoading && hasSubscription) setLoadCount(0); }, [user?.id, hasSubscription, roleLoading]);

  const canAccessFilters = useCallback((hasActive: boolean) => {
    if (!hasActive || !config.filtered_urls_require_subscription || subscriptionLoading) return true;
    return isAuthenticated && hasSubscription;
  }, [config, isAuthenticated, hasSubscription, subscriptionLoading]);

  const canLoadMore = useCallback(() => {
    if (subscriptionLoading || hasSubscription) return true;
    return loadCount < config.guest_load_limit;
  }, [hasSubscription, loadCount, config, subscriptionLoading]);

  const trackLoad = useCallback((_type?: string) => {
    if (subscriptionLoading || hasSubscription) return;
    setLoadCount(c => c + 1);
  }, [hasSubscription, subscriptionLoading]);

  const shouldNoIndex = useCallback((hasActive: boolean) => config.seo_index_main_pages_only && hasActive, [config]);
  const shouldShowSubscriptionPrompt = useCallback(() => !subscriptionLoading && !hasSubscription && loadCount >= config.guest_load_limit, [hasSubscription, loadCount, config, subscriptionLoading]);
  const getRemainingLoads = useCallback(() => subscriptionLoading || hasSubscription ? Infinity : Math.max(0, config.guest_load_limit - loadCount), [hasSubscription, config, loadCount, subscriptionLoading]);

  return { loading, subscriptionLoading, isAuthenticated, hasSubscription, loadCount, config, canAccessFilters, canLoadMore, trackLoad, shouldNoIndex, shouldShowSubscriptionPrompt, getRemainingLoads };
};

export default useDirectoryAccess;
