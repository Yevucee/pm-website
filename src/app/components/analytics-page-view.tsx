import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, trackPageView } from '@/utils/analytics';

/** Sends GA4 page_view on each client-side route change. */
export function AnalyticsPageView() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`;
    if (path.startsWith('/insights')) {
      return;
    }
    trackPageView(path);
  }, [location.pathname, location.search, location.hash]);

  return null;
}
