import { ProductCard } from '@/app/components/product-card';
import { merchProducts } from '@/data/mock-data';
import { Shield } from 'lucide-react';

export function MerchPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-heading text-5xl sm:text-6xl mb-4">MERCH</h1>
        <p className="text-muted-foreground text-xl mb-8">
          Official The PM merchandise - Limited editions and classics
        </p>

        <div className="flex items-center gap-2 mb-12 p-4 bg-surface border border-border rounded-lg w-fit">
          <Shield size={20} className="text-accent" />
          <span className="text-sm">Pay securely with Stripe • Apple Pay • Google Pay</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {merchProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
