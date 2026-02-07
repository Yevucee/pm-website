import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/app/components/button';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { merchProducts } from '@/data/mock-data';
import { cn } from '@/app/components/ui/utils';
import { goToStripeLink } from '@/utils/stripe';
import { getPageContent } from '@/data/pages';

interface MerchPageContent {
  shippingShow?: boolean;
  shippingHeading?: string;
  shippingItems?: { text?: string }[];
}

export function ProductDetailPage() {
  const { id } = useParams();
  const product = merchProducts.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const merchPage = getPageContent<MerchPageContent>('merch', {});
  
  const defaultShippingItems = [
    'UK Shipping: 3-5 working days',
    'International Shipping: 7-14 working days',
    'Free UK returns within 30 days',
    'All items dispatched from London',
  ];
  const shippingItems = (merchPage.shippingItems && merchPage.shippingItems.length > 0)
    ? merchPage.shippingItems.map(item => item.text || '').filter(Boolean)
    : defaultShippingItems;

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl mb-4">Product Not Found</h1>
          <Link to="/merch">
            <Button variant="primary">Back to Merch</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/merch" className="inline-flex items-center text-accent hover:text-accent-hover mb-6 sm:mb-8 transition-colors">
          <ChevronLeft size={20} className="mr-1" />
          Back to Merch
        </Link>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {[product.image, product.image, product.image].map((img, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl mb-4">{product.name}</h1>
            <p className="text-2xl sm:text-3xl font-heading text-accent mb-8">£{product.price}</p>

            {/* Size Selector */}
            <div className="mb-8">
              <p className="font-heading text-base sm:text-lg mb-3">SELECT SIZE</p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-all',
                      selectedSize === size
                        ? 'bg-accent text-black'
                        : 'bg-surface border border-border hover:border-accent'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Buy Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full mb-4"
              onClick={() => goToStripeLink(product.stripeLink)}
            >
              <ShoppingCart size={20} className="mr-2" />
              Buy Now - £{product.price}
            </Button>

            <p className="text-sm text-muted-foreground text-center mb-8">
              Secure checkout via Stripe
            </p>

            {/* Product Description */}
            <div className="space-y-6">
              <details open className="bg-surface border border-border rounded-xl overflow-hidden">
                <summary className="p-4 sm:p-6 cursor-pointer font-heading text-base sm:text-lg hover:bg-accent/5 transition-colors">
                  DESCRIPTION
                </summary>
                <div className="px-4 sm:px-6 pb-6 text-muted-foreground">
                  <p>
                    {product.description
                      ? product.description
                      : `Premium quality ${product.category === 'apparel' ? 'apparel' : 'accessory'} featuring the official The PM branding.
                    Made from high-quality materials for maximum comfort and durability.`}
                  </p>
                </div>
              </details>

              {merchPage.shippingShow !== false && (
                <details className="bg-surface border border-border rounded-xl overflow-hidden">
                  <summary className="p-4 sm:p-6 cursor-pointer font-heading text-base sm:text-lg hover:bg-accent/5 transition-colors">
                    {merchPage.shippingHeading || 'SHIPPING & RETURNS'}
                  </summary>
                  <div className="px-4 sm:px-6 pb-6 text-muted-foreground space-y-2">
                    {shippingItems.map((item, index) => (
                      <p key={index}>• {item}</p>
                    ))}
                  </div>
                </details>
              )}

              <details className="bg-surface border border-border rounded-xl overflow-hidden">
                <summary className="p-4 sm:p-6 cursor-pointer font-heading text-base sm:text-lg hover:bg-accent/5 transition-colors">
                  SIZE GUIDE
                </summary>
                <div className="px-4 sm:px-6 pb-6 text-muted-foreground">
                  <p className="mb-2">Standard UK sizing:</p>
                  <p>S = 36-38" chest</p>
                  <p>M = 38-40" chest</p>
                  <p>L = 40-42" chest</p>
                  <p>XL = 42-44" chest</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
