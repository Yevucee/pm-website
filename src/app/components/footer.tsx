import { Link } from 'react-router-dom';
import { Instagram, Youtube, Music } from 'lucide-react';
import logoWhite from '@/assets/90895916a69a9114996bd02b90cd9a69f7af6594.png';
import { generalSettings } from '@/data/settings';

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
    { icon: Instagram, href: generalSettings.instagram, label: 'Instagram' },
    { icon: TikTokIcon, href: generalSettings.tiktok, label: 'TikTok' },
    { icon: XIcon, href: generalSettings.twitter, label: 'X' },
    { icon: Youtube, href: generalSettings.youtube, label: 'YouTube' },
    { icon: Music, href: generalSettings.spotify, label: 'Spotify' },
    { icon: Music, href: generalSettings.appleMusic, label: 'Apple Music' }
  ].filter((item) => Boolean(item.href));

  const quickLinks = [
    { label: 'Events', path: '/events' },
    { label: 'PM the DJ', path: '/pm-the-dj' },
    { label: 'PM the Artist', path: '/music' },
    { label: 'Merch', path: '/merch' },
    { label: 'Media', path: '/media' },
    { label: 'Admin Login', path: '/admin', external: true }
  ];

  const adminUrl = `${import.meta.env.BASE_URL || '/'}admin/`;

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <img 
              src={logoWhite} 
              alt={generalSettings.artistName} 
              className="h-14 sm:h-16 w-auto mb-4 mx-auto md:mx-0"
            />
            <p className="text-muted-foreground">
              {generalSettings.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="font-heading text-xl mb-4">QUICK LINKS</h4>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.path}
                    href={adminUrl}
                    className="inline-flex min-h-[44px] items-center justify-center md:justify-start py-2 text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="inline-flex min-h-[44px] items-center justify-center md:justify-start py-2 text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>
          </div>

          {/* Social & Contact */}
          <div className="text-center md:text-left">
            <h4 className="font-heading text-xl mb-4">CONNECT</h4>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
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
              <a href={`mailto:${generalSettings.bookingEmail}`} className="text-accent hover:underline">
                {generalSettings.bookingEmail}
              </a>
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-muted-foreground text-sm">
            © {currentYear} The PM. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
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
