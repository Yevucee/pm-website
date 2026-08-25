import { resolvePublicAsset } from '@/utils/site-base';

export type MediaType = 'photo' | 'video';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  image: string;
  videoUrl?: string;
  date?: string;
  albumUrl?: string;
}

interface MediaContent {
  title?: string;
  type?: MediaType;
  image?: string;
  videoUrl?: string;
  date?: string;
  albumUrl?: string;
}

const mediaModules = import.meta.glob<MediaContent>('../../content/media/*.json', {
  eager: true,
  import: 'default'
});

const normalizeMediaType = (value?: string): MediaType => {
  if (value === 'video') {
    return 'video';
  }
  return 'photo';
};

const parseMedia = (path: string, data: MediaContent): MediaItem | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const id = path.split('/').pop()?.replace(/\.json$/, '') || '';
  const title = data.title?.trim() || '';
  const image = resolvePublicAsset(data.image);

  if (!id || !title || !image) {
    return null;
  }

  const albumUrl = data.albumUrl?.trim();
  const safeAlbum =
    albumUrl && /^https?:\/\//i.test(albumUrl) ? albumUrl : undefined;

  return {
    id,
    title,
    type: normalizeMediaType(data.type),
    image,
    videoUrl: data.videoUrl?.trim() || undefined,
    date: data.date?.trim() || undefined,
    albumUrl: safeAlbum
  };
};

export const mediaItems: MediaItem[] = Object.entries(mediaModules)
  .map(([path, data]) => parseMedia(path, data))
  .filter((item): item is MediaItem => Boolean(item));
