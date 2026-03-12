import { EventCard } from '@/app/components/event-card';
import { upcomingEvents, pastEvents } from '@/data/mock-data';
import { MobileActionBar } from '@/app/components/mobile-action-bar';
import { getPageContent, resolvePublicAsset } from '@/data/pages';
import { generalSettings } from '@/data/settings';
import { Button } from '@/app/components/button';
import logo from '@/assets/partiesbythepm-logo.png';

interface EventsPageContent {
  heroShow?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  heroBackgroundImage?: string;
  introText?: string;
  signatureShow?: boolean;
  signatureBadge?: string;
  signatureHeading?: string;
  signatureText?: string;
  signatureSubtext?: string;
  signatureTicketLink?: string;
  signatureNextDate?: string;
  upcomingShow?: boolean;
  upcomingHeading?: string;
  pastShow?: boolean;
  pastHeading?: string;
}

export function EventsPage() {
  const eventsPage = getPageContent<EventsPageContent>('events', {});

  const heroBgSrc =
    eventsPage.heroBackgroundImage
      ? eventsPage.heroBackgroundImage.startsWith('http')
        ? eventsPage.heroBackgroundImage
        : resolvePublicAsset(eventsPage.heroBackgroundImage)
      : resolvePublicAsset('/uploads/pm.jpg');

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero section */}
        {eventsPage.heroShow !== false && (
          <section className="relative h-64 sm:h-80 flex items-center px-6 sm:px-10 overflow-hidden rounded-2xl mb-12">
            <img
              src={heroBgSrc}
              alt="Events"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
            <div className="relative z-10 flex items-center gap-6 sm:gap-8 w-full">
              <img
                src={logo}
                alt="Parties by the PM"
                className="w-28 h-28 sm:w-36 sm:h-36 object-contain flex-shrink-0"
              />
              <div className="h-20 sm:h-24 w-px bg-accent flex-shrink-0" />
              <div>
                <p className="text-accent text-sm sm:text-base font-medium mb-1">Events by</p>
                <h1 className="font-heading text-5xl sm:text-6xl font-bold text-white tracking-tight">
                  PARTIESBYTHEPM
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Boat parties · Club nights · Festivals
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Annual Boat Party Feature */}
        {eventsPage.signatureShow !== false && (
          <section className="mb-12 sm:mb-16 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 rounded-2xl p-6 sm:p-12">
            <div className="max-w-3xl">
              <span className="px-3 py-1 bg-accent text-black rounded uppercase text-sm font-heading inline-block mb-4">
                {eventsPage.signatureBadge || 'Signature Event'}
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl mb-4 sm:mb-6">
                {eventsPage.signatureHeading || 'ANNUAL BOAT PARTY'}
              </h2>
              {eventsPage.signatureNextDate && (
                <p className="text-accent font-semibold mt-2 mb-4">
                  Next date: {eventsPage.signatureNextDate}
                </p>
              )}
              <p className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                {eventsPage.signatureText ||
                  "PM hosts one of London's most successful annual boat parties, combining Afrobeats, hip-hop, dancehall, and global urban sounds on the water."}
              </p>
              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                {eventsPage.signatureSubtext ||
                  "The event attracts a diverse international crowd and has become a staple of London's Afro-urban social calendar."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {eventsPage.signatureTicketLink && (
                  <a
                    href={eventsPage.signatureTicketLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-accent text-black hover:bg-accent/90">
                      Buy Tickets
                    </Button>
                  </a>
                )}
                <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
                  Find Out More
                </Button>
              </div>
            </div>
          </section>
        )}

        <hr className="border-border my-12" />

        {/* Upcoming Events */}
        {eventsPage.upcomingShow !== false && (
          <section className="mb-12">
            <h2 className="font-heading text-3xl font-bold mb-6">
              {eventsPage.upcomingHeading || 'UPCOMING'}
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-surface/50 border border-border rounded-xl">
                <p className="text-muted-foreground text-lg mb-4">
                  No upcoming events at the moment.
                </p>
                <p className="text-muted-foreground mb-4">
                  Follow us on social media to be the first to know when new dates are announced.
                </p>
                <div className="flex gap-3 justify-center flex-wrap mb-4">
                  {generalSettings.instagram && (
                    <a
                      href={generalSettings.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline text-sm"
                    >
                      Instagram
                    </a>
                  )}
                  {generalSettings.tiktok && (
                    <a
                      href={generalSettings.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline text-sm"
                    >
                      TikTok
                    </a>
                  )}
                  {generalSettings.twitter && (
                    <a
                      href={generalSettings.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline text-sm"
                    >
                      X
                    </a>
                  )}
                </div>
                <form
                  className="flex gap-2 mt-4 max-w-sm mx-auto"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-2 rounded-lg bg-surface border border-border text-sm"
                  />
                  <Button type="submit" size="sm">
                    Notify Me
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-2">
                  Get notified when new dates drop.
                </p>
              </div>
            )}
          </section>
        )}

        <hr className="border-border my-12" />

        {/* Past Events */}
        {eventsPage.pastShow !== false && (
          <section>
            <h2 className="font-heading text-2xl font-bold text-muted-foreground mb-6">
              {eventsPage.pastHeading || 'PAST EVENTS'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} variant="horizontal" />
              ))}
            </div>
          </section>
        )}
      </div>
      <MobileActionBar />
    </div>
  );
}
