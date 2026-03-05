
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CategoryBento from '../components/CategoryBento';
import LifestyleSection from '../components/LifestyleSection';
import Footer from '../components/Footer';

import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import UpcomingDrops from '../components/UpcomingDrops';
import FeaturedCarousel from '../components/FeaturedCarousel';
import HorizontalProductList from '../components/HorizontalProductList';

import TrustBadges from '../components/TrustBadges';

const Home: React.FC = () => {
    const { products, addToCart, cart, categories, visibilityConfig, getChildCategories } = useShop();

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Categories are now directly from context (objects)
    // Only show root categories (parent_id is null)
    const sortedCategories = categories.filter(c => !c.parent_id).sort((a, b) => {
        if (a.id === 'billeteras') return 1;
        if (b.id === 'billeteras') return -1;
        return 0;
    });

    return (
        <div className="min-h-screen bg-background-dark text-white selection:bg-white/20 selection:text-white">
            <Navbar cartCount={cartCount} />


            <main>
                {visibilityConfig.hero && <Hero />}
                <TrustBadges />
                {visibilityConfig.drops && <UpcomingDrops />}

                {/* Featured Products Section (Max 8) */}
                {visibilityConfig.featured && (
                    <section className="py-10 px-6 lg:px-12 max-w-[1400px] mx-auto">
                        <div className="flex items-end justify-between mb-6 pb-4 border-b border-gray-800">
                            <div>
                                <h2 className="text-3xl font-bold uppercase tracking-tight">Destacados</h2>
                                <p className="text-accent-gray mt-1 text-sm">Selección exclusiva de temporada</p>
                            </div>
                        </div>

                        {/* Featured Carousel */}
                        <FeaturedCarousel
                            products={products.filter(p => p.isFeatured).sort((a, b) => (a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1))}
                            onAddToCart={addToCart}
                        />

                    </section>
                )}

                {/* Dynamic Category Sections */}
                {visibilityConfig.categories && sortedCategories.map(categoryObj => {
                    const category = categoryObj.id;

                    // Layout with child categories shown as horizontal lists
                    if (category === 'joyas') {
                        const joyasProducts = products.filter(p =>
                            p.category.toLowerCase() === 'joyas' ||
                            p.category.toLowerCase() === categoryObj.name.toLowerCase()
                        );

                        if (joyasProducts.length === 0) return null;

                        const childCats = getChildCategories(categoryObj.id);

                        return (
                            <section
                                key={category}
                                id={category}
                                className="py-6 px-4 lg:px-12 max-w-[1400px] mx-auto border-t border-gray-900"
                                style={{ opacity: categoryObj.opacity !== undefined ? categoryObj.opacity : 1 }}
                            >
                                <div className="flex items-end justify-between mb-4 pb-2 border-b border-gray-800">
                                    <div>
                                        <h2 className="text-2xl font-bold uppercase tracking-tight">{categoryObj.name}</h2>
                                        <p className="text-accent-gray mt-1 text-xs">Explora nuestra colección de {category}</p>
                                    </div>
                                    <Link
                                        to={`/category/${category}`}
                                        className="hidden md:flex items-center text-xs font-bold text-white hover:text-gray-300 transition-colors gap-1"
                                    >
                                        VER TODO <ArrowRight size={14} />
                                    </Link>
                                </div>

                                <div className="space-y-6">
                                    {childCats.map(childCat => {
                                        const subProducts = joyasProducts
                                            .filter(p => p.subcategory && p.subcategory.toLowerCase().includes(childCat.name.toLowerCase()))
                                            .slice(0, 10);

                                        if (subProducts.length === 0) return null;

                                        return (
                                            <HorizontalProductList
                                                key={childCat.id}
                                                products={subProducts}
                                                title={childCat.name}
                                                viewAllLink={`/category/${childCat.id}`}
                                                onAddToCart={addToCart}
                                            />
                                        );
                                    })}
                                </div>

                                <div className="mt-4 text-center md:hidden">
                                    {/* Mobile catch-all link if needed, but HorizontalProductList has its own view all card */}
                                    <Link
                                        to={`/category/${category}`}
                                        className="inline-flex items-center text-xs font-bold text-white hover:text-gray-300 transition-colors gap-1 border border-white/50 px-4 py-2 rounded"
                                    >
                                        VER TODO {category} <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </section>
                        );
                    }

                    // Default layout for other categories
                    const categoryProducts = products.filter(p =>
                        p.category.toLowerCase() === category.toLowerCase() ||
                        p.category.toLowerCase() === categoryObj.name.toLowerCase()
                    );
                    if (categoryProducts.length === 0 && category !== 'huerfanos') return null;
                    if (categoryProducts.length === 0) return null;

                    const displayProducts = categoryProducts
                        .sort((a, b) => (a.isCategoryFeatured === b.isCategoryFeatured ? 0 : a.isCategoryFeatured ? -1 : 1))
                        .slice(0, 8);

                    const hasMore = categoryProducts.length > 8;

                    return (
                        <section
                            key={category}
                            id={category}
                            className="py-6 px-4 lg:px-12 max-w-[1400px] mx-auto border-t border-gray-900"
                            style={{ opacity: categoryObj.opacity !== undefined ? categoryObj.opacity : 1 }}
                        >
                            <div className="flex items-end justify-between mb-4 pb-2 border-b border-gray-800">
                                <div>
                                    <h2 className="text-2xl font-bold uppercase tracking-tight">{categoryObj.name}</h2>
                                    <p className="text-accent-gray mt-1 text-xs">Explora nuestra colección de {category}</p>
                                </div>
                                {hasMore && (
                                    <Link
                                        to={`/category/${category}`}
                                        className="hidden md:flex items-center text-xs font-bold text-white hover:text-gray-300 transition-colors gap-1"
                                    >
                                        VER TODO <ArrowRight size={14} />
                                    </Link>
                                )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                {displayProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={() => addToCart(product)}
                                    />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-4 text-center md:hidden">
                                    <Link
                                        to={`/category/${category}`}
                                        className="inline-flex items-center text-xs font-bold text-white hover:text-gray-300 transition-colors gap-1 border border-white/50 px-4 py-2 rounded"
                                    >
                                        VER TODO {category} <ArrowRight size={14} />
                                    </Link>
                                </div>
                            )}
                        </section>
                    );
                })}

                {visibilityConfig.categories && <CategoryBento />}

                {visibilityConfig.lifestyle && <LifestyleSection />}
            </main>

            <Footer />
        </div>
    );
};

export default Home;
