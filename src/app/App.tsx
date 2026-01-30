import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/music/:id" element={<ReleaseDetailPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/merch" element={<MerchPage />} />
            <Route path="/merch/:id" element={<ProductDetailPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/design-system" element={<DesignSystemPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
