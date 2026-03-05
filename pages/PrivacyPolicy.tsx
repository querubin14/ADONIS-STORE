import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useShop } from '../context/ShopContext';

const PrivacyPolicy: React.FC = () => {
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
                        POLÍTICA DE<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                            PRIVACIDAD
                        </span>
                    </h1>
                    <p className="text-[#a1a1aa] text-sm md:text-base font-light max-w-2xl leading-relaxed">
                        En ADONIS STORE, garantizamos la máxima confidencialidad. Tus datos están seguros y son tratados con el mayor rigor y profesionalismo del mercado.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    {/* Section 1 */}
                    <div className="bg-[#050505] border border-white/10 rounded-2xl p-8 md:p-10 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-white to-transparent opacity-50"></div>
                        <ShieldCheck size={32} className="text-white mb-6" />
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-4">RECOLECCIÓN DE DATOS</h2>
                        <p className="text-[#a1a1aa] leading-relaxed font-light text-sm md:text-base">
                            Recopilamos información estrictamente necesaria como nombre, número de contacto y dirección de envío únicamente para garantizar el procesamiento de tus pedidos. En ningún momento recopilamos información bancaria directamente en nuestros servidores.
                        </p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-[#050505] border border-white/10 rounded-2xl p-8 md:p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:bg-white/10 transition-colors duration-700"></div>
                        <Lock size={32} className="text-white mb-6" />
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-4">SEGURIDAD Y PROTECCIÓN</h2>
                        <ul className="list-disc pl-5 space-y-3 text-[#a1a1aa] font-light text-sm md:text-base marker:text-white">
                            <li><strong className="text-white font-medium">Uso Exclusivo:</strong> Tu información es utilizada meramente para la gestión de envíos.</li>
                            <li><strong className="text-white font-medium">No a la Venta de Datos:</strong> Bajo ninguna circunstancia vendemos o compartimos tus datos con terceros, agencias de publicidad o bases de datos comerciales.</li>
                            <li><strong className="text-white font-medium">Transmisión Cifrada:</strong> Toda comunicación entre el sitio y tus dispositivos está asegurada.</li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-[#050505] border border-white/10 rounded-2xl p-8 md:p-10 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gray-500 to-transparent opacity-50"></div>
                        <EyeOff size={32} className="text-white mb-6" />
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-4">DERECHOS SOBRE TU INFORMACIÓN</h2>
                        <p className="text-[#a1a1aa] leading-relaxed font-light text-sm md:text-base">
                            Conservas en todo momento el derecho de acceder, rectificar o solicitar la eliminación total de tu historial y datos personales en nuestra plataforma. Para proceder, simplemente contáctanos a nuestra línea oficial de soporte.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
