import { getFormSubmitSecret, getFormSubmitUrl } from '@/config';

export type GoogleWebAppResult =
  | { ok: true; verified: true }
  | { ok: true; verified: false }
  | { ok: false; error: string };

const CONTENT_TYPE = 'application/x-www-form-urlencoded';

function buildBody(payload: Record<string, unknown>): string {
  const secret = getFormSubmitSecret();
  const full: Record<string, unknown> = {
    ...payload,
    created_at: new Date().toISOString(),
  };
  if (secret) {
    full.secret = secret;
  }
  return new URLSearchParams({ json: JSON.stringify(full) }).toString();
}

function parseGoogleResponse(text: string): { ok: boolean; error?: string } {
  if (!text) {
    return { ok: false, error: 'Empty response from server' };
  }
  const trimmed = text.trim();
  if (trimmed.startsWith('<') || trimmed.startsWith('<!')) {
    return {
      ok: false,
      error:
        'Server returned HTML instead of JSON. Redeploy the Apps Script web app (New deployment), confirm doPost returns JSON, and that the script is bound to the correct spreadsheet.',
    };
  }
  try {
    const data = JSON.parse(trimmed) as { ok?: boolean; error?: string };
    if (data.ok === false) {
      return { ok: false, error: data.error || 'Request failed' };
    }
    if (data.ok === true) {
      return { ok: true };
    }
  } catch {
    // non-JSON body
  }
  return { ok: false, error: 'Invalid response from server (not JSON).' };
}

/**
 * POST to a Google Apps Script web app using the static-site CORS pattern:
 * body is x-www-form-urlencoded with a single key `json` whose value is JSON.stringify(payload).
 *
 * If the browser blocks reading the response (CORS), we retry with no-cors — the response is
 * then opaque, so verified:false. A 403 from Google often omits CORS headers; fix deploy
 * (Web app → Who has access: Anyone) so the first request returns JSON the browser can read.
 */
export async function submitGoogleWebApp(
  payload: Record<string, unknown>
): Promise<GoogleWebAppResult> {
  const url = getFormSubmitUrl();
  if (!url) {
    return {
      ok: false,
      error: 'Form submission is not configured (set VITE_FORM_SUBMIT_URL).',
    };
  }

  const body = buildBody(payload);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': CONTENT_TYPE },
      body,
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
    });
    const text = (await res.text()).trim();
    const parsed = parseGoogleResponse(text);
    if (res.ok && !parsed.ok) {
      console.warn('[submitGoogleWebApp] Expected JSON { ok: true }, got:', text.slice(0, 500));
    }
    if (import.meta.env.DEV && !res.ok) {
      console.warn('[submitGoogleWebApp]', res.status, text.slice(0, 400));
    }
    if (!res.ok) {
      return { ok: false, error: parsed.error || `Request failed (${res.status})` };
    }
    if (!parsed.ok) {
      return {
        ok: false,
        error: parsed.error || 'Request failed',
      };
    }
    return { ok: true, verified: true };
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[submitGoogleWebApp] CORS fetch failed, retrying no-cors', e);
    }
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': CONTENT_TYPE },
        body,
        mode: 'no-cors',
        credentials: 'omit',
        cache: 'no-store',
      });
      return {
        ok: true,
        verified: false,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error';
      return {
        ok: false,
        error: `${message}. Check the web app URL, blockers, and Apps Script Executions log.`,
      };
    }
  }
}
