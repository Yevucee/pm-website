import { ProductCard } from '@/app/components/product-card';
import { merchProducts } from '@/data/mock-data';
import { Shield } from 'lucide-react';
import { getPageContent } from '@/data/pages';

interface MerchPageContent {
  heroShow?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  introText?: string;
  productsHeading?: string;
  paymentNote?: string;
}

export function MerchPage() {
  const merchPage = getPageContent<MerchPageContent>('merch', {});

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {merchPage.heroShow !== false && (
          <h1 className="font-heading text-4xl sm:text-6xl mb-4">
            {merchPage.heroTitle || 'MERCH'}
          </h1>
        )}
        <p className="text-muted-foreground text-base sm:text-xl mb-8">
          {merchPage.introText ||
            'Official The PM merchandise - Limited editions and classics'}
        </p>

        <div className="flex items-center gap-2 mb-10 sm:mb-12 p-4 bg-surface border border-border rounded-lg w-full sm:w-fit">
          <Shield size={20} className="text-accent" />
          <span className="text-xs sm:text-sm">
            {merchPage.paymentNote || 'Pay securely with Stripe • Apple Pay • Google Pay'}
          </span>
        </div>

        {merchPage.productsHeading && (
          <h2 className="font-heading text-3xl mb-6">{merchPage.productsHeading}</h2>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {merchProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
