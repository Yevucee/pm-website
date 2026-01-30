export type ReleaseType = 'single' | 'ep' | 'album';

export interface Release {
  id: string;
  title: string;
  type: ReleaseType;
  releaseDate: string;
  artwork: string;
  spotifyUrl: string;
  appleMusicUrl: string;
  youtubeUrl: string;
  spotifyEnabled?: boolean;
  appleMusicEnabled?: boolean;
  youtubeEnabled?: boolean;
  tracks?: string[];
  description?: string;
}

interface Frontmatter {
  title?: string;
  type?: ReleaseType;
  releaseDate?: string;
  artwork?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  spotifyEnabled?: boolean;
  appleMusicEnabled?: boolean;
  youtubeEnabled?: boolean;
  tracks?: string[];
  description?: string;
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

  return `${window.location.origin}${normalizedBase}${normalizedPath}`;
};

const rawReleaseFiles = import.meta.glob('../../content/releases/*.md', {
  as: 'raw',
  eager: true,
});

function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const match = raw.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: raw.trim() };
  }

  const [, frontmatter, body] = match;
  const data: Frontmatter = {};

  frontmatter
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) {
        return;
      }

      const key = line.slice(0, separatorIndex).trim();
      let value = line.slice(separatorIndex + 1).trim();

      if (!value) {
        return;
      }

      if (value === 'true' || value === 'false') {
        (data as Record<string, unknown>)[key] = value === 'true';
        return;
      }

      if (value.startsWith('[') && value.endsWith(']')) {
        const list = value
          .slice(1, -1)
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
          .map((item) => item.replace(/^["']|["']$/g, ''));
        (data as Record<string, unknown>)[key] = list;
        return;
      }

      value = value.replace(/^["']|["']$/g, '');
      (data as Record<string, unknown>)[key] = value;
    });

  return { data, body: body.trim() };
}

function normalizeDescription(body: string): string | undefined {
  if (!body) {
    return undefined;
  }

  return body.replace(/\s+/g, ' ').trim();
}

export const releases: Release[] = Object.entries(rawReleaseFiles)
  .map(([path, raw]) => {
    const id = path.split('/').pop()?.replace(/\.md$/, '') ?? '';
    const { data, body } = parseFrontmatter(raw as string);
    const description = data.description ?? normalizeDescription(body);

    return {
      id,
      title: data.title ?? 'Untitled Release',
      type: data.type ?? 'single',
      releaseDate: data.releaseDate ?? '',
      artwork: resolvePublicAsset(data.artwork),
      spotifyUrl: data.spotifyUrl ?? '',
      appleMusicUrl: data.appleMusicUrl ?? '',
      youtubeUrl: data.youtubeUrl ?? '',
      spotifyEnabled: data.spotifyEnabled ?? true,
      appleMusicEnabled: data.appleMusicEnabled ?? true,
      youtubeEnabled: data.youtubeEnabled ?? true,
      tracks: data.tracks ?? [],
      description,
    };
  })
  .sort((a, b) => {
    const aTime = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
    const bTime = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
    return bTime - aTime;
  });
