import { useCoinBalance } from '@/contexts/CoinContext';
import { useAuth } from '@/contexts/AuthContext';
import usePermissions, { PERMISSIONS } from '@/hooks/usePermissions';
import { Coins } from 'lucide-react';

const CoinBalance = ({ className = '' }: { className?: string }) => {
  const { user } = useAuth();
  const { balance, loading } = useCoinBalance();
  const { can, loading: permLoading } = usePermissions();

  if (!user) return null;
  if (!permLoading && !can(PERMISSIONS.CAN_VIEW_COIN_BALANCE)) return null;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 bg-secondary/20 rounded-full ${className}`}>
      <Coins className="w-4 h-4 text-secondary" />
      <span className="text-sm font-medium">{loading ? '...' : balance}</span>
    </div>
  );
};

export default CoinBalance;