import { Link } from 'react-router-dom';
import { Release } from '@/data/releases';
import { cn } from '@/app/components/ui/utils';
import { AppleMusicIcon, SpotifyIcon } from '@/app/components/streaming-icons';

interface ReleaseCardProps {
  release: Release;
}

export function ReleaseCard({ release }: ReleaseCardProps) {
  const showSpotify = Boolean(release.spotifyUrl) && release.spotifyEnabled !== false;
  const showAppleMusic = Boolean(release.appleMusicUrl) && release.appleMusicEnabled !== false;
  const showStreaming = showSpotify || showAppleMusic;

  return (
    <Link
      to={`/music/${release.id}`}
      className="group block bg-surface border border-border rounded-xl overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
    >
      <div className="aspect-square overflow-hidden relative">
        <img
          src={release.artwork}
          alt={release.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {showStreaming && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
            <div className="flex gap-2">
              {showSpotify && (
                <a
                  href={release.spotifyUrl}
                  onClick={(e) => e.stopPropagation()}
                  className="w-10 h-10 flex items-center justify-center bg-accent text-black rounded-full hover:scale-110 transition-transform"
                  aria-label="Spotify"
                >
                  <SpotifyIcon className="h-4 w-4" />
                </a>
              )}
              {showAppleMusic && (
                <a
                  href={release.appleMusicUrl}
                  onClick={(e) => e.stopPropagation()}
                  className="w-10 h-10 flex items-center justify-center bg-accent text-black rounded-full hover:scale-110 transition-transform"
                  aria-label="Apple Music"
                >
                  <AppleMusicIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={cn(
              'px-2 py-0.5 text-xs uppercase font-heading rounded',
              release.type === 'album' && 'bg-accent/20 text-accent',
              release.type === 'ep' && 'bg-purple-500/20 text-purple-400',
              release.type === 'single' && 'bg-blue-500/20 text-blue-400'
            )}
          >
            {release.type}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(release.releaseDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })}
          </span>
        </div>
        <h3 className="font-heading text-lg sm:text-xl mb-1 group-hover:text-accent transition-colors">
          {release.title}
        </h3>
      </div>
    </Link>
  );
}
