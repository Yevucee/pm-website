import { Link } from 'react-router-dom';
import { Button } from '@/app/components/button';
import { ReleaseCard } from '@/app/components/release-card';
import { EventCard } from '@/app/components/event-card';
import { ProductCard } from '@/app/components/product-card';
import { Music, Ticket, ShoppingBag, Play } from 'lucide-react';
import { upcomingEvents, merchProducts } from '@/data/mock-data';
import { releases } from '@/data/releases';
import { MobileActionBar } from '@/app/components/mobile-action-bar';
import logoGoldStudio from '@/assets/4db82b1e147ec8481e449aea5677f3cd902b9758.png';
import heroImage from '@/assets/d24d1977cc81d06fb12bd8b56ff811be50475c64.png';

export function HomePage() {
  const latestRelease = releases[0];
  const featuredEvents = upcomingEvents.slice(0, 3);
  const featuredProducts = merchProducts.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Artist Background */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="The PM - The Prhyme Minister Performing Live"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-6xl sm:text-8xl mb-4 text-white drop-shadow-2xl">THE PRHYME MINISTER (PM)</h1>
            <div className="h-1 w-32 bg-accent mx-auto mb-4"></div>
            <p className="text-2xl sm:text-3xl font-heading text-accent drop-shadow-lg mb-4">
              Mixing business with pleasure.
            </p>
          </div>
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg leading-relaxed">
            Award-winning DJ, Pidgin rap pioneer, and curator of London's most successful annual boat party.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://open.spotify.com/artist/thepm" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg">
                <Play size={20} className="mr-2" />
                Listen on Spotify
              </Button>
            </a>
            <Link to="/events">
              <Button variant="outline" size="lg">
                <Ticket size={20} className="mr-2" />
                Buy Tickets
              </Button>
            </Link>
            <Link to="/merch">
              <Button variant="ghost" size="lg">
                <ShoppingBag size={20} className="mr-2" />
                Explore Merch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed">
            The Prhyme Minister (PM) is one of London's leading DJs, an award-winning radio host, rapper, and event promoter. A pioneer of Pidgin rap and a respected cultural curator, PM blends music, nightlife, and community to deliver unforgettable experiences on and off the stage.
          </p>
          <Link to="/about">
            <Button variant="ghost" size="lg" className="mt-8">
              Read Full Story →
            </Button>
          </Link>
        </div>
      </section>

      {/* Latest Release */}
      <section id="latest" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-4xl sm:text-5xl">LATEST RELEASE</h2>
            <Link to="/music" className="text-accent hover:text-accent-hover transition-colors">
              View All →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="aspect-square rounded-xl overflow-hidden">
              <img
                src={latestRelease.artwork}
                alt={latestRelease.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="px-3 py-1 bg-accent/20 text-accent rounded uppercase text-sm font-heading inline-block mb-4">
                NEW RELEASE
              </span>
              <h3 className="font-heading text-4xl mb-4">{latestRelease.title}</h3>
              <p className="text-muted-foreground mb-6">
                {new Date(latestRelease.releaseDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
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
              <div className="bg-surface border border-border rounded-lg p-6 text-center text-muted-foreground">
                <Music size={48} className="mx-auto mb-3 opacity-50" />
                <p>Spotify Player</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-4xl sm:text-5xl">UPCOMING EVENTS</h2>
            <Link to="/events" className="text-accent hover:text-accent-hover transition-colors">
              View All →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Merch Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-4xl sm:text-5xl">MERCH</h2>
            <Link to="/merch" className="text-accent hover:text-accent-hover transition-colors">
              Shop All →
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-heading text-4xl sm:text-5xl mb-12">AS SEEN AT</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {[
              { name: 'Fabric', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200' },
              { name: 'Ministry of Sound', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200' },
              { name: 'Warehouse Project', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200' },
              { name: 'Printworks', image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=200' }
            ].map((venue) => (
              <div key={venue.name} className="grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <MobileActionBar />
    </div>
  );
}
