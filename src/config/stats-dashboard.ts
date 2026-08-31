/** Private /insights dashboard — embed URLs and access key (build-time env). */

const STORAGE_KEY = 'pm-stats-unlock-v1';

export function getStatsAccessKey(): string {
  return String(import.meta.env.VITE_STATS_ACCESS_KEY || '').trim();
}

export function isStatsDashboardConfigured(): boolean {
  return getStatsAccessKey().length >= 8;
}

export function getLookerStudioEmbedUrl(): string {
  return String(import.meta.env.VITE_LOOKER_STUDIO_EMBED_URL || '').trim();
}

/** Published Google Sheet embed URL (File → Share → Publish to web → Embed). */
export function getMailingListSheetEmbedUrl(): string {
  return String(import.meta.env.VITE_STATS_SHEET_EMBED_URL || '').trim();
}

export function hasStatsSession(): boolean {
  if (typeof sessionStorage === 'undefined') return false;
  return sessionStorage.getItem(STORAGE_KEY) === getStatsAccessKey();
}

export function unlockStatsSession(key: string): boolean {
  if (key !== getStatsAccessKey()) return false;
  sessionStorage.setItem(STORAGE_KEY, key);
  return true;
}

export function lockStatsSession(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
