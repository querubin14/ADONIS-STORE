import React from 'react';
import { useShop } from '../context/ShopContext';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Instagram, MessageCircle, Send } from 'lucide-react'; // Using Lucide for sleek icons

const Contact: React.FC = () => {
    const { cart } = useShop();
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen bg-[#000000] text-white selection:bg-white selection:text-black flex flex-col font-sans relative overflow-hidden">
            {/* Cinematic Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />

            <Navbar cartCount={cartCount} />

            <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-24 px-6 lg:px-12 w-full relative z-10">

                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-[0.25em] text-white mb-6">
                        Contacto
                    </h1>
                    <p className="text-[#a1a1aa] text-sm md:text-base tracking-[0.05em] leading-relaxed max-w-xl mx-auto font-light">
                        CANALES EXCLUSIVOS DE ATENCIÓN. ASISTENCIA PERSONALIZADA PARA CLIENTES DE <span className="text-white font-bold tracking-[0.1em]">ADONIS STORE</span>.
                    </p>
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl mx-auto">

                    {/* WhatsApp Card */}
                    <a
                        href="https://wa.me/595993220180"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex flex-col items-center justify-center p-10 
                                   bg-[#050505]/40 backdrop-blur-xl border border-white/10 
                                   hover:border-white/40 transition-all duration-500 rounded-2xl overflow-hidden"
                    >
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-green-500/0 via-green-500/0 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6 
                                        group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 bg-black">
                            <MessageCircle strokeWidth={1.5} size={28} className="text-white" />
                        </div>
                        <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2 font-bold group-hover:text-gray-300 transition-colors">WhatsApp</h2>
                        <p className="text-xl font-medium tracking-wider text-white">0993 220 180</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-600 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                            Enviar Mensaje →
                        </p>
                    </a>

                    {/* Instagram Card */}
                    <a
                        href="https://instagram.com/adonistorepy_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex flex-col items-center justify-center p-10 
                                   bg-[#050505]/40 backdrop-blur-xl border border-white/10 
                                   hover:border-white/40 transition-all duration-500 rounded-2xl overflow-hidden"
                    >
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6 
                                        group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 bg-black">
                            <Instagram strokeWidth={1.5} size={28} className="text-white" />
                        </div>
                        <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2 font-bold group-hover:text-gray-300 transition-colors">Instagram</h2>
                        <p className="text-lg md:text-xl font-medium tracking-wider text-white">@adonistorepy_</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-600 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                            Ver Perfil →
                        </p>
                    </a>

                    {/* TikTok Card */}
                    <a
                        href="https://tiktok.com/@adonistorepy_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex flex-col items-center justify-center p-10 
                                   bg-[#050505]/40 backdrop-blur-xl border border-white/10 
                                   hover:border-white/40 transition-all duration-500 rounded-2xl overflow-hidden"
                    >
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6 
                                        group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 bg-black">
                            {/* A custom TikTok icon or a generic media one if not available. Using Send as decent fallback / social icon */}
                            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68l.01.2a6.29 6.29 0 0 0 3.65 5.47 6.4 6.4 0 0 0 6.54-1.12 6.09 6.09 0 0 0 2.21-5.12V8.71a8.4 8.4 0 0 0 4.19 1.48v-3.4a4.34 4.34 0 0 1-2.01-1.1z" />
                            </svg>
                        </div>
                        <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2 font-bold group-hover:text-gray-300 transition-colors">TikTok</h2>
                        <p className="text-lg md:text-xl font-medium tracking-wider text-white">@adonistorepy_</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-600 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                            Ver Perfil →
                        </p>
                    </a>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
