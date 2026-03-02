
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const CategoryPage: React.FC = () => {
    const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
    const navigate = useNavigate();
    const { products, categories, addToCart, cart, getChildCategories, getCategoryPath } = useShop();

    // Find the current category being viewed
    const currentCategory = categories.find(c =>
        c.id.toLowerCase() === (subcategory || category)?.toLowerCase() ||
        c.name.toLowerCase() === (subcategory || category)?.toLowerCase()
    );

    // If we have a subcategory param, also find the parent
    const parentCategory = subcategory
        ? categories.find(c => c.id.toLowerCase() === category?.toLowerCase() || c.name.toLowerCase() === category?.toLowerCase())
        : null;

    // Get children of current category (sub-subcategories)
    const childCategories = currentCategory ? getChildCategories(currentCategory.id) : [];

    // Build breadcrumb path
    const breadcrumbPath = currentCategory ? getCategoryPath(currentCategory.id) : [];

    // Active filter state for child categories
    const [activeFilter, setActiveFilter] = React.useState<string>('ALL');

    React.useEffect(() => {
        setActiveFilter('ALL');
        window.scrollTo(0, 0);
    }, [category, subcategory]);

    // Helper: get all descendant category IDs (recursive)
    const getAllDescendantIds = (parentId: string): string[] => {
        const children = categories.filter(c => c.parent_id === parentId);
        let ids = [parentId];
        children.forEach(child => {
            ids = ids.concat(getAllDescendantIds(child.id));
        });
        return ids;
    };

    // Filter products - include current category and all descendants
    const categoryProducts = React.useMemo(() => {
        if (!currentCategory) return [];

        const relevantIds = getAllDescendantIds(currentCategory.id);
        const relevantNames = relevantIds.map(id => categories.find(c => c.id === id)?.name.trim().toUpperCase()).filter(Boolean);

        return products.filter(p => {
            const matchesCategory = relevantIds.some(id =>
                p.category?.trim().toLowerCase() === id.toLowerCase() ||
                p.subcategory?.trim().toLowerCase() === id.toLowerCase() ||
                (p as any).rama?.trim().toLowerCase() === id.toLowerCase()
            ) || relevantNames.some(name =>
                p.category?.trim().toUpperCase() === name ||
                p.subcategory?.trim().toUpperCase() === name ||
                (p as any).rama?.trim().toUpperCase() === name
            );

            if (!matchesCategory) return false;

            if (activeFilter === 'ALL') return true;

            // Filter by specific child category
            const filterIds = getAllDescendantIds(activeFilter);
            const filterNames = filterIds.map(id => categories.find(c => c.id === id)?.name.trim().toUpperCase()).filter(Boolean);

            return filterIds.some(id =>
                p.category?.trim().toLowerCase() === id.toLowerCase() ||
                p.subcategory?.trim().toLowerCase() === id.toLowerCase() ||
                (p as any).rama?.trim().toLowerCase() === id.toLowerCase()
            ) || filterNames.some(name =>
                p.category?.trim().toUpperCase() === name ||
                p.subcategory?.trim().toUpperCase() === name ||
                (p as any).rama?.trim().toUpperCase() === name
            );
        });
    }, [currentCategory, products, activeFilter, categories]);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const displayName = currentCategory?.name || category || '';

    React.useEffect(() => {
        document.title = `${displayName} - Adonis Store Paraguay`;
    }, [displayName]);

    return (
        <div className="min-h-screen bg-background-dark text-white selection:bg-primary selection:text-white">
            <Navbar cartCount={cartCount} />

            <main className="max-w-[1400px] mx-auto px-4 lg:px-12 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                    <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
                    {breadcrumbPath.map((crumb, i) => (
                        <React.Fragment key={crumb.id}>
                            <ChevronRight size={12} />
                            {i < breadcrumbPath.length - 1 ? (
                                <Link
                                    to={`/category/${crumb.id}`}
                                    className="hover:text-white transition-colors"
                                >
                                    {crumb.name}
                                </Link>
                            ) : (
                                <span className="text-white font-bold">{crumb.name}</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight">{displayName}</h1>
                        <p className="text-accent-gray text-xs mt-1">{categoryProducts.length} productos disponibles</p>
                    </div>
                </div>

                {/* Child Categories as filter pills */}
                {(() => {
                    // Only show pills for subcategories that actually have products
                    const allMatchedProducts = (() => {
                        if (!currentCategory) return [];
                        const ids = getAllDescendantIds(currentCategory.id);
                        const names = ids.map(id => categories.find(c => c.id === id)?.name.trim().toUpperCase()).filter(Boolean);
                        return products.filter(p =>
                            ids.some(id =>
                                p.category?.trim().toLowerCase() === id.toLowerCase() ||
                                p.subcategory?.trim().toLowerCase() === id.toLowerCase() ||
                                (p as any).rama?.trim().toLowerCase() === id.toLowerCase()
                            ) || names.some(name =>
                                p.category?.trim().toUpperCase() === name ||
                                p.subcategory?.trim().toUpperCase() === name ||
                                (p as any).rama?.trim().toUpperCase() === name
                            )
                        );
                    })();

                    const pillsWithCount = childCategories.map(child => {
                        const childIds = getAllDescendantIds(child.id);
                        const childNames = childIds.map(id => categories.find(c => c.id === id)?.name.trim().toUpperCase()).filter(Boolean);
                        const count = allMatchedProducts.filter(p =>
                            childIds.some(id =>
                                p.category?.trim().toLowerCase() === id.toLowerCase() ||
                                p.subcategory?.trim().toLowerCase() === id.toLowerCase() ||
                                (p as any).rama?.trim().toLowerCase() === id.toLowerCase()
                            ) || childNames.some(name =>
                                p.category?.trim().toUpperCase() === name ||
                                p.subcategory?.trim().toUpperCase() === name ||
                                (p as any).rama?.trim().toUpperCase() === name
                            )
                        ).length;
                        return { ...child, count };
                    }).filter(c => c.count > 0);

                    if (pillsWithCount.length === 0) return null;

                    return (
                        <div className="mb-6 space-y-4">
                            <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
                                <button
                                    onClick={() => setActiveFilter('ALL')}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${activeFilter === 'ALL' ? 'bg-white border-white text-black' : 'bg-transparent border-gray-800 text-gray-400 hover:border-gray-500 hover:text-white'}`}
                                >
                                    VER TODO
                                </button>
                                {pillsWithCount.map(child => (
                                    <button
                                        key={child.id}
                                        onClick={() => setActiveFilter(child.id)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${activeFilter === child.id ? 'bg-white text-black border-white' : 'bg-transparent border-gray-800 text-gray-400 hover:border-gray-500 hover:text-white'}`}
                                    >
                                        {child.name} <span className="opacity-60 ml-1">({child.count})</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })()}

                {/* Product Grid */}
                {categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
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
