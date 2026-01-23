
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

const Home: React.FC = () => {
    const { products, addToCart, cart, categories, visibilityConfig } = useShop();

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Categories are now directly from context (objects)

    return (
        <div className="min-h-screen bg-background-dark text-white selection:bg-primary selection:text-white">
            <Navbar cartCount={cartCount} />

            <main>
                {visibilityConfig.hero && <Hero />}
                {visibilityConfig.drops && <UpcomingDrops />}

                {/* Featured Products Section (Max 8) */}
                {visibilityConfig.featured && (
                    <section className="py-20 px-6 lg:px-12 max-w-[1400px] mx-auto">
                        <div className="flex items-end justify-between mb-10 pb-4 border-b border-gray-800">
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
                {visibilityConfig.categories && categories.map(categoryObj => {
                    const category = categoryObj.id;
                    const categoryProducts = products.filter(p =>
                        p.category.toLowerCase() === category.toLowerCase() ||
                        p.category.toLowerCase() === categoryObj.name.toLowerCase()
                    );
                    if (categoryProducts.length === 0 && category !== 'huerfanos') return null; // Logic to skip empty unless needed
                    if (categoryProducts.length === 0) return null; // Safe check

                    const displayProducts = categoryProducts
                        .sort((a, b) => (a.isCategoryFeatured === b.isCategoryFeatured ? 0 : a.isCategoryFeatured ? -1 : 1))
                        .slice(0, 8);

                    const hasMore = categoryProducts.length > 8;

                    return (
                        <section
                            key={category}
                            id={category}
                            className="py-20 px-6 lg:px-12 max-w-[1400px] mx-auto border-t border-gray-900"
                            style={{ opacity: categoryObj.opacity !== undefined ? categoryObj.opacity : 1 }}
                        >
                            <div className="flex items-end justify-between mb-10 pb-4 border-b border-gray-800">
                                <div>
                                    <h2 className="text-3xl font-bold uppercase tracking-tight">{categoryObj.name}</h2>
                                    <p className="text-accent-gray mt-1 text-sm">Explora nuestra colección de {category}</p>
                                </div>
                                {hasMore && (
                                    <Link
                                        to={`/category/${category}`}
                                        className="hidden md:flex items-center text-sm font-bold text-primary hover:text-white transition-colors gap-1"
                                    >
                                        VER TODO <ArrowRight size={16} />
                                    </Link>
                                )}
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                                {displayProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={() => addToCart(product)}
                                    />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-8 text-center md:hidden">
                                    <Link
                                        to={`/category/${category}`}
                                        className="inline-flex items-center text-sm font-bold text-primary hover:text-white transition-colors gap-1 border border-primary/50 px-6 py-3 rounded"
                                    >
                                        VER TODO {category} <ArrowRight size={16} />
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
