#!/usr/bin/env node
/**
 * audit:preview-base — GitHub Pages path checks on dist/.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CANONICAL_BASE,
  PAGES,
  SITE,
  SITE_BASE_PATH,
  canonicalUrl,
  pageUrl,
} from './seo-config.mjs';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(ROOT, '..', 'dist');
const PREVIEW_BASE = SITE_BASE_PATH || `/${SITE.repoName}`;
const repo = SITE.repoName;

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

function collectUrls(html, attr) {
  return [...html.matchAll(new RegExp(`${attr}="([^"]+)"`, 'g'))].map((m) => m[1]);
}

function isBrokenPreviewPath(href) {
  if (!href) return false;
  return (
    href.includes(`/${repo}/${repo}/${repo}/`) ||
    href.includes(`/${repo}/${repo}/`) ||
    href.includes(`/de/${repo}/`) ||
    href.includes(`/fr/${repo}/`) ||
    href.includes(`/${repo}/fr/fr/`) ||
    href.includes(`/${repo}/de/de/`) ||
    href.includes(`/${repo}/de/assets/`) ||
    href.includes(`/${repo}/fr/assets/`)
  );
}

console.log('audit:preview-base — scanning dist/');
console.log(`  SITE_BASE_PATH=${SITE_BASE_PATH || '(empty)'}`);
console.log(`  CANONICAL_BASE=${CANONICAL_BASE}\n`);

if (!existsSync(DIST)) {
  console.error('dist/ not found — run npm run build first');
  process.exit(1);
}

for (const page of PAGES) {
  const fp = join(DIST, page.file);
  const urlPath = pageUrl(page.locale, page);
  console.log(`${urlPath}:`);

  if (!existsSync(fp)) {
    fail(`MISSING FILE: ${urlPath}`);
    console.log('');
    continue;
  }

  const html = readFileSync(fp, 'utf8');
  const depth = page.file === 'index.html' ? 0 : page.file.split('/').length - 1;

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical !== canonicalUrl(page.locale, page)) {
    fail(`${urlPath}: canonical must remain ${canonicalUrl(page.locale, page)}`);
  } else if (canonical?.includes(`/${repo}/`) && !CANONICAL_BASE.includes(repo)) {
    fail(`${urlPath}: canonical contains preview base`);
  } else {
    pass(`${urlPath}: canonical stays on production domain`);
  }

  if (html.includes(`${PREVIEW_BASE}${PREVIEW_BASE}`)) {
    fail(`${urlPath}: duplicate SITE_BASE_PATH segment`);
  } else {
    pass(`${urlPath}: no duplicate base path`);
  }

  if (new RegExp(`${escapeRegex(PREVIEW_BASE)}/[a-z]{2}/[a-z]{2}/`).test(html)) {
    fail(`${urlPath}: double locale prefix detected`);
  } else {
    pass(`${urlPath}: no double locale prefix`);
  }

  const hrefs = [
    ...collectUrls(html, 'href'),
    ...collectUrls(html, 'src'),
    ...collectUrls(html, 'data-src'),
    ...collectUrls(html, 'poster'),
  ];

  for (const href of hrefs) {
    if (href.includes('?lang=')) fail(`${urlPath}: link with ?lang=: ${href}`);
    if (isBrokenPreviewPath(href)) fail(`${urlPath}: invalid preview path: ${href}`);
  }

  if (depth > 0) {
    for (const src of collectUrls(html, 'src')) {
      if (src.startsWith('assets/') || src.startsWith('uploads/')) {
        fail(`${urlPath}: locale/nested page has non-root asset path: ${src}`);
      }
    }
  }

  pass(`${urlPath}: preview path scan complete`);
  console.log('');
}

console.log(`\naudit:preview-base — ${stats.ok}/${stats.ok + stats.fail} checks passed`);
if (stats.fail > 0) {
  console.error(`\n${stats.fail} check(s) failed:`);
  for (const issue of stats.issues) console.error(`  - ${issue}`);
  process.exit(1);
}

console.log('All preview-base audits passed.');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
