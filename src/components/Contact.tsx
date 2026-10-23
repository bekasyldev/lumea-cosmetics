import { MapPin, Clock, MapPinned, Store } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contacts" className="container mx-auto my-12 px-4">
      <h2 className="text-3xl font-medium text-[#33333D] mb-8">Контакты</h2>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left panel - Contact Information */}
        <div className="w-full lg:w-1/3 bg-[#BDE0FE] p-7 rounded-3xl">
        <div className="h-full bg-white p-6 rounded-2xl">
          {/* Visit Us Button */}
            <button 
              className="px-4 py-2 text-sm text-[#0072E6] bg-white rounded-full border-1 border-[#0072E6] hover:bg-blue-600 transition-colors mb-4"
            >
              ПРИХОДИТЕ В ГОСТИ
            </button>
          
          {/* Address */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-6 h-6">
              <MapPin size={24} className="text-gray-700" />
            </div>
            <div className="text-gray-800">
              Адем 3, 3 этаж 5 ряд 75 бутик
            </div>
          </div>
          
          {/* Hours */}
          <div className="flex items-start gap-4 mb-8">
            <div className="flex-shrink-0 w-6 h-6">
              <Clock size={24} className="text-gray-700" />
            </div>
            <div className="text-gray-800">
              с 08:00 до 19:00
            </div>
          </div>
          
          {/* What's nearby button */}
            <button 
              className="px-10 py-2 bg-[#0072E6] text-sm mb-8    text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              ЧТО РЯДОМ
            </button>
          
          {/* Nearby locations */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-4">
              <Store size={24} className="text-gray-700" />
              <div className="flex-grow text-gray-800">Рынок Байсат</div>
              <img
                src='/icons/onfoot.svg'
                width="24px"
                height="24px"
                alt="icon"
              />
              <div className="text-gray-600">1,17 км</div>
            </div>
            <div className="flex items-center gap-4">
              <Store size={24} className="text-gray-700" />
              <div className="flex-grow text-gray-800">Рынок Ялян</div>
              <img
                src='/icons/onfoot.svg'
                width="24px"
                height="24px"
                alt="icon"
              />
              <div className="text-gray-600">1,42 км</div>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-gray-700 mb-8">
            Здесь вы можете купить продукцию напрямую, посмотреть товары вживую и получить консультацию.
          </p>
          
          {/* Get location button */}
          <button 
            className="w-full py-3 bg-[#4F772D] text-white rounded-full hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <MapPinned size={20} className="text-white" />
            <a target='_blank' href='https://2gis.kz/almaty/firm/70000001102401716'>Получить местоположение в 2gis</a>
          </button>
        </div>
        </div>
        
        {/* Right panel - Map placeholder */}
        <div className="w-full lg:w-2/3 bg-gray-200 min-h-[300px] md:min-h-[400px] flex rounded-3xl overflow-hidden">
          <iframe
            style={{ border: 0, borderRadius: '1.5rem' }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2904.648639139451!2d76.8889727!3d43.279736299999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38836bc6c96e2e81%3A0xf14f0854bdaac884!2sAdem%202%2C3!5e0!3m2!1sen!2skz!4v1749727580316!5m2!1sen!2skz"
            className="w-full min-h-[300px] md:min-h-[400px]"
            loading="lazy"
            >
          </iframe>
        </div>
      </div>
    </section>
  );
}