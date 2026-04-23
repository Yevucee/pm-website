import { useState } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Event } from '@/data/mock-data';
import { cn } from '@/app/components/ui/utils';
import { EventDetailModal } from './event-detail-modal';

interface EventCardProps {
  event: Event;
  variant?: 'vertical' | 'horizontal';
}

export function EventCard({ event, variant = 'vertical' }: EventCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const date = new Date(event.date);
  const availableTier = event.comingSoon ? undefined : event.ticketTiers.find((tier) => tier.available);
  const eventTypeLabel =
    event.type === 'boat-party' ? 'BOAT PARTY' : event.type === 'festival' ? 'FESTIVAL' : 'CLUB NIGHT';
  const venueDisplay = event.venueName ? `${event.venueName} · ${event.city}` : `${event.venue}, ${event.city}`;

  const showTicketFooter = !event.soldOut && (Boolean(availableTier) || event.comingSoon);

  const imageBlock = (
    <div
      className={cn(
        'relative flex-shrink-0 overflow-hidden bg-black',
        variant === 'horizontal' ? 'h-48 min-w-[14rem] w-full sm:h-full sm:w-72' : 'aspect-[16/9]'
      )}
    >
      <img
        src={event.image}
        alt={event.title}
        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute left-4 top-4 z-10 whitespace-nowrap rounded-lg bg-accent px-3 py-1 font-heading text-sm text-black">
        {eventTypeLabel}
      </div>
      {event.soldOut && (
        <div className="absolute right-4 top-4 z-10 whitespace-nowrap rounded-lg bg-error px-3 py-1 font-heading text-sm text-white">
          SOLD OUT
        </div>
      )}
    </div>
  );

  const contentBlock = (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between p-5 sm:p-6">
      <div>
        <h3 className="mb-3 break-words font-heading text-xl text-foreground sm:text-2xl transition-colors group-hover:text-accent">
          {event.title}
        </h3>
        <div className="mb-4 space-y-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{venueDisplay}</span>
          </div>
        </div>
      </div>

      {showTicketFooter && (
        <div className="flex items-end justify-between gap-4 border-t border-border pt-4">
          <div className="flex min-h-[3.25rem] flex-col justify-end">
            {availableTier && (
              <>
                <p className="text-sm text-muted-foreground">{availableTier.price === 0 ? '' : 'From'}</p>
                <p className="font-heading text-2xl leading-tight text-accent">
                  {availableTier.price === 0 ? 'Free' : `£${availableTier.price}`}
                </p>
              </>
            )}
            {event.comingSoon && !availableTier && (
              <>
                <p className="text-sm text-muted-foreground">Tickets</p>
                <p className="font-heading text-2xl leading-tight text-muted-foreground">TBC</p>
              </>
            )}
          </div>
          <span className="shrink-0 self-end pb-0.5 text-sm font-medium text-accent">View details →</span>
        </div>
      )}

      {event.soldOut && !event.comingSoon && variant !== 'horizontal' && (
        <div className="border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">Sold Out</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={cn(
          'group w-full cursor-pointer text-left',
          'rounded-xl border border-border bg-surface',
          'overflow-hidden transition-all duration-300',
          'hover:border-accent hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
          variant === 'horizontal' && 'flex flex-col sm:flex-row'
        )}
      >
        {variant === 'horizontal' ? (
          <>
            {imageBlock}
            {contentBlock}
          </>
        ) : (
          <>
            {imageBlock}
            {contentBlock}
          </>
        )}
      </button>
      <EventDetailModal
        event={event}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
