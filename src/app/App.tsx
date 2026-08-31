import { BrowserRouter, Routes, Route } from 'react-router-dom';
import type { ReactElement } from 'react';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { HomePage } from '@/app/pages/home';
import { MusicPage } from '@/app/pages/music';
import { ReleaseDetailPage } from '@/app/pages/release-detail';
import { EventsPage } from '@/app/pages/events';
import { EventDetailPage } from '@/app/pages/event-detail';
import { MerchPage } from '@/app/pages/merch';
import { ProductDetailPage } from '@/app/pages/product-detail';
import { MediaPage } from '@/app/pages/media';
import { AboutPage } from '@/app/pages/about';
import { ContactPage } from '@/app/pages/contact';
import { DesignSystemPage } from '@/app/pages/design-system';
import { PmTheDjPage } from '@/app/pages/pm-the-dj';
import { PmTheArtistPage } from '@/app/pages/pm-the-artist';
import { PrivacyPage } from '@/app/pages/privacy';
import { TermsPage } from '@/app/pages/terms';
import { detectSiteBase } from '@/utils/site-base';
import { AnalyticsPageView } from '@/app/components/analytics-page-view';

function App() {
  const basename = detectSiteBase() || undefined;

  const pageRoutes: { path: string; element: ReactElement }[] = [
    { path: '/', element: <HomePage /> },
    { path: '/music', element: <MusicPage /> },
    { path: '/music/:id', element: <ReleaseDetailPage /> },
    { path: '/events', element: <EventsPage /> },
    { path: '/events/:id', element: <EventDetailPage /> },
    { path: '/merch', element: <MerchPage /> },
    { path: '/merch/:id', element: <ProductDetailPage /> },
    { path: '/media', element: <MediaPage /> },
    { path: '/about', element: <AboutPage /> },
    { path: '/contact', element: <ContactPage /> },
    { path: '/pm-the-dj', element: <PmTheDjPage /> },
    { path: '/pm-the-artist', element: <PmTheArtistPage /> },
    { path: '/design-system', element: <DesignSystemPage /> },
    { path: '/privacy', element: <PrivacyPage /> },
    { path: '/terms', element: <TermsPage /> },
  ];

  return (
    <BrowserRouter basename={basename}>
      <AnalyticsPageView />
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 flex flex-col">
          <div className="flex-1">
            <Routes>
              {pageRoutes.flatMap(({ path, element }) =>
                path === '/'
                  ? [<Route key="/" path="/" element={element} />]
                  : [
                      <Route key={path} path={path} element={element} />,
                      <Route key={`${path}/`} path={`${path}/`} element={element} />,
                    ]
              )}
            </Routes>
          </div>
          <Footer />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
