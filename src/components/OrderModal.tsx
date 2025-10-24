import { X, MessageCircle, ShoppingBag } from 'lucide-react';
import { type Product } from './ProductCard';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function OrderModal({ isOpen, onClose, product }: OrderModalProps) {
  if (!isOpen || !product) return null;

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const discountPercentage = product.retailPrice 
    ? Math.round((1 - product.price / product.retailPrice) * 100) 
    : 0;

  const handleWhatsAppOrder = () => {
    const message = `Здравствуйте! Хочу заказать товар:

📦 ${product.name}
💰 Цена: ${formatPrice(product.price)} ₸
${product.retailPrice ? `🏷️ Скидка: ${discountPercentage}%` : ''}

Можете рассказать подробнее о товаре и способах доставки?`;

    const whatsappUrl = `https://wa.me/7766766890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Закрыть"
          >
            <X size={20} />
          </button>
          <h3 className="text-xl font-bold text-[#33333D] pr-8">Оформить заказ</h3>
          <p className="text-gray-600 text-sm mt-1">Выбранный товар</p>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#33333D] text-sm leading-tight mb-2 line-clamp-2">
                {product.name}
              </h4>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-[#33333D]">
                  {formatPrice(product.price)} ₸
                </span>
                {product.retailPrice && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.retailPrice)} ₸
                    </span>
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                      -{discountPercentage}%
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-[#F4F9FB] rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-[#FB6F92] rounded-full flex items-center justify-center">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-[#33333D]">Быстрое оформление</h5>
                <p className="text-sm text-gray-600">Через WhatsApp менеджера</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-[#FB6F92] rounded-full"></span>
                <span>Консультация по товару</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-[#FB6F92] rounded-full"></span>
                <span>Информация о доставке</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-[#FB6F92] rounded-full"></span>
                <span>Актуальные цены и наличие</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            >
              <MessageCircle size={20} />
              <span>Заказать в WhatsApp</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Продолжить покупки
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Нажимая "Заказать в WhatsApp", вы перейдете в чат с нашим менеджером для оформления заказа и получения консультации
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}