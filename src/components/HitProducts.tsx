import { useState } from 'react';
import ProductCard, { type Product } from './ProductCard';

const sampleProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Корейский шампунь против ломкости и сечения',
    price: 2800,
    retailPrice: 4300,
    images: ['/images/products/1.png'],
    inStock: true,
    isBestSeller: true,
    hasVariants: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'product-2',
    name: 'Crome Snail B.B Cream',
    price: 1350,
    retailPrice: 2100,
    images: ['/images/products/2.png'],
    inStock: true,
    isBestSeller: true,
    hasVariants: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'product-3',
    name: 'Легендарный бестселлер от Vivienne Sabo! CABARET',
    price: 1700,
    retailPrice: 2600,
    images: ['/images/products/3.png'],
    inStock: true,
    isBestSeller: true,
    hasVariants: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'product-4',
    name: 'Мицелловый раствор Bioderma Sensibio',
    price: 1200,
    retailPrice: 1850,
    images: ['/images/products/4.png'],
    inStock: true,
    isBestSeller: true,
    hasVariants: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'product-5',
    name: 'Гидрофильное гель-масло делает кожу мягкой',
    price: 1650,
    retailPrice: 2550,
    images: ['/images/products/5.png'],
    inStock: true,
    isBestSeller: true,
    hasVariants: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'product-6',
    name: 'Folia (Фолиа) Маска-кондиционер для волос',
    price: 900,
    retailPrice: 1300,
    images: ['/images/products/6.png'],
    inStock: true,
    isBestSeller: true,
    hasVariants: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'product-7',
    name: 'Крем с экстрактом сакуры и коллагеном для питания кожи',
    price: 650,
    retailPrice: 950,
    images: ['/images/products/7.jpeg'],
    inStock: true,
    isBestSeller: false,
    hasVariants: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'product-8',
    name: 'Желе с низкомолекулярным коллагеном, гиалуроновой кислотой и пептидами',
    price: 9900,
    retailPrice: 12800,
    images: ['/images/products/8.jpeg'],
    inStock: true,
    isBestSeller: true,
    hasVariants: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'product-9',
    name: 'Осветляющий гель с 92% алоэ вера для естественного сияния кожи',
    price: 450,
    retailPrice: 700,
    images: ['/images/products/9.jpeg'],
    inStock: true,
    isBestSeller: false,
    hasVariants: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'product-10',
    name: 'Гель для душа с кокосовым маслом и экстрактом кумквата',
    price: 1250,
    retailPrice: 1850,
    images: ['/images/products/10.jpeg'],
    inStock: true,
    isBestSeller: true,
    hasVariants: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'product-11',
    name: 'Крем-спрей для волос с термозащитой и эффектом блеска цвета',
    price: 2150,
    retailPrice: 2950,
    images: ['/images/products/11.jpeg'],
    inStock: true,
    isBestSeller: false,
    hasVariants: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'product-12',
    name: 'Очищающий тоник — эффективно удаляет загрязнения и увлажняет кожу',
    price: 450,
    retailPrice: 750,
    images: ['/images/products/12.jpeg'],
    inStock: true,
    isBestSeller: false,
    hasVariants: false,
    createdAt: new Date().toISOString(),
  },
];

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
        <a href="/catalog/bestsellers" className="text-[#FB6F92] hover:underline">Смотреть все</a>
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