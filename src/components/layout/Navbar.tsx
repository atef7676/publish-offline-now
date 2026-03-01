import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/ui/LanguageToggle';
import CoinBalance from '@/components/ui/CoinBalance';
import GlobalSearch from '@/components/search/GlobalSearch';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, LogOut, Settings, FileText, Shield, Wallet, MessageSquare, Heart, Briefcase } from 'lucide-react';
import usePermissions, { PERMISSIONS } from '@/hooks/usePermissions';

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const { t, isRTL } = useLanguage();
  const { can, canReview, canImportExport } = usePermissions();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/journalists', label: t('journalists') },
    { href: '/experts', label: t('experts') },
    { href: '/companies', label: t('companies') },
    { href: '/publications', label: t('publications') },
    { href: '/opportunities', label: isRTL ? 'الفرص' : 'Opportunities' },
    { href: '/pricing', label: t('pricing') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">P</span>
            </div>
            <span className="font-display text-xl font-semibold text-foreground">PublishMe</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}>{link.label}</Link>
            ))}
          </div>

          <div className="hidden md:block w-64"><GlobalSearch /></div>

          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            <CoinBalance />
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">{user.email?.charAt(0).toUpperCase()}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild><Link to="/me/listings" className="flex items-center gap-2"><FileText className="w-4 h-4" />{t('myListings')}</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/inbox" className="flex items-center gap-2"><MessageSquare className="w-4 h-4" />{t('inbox')}</Link></DropdownMenuItem>
                  {can(PERMISSIONS.CAN_ACCESS_WALLET) && (
                    <DropdownMenuItem asChild><Link to="/me/wallet" className="flex items-center gap-2"><Wallet className="w-4 h-4" />{t('wallet')}</Link></DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild><Link to="/me/favorites" className="flex items-center gap-2"><Heart className="w-4 h-4" />{t('favorites')}</Link></DropdownMenuItem>
                  {canReview && (
                    <DropdownMenuItem asChild><Link to="/admin/review" className="flex items-center gap-2"><Shield className="w-4 h-4" />{t('adminPanel')}</Link></DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/settings" className="flex items-center gap-2"><Settings className="w-4 h-4" />{t('settings')}</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive">
                    <LogOut className="w-4 h-4" />{t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild><Link to="/login">{t('login')}</Link></Button>
                <Button asChild><Link to="/register">{t('register')}</Link></Button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle />
            <button className="p-2 rounded-md hover:bg-muted" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.href) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}>{link.label}</Link>
              ))}
              <div className="pt-4 border-t border-border mt-2">
                {user ? (
                  <Button variant="ghost" className="w-full justify-start text-destructive"
                    onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}>
                    <LogOut className="w-4 h-4 mr-2" />{t('logout')}
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" asChild className="w-full"><Link to="/login" onClick={() => setMobileMenuOpen(false)}>{t('login')}</Link></Button>
                    <Button asChild className="w-full"><Link to="/register" onClick={() => setMobileMenuOpen(false)}>{t('register')}</Link></Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;