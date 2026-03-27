import { useState } from 'react';
import { Button } from '@/app/components/button';
import { Play, Download, ExternalLink } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import Masonry from 'react-responsive-masonry';
import { getPageContent } from '@/data/pages';
import { mediaItems } from '@/data/media';

interface MediaPageContent {
  heroShow?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  introText?: string;
  galleryHeading?: string;
  epkButtonLabel?: string;
  epkButtonUrl?: string;
}

function byDateDesc(a: { date?: string }, b: { date?: string }) {
  const ta = a.date ? new Date(a.date).getTime() : 0;
  const tb = b.date ? new Date(b.date).getTime() : 0;
  if (!ta && !tb) return 0;
  if (!ta) return 1;
  if (!tb) return -1;
  return tb - ta;
}

export function MediaPage() {
  const mediaPage = getPageContent<MediaPageContent>('media', {});
  const [activeTab, setActiveTab] = useState<'albums' | 'photos' | 'videos'>(
    'albums'
  );

  const albumItems = mediaItems.filter((i) => i.albumUrl).sort(byDateDesc);
  const photos = mediaItems.filter(
    (item) => item.type === 'photo' && !item.albumUrl
  );
  const videos = mediaItems.filter((item) => item.type === 'video');

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            {mediaPage.heroShow !== false && (
              <h1 className="font-heading text-5xl sm:text-6xl mb-2">
                {mediaPage.heroTitle || 'MEDIA'}
              </h1>
            )}
            <p className="text-muted-foreground text-xl">
              {mediaPage.heroSubtitle || 'Photos, videos and press materials'}
            </p>
            {mediaPage.introText && (
              <p className="text-muted-foreground mt-2">{mediaPage.introText}</p>
            )}
          </div>
          {mediaPage.epkButtonLabel && (
            <a href={mediaPage.epkButtonUrl || '#'} download>
              <Button variant="outline">
                <Download size={18} className="mr-2" />
                {mediaPage.epkButtonLabel}
              </Button>
            </a>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab('albums')}
            className={cn(
              'pb-4 px-2 font-heading text-xl transition-colors relative',
              activeTab === 'albums'
                ? 'text-accent'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            EVENT ALBUMS
            {activeTab === 'albums' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={cn(
              'pb-4 px-2 font-heading text-xl transition-colors relative',
              activeTab === 'photos' ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            PHOTOS
            {activeTab === 'photos' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={cn(
              'pb-4 px-2 font-heading text-xl transition-colors relative',
              activeTab === 'videos' ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            VIDEOS
            {activeTab === 'videos' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        </div>

        {/* Event albums – linked to Google Photos / external galleries */}
        {activeTab === 'albums' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {albumItems.length === 0 ? (
              <p className="text-muted-foreground col-span-full">
                Albums coming soon.
              </p>
            ) : (
              albumItems.map((item) => (
                <a
                  key={item.id}
                  href={item.albumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <span className="inline-flex items-center gap-2 text-accent font-heading text-sm mb-2">
                        <ExternalLink size={16} />
                        View album
                      </span>
                      <h3 className="font-heading text-2xl sm:text-3xl text-white drop-shadow-md">
                        {item.title}
                      </h3>
                      {item.date && (
                        <p className="text-white/80 text-sm mt-1">
                          {new Date(item.date).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        )}

        {/* Photos Grid */}
        {activeTab === 'photos' && (
          <>
            {mediaPage.galleryHeading && (
              <h2 className="font-heading text-3xl mb-6">{mediaPage.galleryHeading}</h2>
            )}
          <Masonry columnsCount={3} gutter="1.5rem">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-lg cursor-pointer"
              >
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="primary" size="sm">
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </Masonry>
          </>
        )}

        {/* Videos Grid */}
        {activeTab === 'videos' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-accent transition-all cursor-pointer"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={video.image}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-16 h-16 bg-accent text-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play size={28} fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-lg group-hover:text-accent transition-colors">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
