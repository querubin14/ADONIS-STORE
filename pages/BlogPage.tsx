
import React, { useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPage: React.FC = () => {
    const { blogPosts, cart, loading } = useShop();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Get strictly the latest 10 posts/comments
    // Assuming new posts are added to the beginning or end? 
    // In ShopContext: setBlogPosts(prev => [post, ...prev]); -> So index 0 is newest.
    // We take the first 10.
    const displayPosts = blogPosts.slice(0, 10);

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-white font-sans">
            <Navbar cartCount={cartCount} />

            <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 md:py-20">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-gray-800 pb-8">
                    <div className="space-y-4">
                        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-2 group">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-bold uppercase tracking-widest">Volver al Inicio</span>
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                            Savage <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Community</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                            Historias reales de quienes visten sin límites. Descubre por qué eligen la calidad y el estilo Savage.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden h-[500px] animate-pulse">
                                <div className="h-48 bg-gray-800" />
                                <div className="p-8 space-y-4">
                                    <div className="flex justify-between">
                                        <div className="h-4 w-24 bg-gray-800 rounded" />
                                        <div className="size-6 bg-gray-800 rounded-full" />
                                    </div>
                                    <div className="h-8 w-3/4 bg-gray-800 rounded" />
                                    <div className="h-4 w-full bg-gray-800 rounded" />
                                    <div className="h-4 w-full bg-gray-800 rounded" />
                                    <div className="h-4 w-2/3 bg-gray-800 rounded" />
                                    <div className="pt-6 mt-auto flex items-center gap-3">
                                        <div className="size-10 bg-gray-800 rounded-full" />
                                        <div className="space-y-2">
                                            <div className="h-3 w-20 bg-gray-800 rounded" />
                                            <div className="h-3 w-16 bg-gray-800 rounded" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : displayPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-in fade-in duration-700">
                        {displayPosts.map((post, index) => (
                            <div
                                key={post.id}
                                className="group bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-white/5 flex flex-col"
                            >
                                {/* Image (if exists) */}
                                {post.image && post.image.startsWith('http') && (
                                    <div className="relative aspect-video overflow-hidden bg-gray-900">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: `url('${post.image}')` }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

                                        <div className="absolute bottom-4 left-4">
                                            <span className="bg-primary text-black text-[10px] font-black px-2 py-1 uppercase tracking-wider rounded">
                                                {post.tag || 'CLIENTE'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-1">
                                            {[...Array(post.rating || 5)].map((_, i) => (
                                                <Star key={i} size={16} className="text-[#FFE81F] fill-current drop-shadow-sm" />
                                            ))}
                                        </div>
                                        <Quote size={24} className="text-gray-800" />
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors uppercase leading-tight">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-1">
                                        "{post.content}"
                                    </p>

                                    <div className="flex items-center gap-3 border-t border-gray-800 pt-6 mt-auto">
                                        <div className="size-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-gray-400 text-xs border border-gray-700">
                                            {post.author.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm uppercase tracking-wide">{post.author}</p>
                                            <p className="text-xs text-gray-500 font-mono">{post.date}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center border border-dashed border-gray-800 rounded-3xl bg-white/5 animate-in fade-in zoom-in duration-500">
                        <div className="inline-flex p-4 rounded-full bg-gray-900 mb-4 text-gray-500">
                            <Quote size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Aún no hay historias</h3>
                        <p className="text-gray-400">Sé el primero en compartir tu experiencia Savage.</p>
                    </div>
                )}

            </main>

            <Footer />
        </div>
    );
};

export default BlogPage;
