import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Music } from 'lucide-react';
import logoWhite from '@/assets/90895916a69a9114996bd02b90cd9a69f7af6594.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Music, href: '#', label: 'Spotify' },
    { icon: Music, href: '#', label: 'Apple Music' }
  ];

  const quickLinks = [
    { label: 'Music', path: '/music' },
    { label: 'Events', path: '/events' },
    { label: 'Merch', path: '/merch' },
    { label: 'Media', path: '/media' }
  ];

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <img 
              src={logoWhite} 
              alt="The PM" 
              className="h-16 w-auto mb-4"
            />
            <p className="text-muted-foreground">
              UK-based rapper, DJ & event organiser bringing underground sounds to the masses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xl mb-4">QUICK LINKS</h4>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="font-heading text-xl mb-4">CONNECT</h4>
            <div className="flex gap-4 mb-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-background border border-border rounded-lg hover:border-accent hover:text-accent transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
            <p className="text-muted-foreground text-sm">
              Bookings:{' '}
              <a href="mailto:bookings@thepm.uk" className="text-accent hover:underline">
                bookings@thepm.uk
              </a>
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} The PM. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
