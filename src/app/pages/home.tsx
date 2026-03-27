import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/app/components/button';
import { ReleaseCard } from '@/app/components/release-card';
import { EventCard } from '@/app/components/event-card';
import { Ticket, Instagram } from 'lucide-react';
import { upcomingEvents } from '@/data/mock-data';
import { releases } from '@/data/releases';
import { MobileActionBar } from '@/app/components/mobile-action-bar';
import { getPageContent, resolvePublicAsset } from '@/data/pages';
import { generalSettings } from '@/data/settings';
import { AppleMusicIcon, SpotifyIcon, YouTubeIcon } from '@/app/components/streaming-icons';

function InstagramElfsightWidget({ widgetId }: { widgetId: string }) {
  useEffect(() => {
    if (document.querySelector('script[src*="elfsight"]')) return;
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-[400px]">
      <div
        className={`elfsight-app-${widgetId}`}
        data-elfsight-app-id={widgetId}
        data-elfsight-app-lazy
      />
    </div>
  );
}

interface HomePageContent {
  heroShow?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImage?: string;
  heroPrimaryCtaLabel?: string;
  heroPrimaryCtaUrl?: string;
  heroSecondaryCtaLabel?: string;
  heroSecondaryCtaUrl?: string;
  heroTertiaryCtaLabel?: string;
  heroTertiaryCtaUrl?: string;
  bioShow?: boolean;
  bioText?: string;
  bioButtonLabel?: string;
  bioButtonUrl?: string;
  latestReleaseShow?: boolean;
  latestReleaseHeading?: string;
  latestReleaseBadge?: string;
  eventsShow?: boolean;
  eventsHeading?: string;
  eventsLinkLabel?: string;
  eventsLinkUrl?: string;
  merchShow?: boolean;
  merchHeading?: string;
  merchLinkLabel?: string;
  merchLinkUrl?: string;
  instagramShow?: boolean;
  instagramHeading?: string;
  instagramWidgetId?: string;
  instagramEmbedUrl?: string;
  socialProofShow?: boolean;
  socialProofHeading?: string;
  socialProofLogos?: { name?: string; image?: string }[];
}

const instagramUsername = (generalSettings.instagram?.match(/instagram\.com\/([^/?]+)/) || [null, '_thepm_'])[1];

export function HomePage() {
  const home = getPageContent<HomePageContent>('home', {});
  const latestRelease = releases[0];
  const featuredEvents = upcomingEvents.slice(0, 3);
  const heroImageSrc = resolvePublicAsset(home.heroImage) || 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200';
  const isExternal = (url?: string) => Boolean(url && /^https?:\/\//i.test(url));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {home.heroShow !== false && (
      <section className="relative min-h-[75vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Artist Background */}
        <div className="absolute inset-0">
          <img
            src={heroImageSrc}
            alt={home.heroTitle || 'The PM'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-8xl mb-4 text-white drop-shadow-2xl leading-tight">
              {home.heroTitle || 'THE PRHYME MINISTER (PM)'}
            </h1>
            <div className="h-1 w-24 sm:w-32 bg-accent mx-auto mb-4"></div>
            <p className="text-xl sm:text-3xl font-heading text-accent drop-shadow-lg mb-4">
              {home.heroSubtitle || 'Mixing business with pleasure.'}
            </p>
          </div>
          <p className="text-sm sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg leading-relaxed">
            {home.heroDescription ||
              "Award-winning DJ; early 2000s pioneer of Pidgin rap and one half of Hiplife group KgPM. Curator of London's most successful annual boat party."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {home.heroPrimaryCtaLabel && (
              <a
                href={home.heroPrimaryCtaUrl || latestRelease?.spotifyUrl || '#'}
                target={isExternal(home.heroPrimaryCtaUrl) ? '_blank' : undefined}
                rel={isExternal(home.heroPrimaryCtaUrl) ? 'noopener noreferrer' : undefined}
                className="w-full sm:w-auto"
              >
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  <SpotifyIcon className="h-5 w-5" />
                  <span className="ml-2">{home.heroPrimaryCtaLabel}</span>
                </Button>
              </a>
            )}
            {home.heroSecondaryCtaLabel &&
              (isExternal(home.heroSecondaryCtaUrl) ? (
                <a href={home.heroSecondaryCtaUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Ticket size={20} className="mr-2" />
                    {home.heroSecondaryCtaLabel}
                  </Button>
                </a>
              ) : (
                <Link to={home.heroSecondaryCtaUrl || '/events'} className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Ticket size={20} className="mr-2" />
                    {home.heroSecondaryCtaLabel}
                  </Button>
                </Link>
              ))}
          </div>
        </div>
      </section>
      )}

      {/* Bio Section */}
      {home.bioShow !== false && (
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-surface/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed">
            {home.bioText ||
              "The Prhyme Minister (PM) is one of London's leading DJs, an award-winning radio host, rapper, and event promoter. Early 2000s – a pioneer of Pidgin rap style – one half of the legendary Hiplife group, KgPM. A respected cultural curator, PM blends music, nightlife, and community to deliver unforgettable experiences on and off the stage."}
          </p>
          {home.bioButtonLabel && (
            <Link to={home.bioButtonUrl || '/about'} className="inline-flex w-full sm:w-auto">
              <Button variant="ghost" size="lg" className="mt-8 w-full sm:w-auto">
                {home.bioButtonLabel}
              </Button>
            </Link>
          )}
        </div>
      </section>
      )}

      {/* Latest Release */}
      {home.latestReleaseShow !== false && (
      <section id="latest" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <h2 className="font-heading text-3xl sm:text-5xl">
              {home.latestReleaseHeading || 'LATEST RELEASE'}
            </h2>
            <Link to="/music" className="text-accent hover:text-accent-hover transition-colors text-sm sm:text-base">
              View All →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="aspect-square rounded-xl overflow-hidden">
              <img
                src={latestRelease.artwork}
                alt={latestRelease.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="px-3 py-1 bg-accent/20 text-accent rounded uppercase text-sm font-heading inline-block mb-4">
                {home.latestReleaseBadge || 'NEW RELEASE'}
              </span>
              <h3 className="font-heading text-3xl sm:text-4xl mb-4">{latestRelease.title}</h3>
              <p className="text-muted-foreground mb-6">
                {new Date(latestRelease.releaseDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                {latestRelease.spotifyEnabled !== false && latestRelease.spotifyUrl && (
                  <a href={latestRelease.spotifyUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary">
                      <SpotifyIcon className="h-4 w-4" />
                      <span className="ml-2">Spotify</span>
                    </Button>
                  </a>
                )}
                {latestRelease.appleMusicEnabled !== false && latestRelease.appleMusicUrl && (
                  <a href={latestRelease.appleMusicUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <AppleMusicIcon className="h-4 w-4" />
                      <span className="ml-2">Apple Music</span>
                    </Button>
                  </a>
                )}
                {latestRelease.youtubeEnabled !== false && latestRelease.youtubeUrl && (
                  <a href={latestRelease.youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <YouTubeIcon className="h-4 w-4" />
                      <span className="ml-2">YouTube</span>
                    </Button>
                  </a>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>
      )}

      {/* Upcoming Events */}
      {home.eventsShow !== false && (
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-surface/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <h2 className="font-heading text-3xl sm:text-5xl">
              {home.eventsHeading || 'UPCOMING EVENTS'}
            </h2>
            {home.eventsLinkLabel && (
              <Link to={home.eventsLinkUrl || '/events'} className="text-accent hover:text-accent-hover transition-colors text-sm sm:text-base">
                {home.eventsLinkLabel}
              </Link>
            )}
          </div>
          
          {featuredEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-surface/30 border border-border rounded-xl">
              <p className="text-muted-foreground">
                No upcoming events at the moment. Follow us on social media for announcements.
              </p>
            </div>
          )}
        </div>
      </section>
      )}

      {/* Instagram Feed */}
      {home.instagramShow !== false && (
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <h2 className="font-heading text-3xl sm:text-5xl">
              {home.instagramHeading || 'LATEST FROM INSTAGRAM'}
            </h2>
            {generalSettings.instagram && (
              <a
                href={generalSettings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover transition-colors text-sm sm:text-base inline-flex items-center gap-2"
              >
                <Instagram size={18} />
                Follow @{instagramUsername}
              </a>
            )}
          </div>

          {home.instagramWidgetId ? (
            <InstagramElfsightWidget widgetId={home.instagramWidgetId} />
          ) : home.instagramEmbedUrl ? (
            <div className="rounded-xl overflow-hidden border border-border bg-surface">
              <iframe
                src={home.instagramEmbedUrl}
                title="Instagram feed"
                className="w-full min-h-[400px] sm:min-h-[500px]"
                style={{ border: 0 }}
              />
            </div>
          ) : (
            <a
              href={generalSettings.instagram || 'https://www.instagram.com/_thepm_/'}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden border border-border bg-surface hover:border-accent transition-colors group"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 p-2 sm:p-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-surface/80 group-hover:bg-surface flex items-center justify-center"
                  >
                    <Instagram className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                ))}
              </div>
              <div className="p-4 sm:p-6 text-center border-t border-border">
                <p className="text-muted-foreground group-hover:text-accent transition-colors">
                  Follow @{instagramUsername} on Instagram for the latest
                </p>
              </div>
            </a>
          )}
        </div>
      </section>
      )}

      {/* Social Proof */}
      {home.socialProofShow !== false && (
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-surface/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-5xl mb-10 sm:mb-12">
            {home.socialProofHeading || 'AS SEEN AT'}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center justify-items-center">
            {(home.socialProofLogos || []).map((venue) => (
              <div key={venue.name} className="flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
                <img
                  src={resolvePublicAsset(venue.image)}
                  alt={venue.name || 'Venue'}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                />
                <span className="font-heading text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">
                  {venue.name || 'Venue'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      <MobileActionBar />
    </div>
  );
}
