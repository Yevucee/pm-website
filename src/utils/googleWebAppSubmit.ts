import { getFormSubmitSecret, getFormSubmitUrl } from '@/config';

export type GoogleWebAppResult =
  | { ok: true }
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
  try {
    const data = JSON.parse(text) as { ok?: boolean; error?: string };
    if (data.ok === false) {
      return { ok: false, error: data.error || 'Request failed' };
    }
    if (data.ok === true) {
      return { ok: true };
    }
  } catch {
    // non-JSON body
  }
  return { ok: false, error: 'Invalid response from server' };
}

/**
 * POST to a Google Apps Script web app using the static-site CORS pattern:
 * body is x-www-form-urlencoded with a single key `json` whose value is JSON.stringify(payload).
 * Retries with mode no-cors if the first request throws (opaque response / redirect chain).
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
    });
    const text = (await res.text()).trim();
    const parsed = parseGoogleResponse(text);
    if (!res.ok) {
      return { ok: false, error: parsed.error || `Request failed (${res.status})` };
    }
    if (!parsed.ok) {
      return { ok: false, error: parsed.error || 'Request failed' };
    }
    return { ok: true };
  } catch {
    // Some browsers treat Apps Script redirects as CORS failure even when the row was written.
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': CONTENT_TYPE },
        body,
        mode: 'no-cors',
      });
      // Cannot read response body; assume success if no throw.
      return { ok: true };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Network error';
      return { ok: false, error: message };
    }
  }
}
