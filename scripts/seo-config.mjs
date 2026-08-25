/**
 * Dual-URL SEO config for GitHub Pages preview vs production canonical.
 *
 * CANONICAL_BASE  → production domain (never includes SITE_BASE_PATH)
 * SITE_BASE_PATH  → GitHub Pages project-site prefix (e.g. /pm-website)
 *
 * theonlypm.com is already a custom domain at site root. Internal preview
 * paths are rewritten to *relative* URLs so the same dist works at
 * https://yevucee.github.io/pm-website/ and https://theonlypm.com/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export const SITE = {
  name: 'The PM',
  legalName: 'The Prhyme Minister',
  email: 'theonlypm@gmail.com',
  githubUser: 'Yevucee',
  repoName: 'pm-website',
};

export const CANONICAL_BASE = (
  process.env.CANONICAL_BASE || 'https://theonlypm.com'
).replace(/\/+$/, '');

export const SITE_BASE_PATH = normalizeBasePath(
  process.env.SITE_BASE_PATH || '/pm-website'
);

export const LOCALES = ['en'];
export const DEFAULT_LOCALE = 'en';
export const OG_LOCALE = { en: 'en_GB' };
export const OG_IMAGE_PATH = '/uploads/pm.jpg';

const SKIP_FILES = new Set(['README.md', '.gitkeep']);

function normalizeBasePath(value) {
  if (!value || value === '/') return '';
  const trimmed = String(value).replace(/\/+$/, '');
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function truncate(text, max = 160) {
  const cleaned = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

function listContentIds(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(ext) && !SKIP_FILES.has(name))
    .map((name) => name.slice(0, -ext.length));
}

function parseReleaseMeta(id) {
  const filePath = path.join(ROOT, 'content', 'releases', `${id}.md`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const title = raw.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] || id;
  const body = raw.replace(/^---[\s\S]*?---/, '').trim();
  return {
    title,
    description: truncate(
      body || `${title} — music by The PM (The Prhyme Minister).`
    ),
  };
}

function parseJsonMeta(folder, id, titleKey, descriptionKey) {
  const data = readJson(path.join(ROOT, 'content', folder, `${id}.json`));
  const title = String(data[titleKey] || id);
  const description = truncate(
    data[descriptionKey] || `${title} — The PM (The Prhyme Minister).`
  );
  return { title, description };
}

const home = readJson(path.join(ROOT, 'content', 'pages', 'home.json'));
const about = readJson(path.join(ROOT, 'content', 'pages', 'about.json'));
const contact = readJson(path.join(ROOT, 'content', 'pages', 'contact.json'));
const music = readJson(path.join(ROOT, 'content', 'pages', 'music.json'));
const events = readJson(path.join(ROOT, 'content', 'pages', 'events.json'));
const merch = readJson(path.join(ROOT, 'content', 'pages', 'merch.json'));
const media = readJson(path.join(ROOT, 'content', 'pages', 'media.json'));
const pmDj = readJson(path.join(ROOT, 'content', 'pages', 'pm-the-dj.json'));
const pmArtist = readJson(
  path.join(ROOT, 'content', 'pages', 'pm-the-artist.json')
);

/** @typedef {{ id: string, file: string, locale: string, title: string, description: string, path: string, route: string, schema: string[] }} PageDef */

/** @type {PageDef[]} */
export const STATIC_PAGES = [
  {
    id: 'home',
    file: 'index.html',
    locale: 'en',
    title: 'PM',
    description: truncate(
      home.heroDescription ||
        home.bioText ||
        'Award-winning DJ and rapper; early 2000s pioneer of Pidgin rap, one half of Hiplife group KgPM.'
    ),
    path: '/',
    route: '/',
    schema: ['Person', 'WebSite'],
  },
  {
    id: 'about',
    file: 'about/index.html',
    locale: 'en',
    title: 'About The PM | The Prhyme Minister',
    description: truncate(about.introText || about.body || about.heroTitle),
    path: '/about/',
    route: '/about',
    schema: ['WebPage'],
  },
  {
    id: 'contact',
    file: 'contact/index.html',
    locale: 'en',
    title: 'Book The PM | Contact',
    description: truncate(
      contact.heroSubtitle || contact.introText || contact.heroTitle
    ),
    path: '/contact/',
    route: '/contact',
    schema: ['WebPage'],
  },
  {
    id: 'music',
    file: 'music/index.html',
    locale: 'en',
    title: 'PM the Artist | Music',
    description: truncate(music.introText || music.heroTitle),
    path: '/music/',
    route: '/music',
    schema: ['WebPage'],
  },
  {
    id: 'events',
    file: 'events/index.html',
    locale: 'en',
    title: 'Events | Parties by The PM',
    description: truncate(
      events.introText || events.signatureText || events.heroTitle
    ),
    path: '/events/',
    route: '/events',
    schema: ['WebPage'],
  },
  {
    id: 'merch',
    file: 'merch/index.html',
    locale: 'en',
    title: 'Merch | The PM',
    description: truncate(merch.introText || merch.heroTitle),
    path: '/merch/',
    route: '/merch',
    schema: ['WebPage'],
  },
  {
    id: 'media',
    file: 'media/index.html',
    locale: 'en',
    title: 'Media | The PM',
    description: truncate(
      media.heroSubtitle || media.introText || 'Photo albums from events by The PM.'
    ),
    path: '/media/',
    route: '/media',
    schema: ['WebPage'],
  },
  {
    id: 'pm-the-dj',
    file: 'pm-the-dj/index.html',
    locale: 'en',
    title: 'PM the DJ | Bookings',
    description: truncate(pmDj.heroDescription || pmDj.bioText || pmDj.heroTitle),
    path: '/pm-the-dj/',
    route: '/pm-the-dj',
    schema: ['WebPage'],
  },
  {
    id: 'pm-the-artist',
    file: 'pm-the-artist/index.html',
    locale: 'en',
    title: 'PM the Artist | The Prhyme Minister',
    description: truncate(pmArtist.introText || pmArtist.body || pmArtist.heroTitle),
    path: '/pm-the-artist/',
    route: '/pm-the-artist',
    schema: ['WebPage'],
  },
  {
    id: 'privacy',
    file: 'privacy/index.html',
    locale: 'en',
    title: 'Privacy Policy | The PM',
    description:
      'How The PM (The Prhyme Minister) collects, uses, and protects information on this website.',
    path: '/privacy/',
    route: '/privacy',
    schema: ['WebPage'],
  },
  {
    id: 'terms',
    file: 'terms/index.html',
    locale: 'en',
    title: 'Terms of Service | The PM',
    description:
      'Terms of service for The PM website, including use of the site, tickets, and merchandise.',
    path: '/terms/',
    route: '/terms',
    schema: ['WebPage'],
  },
];

const releasePages = listContentIds(path.join(ROOT, 'content', 'releases'), '.md').map(
  (id) => {
    const meta = parseReleaseMeta(id);
    return {
      id: `music-${id}`,
      file: `music/${id}/index.html`,
      locale: 'en',
      title: `${meta.title} | The PM`,
      description: meta.description,
      path: `/music/${id}/`,
      route: `/music/${id}`,
      schema: ['WebPage'],
    };
  }
);

const eventPages = listContentIds(path.join(ROOT, 'content', 'events'), '.json').map(
  (id) => {
    const meta = parseJsonMeta('events', id, 'title', 'description');
    return {
      id: `events-${id}`,
      file: `events/${id}/index.html`,
      locale: 'en',
      title: `${meta.title} | Events | The PM`,
      description: meta.description,
      path: `/events/${id}/`,
      route: `/events/${id}`,
      schema: ['WebPage'],
    };
  }
);

const merchPages = listContentIds(path.join(ROOT, 'content', 'merch'), '.json').map(
  (id) => {
    const meta = parseJsonMeta('merch', id, 'name', 'description');
    return {
      id: `merch-${id}`,
      file: `merch/${id}/index.html`,
      locale: 'en',
      title: `${meta.title} | Merch | The PM`,
      description: meta.description,
      path: `/merch/${id}/`,
      route: `/merch/${id}`,
      schema: ['WebPage'],
    };
  }
);

/** @type {PageDef[]} */
export const PAGES = [...STATIC_PAGES, ...releasePages, ...eventPages, ...merchPages];

/**
 * Production canonical URL — always CANONICAL_BASE, never SITE_BASE_PATH.
 * @param {string} locale
 * @param {PageDef} page
 */
export function canonicalUrl(locale, page) {
  void locale;
  return `${CANONICAL_BASE}${page.path}`;
}

/**
 * GitHub Pages preview URL path (includes SITE_BASE_PATH).
 * @param {string} locale
 * @param {PageDef} page
 */
export function pageUrl(locale, page) {
  void locale;
  if (page.path === '/') {
    return `${SITE_BASE_PATH}/`;
  }
  return `${SITE_BASE_PATH}${page.path}`;
}

/**
 * Runtime helper — SITE_BASE_PATH on github.io preview, '' on production root.
 * @param {string} [hostname]
 */
export function detectSiteBase(hostname = '') {
  if (!hostname) return SITE_BASE_PATH;
  if (hostname.endsWith('.github.io')) return SITE_BASE_PATH;
  return '';
}

export function findPageByFile(relativeFile) {
  const normalized = relativeFile.replace(/\\/g, '/');
  return PAGES.find((p) => p.file === normalized);
}

export function findPageByRoute(route) {
  const normalized = route.replace(/\/+$/, '') || '/';
  return PAGES.find((p) => (p.route.replace(/\/+$/, '') || '/') === normalized);
}

export const SOCIAL_LINKS = [
  'https://www.instagram.com/_thepm_',
  'https://x.com/_thepm_',
  'https://www.youtube.com/@thepm',
  'https://www.tiktok.com/@_thepm_',
  'https://open.spotify.com/album/3Ym3xOwfN2rByjWBiLnNqu',
  'https://music.apple.com/us/album/the-passion-mixtape/1774418927',
];
