
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { ArrowLeft } from 'lucide-react';

const CategoryPage: React.FC = () => {
    const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
    const navigate = useNavigate();
    const { products, categories, addToCart, cart } = useShop();
    const [activeSubcategory, setActiveSubcategory] = React.useState<string>('ALL');

    React.useEffect(() => {
        if (subcategory) {
            setActiveSubcategory(subcategory);
        } else {
            setActiveSubcategory('ALL');
        }
        window.scrollTo(0, 0);
    }, [category, subcategory]);

    const currentCategoryInfo = categories.find(c => c.id.toLowerCase() === category?.toLowerCase() || c.name.toLowerCase() === category?.toLowerCase());

    const categoryProducts = products.filter(p => {
        const matchesCategory = p.category.toLowerCase() === category?.toLowerCase();
        if (!matchesCategory) return false;
        if (activeSubcategory === 'ALL') return true;
        return p.subcategory?.toLowerCase() === activeSubcategory.toLowerCase();
    });

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const getSEOInfo = (cat: string | undefined) => {
        const c = cat?.toLowerCase();
        if (c?.includes('camisetas') || c === 'ropa') return {
            title: 'Camisetas de Fútbol Premium',
            desc: 'La mejor selección de camisetas de fútbol retro y actuales en Paraguay.',
            docTitle: 'Camisetas de Fútbol - Savage Store Paraguay'
        };
        if (c?.includes('calzado')) return {
            title: 'Calzado Urbano & Sneakers',
            desc: 'Zapatillas y sneakers exclusivos para completar tu outfit Savage.',
            docTitle: 'Calzado Urbano - Savage Store Paraguay'
        };
        if (c?.includes('relojes') || c?.includes('accesorios') || c?.includes('joyas')) return {
            title: 'ACCESORIOS PREMIUM',
            desc: 'Complementos de lujo: Accesorios para destacar.',
            docTitle: 'Accesorios - Adonis Store Paraguay'
        };
        return {
            title: category,
            desc: `${categoryProducts.length} productos disponibles`,
            docTitle: `${category} - Savage Store Paraguay`
        };
    };

    const seoInfo = getSEOInfo(category);

    React.useEffect(() => {
        document.title = seoInfo.docTitle;
    }, [category, seoInfo.docTitle]);

    return (
        <div className="min-h-screen bg-background-dark text-white selection:bg-primary selection:text-white">
            <Navbar cartCount={cartCount} />

            <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tight">{seoInfo.title}</h1>
                        <p className="text-accent-gray text-sm mt-1">{seoInfo.desc}</p>
                    </div>
                </div>

                {/* Subcategories Filter */}
                {currentCategoryInfo?.subcategories && currentCategoryInfo.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
                        <button
                            onClick={() => navigate(`/category/${category}`)}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${activeSubcategory === 'ALL' ? 'bg-primary border-primary text-white' : 'bg-transparent border-gray-800 text-gray-400 hover:border-gray-500 hover:text-white'}`}
                        >
                            VER TODO
                        </button>
                        {currentCategoryInfo.subcategories.map(sub => (
                            <button
                                key={sub}
                                onClick={() => navigate(`/category/${category}/${sub}`)}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${activeSubcategory === sub ? 'bg-white text-black border-white' : 'bg-transparent border-gray-800 text-gray-400 hover:border-gray-500 hover:text-white'}`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                )}

                {categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                        {categoryProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={() => addToCart(product)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-surface-dark border border-gray-800 rounded-xl">
                        <p className="text-gray-500 text-lg">No hay productos en esta categoría.</p>
                        <Link to="/" className="text-primary hover:underline mt-4 inline-block font-bold">Volver al Inicio</Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default CategoryPage;
