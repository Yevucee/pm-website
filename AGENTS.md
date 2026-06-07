# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

Single-product **The PM Artist Website** — a Vite + React 18 + TypeScript static site with Decap CMS admin at `/admin/index.html`. Content lives in `content/` as markdown/JSON. See `README.md` for full details.

### Required service

Only the **Vite dev server** is required for day-to-day frontend development:

```bash
npm run dev
```

Site: http://localhost:5173  
CMS admin: http://localhost:5173/admin/index.html (not `/admin` alone — React Router does not handle that path; Vite serves the static admin shell at `public/admin/`)

### Common commands

| Task | Command |
|------|---------|
| Install deps | `npm ci` |
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| E2E tests | `npm test` |

There is no dedicated lint script; CI only runs `npm ci` and `npm run build`.

### Testing notes

- Playwright tests auto-start Vite on port **4173** via `playwright.config.ts`.
- On a fresh VM, install browser binaries once before running tests:

```bash
npx playwright install chromium --with-deps
```

### Optional services (not needed for normal dev)

- **Decap local proxy** (`npx decap-server`) — local CMS Git Gateway testing
- **Cloudflare OAuth worker** (`oauth-proxy/`) — production CMS auth on GitHub Pages
- **`.env`** — copy from `.env.example`; only needed for contact form submission (`VITE_FORM_SUBMIT_URL`)

### Node version

CI uses Node 20 (`/.github/workflows/deploy.yml`). Node 22 also works.
