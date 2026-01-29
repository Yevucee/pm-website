import { EventCard } from '@/app/components/event-card';
import { upcomingEvents, pastEvents } from '@/data/mock-data';
import { MobileActionBar } from '@/app/components/mobile-action-bar';

export function EventsPage() {
  return (
    <div className="min-h-screen pt-32 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-heading text-5xl sm:text-6xl mb-4">EVENTS</h1>
        <p className="text-muted-foreground text-xl mb-8">
          Boat parties, club nights, and festival appearances
        </p>

        {/* Annual Boat Party Feature */}
        <section className="mb-16 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 rounded-2xl p-8 sm:p-12">
          <div className="max-w-3xl">
            <span className="px-3 py-1 bg-accent text-black rounded uppercase text-sm font-heading inline-block mb-4">
              Signature Event
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl mb-6">ANNUAL BOAT PARTY</h2>
            <p className="text-lg leading-relaxed mb-6">
              PM hosts one of London's most successful annual boat parties, combining Afrobeats, hip-hop, dancehall, and global urban sounds on the water.
            </p>
            <p className="text-base text-foreground/80 leading-relaxed">
              The event attracts a diverse international crowd and has become a staple of London's Afro-urban social calendar.
            </p>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl mb-8">UPCOMING</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Past Events */}
        <section>
          <h2 className="font-heading text-3xl mb-8">PAST EVENTS</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </div>
      <MobileActionBar />
    </div>
  );
}
