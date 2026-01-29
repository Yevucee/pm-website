import { useParams, Link } from 'react-router-dom';
import { Button } from '@/app/components/button';
import { Calendar, MapPin, Clock, ChevronLeft, Users, Music } from 'lucide-react';
import { upcomingEvents, pastEvents } from '@/data/mock-data';
import { cn } from '@/app/components/ui/utils';
import { goToStripeLink } from '@/utils/stripe';

export function EventDetailPage() {
  const { id } = useParams();
  const event = [...upcomingEvents, ...pastEvents].find((e) => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl mb-4">Event Not Found</h1>
          <Link to="/events">
            <Button variant="primary">Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const date = new Date(event.date);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/events" className="inline-flex items-center text-accent hover:text-accent-hover mb-8 transition-colors">
          <ChevronLeft size={20} className="mr-1" />
          Back to Events
        </Link>

        {/* Event Banner */}
        <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-8">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-8 left-8">
            <span className="px-3 py-1 bg-accent text-black rounded font-heading mb-4 inline-block">
              {event.type === 'boat-party' ? 'BOAT PARTY' : event.type === 'festival' ? 'FESTIVAL' : 'CLUB NIGHT'}
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl">{event.title}</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Event Info */}
          <div className="md:col-span-2">
            {/* Details */}
            <div className="bg-surface border border-border rounded-xl p-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar size={20} className="text-accent mt-1" />
                  <div>
                    <p className="font-heading">DATE</p>
                    <p className="text-muted-foreground">
                      {date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-accent mt-1" />
                  <div>
                    <p className="font-heading">TIME</p>
                    <p className="text-muted-foreground">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-accent mt-1" />
                  <div>
                    <p className="font-heading">VENUE</p>
                    <p className="text-muted-foreground">{event.venue}, {event.city}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="font-heading text-3xl mb-4">ABOUT</h2>
              <p className="text-muted-foreground text-lg">{event.description}</p>
            </div>

            {/* Lineup */}
            {event.lineup && event.lineup.length > 0 && (
              <div className="mb-8">
                <h2 className="font-heading text-3xl mb-4">LINEUP</h2>
                <div className="bg-surface border border-border rounded-xl p-6 space-y-3">
                  {event.lineup.map((artist, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Music size={18} className="text-accent" />
                      <span>{artist}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Sections */}
            <div className="space-y-6">
              <details className="bg-surface border border-border rounded-xl overflow-hidden">
                <summary className="p-6 cursor-pointer font-heading text-xl hover:bg-accent/5 transition-colors">
                  WHAT'S INCLUDED
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">
                  <ul className="space-y-2">
                    <li>• Entry to the venue</li>
                    <li>• Access to all floors and rooms</li>
                    <li>• Complimentary cloakroom</li>
                    <li>• Professional sound system</li>
                  </ul>
                </div>
              </details>

              <details className="bg-surface border border-border rounded-xl overflow-hidden">
                <summary className="p-6 cursor-pointer font-heading text-xl hover:bg-accent/5 transition-colors">
                  FAQ
                </summary>
                <div className="px-6 pb-6 text-muted-foreground space-y-4">
                  <div>
                    <p className="font-heading text-foreground mb-1">What's the age limit?</p>
                    <p>18+ with valid ID required at the door.</p>
                  </div>
                  <div>
                    <p className="font-heading text-foreground mb-1">What should I wear?</p>
                    <p>Smart casual. No sportswear or caps.</p>
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Ticket Purchase */}
          <div>
            <div className="sticky top-32">
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="font-heading text-2xl mb-6">TICKETS</h3>
                
                {event.soldOut ? (
                  <div className="bg-error/10 border border-error rounded-lg p-4 text-center">
                    <p className="font-heading text-error">SOLD OUT</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {event.ticketTiers.map((tier) => (
                      <div
                        key={tier.name}
                        className={cn(
                          'border rounded-lg p-4',
                          tier.available ? 'border-border hover:border-accent cursor-pointer transition-colors' : 'border-border opacity-50'
                        )}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-heading">{tier.name}</span>
                          <span className="text-accent text-xl">£{tier.price}</span>
                        </div>
                        {!tier.available && (
                          <p className="text-sm text-error">Sold Out</p>
                        )}
                        {tier.available && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => goToStripeLink(tier.stripeLink)}
                          >
                            Buy Now
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-border text-sm text-muted-foreground text-center">
                  <p>Secure checkout via Stripe</p>
                  <p className="mt-1">Apple Pay • Google Pay accepted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
