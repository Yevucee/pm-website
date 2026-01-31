interface PageModuleMap {
  [path: string]: Record<string, unknown>;
}

const pageModules = import.meta.glob<Record<string, unknown>>(
  '../../content/pages/*.json',
  { eager: true, import: 'default' }
);

const resolvePageModule = (slug: string) => {
  const entry = Object.entries(pageModules).find(([path]) =>
    path.endsWith(`/${slug}.json`)
  );
  return entry ? entry[1] : null;
};

export const resolvePublicAsset = (value?: string) => {
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

export const getPageContent = <T extends Record<string, unknown>>(
  slug: string,
  fallback: T
): T => {
  const data = resolvePageModule(slug);
  if (!data) {
    return fallback;
  }
  return { ...fallback, ...(data as T) };
};
