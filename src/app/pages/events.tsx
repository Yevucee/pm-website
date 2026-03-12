import { useState } from 'react';
import { EventCard } from '@/app/components/event-card';
import { EventDetailModal } from '@/app/components/event-detail-modal';
import { Event, upcomingEvents, pastEvents } from '@/data/mock-data';
import { MobileActionBar } from '@/app/components/mobile-action-bar';
import { getPageContent, resolvePublicAsset } from '@/data/pages';
import { generalSettings } from '@/data/settings';
import { Button } from '@/app/components/button';
import logo from '@/assets/partiesbythepm-logo.png';

const signatureEvent = upcomingEvents.find((e) => e.type === 'boat-party');
const otherUpcomingEvents = upcomingEvents.filter((e) => e.type !== 'boat-party');

function SignatureEventSection({ event }: { event: Event }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <section className="mb-8 sm:mb-10">
      <div className="flex flex-col items-center">
        <span className="px-3 py-1 bg-accent text-black rounded uppercase text-sm font-heading inline-block mb-3">
          Signature Event
        </span>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="block w-full max-w-md rounded-xl overflow-hidden border border-border hover:border-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-auto object-contain max-h-[280px] sm:max-h-[320px]"
          />
        </button>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => setModalOpen(true)}
        >
          {event.comingSoon ? 'View Details' : 'Get Tickets'}
        </Button>
      </div>
      <EventDetailModal event={event} open={modalOpen} onOpenChange={setModalOpen} />
    </section>
  );
}

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

        {/* Signature Event – Boat Party */}
        {eventsPage.signatureShow !== false && signatureEvent && (
          <SignatureEventSection event={signatureEvent} />
        )}

        <hr className="border-border my-12" />

        {/* Upcoming Events */}
        {eventsPage.upcomingShow !== false && (
          <section className="mb-12">
            <h2 className="font-heading text-3xl font-bold mb-6">
              {eventsPage.upcomingHeading || 'UPCOMING'}
            </h2>
            {otherUpcomingEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {otherUpcomingEvents.map((event) => (
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
