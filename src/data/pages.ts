export { resolvePublicAsset } from '@/utils/site-base';

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
