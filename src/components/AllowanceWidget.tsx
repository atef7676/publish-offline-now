import { useCoins } from '@/hooks/useCoins';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Coins } from 'lucide-react';

const AllowanceWidget = ({ className = '' }: { className?: string }) => {
  const { user } = useAuth();
  const { balance, loading } = useCoins();

  if (!user || loading) return null;

  return (
    <div className={`bg-muted/50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Coins className="w-4 h-4 text-secondary" />
        <span className="text-sm font-medium text-foreground">Coin Balance</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-foreground">{balance}</div>
        <span className="text-sm text-muted-foreground">coins</span>
      </div>
      {balance < 10 && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">Low balance.</p>
          <Link to="/pricing" className="text-sm font-medium text-primary hover:underline">Get More Coins →</Link>
        </div>
      )}
    </div>
  );
};

export default AllowanceWidget;
