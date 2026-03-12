import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/button';
import { Calendar, MapPin, Clock, Music } from 'lucide-react';
import { Event } from '@/data/mock-data';
import { cn } from '@/app/components/ui/utils';
import { goToStripeLink } from '@/utils/stripe';

interface EventDetailModalProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const interestEndpoint =
  'https://script.google.com/macros/s/AKfycbwi6dZZkeBbSxprzpaa4bLxf8ys8X_MsMzRy14ZmsUcFO9xmjXCH1je0Z3hPZBO1NP5RQ/exec';

export function EventDetailModal({ event, open, onOpenChange }: EventDetailModalProps) {
  const [interestStatus, setInterestStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleInterestSubmit = async (formData: FormData) => {
    if (!event) return;
    setInterestStatus('sending');
    try {
      await fetch(interestEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          message: formData.get('message'),
          event: event.title,
        }),
      });
      setInterestStatus('success');
    } catch {
      setInterestStatus('error');
    }
  };

  if (!event) return null;

  const date = new Date(event.date);
  const eventTypeLabel =
    event.type === 'boat-party' ? 'BOAT PARTY' : event.type === 'festival' ? 'FESTIVAL' : 'CLUB NIGHT';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="relative aspect-[3/1] sm:aspect-[21/9] overflow-hidden rounded-t-lg flex-shrink-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
            <span className="px-3 py-1 bg-accent text-black rounded font-heading text-sm mb-2 inline-block">
              {eventTypeLabel}
            </span>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl sm:text-4xl text-white">
                {event.title}
              </DialogTitle>
            </DialogHeader>
          </div>
        </div>

        <div className="p-4 pt-6 sm:p-6 sm:pt-8 space-y-6">
          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-accent flex-shrink-0" />
              <span className="text-muted-foreground">
                {date.toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-accent flex-shrink-0" />
              <span className="text-muted-foreground">{event.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-accent flex-shrink-0" />
              <span className="text-muted-foreground">
                {event.venueName ? `${event.venueName} · ${event.city}` : `${event.venue}, ${event.city}`}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-heading text-lg mb-2">ABOUT</h3>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Lineup */}
          {event.lineup && event.lineup.length > 0 && (
            <div>
              <h3 className="font-heading text-lg mb-2">LINEUP</h3>
              <div className="flex flex-wrap gap-2">
                {event.lineup.map((artist, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Music size={14} className="text-accent" />
                    <span>{artist}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tickets */}
          <div className="pt-4 border-t border-border">
            <h3 className="font-heading text-lg mb-4">
              {event.comingSoon ? 'COMING SOON' : 'TICKETS'}
            </h3>

            {event.comingSoon ? (
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">
                  Register your interest and we will notify you.
                </p>
                {interestStatus === 'success' ? (
                  <div className="bg-accent/10 border border-accent rounded-lg p-4 text-center">
                    <p className="font-heading text-accent text-sm">Thanks! We will be in touch.</p>
                  </div>
                ) : (
                  <form
                    className="space-y-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void handleInterestSubmit(new FormData(e.currentTarget));
                    }}
                  >
                    <input
                      name="name"
                      required
                      placeholder="Full name"
                      className="w-full rounded-lg bg-surface border border-border px-4 py-2 text-sm"
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Email"
                      className="w-full rounded-lg bg-surface border border-border px-4 py-2 text-sm"
                    />
                    <input
                      name="phone"
                      placeholder="Phone (optional)"
                      className="w-full rounded-lg bg-surface border border-border px-4 py-2 text-sm"
                    />
                    {interestStatus === 'error' && (
                      <p className="text-sm text-error">Something went wrong. Try again.</p>
                    )}
                    <Button type="submit" size="sm" className="w-full" disabled={interestStatus === 'sending'}>
                      {interestStatus === 'sending' ? 'Sending...' : 'Register Interest'}
                    </Button>
                  </form>
                )}
              </div>
            ) : event.soldOut ? (
              <p className="font-heading text-error">SOLD OUT</p>
            ) : (
              <div className="space-y-3">
                {event.ticketTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={cn(
                      'border rounded-lg p-3',
                      tier.available && 'border-border hover:border-accent'
                    )}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-heading text-sm">{tier.name}</span>
                      <span className="text-accent font-heading">
                        {tier.price === 0 ? 'Free' : `£${tier.price}`}
                      </span>
                    </div>
                    {tier.available && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const link = tier.stripeLink || '';
                          if (/^https?:\/\//i.test(link)) {
                            window.open(link, '_blank', 'noopener,noreferrer');
                          } else {
                            goToStripeLink(tier.stripeLink);
                          }
                        }}
                      >
                        {tier.price === 0 ? 'Get Tickets' : 'Buy Now'}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
