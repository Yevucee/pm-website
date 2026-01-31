import { Link } from 'react-router-dom';
import { Product } from '@/data/mock-data';
import { Button } from './button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]">
      <Link to={`/merch/${product.id}`} className="block aspect-square overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-4">
        <Link to={`/merch/${product.id}`}>
          <h3 className="font-heading text-lg sm:text-xl mb-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-xl sm:text-2xl font-heading text-accent">£{product.price}</span>
          <Link to={`/merch/${product.id}`}>
            <Button variant="primary" size="sm">
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
