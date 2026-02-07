import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Music, Calendar, ShoppingBag, Image, User, Mail } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/music', label: 'PM the Artist', icon: Music },
    { to: '/pm-events', label: 'PM Events', icon: Calendar },
    { to: '/merch', label: 'Merch', icon: ShoppingBag },
    { to: '/media', label: 'Media', icon: Image },
    { to: '/about', label: 'About', icon: User },
    { to: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background/95 backdrop-blur-lg border-b border-border shadow-lg'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <span
                className="text-2xl tracking-wider transition-all duration-300 group-hover:text-primary"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                DRAKE VORTEX
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'px-4 py-2 rounded-md transition-all duration-200',
                    'hover:bg-secondary hover:text-primary',
                    location.pathname === link.to
                      ? 'text-primary bg-secondary'
                      : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/95 backdrop-blur-lg md:hidden transition-all duration-300',
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
        style={{ top: '80px' }}
      >
        <div className="flex flex-col p-6 space-y-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200',
                  'hover:bg-secondary hover:text-primary',
                  location.pathname === link.to
                    ? 'text-primary bg-secondary'
                    : 'text-foreground'
                )}
              >
                {Icon && <Icon size={20} />}
                <span className="text-lg">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function MobileBottomBar() {
  const location = useLocation();

  // Only show on specific pages
  const showOnPages = ['/', '/pm-events', '/merch'];
  if (!showOnPages.includes(location.pathname)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border shadow-2xl">
      <div className="flex items-center justify-around p-4 gap-3">
        <Link
          to="/pm-events"
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 px-6 py-3 rounded-md text-center font-medium shadow-[0_0_15px_rgba(0,229,255,0.3)]"
        >
          Buy Tickets
        </Link>
        <a
          href="https://open.spotify.com/artist/drakevortex"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground transition-all duration-200 px-6 py-3 rounded-md text-center font-medium"
        >
          Listen
        </a>
      </div>
    </div>
  );
}
