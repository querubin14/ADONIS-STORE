import React from 'react';
import { useShop } from '../context/ShopContext';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Truck, MapPin } from 'lucide-react';

const ShippingPolicy: React.FC = () => {
    const { cart } = useShop();
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen bg-[#000000] text-white selection:bg-white selection:text-black flex flex-col font-sans relative overflow-hidden">
            {/* Cinematic Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />

            <Navbar cartCount={cartCount} />

            <main className="flex-grow flex flex-col items-center pt-32 pb-24 px-6 lg:px-12 w-full relative z-10">

                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.25em] text-white mb-6">
                        Términos de Envío
                    </h1>
                    <p className="text-[#a1a1aa] text-sm md:text-base tracking-[0.05em] leading-relaxed max-w-xl mx-auto font-light">
                        LOGÍSTICA DE PRIMER NIVEL PARA ENTREGAS SEGURAS EN TODO EL TERRITORIO NACIONAL.
                    </p>
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-4xl mx-auto">

                    {/* Central Card */}
                    <div className="group relative flex flex-col items-center justify-center p-10 bg-[#050505]/40 backdrop-blur-xl border border-white/10 hover:border-white/40 transition-all duration-500 rounded-2xl overflow-hidden text-center h-full">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 bg-black">
                            <MapPin strokeWidth={1.5} size={28} className="text-white" />
                        </div>
                        <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2 font-bold group-hover:text-gray-300 transition-colors">Zona Central</h2>
                        <p className="text-xl font-medium tracking-wider text-white">Delivery Local</p>
                        <p className="text-[11px] uppercase tracking-widest text-[#a1a1aa] mt-4 leading-relaxed group-hover:text-gray-300 transition-colors">
                            Envíos por delivery disponibles en varias ciudades del departamento Central.
                        </p>
                    </div>

                    {/* Interior Card */}
                    <div className="group relative flex flex-col items-center justify-center p-10 bg-[#050505]/40 backdrop-blur-xl border border-white/10 hover:border-white/40 transition-all duration-500 rounded-2xl overflow-hidden text-center h-full">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 bg-black">
                            <Truck strokeWidth={1.5} size={28} className="text-white" />
                        </div>
                        <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2 font-bold group-hover:text-gray-300 transition-colors">Interior del País</h2>
                        <p className="text-xl font-medium tracking-wider text-white">Transportadora</p>
                        <p className="text-[11px] uppercase tracking-widest text-[#a1a1aa] mt-4 leading-relaxed group-hover:text-gray-300 transition-colors">
                            Envíos seguros y garantizados a través de agencias transportadoras de confianza.
                        </p>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ShippingPolicy;
