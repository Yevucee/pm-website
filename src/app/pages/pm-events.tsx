import { EventCard } from '@/app/components/event-card';
import { upcomingEvents, pastEvents } from '@/data/mock-data';
import { MobileActionBar } from '@/app/components/mobile-action-bar';
import { getPageContent } from '@/data/pages';

interface PmEventsContent {
  heroShow?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  introText?: string;
  signatureShow?: boolean;
  signatureBadge?: string;
  signatureHeading?: string;
  signatureText?: string;
  signatureSubtext?: string;
  upcomingShow?: boolean;
  upcomingHeading?: string;
  pastShow?: boolean;
  pastHeading?: string;
}

export function PmEventsPage() {
  const page = getPageContent<PmEventsContent>('pm-events', {});

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {page.heroShow !== false && (
          <h1 className="font-heading text-4xl sm:text-6xl mb-4">
            {page.heroTitle || 'PM EVENTS'}
          </h1>
        )}
        <p className="text-muted-foreground text-base sm:text-xl mb-8">
          {page.introText ||
            'Boat parties, club nights, and festival appearances'}
        </p>

        {/* Annual Boat Party Feature */}
        {page.signatureShow !== false && (
        <section className="mb-12 sm:mb-16 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 rounded-2xl p-6 sm:p-12">
            <div className="max-w-3xl">
              <span className="px-3 py-1 bg-accent text-black rounded uppercase text-sm font-heading inline-block mb-4">
                {page.signatureBadge || 'Signature Event'}
              </span>
            <h2 className="font-heading text-3xl sm:text-5xl mb-4 sm:mb-6">
                {page.signatureHeading || 'ANNUAL BOAT PARTY'}
              </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                {page.signatureText ||
                  "PM hosts one of London's most successful annual boat parties, combining Afrobeats, hip-hop, dancehall, and global urban sounds on the water."}
              </p>
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                {page.signatureSubtext ||
                  "The event attracts a diverse international crowd and has become a staple of London's Afro-urban social calendar."}
              </p>
            </div>
          </section>
        )}

        {/* Upcoming Events */}
        {page.upcomingShow !== false && (
          <section className="mb-16">
            <h2 className="font-heading text-3xl mb-8">
              {page.upcomingHeading || 'UPCOMING'}
            </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Past Events */}
        {page.pastShow !== false && (
          <section>
            <h2 className="font-heading text-3xl mb-8">
              {page.pastHeading || 'PAST EVENTS'}
            </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}
      </div>
      <MobileActionBar />
    </div>
  );
}
