import { useState } from 'react';
import { ReleaseCard } from '@/app/components/release-card';
import { releases } from '@/data/releases';
import { cn } from '@/app/components/ui/utils';
import { getPageContent } from '@/data/pages';

interface MusicPageContent {
  heroShow?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  introText?: string;
  releasesHeading?: string;
  filterLabels?: { label?: string; value?: string }[];
}

export function MusicPage() {
  const music = getPageContent<MusicPageContent>('music', {});
  const [filter, setFilter] = useState<'all' | 'single' | 'ep' | 'album'>('all');

  const filteredReleases = filter === 'all' 
    ? releases 
    : releases.filter((r) => r.type === filter);
  const filterOptions = (music.filterLabels || []).filter((item) => item.value);

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {music.heroShow !== false && (
          <h1 className="font-heading text-4xl sm:text-6xl mb-4">
            {music.heroTitle || 'MUSIC'}
          </h1>
        )}
        <p className="text-muted-foreground text-base sm:text-xl mb-8 max-w-3xl leading-relaxed">
          {music.introText ||
            'From pioneering Pidgin rap to global Afro-urban sounds, PM blends humour, storytelling, and classic hip-hop influences with African-infused beats.'}
        </p>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-12">
          {(filterOptions.length > 0 ? filterOptions : [
            { label: 'All', value: 'all' },
            { label: 'Singles', value: 'single' },
            { label: 'EPs', value: 'ep' },
            { label: 'Albums', value: 'album' }
          ]).map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value as typeof filter)}
              className={cn(
                'px-4 sm:px-6 py-2 rounded-full font-heading text-sm sm:text-base transition-all',
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
        {music.releasesHeading && (
          <h2 className="font-heading text-3xl mb-6">{music.releasesHeading}</h2>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredReleases.map((release) => (
            <ReleaseCard key={release.id} release={release} />
          ))}
        </div>
      </div>
    </div>
  );
}
