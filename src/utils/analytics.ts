/**
 * Google Analytics 4 (free). Set VITE_GA_MEASUREMENT_ID (G-XXXXXXXX) at build time.
 * Page views are sent on each React Router navigation (SPA).
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

export function getGaMeasurementId(): string {
  return String(import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();
}

export function isAnalyticsEnabled(): boolean {
  return /^G-[A-Z0-9]+$/i.test(getGaMeasurementId());
}

/** Load gtag.js once when a measurement ID is configured. */
export function initAnalytics(): void {
  const id = getGaMeasurementId();
  if (!isAnalyticsEnabled() || typeof window === 'undefined' || initialized) {
    return;
  }
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('config', id, {
    send_page_view: false,
    anonymize_ip: true,
  });

  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${id}"]`)) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

/** Record a virtual page view (path includes query + hash when present). */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (!isAnalyticsEnabled() || !window.gtag) {
    return;
  }
  const id = getGaMeasurementId();
  window.gtag('config', id, {
    page_path: pagePath,
    page_title: pageTitle || document.title,
    page_location: window.location.href,
  });
}
