# Studio content agent (Cloudflare Worker)

Natural-language CMS for **theonlypm.com**: owners sign in with GitHub, describe changes, preview diffs, publish to **`main`**.

Frontend: **`/studio`** on the site (not linked in nav).

## One-time setup

### 1. GitHub OAuth App

Use the existing OAuth app or create one. Add **Authorization callback URL**:

`https://YOUR-WORKER-URL/studio/oauth/callback`

(Keep the Decap `/callback` URL if you still use `/admin`.)

### 2. Deploy the worker

```bash
npm install -g wrangler
wrangler login
cd content-agent && wrangler deploy
```

### 3. Worker secrets

```bash
wrangler secret put OPENROUTER_API_KEY
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler secret put SESSION_SECRET    # long random string
```

Optional vars in `wrangler.toml` or dashboard:

| Variable | Example |
|----------|---------|
| `ALLOWED_GITHUB_USERS` | `Yevucee,theonlypm` (comma-separated GitHub **logins**, lowercase ok) |
| `ALLOWED_ORIGINS` | `https://www.theonlypm.com,https://theonlypm.com,https://yevucee.github.io` |
| `OPENROUTER_MODEL` | `openai/gpt-4o-mini` (default; supports images for flyers) |

### 4. GitHub Actions secret

Repository → Settings → Secrets → **`VITE_STUDIO_API_URL`** = `https://pm-website-studio.<subdomain>.workers.dev`

Redeploy the site.

### 5. Owner access

Both users need **write access** to `Yevucee/pm-website` on GitHub (collaborators). Add each GitHub **username** to `ALLOWED_GITHUB_USERS`.

## Usage

1. Open **`https://www.theonlypm.com/studio`**
2. Sign in with GitHub
3. Describe the change; attach images if needed
4. **Generate preview** → review files
5. **Publish to live site** → commit to `main` → Pages rebuild

## Security

- LLM may only write under `content/` and `public/uploads/`
- Proposals are signed server-side; expire after 1 hour
- OpenRouter key never exposed to the browser

## Model / cost

Default **OpenRouter** model: `openai/gpt-4o-mini` — suitable for JSON edits and flyer vision at low cost per update.
