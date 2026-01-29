import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Music, Calendar, ShoppingBag, Camera, User, Mail } from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';
import { cn } from '@/app/components/ui/utils';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: null },
    { label: 'Music', path: '/music', icon: Music },
    { label: 'Events', path: '/events', icon: Calendar },
    { label: 'Merch', path: '/merch', icon: ShoppingBag },
    { label: 'Media', path: '/media', icon: Camera },
    { label: 'About', path: '/about', icon: User },
    { label: 'Contact', path: '/contact', icon: Mail }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 hover:bg-surface rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-[280px] bg-background border-l border-border z-50',
          'transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="text-2xl font-heading">MENU</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-surface rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive ? 'bg-accent text-black' : 'hover:bg-surface text-foreground'
                  )}
                >
                  {Icon && <Icon size={20} />}
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-border space-y-2">
            <Button variant="primary" size="sm" className="w-full">
              Buy Tickets
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              Listen Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
