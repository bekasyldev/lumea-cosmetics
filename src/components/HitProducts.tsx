import { useState } from 'react';
import ProductCard, { type Product } from './ProductCard';
import { sampleProducts } from '../data/products';

interface HitProductsProps {
  title?: string;
  maxProducts?: number;
}

export default function HitProducts({ title = "Хиты продаж", maxProducts = 6 }: HitProductsProps) {
  const [products] = useState<Product[]>(sampleProducts);
  
  return (
    <section className="container mx-auto my-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-medium text-[#33333D]">{title}</h2>
        <a href="/catalog?bestseller=1" className="text-[#FB6F92] hover:underline">Смотреть все</a>
      </div>
      <div className='space-y-8'>
        {products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: maxProducts }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg aspect-square animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.slice(0, maxProducts).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* second row */}
        {products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: maxProducts }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg aspect-square animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.slice(maxProducts, maxProducts * 2).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      
    </section>
  );
}