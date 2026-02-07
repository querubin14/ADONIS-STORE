import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface FeaturedCarouselProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ products, onAddToCart }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [isHovered, setIsHovered] = useState(false);

    // Responsive items per page
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setItemsPerPage(3);
            } else {
                setItemsPerPage(4);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex(prevIndex =>
            prevIndex + itemsPerPage >= products.length ? 0 : prevIndex + itemsPerPage
        );
    };

    const prevSlide = () => {
        setCurrentIndex(prevIndex =>
            prevIndex - itemsPerPage < 0
                ? Math.max(0, products.length - itemsPerPage)
                : prevIndex - itemsPerPage
        );
    };

    // Auto-scroll
    useEffect(() => {
        if (isHovered) return; // Pause on hover

        // 3 sec for mobile (itemsPerPage < 4 typically implies mobile/tablet but checking width is safer/consistent with resize logic)
        // actually itemsPerPage is already responsive.
        // itemsPerPage: 1 (mobile), 2 (tablet), 4 (desktop)
        const duration = itemsPerPage === 1 ? 3000 : 5000;

        const interval = setInterval(() => {
            nextSlide();
        }, duration);

        return () => clearInterval(interval);
    }, [currentIndex, itemsPerPage, products.length, isHovered]);

    // Handle touch/swipe could be added here, but simple buttons requested.

    // Calculate visible products
    // We want to slice the array. If wrapping needed, we might need complex logic, 
    // but simplified paging "0-3, 4-7" is what was requested ("apareceran otros 4").
    // If we are at the end and have fewer than 4, we just show them.

    // To implement "infinite" feel or smooth wrapping, we can use an animation, 
    // but for now, React state update is sufficient for "appearing".
    const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerPage);

    if (products.length === 0) return null;

    return (
        <div
            className="relative group/carousel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Controls - Only show if enough items to scroll */}
            {/* Controls - Only show if enough items to scroll */}
            {products.length > itemsPerPage && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-[30%] -translate-y-1/2 md:-translate-x-4 z-10 bg-black/50 hover:bg-black text-white p-1 md:p-2 rounded-full backdrop-blur-sm transition-all opacity-100 sm:opacity-0 sm:group-hover/carousel:opacity-100 disabled:opacity-0"
                        disabled={products.length <= itemsPerPage}
                    >
                        <ChevronLeft size={16} className="md:w-6 md:h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-[30%] -translate-y-1/2 md:translate-x-4 z-10 bg-black/50 hover:bg-black text-white p-1 md:p-2 rounded-full backdrop-blur-sm transition-all opacity-100 sm:opacity-0 sm:group-hover/carousel:opacity-100 disabled:opacity-0"
                        disabled={products.length <= itemsPerPage}
                    >
                        <ChevronRight size={16} className="md:w-6 md:h-6" />
                    </button>
                </>
            )}

            {/* Grid */}
            <div
                className={`grid gap-3 sm:gap-6 ${itemsPerPage === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}
            >
                {visibleProducts.map(product => (
                    <div key={`${product.id}-${currentIndex}`} className="animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both">
                        <ProductCard
                            product={product}
                            onAddToCart={() => onAddToCart(product)}
                            showCategoryTag={true}
                        />
                    </div>
                ))}
            </div>

            {/* Indicators / Progress Bar optional */}
            <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: Math.ceil(products.length / itemsPerPage) }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx * itemsPerPage)}
                        className={`transition-all duration-300 rounded-full ${Math.floor(currentIndex / itemsPerPage) === idx
                            ? 'w-8 h-1 bg-primary'
                            : 'w-2 h-1 bg-gray-800 hover:bg-gray-600'
                            }`}
                        aria-label={`Go to page ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeaturedCarousel;
