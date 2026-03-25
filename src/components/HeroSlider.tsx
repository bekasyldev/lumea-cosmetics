import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideData {
  id: number;
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
}

interface HeroSliderProps {
  slides: SlideData[];
  autoplayInterval?: number; // in milliseconds
}

export default function HeroSlider({ slides, autoplayInterval = 5000 }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, autoplayInterval);
    
    return () => clearInterval(interval);
  }, [nextSlide, autoplayInterval]);

  return (
    <div className="w-full container relative overflow-visible rounded-2xl mx-auto mt-4 px-4 sm:px-0">
      <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] w-full">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute top-0 left-0 w-full h-full rounded-xl sm:rounded-3xl transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{ 
              backgroundImage: `url(${slide.imageUrl})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 lg:px-16">
              {slide.buttonText && (
                <span className="inline-block w-fit border border-white text-white px-4 py-2 sm:px-6 rounded-full mb-4 sm:mb-6 text-sm sm:text-base">
                  {slide.buttonText}
                </span>
              )}
              <h2 className="text-white text-xl sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-4 max-w-xs sm:max-w-md lg:max-w-xl">{slide.title}</h2>
              <p className="text-white text-sm sm:text-lg lg:text-xl max-w-xs sm:max-w-md lg:max-w-xl">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <button 
        className="absolute left-[-10px] sm:left-[-20px] top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-[#F2F2F2] rounded-full flex items-center justify-center shadow-md"
        onClick={prevSlide}
      >
        <ChevronLeft className="text-black w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      
      <button 
        className="absolute right-[-10px] sm:right-[-20px] top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-[#F2F2F2] rounded-full flex items-center justify-center shadow-md"
        onClick={nextSlide}
      >
        <ChevronRight className="text-black w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      
      {/* Pagination Indicators */}
      <div className="flex justify-center gap-2 mt-6 sm:mt-8 lg:mt-10">
        {slides.map((_, index) => (
          <button 
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'w-8 sm:w-12 bg-pink-400' 
                : 'w-4 sm:w-6 bg-gray-300'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}