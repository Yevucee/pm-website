/**
 * Generate sitemap.xml, robots.txt and llms.txt at dist root.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CANONICAL_BASE,
  DEFAULT_LOCALE,
  LOCALES,
  PAGES,
  SITE,
  canonicalUrl,
} from './seo-config.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, '..', 'dist');

export function generateSeoFiles(distDir = DIST) {
  if (!fs.existsSync(distDir)) {
    console.error('generate-seo-files: dist/ not found');
    process.exit(1);
  }

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), buildSitemap(), 'utf8');
  fs.writeFileSync(path.join(distDir, 'robots.txt'), buildRobots(), 'utf8');
  fs.writeFileSync(path.join(distDir, 'llms.txt'), buildLlmsTxt(), 'utf8');
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
  console.log('generate-seo-files: wrote sitemap.xml, robots.txt, llms.txt, .nojekyll');
}

function buildSitemap() {
  const urls = PAGES.map((page) => {
    const loc = canonicalUrl(page.locale, page);
    const alternates = LOCALES.map(
      (locale) =>
        `    <xhtml:link rel="alternate" hreflang="${locale}" href="${canonicalUrl(locale, page)}" />`
    ).join('\n');
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${canonicalUrl(DEFAULT_LOCALE, page)}" />`;
    return `  <url>
    <loc>${loc}</loc>
${alternates}
${xDefault}
    <changefreq>weekly</changefreq>
    <priority>${page.id === 'home' ? '1.0' : page.schema.includes('WebPage') && page.path.split('/').filter(Boolean).length === 1 ? '0.8' : '0.6'}</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
}

function buildRobots() {
  return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

Sitemap: ${CANONICAL_BASE}/sitemap.xml
`;
}

function buildLlmsTxt() {
  const topLevel = PAGES.filter(
    (page) => page.path.split('/').filter(Boolean).length <= 1
  );
  const pageLines = topLevel
    .map((page) => `- ${page.title}: ${canonicalUrl(page.locale, page)}`)
    .join('\n');

  return `# ${SITE.name}

> ${SITE.legalName} (PM) is a London DJ, rapper, and event organiser — award-winning radio host, Pidgin rap pioneer, and curator of boat parties and club nights.

Canonical homepage: ${CANONICAL_BASE}/

## English
${pageLines}

## Contact
Email: ${SITE.email}

## Canonical site
${CANONICAL_BASE}/

## GitHub Pages preview (not canonical)
https://${SITE.githubUser}.github.io/${SITE.repoName}/

## Sitemap
${CANONICAL_BASE}/sitemap.xml
`;
}

generateSeoFiles();
