
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShoppingBag, ArrowLeft, Star, Share2 } from 'lucide-react';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { products, addToCart, cart, socialConfig } = useShop();

    const product = products.find(p => p.id === id);

    // State
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string>('');

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return <div className="min-h-screen bg-background-dark text-white flex items-center justify-center">Producto no encontrado</div>;
    }

    const isAccessory = product.category?.toUpperCase() === 'ACCESORIOS';

    const isTotallyOutOfStock = product.inventory && product.inventory.length > 0
        ? product.inventory.every(i => Number(i.quantity) === 0)
        : product.stock === 0;

    const handleAddToCart = () => {
        if (isTotallyOutOfStock) return;
        if (!selectedSize && product.sizes.length > 0 && !isAccessory) {
            alert('Por favor selecciona un talle');
            return;
        }
        addToCart(product, selectedSize || (isAccessory ? 'Talle Único' : 'One Size'));
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen bg-background-dark text-white">
            <Navbar cartCount={cartCount} />

            <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> Volver
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Gallery Section */}
                    <div className="space-y-6">
                        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface-dark border border-white/5 relative group">
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className={`w-full h-full object-cover ${isTotallyOutOfStock ? 'grayscale opacity-50' : ''}`}
                            />
                            {isTotallyOutOfStock && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-red-600 text-white font-black px-6 py-3 uppercase tracking-widest text-xl border-4 border-white transform -rotate-12 shadow-2xl">
                                        AGOTADO
                                    </span>
                                </div>
                            )}
                            {/* Image Navigation (Optional if multiple images) */}
                            {product.images.length > 1 && (
                                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <button className="bg-black/50 p-2 rounded-full pointer-events-auto hover:bg-black/80" onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}>
                                        <ArrowLeft size={20} />
                                    </button>
                                    <button className="bg-black/50 p-2 rounded-full pointer-events-auto hover:bg-black/80" onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}>
                                        <ArrowLeft size={20} className="rotate-180" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-24 aspect-square rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === idx ? 'border-primary' : 'border-transparent hover:border-gray-600'}`}
                                    >
                                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col">
                        <div className="mb-2 flex gap-2">
                            {product.tags.filter(t => !['SIN CATEGORIA', 'SIN CATEGORÍA'].includes(t.toUpperCase())).map(tag => (
                                <span key={tag} className="px-2 py-1 bg-white/10 text-xs font-bold uppercase rounded text-primary border border-primary/20">{tag}</span>
                            ))}
                            {product.isNew && <span className="px-2 py-1 bg-primary text-xs font-bold uppercase rounded text-white">NUEVO</span>}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 leading-none">{product.name}</h1>

                        <div className="flex items-end gap-4 mb-8">
                            <span className="text-4xl font-bold font-mono text-primary">Gs. {product.price.toLocaleString()}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-xl text-gray-500 line-through mb-1">Gs. {product.originalPrice.toLocaleString()}</span>
                            )}
                        </div>

                        {product.description && (
                            <p className="text-gray-400 mb-8 leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                        )}

                        {/* Size Selector - Hidden for Accessories */}
                        {!isAccessory && (
                            <div className="mb-10">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold uppercase tracking-widest text-gray-300">Talle</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map(size => {
                                        // Normalize size for comparison
                                        const normalizedSize = size.trim().toUpperCase();

                                        // Check inventory if available
                                        let isOutOfStock = false;
                                        if (product.inventory && product.inventory.length > 0) {
                                            const invItem = product.inventory.find(i => i.size.trim().toUpperCase() === normalizedSize);

                                            if (invItem) {
                                                const qty = Number(invItem.quantity);
                                                if (qty <= 0) isOutOfStock = true;
                                            }
                                        }

                                        return (
                                            <button
                                                key={size}
                                                onClick={() => !isOutOfStock && setSelectedSize(size)}
                                                disabled={isOutOfStock}
                                                className={`h-12 w-20 flex flex-col items-center justify-center border rounded font-mono font-medium transition-all relative overflow-hidden ${selectedSize === size
                                                    ? 'bg-white text-black border-white'
                                                    : isOutOfStock
                                                        ? 'border-gray-800 text-gray-600 cursor-not-allowed bg-white/5 opacity-50'
                                                        : 'border-gray-800 text-gray-400 hover:border-gray-600'
                                                    }`}
                                            >
                                                <span className={isOutOfStock ? 'line-through decoration-red-500' : ''}>{size}</span>
                                                {isOutOfStock && <span className="text-[8px] text-red-500 font-bold uppercase leading-none mt-1">Agotado</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                                {product.fit && <p className="mt-4 text-sm text-gray-500">Fit: <span className="text-white font-medium">{product.fit}</span></p>}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-auto space-y-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={isTotallyOutOfStock}
                                className={`w-full py-5 font-bold tracking-[0.15em] uppercase rounded transition-all flex items-center justify-center gap-3 text-lg ${isTotallyOutOfStock ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-primary hover:opacity-90 text-white'}`}
                            >
                                {isTotallyOutOfStock ? 'AGOTADO' : (
                                    <>
                                        <ShoppingBag size={24} /> Agregar al Carrito
                                    </>
                                )}
                            </button>

                            {/* <div className="flex gap-4">
                                <button className="flex-1 py-3 border border-gray-800 hover:bg-white/5 rounded text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">
                                    <Star size={16} /> Guardar
                                </button>
                                <button className="flex-1 py-3 border border-gray-800 hover:bg-white/5 rounded text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">
                                    <Share2 size={16} /> Compartir
                                </button>
                            </div> */}
                        </div>

                        <div className="mt-8 border-t border-gray-800 pt-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <span className="material-symbols-outlined text-green-500">check_circle</span>
                                {socialConfig.shippingText || 'Envío gratis en compras mayores a Gs. 200.000'}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <span className="material-symbols-outlined text-green-500">check_circle</span>
                                {socialConfig.extraShippingInfo || 'Devoluciones gratis hasta 30 días'}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetail;
