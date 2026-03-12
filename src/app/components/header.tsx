import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/app/components/ui/utils';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import logo from '@/assets/partiesbythepm-logo.png';
import { generalSettings } from '@/data/settings';
import { Sheet, SheetContent, SheetTrigger } from '@/app/components/ui/sheet';

export function Header() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'PM the DJ', path: '/pm-the-dj' },
    { label: 'PM the Artist', path: '/music' },
    { label: 'Events', path: '/events' },
    { label: 'Merch', path: '/merch' },
    { label: 'Media', path: '/media' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'min-h-[44px] px-3 py-2 rounded-lg transition-colors font-medium whitespace-nowrap text-xs sm:text-sm flex items-center',
              isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled ? 'bg-background/95 backdrop-blur-lg border-b border-border' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-3 lg:gap-6 lg:py-0 lg:min-h-[4rem]">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt={generalSettings.artistName} 
              className="h-10 sm:h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-1 sm:gap-2">
            <NavLinks />
          </nav>

          {/* Mobile Hamburger + Drawer */}
          <div className="flex-1 lg:hidden flex justify-end">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-foreground hover:bg-surface transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-12">
                <nav className="flex flex-col gap-1">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
