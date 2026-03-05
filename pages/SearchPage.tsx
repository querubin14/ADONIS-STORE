import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search } from 'lucide-react';
import { Product } from '../types';

const SearchPage: React.FC = () => {
    const { products, cart, addToCart } = useShop();
    const [searchResults, setSearchResults] = useState<Product[]>([]);

    // Get search query from URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const rawQuery = queryParams.get('q') || '';
    const query = rawQuery.trim().toLowerCase();

    useEffect(() => {
        if (query.length > 0) {
            const results = products.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query) ||
                (p.subcategory?.toLowerCase() || '').includes(query)
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [query, products]);

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className="min-h-screen bg-[#000000] text-white selection:bg-white selection:text-black flex flex-col font-sans">
            <Navbar cartCount={cartCount} />

            <main className="flex-grow pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto w-full">

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">
                        Resultados de búsqueda
                    </h1>
                    {query ? (
                        <p className="text-[#a1a1aa] font-mono text-sm uppercase tracking-widest">
                            Mostrando resultados para: <span className="text-white font-bold">"{rawQuery}"</span> ({searchResults.length})
                        </p>
                    ) : (
                        <p className="text-[#a1a1aa] font-mono text-sm uppercase tracking-widest">
                            Ingresa un término de búsqueda para ver productos.
                        </p>
                    )}
                </div>

                {/* Grid */}
                {searchResults.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {searchResults.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={() => addToCart(product)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Search size={64} className="text-gray-800 mb-6" />
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-4">No se encontraron productos</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-8 font-light">
                            No pudimos encontrar ningún producto que coincida con "<strong>{rawQuery}</strong>". Intenta con otro término o explora nuestras categorías principales.
                        </p>
                        <Link to="/" className="bg-white text-black font-black uppercase tracking-[0.2em] px-8 py-3 rounded hover:bg-gray-200 transition-colors text-xs md:text-sm">
                            Volver al Inicio
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default SearchPage;
