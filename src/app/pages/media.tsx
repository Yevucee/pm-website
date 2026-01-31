import { useState } from 'react';
import { Button } from '@/app/components/button';
import { Play, Download } from 'lucide-react';
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

export function MediaPage() {
  const mediaPage = getPageContent<MediaPageContent>('media', {});
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const photos = mediaItems.filter((item) => item.type === 'photo');
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
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
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
