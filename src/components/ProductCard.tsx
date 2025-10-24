import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import OrderModal from './OrderModal';

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

export default function ProductCard({ product }: { product: Product }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const discountPercentage = product.retailPrice 
        ? Math.round((1 - product.price / product.retailPrice) * 100) 
        : product.discount || 0;
    
    const hasDiscount = discountPercentage > 0;
    
    // Format price with spaces for thousands
    const formatPrice = (price: number) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };
    
    const handleProductClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(true);
    };
    
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsModalOpen(true);
    };

    // Reset image loaded state when product changes
    useEffect(() => {
        setImageLoaded(false);
    }, [product.id]);

    return (
        <>
            <div 
                onClick={handleProductClick}
                className="block group cursor-pointer"
            >
                <div className="relative rounded-lg overflow-hidden bg-white">
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
                        
                        {/* Discount Badge */}
                        {hasDiscount && (
                            <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-semibold py-1 px-2 rounded">
                                -{discountPercentage}%
                            </div>
                        )}
                        
                        {/* Add to Cart Button */}
                        <button 
                            className="absolute right-2 bottom-2 rounded-full bg-[#FB6F92] text-white w-10 h-10 flex items-center justify-center shadow-md transition-transform hover:scale-105"
                            onClick={handleAddToCart}
                            aria-label="Add to cart"
                        >
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                    
                    {/* Product Info */}
                    <div className="pt-3 pb-2">
                        {/* Price */}
                        <div className="font-semibold text-lg">{formatPrice(product.price)} ₸</div>
                        
                        {/* Product Name */}
                        <h3 className="mt-1 text-sm text-gray-700 line-clamp-2">
                            {product.name}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Order Modal */}
            <OrderModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={product}
            />
        </>
    );
}