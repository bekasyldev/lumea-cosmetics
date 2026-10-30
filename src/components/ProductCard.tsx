import { useEffect, useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';

export interface ProductVariant {
  id: string;
  name: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  retailPrice?: number;
  images: string[];
  inStock: boolean;
  isBestSeller: boolean;
  hasVariants: boolean;
  createdAt: string;
  description?: string;
  variants?: ProductVariant[];
  category?: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
  // Additional fields based on UI
  discount?: number; // Percentage discount
}

const formatPrice = (value: number) => `${value.toLocaleString('ru-RU')} ₸`;

interface ProductCardProps {
    product: Product;
    showAddToCart?: boolean;
}

export default function ProductCard({ product, showAddToCart = false }: ProductCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [added, setAdded] = useState(false);

    const discountPercentage = product.retailPrice
        ? Math.round((1 - product.price / product.retailPrice) * 100)
        : product.discount || 0;

    const hasDiscount = discountPercentage > 0;

    const handleAskPrice = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const message = `Здравствуйте! Хочу узнать цену на товар: ${product.name}`;
        window.open(`https://wa.me/7053371911?text=${encodeURIComponent(message)}`, '_blank');
    };

    // UI only: no cart logic yet, just a brief "added" confirmation
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setAdded(true);
    };

    // Reset image loaded state when product changes
    useEffect(() => {
        setImageLoaded(false);
        setAdded(false);
    }, [product.id]);

    useEffect(() => {
        if (!added) return;
        const t = setTimeout(() => setAdded(false), 1800);
        return () => clearTimeout(t);
    }, [added]);

    return (
        <>
            <div
                onClick={handleAskPrice}
                className={`group cursor-pointer ${showAddToCart ? 'h-full flex flex-col' : 'block'}`}
            >
                <div className={`relative rounded-lg overflow-hidden bg-white ${showAddToCart ? 'flex-1 flex flex-col' : ''}`}>
                    {/* Product Image with overlay */}
                    <div className="relative aspect-square bg-gray-100">
                        {/* Placeholder */}
                        {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 border-4 border-pink-200 border-t-[#FB6F92] rounded-full animate-spin"></div>
                            </div>
                        )}
                        
                        <img 
                            src={product.images[0]}
                            alt={product.name} 
                            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageLoaded(true)} // Show even if error occurs
                        />
                        
                        {/* Out of stock overlay */}
                        {showAddToCart && !product.inStock && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <span className="bg-white text-gray-600 text-xs font-semibold py-1 px-3 rounded-full shadow">
                                    Нет в наличии
                                </span>
                            </div>
                        )}

                        {/* Discount Badge */}
                        {hasDiscount && (
                            <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-semibold py-1 px-2 rounded">
                                -{discountPercentage}%
                            </div>
                        )}
                        
                        {/* Ask Price Button */}
                        {!showAddToCart && <button
                            className="absolute right-2 bottom-2 rounded-full bg-[#FB6F92] text-white text-xs font-semibold px-3 h-8 flex items-center justify-center shadow-md transition-transform hover:scale-105 whitespace-nowrap"
                            onClick={handleAskPrice}
                            aria-label="Узнать цену"
                        >
                            Узнать цену
                        </button>}
                    </div>
                    
                    {/* Product Info */}
                    <div className={showAddToCart ? 'pt-2 pb-1 flex-1 flex flex-col' : 'pt-3 pb-2'}>
                        {/* Product Name */}
                        <h3 className={`text-gray-700 line-clamp-2 ${showAddToCart ? 'text-xs min-h-8' : 'text-sm'}`}>
                            {product.name}
                        </h3>

                        {showAddToCart && (
                            <>
                                <div className="mt-1 mb-2 flex items-baseline gap-1.5">
                                    <span className="text-sm font-semibold text-[#33333D]">{formatPrice(product.price)}</span>
                                    {hasDiscount && product.retailPrice && (
                                        <span className="text-[11px] text-gray-400 line-through">{formatPrice(product.retailPrice)}</span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock}
                                    className={`mt-auto w-full h-8 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed ${
                                        added ? 'bg-emerald-500 text-white' : 'bg-[#FB6F92] text-white hover:bg-[#f95a82]'
                                    }`}
                                >
                                    {added ? <Check size={14} /> : <ShoppingBag size={14} />}
                                    {added ? 'Добавлено' : 'В корзину'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

        </>
    );
}