
import React, { useRef } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HorizontalProductListProps {
    products: Product[];
    title?: string;
    viewAllLink?: string;
    onAddToCart: (product: Product) => void;
    subTitle?: string;
}

const HorizontalProductList: React.FC<HorizontalProductListProps> = ({ products, title, viewAllLink, onAddToCart, subTitle }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            // Scroll by roughly 80% of client width to move one "page" or chunk of items
            const scrollAmount = current.clientWidth * 0.8;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (products.length === 0) return null;

    return (
        <div className="space-y-4">
            {/* Header */}
            {(title || viewAllLink) && (
                <div className="flex items-center justify-between">
                    <div>
                        {title && <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 border-l-4 border-primary pl-4">{title}</h3>}
                        {subTitle && <p className="text-accent-gray mt-1 text-xs">{subTitle}</p>}
                    </div>
                    {viewAllLink && <Link to={viewAllLink} className="text-xs font-bold text-primary hover:text-white uppercase flex items-center gap-1">Ver Todo <ArrowRight size={14} /></Link>}
                </div>
            )}

            {/* Slider Container */}
            <div className="relative group/carousel">
                {/* Left Button */}
                <button
                    onClick={(e) => { e.preventDefault(); scroll('left'); }}
                    className="absolute left-0 top-[35%] -translate-y-1/2 -translate-x-3 z-30 bg-black/50 hover:bg-black text-white p-1 md:p-2 rounded-full backdrop-blur-sm transition-all opacity-100 disabled:opacity-0 flex items-center justify-center border border-white/10"
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={16} className="md:w-6 md:h-6" />
                </button>

                {/* Right Button */}
                <button
                    onClick={(e) => { e.preventDefault(); scroll('right'); }}
                    className="absolute right-0 top-[35%] -translate-y-1/2 translate-x-3 z-30 bg-black/50 hover:bg-black text-white p-1 md:p-2 rounded-full backdrop-blur-sm transition-all opacity-100 disabled:opacity-0 flex items-center justify-center border border-white/10"
                    aria-label="Scroll right"
                >
                    <ChevronRight size={16} className="md:w-6 md:h-6" />
                </button>

                {/* Scrollable Area */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-4 pb-4 px-1 -mx-1 snap-x scrollbar-hide"
                >
                    {products.map(product => (
                        <div key={product.id} className="w-[30vw] sm:w-[160px] md:w-[180px] lg:w-[200px] flex-shrink-0 snap-center">
                            <ProductCard product={product} onAddToCart={onAddToCart} />
                        </div>
                    ))}

                    {/* 'View All' Card */}
                    {viewAllLink && (
                        <Link
                            to={viewAllLink}
                            className="w-[30vw] sm:w-[160px] md:w-[180px] lg:w-[200px] flex-shrink-0 snap-center flex flex-col items-center justify-center bg-gray-900/50 border border-gray-800 hover:bg-gray-800 hover:border-primary/50 transition-all rounded group cursor-pointer aspect-[3/4] md:aspect-auto md:h-full"
                        >
                            <span className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-colors mb-2">
                                <ArrowRight size={24} />
                            </span>
                            <span className="text-sm font-bold uppercase text-gray-300 group-hover:text-white">Ver Todo</span>
                            <span className="text-xs text-gray-500 uppercase mt-1">{title}</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HorizontalProductList;
