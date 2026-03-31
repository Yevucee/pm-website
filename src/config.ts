/** Google Apps Script web app /exec URL (see .env.example). */
export function getFormSubmitUrl(): string {
  const raw = String(import.meta.env.VITE_FORM_SUBMIT_URL || '').trim();
  if (!raw) return '';
  return raw.replace(/\/+$/, '');
}

/**
 * Optional shared token checked server-side (Script Properties).
 * Not secret in a browser — mild abuse friction only.
 */
export function getFormSubmitSecret(): string {
  return String(import.meta.env.VITE_FORM_SUBMIT_SECRET || '').trim();
}
