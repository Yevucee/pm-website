import { useState } from 'react';
import { ReleaseCard } from '@/app/components/release-card';
import { releases } from '@/data/mock-data';
import { cn } from '@/app/components/ui/utils';

export function MusicPage() {
  const [filter, setFilter] = useState<'all' | 'single' | 'ep' | 'album'>('all');

  const filteredReleases = filter === 'all' 
    ? releases 
    : releases.filter((r) => r.type === filter);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-heading text-5xl sm:text-6xl mb-4">MUSIC</h1>
        <p className="text-muted-foreground text-lg sm:text-xl mb-8 max-w-3xl leading-relaxed">
          From pioneering Pidgin rap to global Afro-urban sounds, PM blends humour, storytelling, and classic hip-hop influences with African-infused beats.
        </p>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-3 mb-12">
          {[
            { label: 'All', value: 'all' as const },
            { label: 'Singles', value: 'single' as const },
            { label: 'EPs', value: 'ep' as const },
            { label: 'Albums', value: 'album' as const }
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={cn(
                'px-6 py-2 rounded-full font-heading transition-all',
                filter === item.value
                  ? 'bg-accent text-black'
                  : 'bg-surface border border-border hover:border-accent'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Releases Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredReleases.map((release) => (
            <ReleaseCard key={release.id} release={release} />
          ))}
        </div>
      </div>
    </div>
  );
}
