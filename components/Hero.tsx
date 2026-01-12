
import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight
} from 'lucide-react';

const Hero: React.FC = () => {
  const { heroSlides, heroCarouselConfig } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  // Auto-advance
  useEffect(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      nextSlide();
    }, heroCarouselConfig?.interval || 5000);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [currentSlide, heroSlides.length, heroCarouselConfig]);

  if (heroSlides.length === 0) return null;

  const current = heroSlides[currentSlide];

  // Safety check to prevent crashes if slides change and index is out of bounds
  useEffect(() => {
    if (currentSlide >= heroSlides.length) {
      setCurrentSlide(0);
    }
  }, [heroSlides.length]);

  // Responsive Position Logic
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!current) return null;

  return (
    <header className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 bg-cover transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
          style={{
            backgroundImage: `url('${slide.image}')`,
            backgroundPosition: isMobile
              ? (slide.mobilePosition || 'center')
              : (slide.desktopPosition || 'center')
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/30 to-transparent"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter mb-4 uppercase">
          {current.title.split(' ').slice(0, 1)} <span className="text-stroke text-transparent" style={{ WebkitTextStroke: '1px white' }}>{current.title.split(' ').slice(1).join(' ')}</span>
        </h1>
        <h2 className="text-gray-300 text-lg md:text-xl font-light tracking-widest mb-8 uppercase">
          {current.subtitle}
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to={current.buttonLink || '/'}
            className="bg-primary hover:opacity-90 text-white h-12 px-8 rounded font-bold text-sm tracking-[0.1em] uppercase transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-yellow-900/20 flex items-center justify-center"
          >
            {current.buttonText || 'EXPLORAR AHORA'}
          </Link>

        </div>
      </div>

      {/* Navigation */}
      {heroSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full border border-white/10 bg-black/20 text-white hover:bg-white/20 transition-all z-30"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full border border-white/10 bg-black/20 text-white hover:bg-white/20 transition-all z-30"
          >
            <ArrowRight size={24} />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-10 flex gap-2 z-30">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white'}`}
              />
            ))}
          </div>
        </>
      )}
    </header>
  );
};

export default Hero;
