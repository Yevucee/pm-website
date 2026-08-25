/** Dual-URL helper: GitHub Pages project preview vs production root. */

export const REPO_NAME = 'pm-website';

function normalizeBase(path: string): string {
  if (!path || path === '/') return '';
  const trimmed = path.replace(/\/+$/, '');
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/**
 * Returns `/pm-website` on github.io project pages, and `''` on a
 * production/custom-domain root (theonlypm.com) and on localhost prerender.
 */
export function detectSiteBase(
  hostname = typeof window !== 'undefined' ? window.location.hostname : '',
  pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
): string {
  const first = pathname.split('/').filter(Boolean)[0];

  if (hostname.endsWith('.github.io')) {
    return first ? `/${first}` : `/${REPO_NAME}`;
  }

  // Local GitHub Pages simulation (e.g. /pm-website/about/ on 127.0.0.1).
  // Production (theonlypm.com) and prerender (dist served at /) never use
  // this first-segment — those routes start with about/, music/, etc.
  if (first === REPO_NAME) {
    return `/${REPO_NAME}`;
  }

  if (hostname) return '';

  if (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) {
    const envBase = normalizeBase(String(import.meta.env.BASE_URL).replace(/\/+$/, '') || '/');
    if (envBase && envBase !== '/') return envBase;
  }

  return '';
}

export function withSiteBase(path: string): string {
  const base = detectSiteBase();
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (!base) return clean;
  if (clean === base || clean.startsWith(`${base}/`)) return clean;
  return `${base}${clean}`;
}

/** Prefix a public/ CMS asset path with the current site base. */
export function resolvePublicAsset(value?: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const base = detectSiteBase();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const normalizedPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  const prefixed = `${base}/${normalizedPath}`.replace(/\/{2,}/g, '/');
  return `${origin}${prefixed.startsWith('/') ? prefixed : `/${prefixed}`}`;
}
