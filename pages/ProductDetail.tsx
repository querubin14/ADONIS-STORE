
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { ShoppingBag, ArrowLeft, Star, Share2 } from 'lucide-react';
import { ColorVariant } from '../types';
import CustomAlert from '../components/CustomAlert';

const ProductDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { products, addToCart, cart, socialConfig } = useShop();

    // Check if slug looks like a UUID (fallback for old links)
    const isUuid = (str?: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str || '');

    // Find by slug OR by ID
    const product = products.find(p => p.slug === slug || p.id === slug);

    // State
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
    const [zoomState, setZoomState] = useState({ show: false, x: 0, y: 0 });
    const [alertConfig, setAlertConfig] = useState<{ isOpen: boolean; title: string; message: string }>({
        isOpen: false,
        title: '',
        message: ''
    });
    const thumbnailsRef = React.useRef<HTMLDivElement>(null);

    const scrollThumbnails = (direction: 'left' | 'right') => {
        if (thumbnailsRef.current) {
            const container = thumbnailsRef.current;
            const scrollAmount = container.clientWidth * 0.75;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!product) {
        return <div className="min-h-screen bg-background-dark text-white flex items-center justify-center">Producto no encontrado</div>;
    }

    const isAccessory = product.category?.toUpperCase() === 'ACCESORIOS';

    // Active Color Logic (Default to first if not selected)
    const activeColor = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : null);

    // Filter Images based on Active Color
    const { displayImages, displayAlts } = React.useMemo(() => {
        if (!product.colors || product.colors.length === 0 || !activeColor) {
            return { displayImages: product.images, displayAlts: product.imageAlts };
        }

        // Map colors to their image indices to determine ranges
        const colorIndices = product.colors
            .map(c => ({
                color: c,
                index: product.images.findIndex(img => img === c.image)
            }))
            .filter(x => x.index !== -1)
            .sort((a, b) => a.index - b.index);

        if (colorIndices.length === 0) return { displayImages: product.images, displayAlts: product.imageAlts };

        const activeIndex = colorIndices.findIndex(x => x.color.name === activeColor.name);

        // If active color image not found in main list, show full list fallback
        if (activeIndex === -1) return { displayImages: product.images, displayAlts: product.imageAlts };

        const start = colorIndices[activeIndex].index;
        const end = activeIndex < colorIndices.length - 1
            ? colorIndices[activeIndex + 1].index
            : product.images.length;

        // Ensure we don't return partial arrays if logic fails
        if (start >= end) return { displayImages: product.images, displayAlts: product.imageAlts };

        return {
            displayImages: product.images.slice(start, end),
            displayAlts: product.imageAlts ? product.imageAlts.slice(start, end) : []
        };
    }, [product, activeColor]);

    // Reset selected image when active color changes
    React.useEffect(() => {
        setSelectedImage(0);
    }, [activeColor]);

    // Stock Logic considering Variant
    const currentStock = activeColor?.stock !== undefined ? activeColor.stock : product.stock;
    const isTotallyOutOfStock = product.inventory && product.inventory.length > 0
        ? product.inventory.every(i => Number(i.quantity) === 0)
        : currentStock === 0;

    const handleAddToCart = () => {
        if (isTotallyOutOfStock) return;
        if (!selectedSize && product.sizes.length > 0 && !isAccessory) {
            setAlertConfig({
                isOpen: true,
                title: 'Atención',
                message: 'Por favor, selecciona un talle.'
            });
            return;
        }
        addToCart(product, selectedSize || (isAccessory ? 'Talle Único' : 'One Size'), activeColor?.name);
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Related Products for Recommendations
    // Related Products for Recommendations
    const relatedProducts = React.useMemo(() => {
        if (!product) return [];

        const candidates = products.filter(p => p.id !== product.id && p.category === product.category);

        // Split by priority
        const sameSub = candidates.filter(p => p.subcategory === product.subcategory);
        const otherSub = candidates.filter(p => p.subcategory !== product.subcategory);

        // Shuffle logic
        const shuffle = (list: typeof products) => [...list].sort(() => 0.5 - Math.random());

        // Combine: Prioritize same subcategory, then others
        return [...shuffle(sameSub), ...shuffle(otherSub)].slice(0, 3);
    }, [product, products]);

    return (
        <div className="min-h-screen bg-background-dark text-white">
            <Navbar cartCount={cartCount} />

            <SEO
                title={`${product.name} - Savage Store Paraguay`}
                description={product.description || `Comprá ${product.name} en Savage Store. Calidad Premium.`}
                image={product.images[0]}
                product={true}
                // Important: Ensure this URL matches what the bot sees
                url={window.location.href}
            />

            {/* Structured Data for SEO */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": product.name,
                    "image": product.images,
                    "description": product.description || `Compra ${product.name} en Savage Store Paraguay.`,
                    "brand": {
                        "@type": "Brand",
                        "name": "Savage Store"
                    },
                    "offers": {
                        "@type": "Offer",
                        "url": window.location.href,
                        "priceCurrency": "PYG",
                        "price": product.price,
                        "availability": isTotallyOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
                        "itemCondition": "https://schema.org/NewCondition"
                    }
                })}
            </script>

            <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> Volver
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12">
                    {/* Gallery Section */}
                    <div className="space-y-6">
                        <div
                            className="aspect-square rounded-lg overflow-hidden bg-surface-dark border border-white/5 relative group cursor-crosshair"
                            onMouseEnter={() => setZoomState(prev => ({ ...prev, show: true }))}
                            onMouseLeave={() => setZoomState(prev => ({ ...prev, show: false }))}
                            onMouseMove={(e) => {
                                const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                                const x = ((e.clientX - left) / width) * 100;
                                const y = ((e.clientY - top) / height) * 100;
                                setZoomState({ show: true, x, y });
                            }}
                        >
                            <img
                                src={displayImages[selectedImage]}
                                alt={
                                    displayAlts?.[selectedImage] ||
                                    ((product.name.toLowerCase().includes('camiseta') || product.category?.toLowerCase().includes('ropa'))
                                        ? `Camiseta de fútbol ${product.name} - Savage Store Paraguay`
                                        : `${product.name} - Savage Store Paraguay`)
                                }
                                className={`w-full h-full object-cover ${isTotallyOutOfStock ? 'grayscale opacity-50' : ''} ${!zoomState.show ? 'transition-transform duration-500' : ''}`}
                                style={{
                                    transformOrigin: `${zoomState.x}% ${zoomState.y}%`,
                                    transform: zoomState.show ? 'scale(2)' : 'scale(1)',
                                }}
                            />
                            {isTotallyOutOfStock && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="bg-red-600 text-white font-black px-6 py-3 uppercase tracking-widest text-xl border-4 border-white transform -rotate-12 shadow-2xl">
                                        AGOTADO
                                    </span>
                                </div>
                            )}
                            {/* Image Navigation (Optional if multiple images) */}
                            {displayImages.length > 1 && !zoomState.show && (
                                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <button className="bg-black/50 p-2 rounded-full pointer-events-auto hover:bg-black/80" onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev > 0 ? prev - 1 : displayImages.length - 1); }}>
                                        <ArrowLeft size={20} />
                                    </button>
                                    <button className="bg-black/50 p-2 rounded-full pointer-events-auto hover:bg-black/80" onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev < displayImages.length - 1 ? prev + 1 : 0); }}>
                                        <ArrowLeft size={20} className="rotate-180" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {displayImages.length > 1 && (
                            <div className="relative group/thumbs">
                                <button
                                    onClick={() => scrollThumbnails('left')}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-1.5 rounded-full text-white opacity-0 group-hover/thumbs:opacity-100 transition-opacity hover:bg-black/80 disabled:opacity-0 backdrop-blur-sm"
                                    aria-label="Scroll left"
                                >
                                    <ArrowLeft size={16} />
                                </button>

                                <div
                                    ref={thumbnailsRef}
                                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-1"
                                >
                                    {displayImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`relative w-24 aspect-square rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === idx ? 'border-primary' : 'border-transparent hover:border-gray-600'}`}
                                        >
                                            <img src={img} alt={displayAlts?.[idx] || `${product.name} Thumbnail`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => scrollThumbnails('right')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-1.5 rounded-full text-white opacity-0 group-hover/thumbs:opacity-100 transition-opacity hover:bg-black/80 backdrop-blur-sm"
                                    aria-label="Scroll right"
                                >
                                    <ArrowLeft size={16} className="rotate-180" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col">
                        <div className="mb-2 flex gap-2">
                            {product.tags.filter(t => !['SIN CATEGORIA', 'SIN CATEGORÍA', 'NUEVO', 'NEW'].includes(t.toUpperCase())).map(tag => (
                                <span key={tag} className="px-2 py-1 bg-white/10 text-xs font-bold uppercase rounded text-primary border border-primary/20">{tag}</span>
                            ))}
                            {product.isNew && <span className="px-2 py-1 bg-primary text-xs font-bold uppercase rounded text-white">NUEVO</span>}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 leading-none">{product.name}</h1>

                        <div className="flex items-end gap-4 mb-8">
                            <span className="text-4xl font-bold font-mono text-primary">Gs. {(activeColor?.price || product.price).toLocaleString()}</span>
                            {product.originalPrice && product.originalPrice > (activeColor?.price || product.price) && (
                                <span className="text-xl text-gray-500 line-through mb-1">Gs. {product.originalPrice.toLocaleString()}</span>
                            )}
                        </div>



                        <div className="flex flex-col gap-8 mb-10">
                            {/* Size Selector */}
                            {!isAccessory && (
                                <div className="w-full text-left">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-bold uppercase tracking-widest text-gray-300">Talle</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map(size => {
                                            const normalizedSize = size.trim().toUpperCase();
                                            let isOutOfStock = false;
                                            if (product.inventory && product.inventory.length > 0) {
                                                const invItem = product.inventory.find(i => i.size.trim().toUpperCase() === normalizedSize);
                                                if (invItem && Number(invItem.quantity) <= 0) isOutOfStock = true;
                                            }

                                            return (
                                                <button
                                                    key={size}
                                                    onClick={() => !isOutOfStock && setSelectedSize(size)}
                                                    disabled={isOutOfStock}
                                                    className={`h-12 px-6 flex items-center justify-center border rounded font-mono font-medium transition-all relative overflow-hidden ${selectedSize === size
                                                        ? 'bg-white text-black border-white'
                                                        : isOutOfStock
                                                            ? 'border-gray-800 text-gray-600 cursor-not-allowed bg-white/5 opacity-50'
                                                            : 'border-gray-800 text-gray-400 hover:border-gray-600'
                                                        }`}
                                                >
                                                    <span className={`${isOutOfStock ? 'line-through decoration-red-500' : ''} text-xs md:text-sm`}>{size}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {product.fit && <p className="mt-4 text-xs text-gray-500">Fit: <span className="text-white">{product.fit}</span></p>}
                                </div>
                            )}

                            {/* Color Selector */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-bold uppercase tracking-widest text-gray-300">
                                            Color: <span className="text-primary ml-1">{activeColor?.name || 'Seleccionar'}</span>
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {product.colors.map((color, idx) => {
                                            const isSelected = activeColor && activeColor.name === color.name;

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        setSelectedColor(color);
                                                        // Image reset is handled by useEffect on activeColor change
                                                    }}
                                                    className={`group relative w-16 h-16 rounded mb-2 overflow-hidden border-2 transition-all flex items-center justify-center ${isSelected ? 'border-primary ring-2 ring-primary/50 scale-105 shadow-xl' : 'border-gray-700 hover:border-gray-500 hover:scale-105'}`}
                                                    title={color.name}
                                                    style={{ backgroundColor: !color.image ? (color.hex || '#222') : undefined }}
                                                >
                                                    {/* Always Key: Show Image if available (Visual Variant) */}
                                                    {color.image && <img src={color.image} alt={color.name} className="w-full h-full object-cover" />}

                                                    {/* Fallback to hex if image broken/missing but hex exists */}
                                                    {!color.image && <span className={`text-[8px] font-bold ${color.hex === '#ffffff' || color.hex === '#fff' ? 'text-black' : 'text-white'} drop-shadow-md`}>{!color.image && !color.hex ? color.name : ''}</span>}

                                                    {/* Active Indicator Overlay */}
                                                    {isSelected && <div className="absolute inset-0 ring-inset ring-2 ring-primary/20 pointer-events-none" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Add To Cart Button - Moved to bottom for better mobile/desktop flow */}
                            <div className="pt-4 border-t border-gray-800">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isTotallyOutOfStock}
                                    className={`w-full md:w-auto h-14 px-10 font-black tracking-widest uppercase rounded transition-all flex items-center justify-center gap-3 text-base ${isTotallyOutOfStock ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-red-700 text-white shadow-lg hover:shadow-red-900/20 hover:-translate-y-1'}`}
                                >
                                    {isTotallyOutOfStock ? 'AGOTADO' : (
                                        <>
                                            <ShoppingBag size={20} /> <span className="">AGREGAR AL CARRITO</span>
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>

                        {/* Actions */}
                        {product.description && (
                            <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-500 delay-100">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Descripción</h3>
                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-light">
                                    {product.description}
                                </p>
                            </div>
                        )}
                        <div className="mt-auto space-y-4">
                            {isAccessory && (
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
                            )}

                            {/* <div className="flex gap-4">
                                <button className="flex-1 py-3 border border-gray-800 hover:bg-white/5 rounded text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">
                                    <Star size={16} /> Guardar
                                </button>
                                <button className="flex-1 py-3 border border-gray-800 hover:bg-white/5 rounded text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">
                                    <Share2 size={16} /> Compartir
                                </button>
                            </div> */}
                        </div>

                        {/* Recommendations Section */}
                        {relatedProducts.length > 0 && (
                            <div className="mt-8 border-t border-gray-800 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                                    <Star size={12} className="text-primary" /> Recomendaciones
                                </h3>
                                <div className="grid grid-cols-3 gap-3 mb-4 max-w-[380px]">
                                    {relatedProducts.map(rp => (
                                        <button
                                            key={rp.id}
                                            onClick={() => {
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                navigate(`/product/${rp.slug || rp.id}`);
                                            }}
                                            className="group text-left"
                                        >
                                            <div className="aspect-[3/4] rounded bg-gray-900 border border-white/10 overflow-hidden mb-2 group-hover:border-primary transition-colors relative">
                                                <img src={rp.images[0]} alt={rp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                {rp.images[1] && (
                                                    <img src={rp.images[1]} alt={rp.name} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                )}
                                            </div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase truncate group-hover:text-white transition-colors">{rp.name}</p>
                                            <p className="text-[9px] text-primary font-bold">Gs. {rp.price.toLocaleString()}</p>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => navigate(`/category/${product.category}`)}
                                    className="w-full py-3 border border-gray-800 hover:bg-white/5 hover:border-white/20 rounded text-[10px] font-bold uppercase tracking-[0.2em] transition-all text-center block text-gray-400 hover:text-white"
                                >
                                    Ver Más Opciones
                                </button>
                            </div>
                        )}

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

            <CustomAlert
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                title={alertConfig.title}
                message={alertConfig.message}
            />
        </div>
    );
};

export default ProductDetail;
