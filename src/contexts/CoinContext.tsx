import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface CoinContextType {
  balance: number;
  loading: boolean;
  refresh: () => Promise<void>;
}

const CoinContext = createContext<CoinContextType>({} as CoinContextType);

export const useCoinBalance = () => {
  const context = useContext(CoinContext);
  if (!context) {
    throw new Error('useCoinBalance must be used within a CoinProvider');
  }
  return context;
};

export const CoinProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    if (!user) {
      setBalance(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_coins')
        .select('balance')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setBalance((data as any)?.balance || 0);
    } catch (error) {
      console.error('Error fetching coin balance:', error);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const refresh = useCallback(() => {
    return fetchBalance();
  }, [fetchBalance]);

  return (
    <CoinContext.Provider value={{ balance, loading, refresh }}>
      {children}
    </CoinContext.Provider>
  );
};