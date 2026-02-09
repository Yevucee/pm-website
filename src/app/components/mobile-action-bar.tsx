import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import { releases } from '@/data/releases';
import { Button } from './button';
import { SpotifyIcon } from '@/app/components/streaming-icons';

export function MobileActionBar() {
  const latestRelease = releases[0];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-surface/95 backdrop-blur-lg border-t border-border px-4 py-3">
      <div className="flex gap-2">
        <a
          href={latestRelease?.spotifyUrl || 'https://open.spotify.com/album/3Ym3xOwfN2rByjWBiLnNqu'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="outline" className="w-full" size="md">
            <SpotifyIcon className="h-5 w-5" />
            <span className="ml-2">Listen</span>
          </Button>
        </a>
        <Link to="/events" className="flex-1">
          <Button variant="primary" className="w-full" size="md">
            <Ticket size={20} className="mr-2" />
            Tickets
          </Button>
        </Link>
      </div>
    </div>
  );
}
