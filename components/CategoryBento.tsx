import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const CategoryBento: React.FC = () => {
  const { bannerBento } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Resize listener to detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    // Setting initial value in case of SSR (not likely here but good practice)
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine if carousel should slide
  const shouldSlide = isMobile ? bannerBento.length > 1 : bannerBento.length > 3;

  // Auto-slide effect every 3 seconds
  useEffect(() => {
    if (shouldSlide) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerBento.length);
      }, 3000); // 3 seconds as requested
      return () => clearInterval(interval);
    } else {
      // Reset if resizing makes it not slide anymore
      setCurrentIndex(0);
    }
  }, [shouldSlide, bannerBento.length]);

  if (!bannerBento || bannerBento.length === 0) return null;

  return (
    <section className="py-6 px-4 md:px-12 max-w-[1400px] mx-auto overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-4">Categorías</h2>

      <div className="relative">
        {/* Carousel Container */}
        <div
          className="flex transition-transform duration-700 ease-in-out gap-4"
          style={{
            transform: shouldSlide ? `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 16}px))` : 'translateX(0)',
          }}
        >
          {bannerBento.map((banner, index) => (
            <Link
              key={banner.id || index}
              to={banner.link}
              className={`
                relative group rounded overflow-hidden cursor-pointer block flex-shrink-0
                w-full md:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]
                h-[250px] md:h-[300px]
                ${!shouldSlide && !isMobile ? 'md:flex-1' : ''}
              `}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${banner.image}')` }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
              <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full z-20 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-1">{banner.title}</h3>
                {banner.subtitle && <p className="text-gray-200 text-xs md:text-sm max-w-xs mb-2 line-clamp-2">{banner.subtitle}</p>}
                <span className="inline-flex items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-white group-hover:text-primary transition-colors">
                  {banner.buttonText || 'Ver Colección'}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Carousel Indicators (Only show if sliding) */}
        {shouldSlide && (
          <div className="flex justify-center mt-6 gap-2">
            {bannerBento.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-primary w-6' : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryBento;
