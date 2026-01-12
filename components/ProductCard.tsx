
import React from 'react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const isTotallyOutOfStock = product.inventory && product.inventory.length > 0
    ? product.inventory.every(i => Number(i.quantity) === 0)
    : product.stock === 0;

  return (
    <div className="group flex flex-col gap-3">
      <div
        className="relative w-full aspect-[3/4] overflow-hidden rounded bg-surface-dark group cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.images[0]}
          alt={
            (product.name.toLowerCase().includes('camiseta') || product.category.toLowerCase().includes('ropa'))
              ? `Camiseta de fútbol ${product.name} - Savage Store Paraguay`
              : `${product.name} - Savage Store Paraguay`
          }
          className={`w-full h-full transition-transform duration-700 group-hover:scale-110 ${product.type === 'footwear' ? 'object-contain' : 'object-cover'} ${isTotallyOutOfStock ? 'grayscale opacity-50' : ''}`}
        />
        {/* Sold Out Overlay */}
        {isTotallyOutOfStock && (
          <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
            <span className="bg-red-600 text-white font-black px-4 py-2 uppercase tracking-widest text-sm border-2 border-white transform -rotate-12 shadow-xl">
              AGOTADO
            </span>
          </div>
        )}

        {!isTotallyOutOfStock && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="absolute bottom-3 right-3 bg-white text-black p-2.5 rounded-full transition-all duration-300 hover:scale-110 hover:bg-black hover:text-white shadow-xl z-10 flex items-center justify-center"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <div className="bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
              Nuevo
            </div>
          )}
          {product.tags && product.tags.filter(t => !['SIN CATEGORIA', 'SIN CATEGORÍA', 'Nuevo', 'NUEVO'].includes(t.toUpperCase()) && !(product.isNew && t.toUpperCase() === 'NUEVO')).map(tag => (
            <div key={tag} className="bg-black/70 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
              {tag}
            </div>
          ))}
        </div>

        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </div>
        )}
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h3
            className="text-white text-lg font-bold leading-tight group-hover:text-primary transition-colors cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product.name}
          </h3>
          <p className="text-accent-gray text-xs uppercase tracking-wide mt-1">
            {product.subcategory || product.category}
          </p>
        </div>
        <div className="text-right">
          <p className={`font-medium ${product.originalPrice && product.originalPrice > product.price ? 'text-primary' : 'text-white'}`}>
            Gs. {product.price.toLocaleString()}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-gray-500 line-through text-xs font-normal">Gs. {product.originalPrice.toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
