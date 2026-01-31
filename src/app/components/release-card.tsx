import { Link } from 'react-router-dom';
import { Release } from '@/data/releases';
import { cn } from '@/app/components/ui/utils';

interface ReleaseCardProps {
  release: Release;
}

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
    <path
      fill="currentColor"
      d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 14.5a.75.75 0 0 1-1.03.25c-2.84-1.73-6.41-2.12-10.6-1.15a.75.75 0 1 1-.33-1.47c4.58-1.03 8.54-.58 11.74 1.36.36.22.48.69.22 1.01zm1.47-3.27a.9.9 0 0 1-1.23.3c-3.25-1.98-8.21-2.56-12.05-1.4a.9.9 0 0 1-.52-1.72c4.25-1.3 9.62-.64 13.28 1.6.42.26.55.82.52 1.22zm.12-3.36c-3.79-2.25-10.04-2.46-13.66-1.35a1.05 1.05 0 1 1-.61-2.01c4.15-1.27 11.05-1.03 15.44 1.58a1.05 1.05 0 1 1-1.17 1.78z"
    />
  </svg>
);

const AppleMusicIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
    <path
      fill="currentColor"
      d="M15.35 5.8c-.7.82-1.86 1.46-2.93 1.36-.15-1.08.4-2.22 1.03-2.97.7-.84 1.92-1.45 2.93-1.49.12 1.12-.32 2.19-1.03 3.1zM20 17.47c-.52 1.2-1.14 2.34-2.05 3.37-.83.96-1.5 2.04-2.83 2.04-1.31 0-1.65-.83-3.16-.83-1.52 0-1.9.8-3.16.85-1.25.05-2.2-1.15-3.05-2.1-1.7-2.02-3.04-5.75-1.27-8.27.88-1.23 2.47-2 4.2-2.02 1.3-.02 2.52.88 3.16.88.63 0 1.98-1.08 3.68-.92.7.03 2.67.28 3.94 2.1-.1.06-2.34 1.36-2.32 4.05.02 3.22 2.78 4.3 2.86 4.35z"
    />
  </svg>
);

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
                  <SpotifyIcon />
                </a>
              )}
              {showAppleMusic && (
                <a
                  href={release.appleMusicUrl}
                  onClick={(e) => e.stopPropagation()}
                  className="w-10 h-10 flex items-center justify-center bg-accent text-black rounded-full hover:scale-110 transition-transform"
                  aria-label="Apple Music"
                >
                  <AppleMusicIcon />
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
