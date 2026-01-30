import { Link } from 'react-router-dom';
import { Instagram, Youtube, Music } from 'lucide-react';
import logoWhite from '@/assets/90895916a69a9114996bd02b90cd9a69f7af6594.png';

const XIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M18.244 2.25h3.308l-7.227 8.26 8.493 11.24h-6.64l-5.2-6.8-5.94 6.8H1.73l7.73-8.84L1.4 2.25h6.81l4.7 6.2 5.334-6.2z"
    />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M16.62 2c.33 2.13 1.98 3.8 4.11 4.12v3.07c-1.88.01-3.65-.61-5.11-1.67v6.14c0 3.46-2.8 6.27-6.25 6.27-3.45 0-6.25-2.8-6.25-6.27 0-3.46 2.8-6.27 6.25-6.27.33 0 .65.03.97.08v3.15a3.15 3.15 0 0 0-.97-.15 3.12 3.12 0 0 0-3.12 3.12 3.12 3.12 0 1 0 6.24 0V2h4.13z"
    />
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/_thepm_', label: 'Instagram' },
    { icon: TikTokIcon, href: 'https://www.tiktok.com/@_thepm_', label: 'TikTok' },
    { icon: XIcon, href: 'https://x.com/_thepm_', label: 'X' },
    { icon: Youtube, href: 'https://www.youtube.com/@thepm', label: 'YouTube' },
    { icon: Music, href: 'https://open.spotify.com/album/3Ym3xOwfN2rByjWBiLnNqu', label: 'Spotify' },
    { icon: Music, href: 'https://music.apple.com/us/album/the-passion-mixtape/1774418927', label: 'Apple Music' }
  ];

  const quickLinks = [
    { label: 'Music', path: '/music' },
    { label: 'Events', path: '/events' },
    { label: 'Merch', path: '/merch' },
    { label: 'Media', path: '/media' },
    { label: 'Admin Login', path: '/admin' }
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
              <a href="mailto:theonlypm@gmail.com" className="text-accent hover:underline">
                theonlypm@gmail.com
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
