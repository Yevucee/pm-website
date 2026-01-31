import { Link } from 'react-router-dom';
import { Button } from '@/app/components/button';
import { ReleaseCard } from '@/app/components/release-card';
import { EventCard } from '@/app/components/event-card';
import { ProductCard } from '@/app/components/product-card';
import { Music, Ticket, ShoppingBag, Play } from 'lucide-react';
import { upcomingEvents, merchProducts } from '@/data/mock-data';
import { releases } from '@/data/releases';
import { MobileActionBar } from '@/app/components/mobile-action-bar';
import { getPageContent, resolvePublicAsset } from '@/data/pages';

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
  socialProofShow?: boolean;
  socialProofHeading?: string;
  socialProofLogos?: { name?: string; image?: string }[];
}

export function HomePage() {
  const home = getPageContent<HomePageContent>('home', {});
  const latestRelease = releases[0];
  const featuredEvents = upcomingEvents.slice(0, 3);
  const featuredProducts = merchProducts.slice(0, 3);
  const heroImageSrc = resolvePublicAsset(home.heroImage) || resolvePublicAsset('/uploads/stuck_indoors.jpg');
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
              "Award-winning DJ, Pidgin rap pioneer, and curator of London's most successful annual boat party."}
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
                  <Play size={20} className="mr-2" />
                  {home.heroPrimaryCtaLabel}
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
            {home.heroTertiaryCtaLabel &&
              (isExternal(home.heroTertiaryCtaUrl) ? (
                <a href={home.heroTertiaryCtaUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                    <ShoppingBag size={20} className="mr-2" />
                    {home.heroTertiaryCtaLabel}
                  </Button>
                </a>
              ) : (
                <Link to={home.heroTertiaryCtaUrl || '/merch'} className="w-full sm:w-auto">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                    <ShoppingBag size={20} className="mr-2" />
                    {home.heroTertiaryCtaLabel}
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
              "The Prhyme Minister (PM) is one of London's leading DJs, an award-winning radio host, rapper, and event promoter. A pioneer of Pidgin rap and a respected cultural curator, PM blends music, nightlife, and community to deliver unforgettable experiences on and off the stage."}
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
                <a href={latestRelease.spotifyUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary">
                    <Music size={18} className="mr-2" />
                    Spotify
                  </Button>
                </a>
                <a href={latestRelease.appleMusicUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    <Music size={18} className="mr-2" />
                    Apple Music
                  </Button>
                </a>
                <a href={latestRelease.youtubeUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    <Play size={18} className="mr-2" />
                    YouTube
                  </Button>
                </a>
              </div>

              {/* Spotify Embed Placeholder */}
              <div className="bg-surface border border-border rounded-lg p-5 text-center text-muted-foreground">
                <Music size={40} className="mx-auto mb-3 opacity-50" />
                <p>Spotify Player</p>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Merch Highlights */}
      {home.merchShow !== false && (
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <h2 className="font-heading text-3xl sm:text-5xl">
              {home.merchHeading || 'MERCH'}
            </h2>
            {home.merchLinkLabel && (
              <Link to={home.merchLinkUrl || '/merch'} className="text-accent hover:text-accent-hover transition-colors text-sm sm:text-base">
                {home.merchLinkLabel}
              </Link>
            )}
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
              <div key={venue.name} className="grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
                <img
                  src={resolvePublicAsset(venue.image)}
                  alt={venue.name || 'Venue'}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                />
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
