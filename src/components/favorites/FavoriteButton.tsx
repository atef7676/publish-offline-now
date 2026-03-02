import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  profileId: string;
  profileName?: string;
  ownerId?: string | null;
  variant?: 'icon' | 'button' | 'compact';
  className?: string;
  size?: 'default' | 'sm' | 'lg';
}

const FavoriteButton = ({ profileId, profileName, variant = 'icon', className = '', size = 'default' }: FavoriteButtonProps) => {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [isToggling, setIsToggling] = useState(false);

  const favorite = isFavorite(profileId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.info('Please login to save favorites'); navigate('/login'); return; }
    setIsToggling(true);
    const result = await toggleFavorite(profileId);
    setIsToggling(false);
    if (result.success) {
      toast.success(result.isFavorite ? 'Added to favorites' : 'Removed from favorites');
    }
  };

  if (variant === 'icon') {
    return (
      <button onClick={handleToggle} disabled={isToggling} className={cn("p-2 rounded-full transition-all hover:scale-110", favorite ? "text-red-500" : "text-muted-foreground hover:text-red-500", isToggling && "opacity-50", className)}>
        <Heart className={cn("w-5 h-5 transition-all", favorite && "fill-current")} />
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <Button variant="ghost" size="sm" onClick={handleToggle} disabled={isToggling} className={cn("gap-1.5", favorite && "text-red-500", className)}>
        <Heart className={cn("w-4 h-4", favorite && "fill-current")} />
      </Button>
    );
  }

  return (
    <Button variant={favorite ? "secondary" : "outline"} size={size} onClick={handleToggle} disabled={isToggling} className={cn("gap-2", favorite && "text-red-500 border-red-200", isRTL && "flex-row-reverse", className)}>
      <Heart className={cn("w-4 h-4", favorite && "fill-current")} />
      {favorite ? (isRTL ? 'محفوظ' : 'Saved') : (isRTL ? 'حفظ' : 'Save')}
    </Button>
  );
};

export default FavoriteButton;
