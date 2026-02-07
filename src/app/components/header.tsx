import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/app/components/ui/utils';
import { useEffect, useState } from 'react';
import logoWhite from '@/assets/90895916a69a9114996bd02b90cd9a69f7af6594.png';
import { generalSettings } from '@/data/settings';

export function Header() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Music', path: '/music' },
    { label: 'PM Events', path: '/pm-events' },
    { label: 'Merch', path: '/merch' },
    { label: 'Media', path: '/media' },
    { label: 'About', path: '/about' },
    { label: 'PM the DJ', path: '/pm-the-dj' },
    { label: 'PM the Artist', path: '/pm-the-artist' },
    { label: 'Contact', path: '/contact' }
  ];

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
              src={logoWhite} 
              alt={generalSettings.artistName} 
              className="h-10 sm:h-12 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="flex flex-1 items-center justify-center gap-1 sm:gap-2 overflow-x-auto lg:overflow-visible">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'min-h-[44px] px-3 py-2 rounded-lg transition-colors font-medium whitespace-nowrap text-xs sm:text-sm',
                    isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
