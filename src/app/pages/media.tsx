import { useState } from 'react';
import { Button } from '@/app/components/button';
import { Play, Download } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import Masonry from 'react-responsive-masonry';

export function MediaPage() {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');

  const photos = [
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
    'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    'https://images.unsplash.com/photo-1525027811520-834fdec34ecb?w=800',
    'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=800',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800'
  ];

  const videos = [
    { title: 'Thames Boat Party Highlights', thumbnail: 'https://images.unsplash.com/photo-1525027811520-834fdec34ecb?w=800', duration: '3:42' },
    { title: 'Warehouse Sessions Vol. 1', thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', duration: '5:18' },
    { title: 'Live at Fabric', thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800', duration: '4:25' },
    { title: 'Behind The Decks', thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800', duration: '2:55' }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-heading text-5xl sm:text-6xl mb-2">MEDIA</h1>
            <p className="text-muted-foreground text-xl">
              Photos, videos and press materials
            </p>
          </div>
          <a href="#" download>
            <Button variant="outline">
              <Download size={18} className="mr-2" />
              Download EPK
            </Button>
          </a>
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
          <Masonry columnsCount={3} gutter="1.5rem">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg cursor-pointer"
              >
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
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
        )}

        {/* Videos Grid */}
        {activeTab === 'videos' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <div
                key={index}
                className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-accent transition-all cursor-pointer"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-16 h-16 bg-accent text-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play size={28} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-sm">
                    {video.duration}
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
