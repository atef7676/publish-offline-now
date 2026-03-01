import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useCoins = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    if (!user) { setBalance(0); setLoading(false); return; }
    try {
      const { data } = await supabase.from('wallets' as any).select('balance').eq('user_id', user.id).maybeSingle();
      setBalance((data as any)?.balance || 0);
    } catch { setBalance(0); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchBalance(); }, [fetchBalance]);

  return { balance, loading, refresh: fetchBalance };
};

export default useCoins;
