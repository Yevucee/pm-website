import { useParams, Link } from 'react-router-dom';
import { Button } from '@/app/components/button';
import { Music, Play, ChevronLeft, Download } from 'lucide-react';
import { releases } from '@/data/releases';

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
                      <Music size={20} className="mr-2" />
                      Listen on Spotify
                    </Button>
                  </a>
                )}
                {release.appleMusicEnabled !== false && release.appleMusicUrl && (
                  <a href={release.appleMusicUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" size="lg" className="w-full">
                      <Music size={20} className="mr-2" />
                      Listen on Apple Music
                    </Button>
                  </a>
                )}
                {release.youtubeEnabled !== false && release.youtubeUrl && (
                  <a href={release.youtubeUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" size="lg" className="w-full">
                      <Play size={20} className="mr-2" />
                      Watch on YouTube
                    </Button>
                  </a>
                )}
              </div>
            ) : null}

            {/* Spotify Player Placeholder */}
            <div className="bg-surface border border-border rounded-lg p-6 sm:p-8 mb-8">
              <div className="flex flex-col items-center justify-center text-center">
                <Music size={48} className="mb-4 text-accent opacity-50" />
                <p className="text-muted-foreground">Embedded Spotify Player</p>
              </div>
            </div>

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
