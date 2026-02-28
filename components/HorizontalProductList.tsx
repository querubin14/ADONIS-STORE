
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
    if (products.length === 0) return null;

    return (
        <div className="space-y-2">
            {/* Header */}
            {(title || viewAllLink) && (
                <div className="flex items-center justify-between pb-1">
                    <div>
                        {title && <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-2 border-white pl-2">{title}</h3>}
                        {subTitle && <p className="text-accent-gray mt-1 text-[10px] pl-2">{subTitle}</p>}
                    </div>
                    {viewAllLink && <Link to={viewAllLink} className="text-[10px] font-bold text-white hover:text-gray-300 uppercase flex items-center gap-1">VER TODO <ArrowRight size={12} /></Link>}
                </div>
            )}

            {/* Grid Container */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pb-4">
                {products.slice(0, 4).map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                ))}
            </div>
        </div>
    );
};

export default HorizontalProductList;
