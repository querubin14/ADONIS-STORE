import React from 'react';
import { useShop } from '../context/ShopContext';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Contact: React.FC = () => {
    const { cart } = useShop();
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen bg-background-dark text-white selection:bg-primary selection:text-white flex flex-col">
            <Navbar cartCount={cartCount} />

            <main className="flex-grow pt-32 pb-20 px-6 lg:px-12 max-w-4xl mx-auto w-full">
                <article className="prose prose-invert prose-lg max-w-none">
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-8 text-white border-b border-gray-800 pb-6">
                        CONTACTO
                    </h1>

                    <div className="space-y-8 text-gray-300 leading-relaxed text-sm md:text-base">
                        <p>
                            En <span className="text-white font-bold">SAVAGE</span>, valoramos la exclusividad y la atención personalizada. Si tienes dudas sobre tu pedido, colaboraciones o consultas generales, estamos a tu disposición a través de nuestros canales oficiales.
                        </p>

                        <section>
                            <h2 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-2 border-l-4 border-primary pl-4">
                                Canales de Atención
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Instagram */}
                                <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-gradient-to-tr from-purple-600 to-pink-600 p-2 rounded-lg">
                                            <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
                                            {/* Note: using a generic icon or we can use generic text if icon font not loaded for specific brands */}
                                        </div>
                                        <h3 className="font-bold text-white uppercase tracking-wider text-sm">Instagram Direct</h3>
                                    </div>
                                    <a href="https://instagram.com/savage_storepy" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline mb-2 block">
                                        @savage_storepy
                                    </a>
                                    <p className="text-gray-500 text-xs">
                                        Nuestra vía principal para consultas rápidas y novedades diarias.
                                    </p>
                                </div>

                                {/* WhatsApp */}
                                <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-green-600 p-2 rounded-lg">
                                            <span className="material-symbols-outlined text-white text-xl">chat</span>
                                        </div>
                                        <h3 className="font-bold text-white uppercase tracking-wider text-sm">WhatsApp Concierge</h3>
                                    </div>
                                    <a href="https://wa.me/595983840235" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline mb-2 block">
                                        +595 983840235
                                    </a>
                                    <p className="text-gray-500 text-xs">
                                        Atención personalizada para ventas y seguimiento de envíos.
                                    </p>
                                </div>

                                {/* Email */}
                                <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-colors md:col-span-2">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-blue-600 p-2 rounded-lg">
                                            <span className="material-symbols-outlined text-white text-xl">mail</span>
                                        </div>
                                        <h3 className="font-bold text-white uppercase tracking-wider text-sm">Correo Electrónico</h3>
                                    </div>
                                    <a href="mailto:savageeepy@gmail.com" className="text-primary font-bold hover:underline mb-2 block">
                                        savageeepy@gmail.com
                                    </a>
                                    <p className="text-gray-500 text-xs">
                                        Para consultas corporativas o administrativas.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
