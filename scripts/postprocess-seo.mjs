/**
 * Inject canonical, hreflang, Open Graph, JSON-LD and fix GitHub Pages paths.
 */
import {
  CANONICAL_BASE,
  DEFAULT_LOCALE,
  LOCALES,
  OG_IMAGE_PATH,
  OG_LOCALE,
  SITE,
  SITE_BASE_PATH,
  SOCIAL_LINKS,
  canonicalUrl,
} from './seo-config.mjs';

const SKIP_ATTR_REWRITE = new Set([
  'canonical',
  'alternate',
]);

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fileDepth(relFile) {
  const normalized = relFile.replace(/\\/g, '/');
  if (normalized === 'index.html') return 0;
  return normalized.split('/').length - 1;
}

function relativePrefix(depth) {
  if (depth <= 0) return '.';
  return Array.from({ length: depth }, () => '..').join('/');
}

function isAssetLike(pathname) {
  return /\.[a-z0-9]+$/i.test(pathname.split('/').pop() || '');
}

/**
 * Convert a site-root path (/about, /assets/x.js) into a relative URL
 * from the prerendered HTML file. Relative URLs work both at
 * https://theonlypm.com/about/ and https://user.github.io/pm-website/about/.
 */
export function toRelativeFromFile(relFile, absPath) {
  const hashIndex = absPath.indexOf('#');
  const hash = hashIndex >= 0 ? absPath.slice(hashIndex) : '';
  const withoutHash = hashIndex >= 0 ? absPath.slice(0, hashIndex) : absPath;
  const queryIndex = withoutHash.indexOf('?');
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : '';
  let pathname = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;

  if (SITE_BASE_PATH && (pathname === SITE_BASE_PATH || pathname.startsWith(`${SITE_BASE_PATH}/`))) {
    pathname = pathname.slice(SITE_BASE_PATH.length) || '/';
  }

  if (!pathname.startsWith('/')) {
    return absPath;
  }

  if (pathname !== '/' && !isAssetLike(pathname) && !pathname.endsWith('/')) {
    pathname += '/';
  }

  const depth = fileDepth(relFile);
  const prefix = relativePrefix(depth);

  if (pathname === '/') {
    return `${prefix}/${hash}`.replace(/\/+$/, '/') + (query ? query.replace(/^\?/, '?') : '');
  }

  const rest = pathname.replace(/^\//, '');
  return `${prefix}/${rest}${query}${hash}`;
}

function stripLocalhost(url) {
  return url.replace(/^https?:\/\/(?:127\.0\.0\.1|localhost):\d+/i, '');
}

function shouldRewriteUrl(url) {
  if (!url) return false;
  if (
    url.startsWith('mailto:') ||
    url.startsWith('tel:') ||
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.startsWith('javascript:') ||
    url.startsWith('#')
  ) {
    return false;
  }
  if (/^https?:\/\//i.test(url) && !/^https?:\/\/(?:127\.0\.0\.1|localhost):\d+/i.test(url)) {
    return false;
  }
  return true;
}

function rewriteUrl(url, relFile) {
  let next = stripLocalhost(url);
  if (!next.startsWith('/')) return next;
  if (next.startsWith('//')) return next;
  return toRelativeFromFile(relFile, next);
}

function rewriteAttributeUrls(html, relFile) {
  const attrs = ['href', 'src', 'poster', 'data-src'];
  let out = html;
  for (const attr of attrs) {
    out = out.replace(
      new RegExp(`(\\b${attr}=")([^"]+)(")`, 'gi'),
      (match, pre, value, post, offset, full) => {
        const before = full.slice(Math.max(0, offset - 80), offset);
        if (/rel="canonical"/i.test(before) || /hreflang="/i.test(before)) {
          return match;
        }
        if (/property="og:/i.test(before) || /name="twitter:/i.test(before)) {
          return match;
        }
        if (!shouldRewriteUrl(value)) return match;
        return `${pre}${rewriteUrl(value, relFile)}${post}`;
      }
    );
  }

  out = out.replace(/srcset="([^"]+)"/gi, (match, value) => {
    const parts = value.split(',').map((part) => {
      const trimmed = part.trim();
      const m = trimmed.match(/^(\S+)(\s+.+)?$/);
      if (!m) return trimmed;
      const url = m[1];
      const descriptor = m[2] ?? '';
      if (!shouldRewriteUrl(url)) return trimmed;
      return `${rewriteUrl(url, relFile)}${descriptor}`;
    });
    return `srcset="${parts.join(', ')}"`;
  });

  return out;
}

function buildHreflangLinks(page) {
  return LOCALES.map(
    (loc) =>
      `<link rel="alternate" hreflang="${loc}" href="${escapeHtml(canonicalUrl(loc, page))}">`
  ).join('\n  ');
}

function buildJsonLd(page) {
  const url = canonicalUrl(page.locale, page);
  if (page.id === 'home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': `${CANONICAL_BASE}/#person`,
          name: SITE.name,
          alternateName: SITE.legalName,
          url: `${CANONICAL_BASE}/`,
          email: SITE.email,
          description: page.description,
          image: `${CANONICAL_BASE}${OG_IMAGE_PATH}`,
          sameAs: SOCIAL_LINKS,
        },
        {
          '@type': 'WebSite',
          '@id': `${CANONICAL_BASE}/#website`,
          url: `${CANONICAL_BASE}/`,
          name: SITE.name,
          description: page.description,
          inLanguage: 'en',
          publisher: { '@id': `${CANONICAL_BASE}/#person` },
        },
      ],
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    url,
    description: page.description,
    inLanguage: 'en',
    isPartOf: { '@id': `${CANONICAL_BASE}/#website` },
  };
}

export function postprocessHtml(html, page) {
  const canonical = canonicalUrl(page.locale, page);
  const ogImage = `${CANONICAL_BASE}${OG_IMAGE_PATH}`;
  const ogLocale = OG_LOCALE[page.locale] ?? 'en_GB';

  let out = html;

  out = out.replace(/<html lang="[^"]*">/, `<html lang="${page.locale}">`);
  if (!/<html lang=/.test(out)) {
    out = out.replace(/<html\b/, `<html lang="${page.locale}"`);
  }

  if (/<title>[\s\S]*?<\/title>/.test(out)) {
    out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  } else {
    out = out.replace('</head>', `  <title>${escapeHtml(page.title)}</title>\n</head>`);
  }

  const descTag = `<meta name="description" content="${escapeHtml(page.description)}">`;
  if (out.includes('name="description"')) {
    out = out.replace(/<meta name="description" content="[^"]*">/, descTag);
  } else {
    out = out.replace('</head>', `  ${descTag}\n</head>`);
  }

  out = out.replace(/<link rel="canonical"[^>]*>\s*/g, '');
  out = out.replace(/<link rel="alternate" hreflang="[^"]*"[^>]*>\s*/g, '');
  out = out.replace(/<meta property="og:[^"]+"[^>]*>\s*/g, '');
  out = out.replace(/<meta name="twitter:[^"]+"[^>]*>\s*/g, '');
  out = out.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, '');

  const jsonLd = buildJsonLd(page);
  const headInject = `
  <link rel="canonical" href="${escapeHtml(canonical)}">
  ${buildHreflangLinks(page)}
  <link rel="alternate" hreflang="x-default" href="${escapeHtml(canonicalUrl(DEFAULT_LOCALE, page))}">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(ogImage)}">
  <meta property="og:locale" content="${ogLocale}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.description)}">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
`;

  out = out.replace('</head>', `${headInject}</head>`);
  out = rewriteAttributeUrls(out, page.file);

  // Drop leftover ?lang= bookmarks if any appear in prerendered markup.
  out = out.replace(/\?lang=[a-z-]+/gi, '');

  return out;
}

void SKIP_ATTR_REWRITE;
void SITE_BASE_PATH;
