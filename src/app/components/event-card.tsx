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
        className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
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
    <div className="flex min-h-0 min-w-0 flex-1 flex-col p-5 sm:p-6">
      <div className="min-h-0 flex-1">
        <h3 className="line-clamp-3 min-h-[4.5rem] text-balance break-words font-heading text-xl text-foreground sm:min-h-[5.5rem] sm:text-2xl transition-colors group-hover:text-accent">
          {event.title}
        </h3>
        <div className="mb-0 mt-3 space-y-2 text-muted-foreground sm:mb-0">
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
        <div className="grid w-full grid-cols-[1fr_auto] items-end gap-4 border-t border-border pt-4">
          <div className="flex h-14 flex-col justify-end">
            {availableTier && (
              <>
                <p className="text-sm leading-none text-muted-foreground">
                  {availableTier.price === 0 ? '\u00a0' : 'From'}
                </p>
                <p className="mt-0.5 font-heading text-2xl leading-none text-accent">
                  {availableTier.price === 0 ? 'Free' : `£${availableTier.price}`}
                </p>
              </>
            )}
            {event.comingSoon && !availableTier && (
              <>
                <p className="text-sm leading-none text-muted-foreground">Tickets</p>
                <p className="mt-0.5 font-heading text-2xl leading-none text-muted-foreground">TBC</p>
              </>
            )}
          </div>
          <div className="flex h-14 min-w-0 items-end">
            <span className="text-sm font-medium leading-none text-accent">View details →</span>
          </div>
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
          'group flex h-full w-full cursor-pointer text-left',
          'flex-col overflow-hidden rounded-xl border border-border bg-surface',
          'transition-all duration-300',
          'hover:border-accent hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
          variant === 'horizontal' && 'sm:flex-row'
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
