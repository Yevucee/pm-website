## Cloudflare Worker OAuth Proxy (GitHub)

This proxy is required for Decap CMS GitHub auth on GitHub Pages.

### What you need to do (once)
1. Create a GitHub OAuth App
   - Homepage URL: `https://yevucee.github.io/pm-website/`
   - Authorization callback URL: `https://YOUR-WORKER-URL/callback`
2. Create a Cloudflare Worker and set secrets:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
3. Deploy the worker and note its public URL.

### Update CMS config
In `public/admin/config.yml` set:

```
backend:
  base_url: "https://YOUR-WORKER-URL"
  auth_endpoint: "auth"
  site_domain: "yevucee.github.io"
```

### Deploy steps (CLI)
1. Install Wrangler:
   - `npm install -g wrangler`
2. Authenticate:
   - `wrangler login`
3. Create worker:
   - `wrangler deploy oauth-proxy/cloudflare-worker.js --name pm-website-oauth`
4. Add secrets:
   - `wrangler secret put GITHUB_CLIENT_ID`
   - `wrangler secret put GITHUB_CLIENT_SECRET`

### After deploy
Use the worker URL in `base_url` (for example `https://pm-website-oauth.<your-subdomain>.workers.dev`).
