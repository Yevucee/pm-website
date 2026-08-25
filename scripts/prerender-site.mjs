/**
 * Playwright prerender: write fully rendered HTML for every public route.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { PAGES } from './seo-config.mjs';
import { postprocessHtml } from './postprocess-seo.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, '..', 'dist');
const PORT = Number(process.env.PRERENDER_PORT || 4175);

function waitForServer(port, attempts = 40) {
  return new Promise((resolve, reject) => {
    let tries = 0;
    const tick = () => {
      const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        tries += 1;
        if (tries >= attempts) reject(new Error(`Server not ready on port ${port}`));
        else setTimeout(tick, 250);
      });
    };
    tick();
  });
}

function startServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'npx',
      ['serve', DIST, '-s', '-l', String(PORT), '--no-clipboard'],
      { stdio: 'pipe', shell: true }
    );
    proc.on('error', reject);
    waitForServer(PORT)
      .then(() => resolve(proc))
      .catch((err) => {
        proc.kill('SIGTERM');
        reject(err);
      });
  });
}

async function waitForPageReady(page) {
  await page.waitForSelector('#site-header nav a', { timeout: 45000 });
  await page.waitForSelector('main h1', { timeout: 45000 });
  await page.waitForFunction(
    () => {
      const main = document.querySelector('main');
      const header = document.querySelector('#site-header img, header img');
      const text = (main?.textContent || '').replace(/\s+/g, ' ').trim();
      return text.length >= 200 && Boolean(header);
    },
    { timeout: 45000 }
  );
  await new Promise((resolve) => setTimeout(resolve, 400));
}

if (!fs.existsSync(DIST)) {
  console.error('prerender-site: dist/ not found — run vite build first');
  process.exit(1);
}

const shellHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
fs.writeFileSync(path.join(DIST, '404.html'), shellHtml);
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

const server = await startServer();
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
page.setDefaultTimeout(60000);

/** @type {Map<string, string>} */
const snapshots = new Map();

for (const routePage of PAGES) {
  const url = `http://127.0.0.1:${PORT}${routePage.route}`;
  console.log(`prerender-site: ${routePage.route}`);
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await waitForPageReady(page);
  snapshots.set(routePage.file, await page.content());
}

await browser.close();
if (server) server.kill('SIGKILL');

for (const routePage of PAGES) {
  const raw = snapshots.get(routePage.file);
  if (!raw) {
    console.error(`prerender-site: missing snapshot for ${routePage.file}`);
    process.exit(1);
  }
  const html = postprocessHtml(raw, routePage);
  const dest = path.join(DIST, routePage.file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  console.log(`prerender-site: wrote ${routePage.file}`);
}

// Keep the Vite SPA shell as 404.html for unmatched client routes.
fs.writeFileSync(path.join(DIST, '404.html'), shellHtml);

console.log(`prerender-site: complete (${PAGES.length} pages)`);
process.exit(0);
