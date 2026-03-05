import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, BadgeAlert, ScrollText } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useShop } from '../context/ShopContext';

const TermsOfUse: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { cart } = useShop();
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen bg-[#000000] text-white selection:bg-white selection:text-black flex flex-col font-sans">
            <Navbar cartCount={cartCount} />

            <main className="flex-grow pt-32 pb-20 px-6 lg:px-12 max-w-[1000px] mx-auto w-full">
                {/* Header */}
                <div className="mb-16">
                    <Link to="/" className="inline-flex items-center gap-2 text-[#a1a1aa] hover:text-white transition-colors mb-8 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Volver al inicio</span>
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                        TÉRMINOS Y<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                            CONDICIONES
                        </span>
                    </h1>
                    <p className="text-[#a1a1aa] text-sm md:text-base font-light max-w-2xl leading-relaxed">
                        Normativas y acuerdos rectores al navegar o adquirir piezas de joyería en ADONIS STORE. El uso de nuestro sitio implica la aceptación incondicional de estos términos.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    {/* Section 1 */}
                    <div className="bg-[#050505] border border-white/10 rounded-2xl p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
                        <Scale size={32} className="text-white mb-6" />
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-4">ACERCA DE LAS COMPRAS Y STOCK</h2>
                        <ul className="list-disc pl-5 space-y-3 text-[#a1a1aa] font-light text-sm md:text-base marker:text-white">
                            <li><strong className="text-white font-medium">Disponibilidad Dinámica:</strong> Manejamos piezas exclusivas. Debido a la alta demanda, el stock es dinámico. En el inusual caso de rotura de stock tras una compra confirmada, nos comunicaremos inmediatamente.</li>
                            <li><strong className="text-white font-medium">Precios Ajustados:</strong> Todos los valores mostrados en el catálogo web están fijados en Guaraníes (Gs.). Nos reservamos el derecho de modificar tarifas de acuerdo a fluctuaciones del mercado, sin efecto retroactivo sobre órdenes ya ingresadas.</li>
                        </ul>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-[#050505] border border-white/10 rounded-2xl p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute left-0 bottom-0 w-32 h-32 bg-white/5 rounded-full blur-3xl translate-y-10 -translate-x-10"></div>
                        <BadgeAlert size={32} className="text-white mb-6" />
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-4">GARANTÍAS Y RESPONSABILIDAD</h2>
                        <ul className="list-disc pl-5 space-y-3 text-[#a1a1aa] font-light text-sm md:text-base marker:text-white">
                            <li><strong className="text-white font-medium">Proceso de Envío:</strong> ADONIS STORE garantiza el despacho en óptimas condiciones, pero dependemos de empresas de logística aliadas para los tiempos exactos de arribo.</li>
                            <li><strong className="text-white font-medium">Desgaste Natural:</strong> Nuestra joyería utiliza materiales premium de larga durabilidad. Sin embargo, no nos hacemos cargo por el deterioro provocado por un cuidado irresponsable, contacto con agentes químicos severos (perfumes directos, sudor ácido extremo) ni por accidentes por parte del usuario final.</li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-[#050505] border border-white/10 rounded-2xl p-8 md:p-10 relative overflow-hidden">
                        <ScrollText size={32} className="text-white mb-6" />
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-4">PROPIEDAD INTELECTUAL Y USO</h2>
                        <p className="text-[#a1a1aa] leading-relaxed font-light text-sm md:text-base">
                            El diseño integral del sitio, identidades visuales, logotipos y material fotográfico son propiedad exclusiva y material intelectual de ADONIS STORE. Queda rotundamente prohibida la copia, reproducción, o uso comercial no autorizado de los recursos visuales propiciados en este e-commerce. Todo acto de piratería será derivado a medidas legales.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsOfUse;
