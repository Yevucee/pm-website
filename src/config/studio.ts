/** Studio content agent API (Cloudflare Worker). See content-agent/README.md */

export function getStudioApiUrl(): string {
  return String(import.meta.env.VITE_STUDIO_API_URL || '')
    .trim()
    .replace(/\/+$/, '');
}

export function isStudioConfigured(): boolean {
  return getStudioApiUrl().startsWith('https://');
}

export function studioLoginUrl(returnTo: string): string {
  const base = getStudioApiUrl();
  const params = new URLSearchParams({ return_to: returnTo });
  return `${base}/studio/login?${params.toString()}`;
}
