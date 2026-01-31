export type MediaType = 'photo' | 'video';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  image: string;
  videoUrl?: string;
  date?: string;
}

interface MediaContent {
  title?: string;
  type?: MediaType;
  image?: string;
  videoUrl?: string;
  date?: string;
}

const resolvePublicAsset = (value?: string) => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  const basePrefix = normalizedBase.replace(/^\/|\/$/g, '');
  const normalizedWithSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  if (basePrefix && normalizedWithSlash.startsWith(`/${basePrefix}/`)) {
    return `${window.location.origin}${normalizedWithSlash}`;
  }

  return `${window.location.origin}${normalizedBase}${normalizedPath}`;
};

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

  return {
    id,
    title,
    type: normalizeMediaType(data.type),
    image,
    videoUrl: data.videoUrl?.trim() || undefined,
    date: data.date?.trim() || undefined
  };
};

export const mediaItems: MediaItem[] = Object.entries(mediaModules)
  .map(([path, data]) => parseMedia(path, data))
  .filter((item): item is MediaItem => Boolean(item));
