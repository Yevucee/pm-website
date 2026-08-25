#!/usr/bin/env node
/**
 * audit:seo — fail CI if prerendered dist/ is missing bot-readable SEO.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CANONICAL_BASE,
  DEFAULT_LOCALE,
  LOCALES,
  PAGES,
  SITE,
  canonicalUrl,
} from './seo-config.mjs';

const ROOT = pathDirname();
const DIST = join(ROOT, '..', 'dist');

function pathDirname() {
  return fileURLToPath(new URL('.', import.meta.url));
}

const stats = { ok: 0, fail: 0, issues: [] };

function pass(msg) {
  stats.ok++;
  console.log(`  ✓ ${msg}`);
}

function fail(msg) {
  stats.fail++;
  stats.issues.push(msg);
  console.error(`  ✗ ${msg}`);
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

console.log('audit:seo — scanning dist/\n');

if (!existsSync(DIST)) {
  console.error('dist/ not found — run npm run build first');
  process.exit(1);
}

for (const page of PAGES) {
  const fp = join(DIST, page.file);
  const urlPath = page.path;
  console.log(`${urlPath}:`);

  if (!existsSync(fp)) {
    fail(`${urlPath}: MISSING FILE ${page.file}`);
    console.log('');
    continue;
  }

  const html = readFileSync(fp, 'utf8');

  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(
    (m) => m[1]
  );
  const expectedCanonical = canonicalUrl(page.locale, page);
  if (canonicals.length !== 1) {
    fail(`${urlPath}: expected 1 canonical, got ${canonicals.length}`);
  } else if (canonicals[0] !== expectedCanonical) {
    fail(`${urlPath}: canonical ${canonicals[0]} != ${expectedCanonical}`);
  } else if (canonicals[0].includes(`/${SITE.repoName}`)) {
    fail(`${urlPath}: canonical must not include SITE_BASE_PATH`);
  } else {
    pass(`${urlPath}: canonical OK`);
  }

  const hreflang = [
    ...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g),
  ].map((m) => ({ lang: m[1], href: m[2] }));
  const langs = new Set(hreflang.map((h) => h.lang));
  for (const loc of [...LOCALES, 'x-default']) {
    if (!langs.has(loc)) fail(`${urlPath}: missing hreflang ${loc}`);
    else pass(`${urlPath}: hreflang="${loc}" OK`);
  }
  for (const h of hreflang) {
    const expected =
      h.lang === 'x-default'
        ? canonicalUrl(DEFAULT_LOCALE, page)
        : canonicalUrl(h.lang, page);
    if (h.href !== expected) {
      fail(`${urlPath}: hreflang ${h.lang} href ${h.href} != ${expected}`);
    }
  }

  const lang = html.match(/<html lang="([^"]+)"/)?.[1] ?? '';
  if (lang !== page.locale) fail(`${urlPath}: html lang ${lang} != ${page.locale}`);
  else pass(`${urlPath}: html lang OK`);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  if (!title) fail(`${urlPath}: missing title`);
  else pass(`${urlPath}: title OK`);

  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  if (!desc) fail(`${urlPath}: missing meta description`);
  else pass(`${urlPath}: description OK`);

  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count !== 1) fail(`${urlPath}: expected 1 h1, got ${h1Count}`);
  else pass(`${urlPath}: single h1 OK`);

  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? '';
  const mainLen = stripTags(main).length;
  if (!main) fail(`${urlPath}: missing <main>`);
  else if (mainLen < 200) fail(`${urlPath}: main text too short (${mainLen})`);
  else pass(`${urlPath}: main text ≥200 chars (${mainLen})`);

  if (/<meta name="robots"[^>]*noindex/i.test(html)) fail(`${urlPath}: noindex present`);
  else pass(`${urlPath}: no noindex`);

  if (/[?&]lang=/.test(html)) fail(`${urlPath}: found ?lang= in output`);
  else pass(`${urlPath}: no ?lang= links`);

  if (!html.includes('id="site-header"')) fail(`${urlPath}: missing header`);
  else pass(`${urlPath}: header OK`);
  if (!html.includes('id="site-footer"')) fail(`${urlPath}: missing footer`);
  else pass(`${urlPath}: footer OK`);

  const ogUrl = html.match(/<meta property="og:url" content="([^"]*)"/)?.[1];
  if (ogUrl !== expectedCanonical) fail(`${urlPath}: og:url mismatch ${ogUrl}`);
  else pass(`${urlPath}: og:url OK`);

  const ldBlocks = [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ].map((m) => m[1]);
  if (!ldBlocks.length) {
    fail(`${urlPath}: missing JSON-LD`);
  } else {
    let valid = true;
    for (const block of ldBlocks) {
      try {
        const data = JSON.parse(block);
        const str = JSON.stringify(data);
        if (/placeholder|TODO|lorem ipsum|FIXME|example\.com/i.test(str)) {
          fail(`${urlPath}: placeholder in JSON-LD`);
          valid = false;
        }
        if (/aggregateRating|reviewCount|"price"|streetAddress|"rating"/i.test(str)) {
          fail(`${urlPath}: invented JSON-LD commercial data`);
          valid = false;
        }
      } catch (e) {
        fail(`${urlPath}: invalid JSON-LD: ${e.message}`);
        valid = false;
      }
    }
    if (valid) pass(`${urlPath}: JSON-LD valid`);
  }

  console.log('');
}

const sitemapPath = join(DIST, 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  fail('sitemap.xml missing');
} else {
  const sitemap = readFileSync(sitemapPath, 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (locs.length !== PAGES.length) {
    fail(`sitemap: expected ${PAGES.length} URLs, got ${locs.length}`);
  } else {
    pass(`sitemap: ${locs.length} URLs`);
  }
  for (const loc of locs) {
    if (loc.includes('index.html')) fail(`sitemap contains index.html: ${loc}`);
    if (!loc.startsWith(CANONICAL_BASE)) fail(`sitemap URL not canonical: ${loc}`);
    if (loc.includes(`/${SITE.repoName}/`) && !CANONICAL_BASE.includes(SITE.repoName)) {
      fail(`sitemap mixes preview path into canonical: ${loc}`);
    }
  }
}

const robotsPath = join(DIST, 'robots.txt');
if (!existsSync(robotsPath)) {
  fail('robots.txt missing');
} else {
  const robots = readFileSync(robotsPath, 'utf8');
  if (!robots.includes(`Sitemap: ${CANONICAL_BASE}/sitemap.xml`)) {
    fail('robots.txt missing sitemap line');
  } else {
    pass('robots.txt sitemap line OK');
  }
}

if (!existsSync(join(DIST, 'llms.txt'))) fail('llms.txt missing');
else pass('llms.txt present');

if (!existsSync(join(DIST, '.nojekyll'))) fail('.nojekyll missing');
else pass('.nojekyll present');

console.log(`\naudit:seo — ${stats.ok}/${stats.ok + stats.fail} checks passed`);
if (stats.fail > 0) {
  console.error(`\n${stats.fail} check(s) failed:`);
  for (const issue of stats.issues) console.error(`  - ${issue}`);
  process.exit(1);
}

console.log('All SEO audits passed.');
