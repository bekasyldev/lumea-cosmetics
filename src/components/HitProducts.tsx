import ProductCard from './ProductCard';
import { useStorefrontProducts } from '../features/products/useStorefrontProducts';

interface HitProductsProps {
  title?: string;
  maxProducts?: number;
}

export default function HitProducts({ title = "Хиты продаж", maxProducts = 6 }: HitProductsProps) {
  const { products, isLoading, isError } = useStorefrontProducts();
  const hits = products.filter((p) => p.isBestSeller);

  const skeletonRow = (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: maxProducts }).map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-lg aspect-square animate-pulse"></div>
      ))}
    </div>
  );

  const row = (from: number) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {hits.slice(from, from + maxProducts).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );

  return (
    <section className="container mx-auto my-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-medium text-[#33333D]">{title}</h2>
        <a href="/catalog?bestseller=1" className="text-[#FB6F92] hover:underline">Смотреть все</a>
      </div>
      <div className='space-y-8'>
        {isLoading ? (
          <>
            {skeletonRow}
            {skeletonRow}
          </>
        ) : isError ? (
          <p className="text-sm text-gray-500">Не удалось загрузить товары. Попробуйте обновить страницу.</p>
        ) : hits.length === 0 ? (
          <p className="text-sm text-gray-500">Скоро здесь появятся хиты продаж.</p>
        ) : (
          <>
            {row(0)}
            {hits.length > maxProducts && row(maxProducts)}
          </>
        )}
      </div>
    </section>
  );
}
