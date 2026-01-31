import { useParams, Link } from 'react-router-dom';
import { Button } from '@/app/components/button';
import { ChevronLeft, Download, Play } from 'lucide-react';
import { releases } from '@/data/releases';

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 14.5a.75.75 0 0 1-1.03.25c-2.84-1.73-6.41-2.12-10.6-1.15a.75.75 0 1 1-.33-1.47c4.58-1.03 8.54-.58 11.74 1.36.36.22.48.69.22 1.01zm1.47-3.27a.9.9 0 0 1-1.23.3c-3.25-1.98-8.21-2.56-12.05-1.4a.9.9 0 0 1-.52-1.72c4.25-1.3 9.62-.64 13.28 1.6.42.26.55.82.52 1.22zm.12-3.36c-3.79-2.25-10.04-2.46-13.66-1.35a1.05 1.05 0 1 1-.61-2.01c4.15-1.27 11.05-1.03 15.44 1.58a1.05 1.05 0 1 1-1.17 1.78z"
    />
  </svg>
);

const AppleMusicIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M15.35 5.8c-.7.82-1.86 1.46-2.93 1.36-.15-1.08.4-2.22 1.03-2.97.7-.84 1.92-1.45 2.93-1.49.12 1.12-.32 2.19-1.03 3.1zM20 17.47c-.52 1.2-1.14 2.34-2.05 3.37-.83.96-1.5 2.04-2.83 2.04-1.31 0-1.65-.83-3.16-.83-1.52 0-1.9.8-3.16.85-1.25.05-2.2-1.15-3.05-2.1-1.7-2.02-3.04-5.75-1.27-8.27.88-1.23 2.47-2 4.2-2.02 1.3-.02 2.52.88 3.16.88.63 0 1.98-1.08 3.68-.92.7.03 2.67.28 3.94 2.1-.1.06-2.34 1.36-2.32 4.05.02 3.22 2.78 4.3 2.86 4.35z"
    />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.6 4.6 12 4.6 12 4.6s-7.6 0-9.4.5a3 3 0 0 0-2.1 2.1C0 9 0 12 0 12s0 3 .5 4.8a3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.8.5-4.8.5-4.8s0-3-.5-4.8zM9.6 15.5V8.5l6.2 3.5-6.2 3.5z"
    />
  </svg>
);

export function ReleaseDetailPage() {
  const { id } = useParams();
  const release = releases.find((r) => r.id === id);

  if (!release) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl mb-4">Release Not Found</h1>
          <Link to="/music">
            <Button variant="primary">Back to Music</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/music" className="inline-flex items-center text-accent hover:text-accent-hover mb-6 sm:mb-8 transition-colors">
          <ChevronLeft size={20} className="mr-1" />
          Back to Music
        </Link>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          {/* Artwork */}
          <div className="aspect-square rounded-xl overflow-hidden">
            <img
              src={release.artwork}
              alt={release.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <span className="px-3 py-1 bg-accent/20 text-accent rounded uppercase text-sm font-heading inline-block mb-4">
              {release.type}
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl mb-4">{release.title}</h1>
            <p className="text-muted-foreground text-lg mb-4">
              Released {new Date(release.releaseDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            {release.description && (
              <p className="text-foreground/90 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                {release.description}
              </p>
            )}

            {/* Streaming Buttons */}
            {(release.spotifyEnabled !== false && release.spotifyUrl) ||
            (release.appleMusicEnabled !== false && release.appleMusicUrl) ||
            (release.youtubeEnabled !== false && release.youtubeUrl) ? (
              <div className="space-y-3 mb-8">
                {release.spotifyEnabled !== false && release.spotifyUrl && (
                  <a href={release.spotifyUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="primary" size="lg" className="w-full">
                      <SpotifyIcon />
                      <span className="ml-2">Listen on Spotify</span>
                    </Button>
                  </a>
                )}
                {release.appleMusicEnabled !== false && release.appleMusicUrl && (
                  <a href={release.appleMusicUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" size="lg" className="w-full">
                      <AppleMusicIcon />
                      <span className="ml-2">Listen on Apple Music</span>
                    </Button>
                  </a>
                )}
                {release.youtubeEnabled !== false && release.youtubeUrl && (
                  <a href={release.youtubeUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" size="lg" className="w-full">
                      <YouTubeIcon />
                      <span className="ml-2">Watch on YouTube</span>
                    </Button>
                  </a>
                )}
              </div>
            ) : null}

            {/* Tracklist */}
            {release.tracks && release.tracks.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading text-xl sm:text-2xl mb-4">TRACKLIST</h3>
                <div className="bg-surface border border-border rounded-lg divide-y divide-border">
                  {release.tracks.map((track, index) => (
                    <div key={index} className="p-3 sm:p-4 flex items-center justify-between hover:bg-accent/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground font-mono">{String(index + 1).padStart(2, '0')}</span>
                        <span>{track}</span>
                      </div>
                      <Play size={16} className="text-accent" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Press Photos */}
            <div className="pt-8 border-t border-border">
              <a href="#" download>
                <Button variant="ghost" className="w-full">
                  <Download size={20} className="mr-2" />
                  Download Press Photos
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
