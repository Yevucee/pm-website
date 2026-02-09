import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Event } from '@/data/mock-data';
import { Button } from './button';
import { cn } from '@/app/components/ui/utils';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const date = new Date(event.date);
  const availableTier = event.comingSoon ? undefined : event.ticketTiers.find((tier) => tier.available);
  const eventTypeLabel =
    event.type === 'boat-party' ? 'BOAT PARTY' : event.type === 'festival' ? 'FESTIVAL' : 'CLUB NIGHT';

  return (
    <div className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]">
      <div className="aspect-[16/9] overflow-hidden relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 bg-accent text-black px-3 py-1 rounded-lg font-heading">
          {eventTypeLabel}
        </div>
        {event.soldOut && (
          <div className="absolute top-4 right-4 bg-error text-white px-3 py-1 rounded-lg font-heading">
            SOLD OUT
          </div>
        )}
        {event.comingSoon && (
          <div className="absolute top-4 right-4 bg-accent text-black px-3 py-1 rounded-lg font-heading">
            COMING SOON
          </div>
        )}
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="font-heading text-xl sm:text-2xl mb-3 group-hover:text-accent transition-colors">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-4 text-muted-foreground">
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
            <span>{event.venue}, {event.city}</span>
          </div>
        </div>

        {!event.soldOut && availableTier && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-heading text-2xl text-accent">£{availableTier.price}</p>
            </div>
            <Link to={`/events/${event.id}`}>
              <Button variant="primary">
                Buy Tickets
              </Button>
            </Link>
          </div>
        )}

        {event.comingSoon && (
          <div className="pt-4 border-t border-border">
            <Link to={`/events/${event.id}`}>
              <Button variant="outline" className="w-full">
                Register Interest
              </Button>
            </Link>
          </div>
        )}

        {event.soldOut && !event.comingSoon && (
          <div className="pt-4 border-t border-border">
            <Button variant="secondary" className="w-full" disabled>
              Sold Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
