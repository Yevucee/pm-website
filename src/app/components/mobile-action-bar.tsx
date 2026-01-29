import { Music, Ticket } from 'lucide-react';
import { Button } from './button';

export function MobileActionBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-surface/95 backdrop-blur-lg border-t border-border p-4">
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" size="lg">
          <Music size={20} className="mr-2" />
          Listen
        </Button>
        <Button variant="primary" className="flex-1" size="lg">
          <Ticket size={20} className="mr-2" />
          Tickets
        </Button>
      </div>
    </div>
  );
}
