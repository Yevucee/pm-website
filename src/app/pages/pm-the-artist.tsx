import { Link } from 'react-router-dom';
import { Button } from '@/app/components/button';
import { Download, Music, Mic, Award } from 'lucide-react';
import logoGold from '@/assets/b65c8f29dae3829d7417c5d59754cec48cabc03e.png';
import { getPageContent, resolvePublicAsset } from '@/data/pages';

interface PmArtistContent {
  heroShow?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  introText?: string;
  body?: string;
  statsShow?: boolean;
  stats?: { label?: string; value?: string }[];
  timelineShow?: boolean;
  timelineHeading?: string;
  timeline?: { year?: string; event?: string }[];
  pressShow?: boolean;
  pressHeading?: string;
  pressQuotes?: { quote?: string; source?: string }[];
  pressKitLabel?: string;
  pressKitUrl?: string;
  bookingShow?: boolean;
  bookingHeading?: string;
  bookingText?: string;
  bookingButtonLabel?: string;
  bookingButtonUrl?: string;
}

export function PmTheArtistPage() {
  const page = getPageContent<PmArtistContent>('pm-the-artist', {});
  const statsIcons = [Music, Mic, Award];
  const bioImage = resolvePublicAsset(page.heroImage) || 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800';
  const bookingLink = page.bookingButtonUrl || '/contact';

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Bio Section */}
        {page.heroShow !== false && (
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="aspect-square rounded-xl overflow-hidden">
            <img
              src={bioImage}
              alt={page.heroTitle || 'PM the Artist'}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="mb-8">
              <img 
                src={logoGold} 
                alt="The PM - The Prhyme Minister" 
                className="h-24 w-auto"
              />
            </div>
            <h1 className="font-heading text-5xl mb-6">
              {page.heroTitle || 'PM THE ARTIST'}
            </h1>
            {page.heroSubtitle && (
              <p className="text-lg text-muted-foreground mb-6">{page.heroSubtitle}</p>
            )}
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {page.introText && <p>{page.introText}</p>}
              {page.body?.split('\n').filter(Boolean).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8">
              {page.pressKitLabel && (
                <a href={page.pressKitUrl || '#'} download>
                  <Button variant="primary">
                    <Download size={18} className="mr-2" />
                    {page.pressKitLabel}
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
        )}

        {/* Stats */}
        {page.statsShow !== false && page.stats && page.stats.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-6 mb-20">
            {page.stats.map((stat, index) => {
              const Icon = statsIcons[index % statsIcons.length];
              return (
                <div key={`${stat.label}-${stat.value}`} className="bg-surface border border-border rounded-xl p-6 text-center">
                  <Icon size={32} className="mx-auto mb-3 text-accent" />
                  <p className="text-4xl font-heading text-accent mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Timeline */}
        {page.timelineShow !== false && page.timeline && page.timeline.length > 0 && (
          <div className="mb-20">
            <h2 className="font-heading text-4xl mb-8">
              {page.timelineHeading || 'CAREER HIGHLIGHTS'}
            </h2>
            <div className="space-y-4">
              {page.timeline.map((item, index) => (
                <div
                  key={`${item.year}-${index}`}
                  className="flex items-start gap-4 bg-surface border border-border rounded-xl p-6 hover:border-accent transition-colors"
                >
                  <span className="font-heading text-2xl text-accent min-w-[80px]">
                    {item.year}
                  </span>
                  <p className="text-lg">{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Press Quotes */}
        {page.pressShow !== false && page.pressQuotes && page.pressQuotes.length > 0 && (
          <div className="mb-20">
            <h2 className="font-heading text-4xl mb-8">
              {page.pressHeading || 'PRESS'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {page.pressQuotes.map((item, index) => (
                <div
                  key={`${item.source}-${index}`}
                  className="bg-surface border border-border rounded-xl p-6"
                >
                  <p className="text-lg mb-4 italic">"{item.quote}"</p>
                  <p className="text-accent font-heading">— {item.source}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking CTA */}
        {page.bookingShow !== false && (
          <div className="bg-accent/10 border border-accent rounded-xl p-8 text-center">
            <h2 className="font-heading text-3xl mb-4">
              {page.bookingHeading || 'BOOK THE PM'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {page.bookingText ||
                'Available for club nights, festivals, private events and collaborations'}
            </p>
            <Link to={bookingLink}>
              <Button variant="primary" size="lg">
                {page.bookingButtonLabel || 'Get in Touch'}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
