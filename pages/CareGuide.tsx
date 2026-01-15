
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, Droplets, Sun, Flame } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const CareGuide: React.FC = () => {
    const { cart } = useShop();
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-background-dark text-white font-sans">
            <Navbar cartCount={cartCount} />

            <main className="max-w-[1000px] mx-auto px-6 lg:px-12 py-16 md:py-24">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 text-primary">
                        Guía de Cuidado Savage
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-gray-300 tracking-wide uppercase">
                        Mantén tu Pasión Impecable
                    </p>
                </div>

                <div className="prose prose-invert max-w-none space-y-16">

                    {/* Intro */}
                    <div className="bg-surface-dark border border-white/5 p-8 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <ShieldCheck size={200} />
                        </div>
                        <p className="text-gray-300 leading-relaxed text-lg relative z-10">
                            En Savage, sabemos que una camiseta de fútbol no es solo una prenda, es una pieza de colección.
                            Ya sea que tengas una versión <span className="text-white font-bold">Fan (bordada)</span>,
                            <span className="text-white font-bold"> Player (corte atlético y sellados)</span> o una
                            <span className="text-white font-bold"> Retro</span>, queremos que luzca como nueva por años.
                            <br /><br />
                            Sigue estos consejos exclusivos de nuestra comunidad para proteger los tejidos y estampados:
                        </p>
                    </div>

                    {/* Section 1 */}
                    <section className="flex flex-col md:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        <div className="bg-blue-900/20 p-4 rounded-xl text-blue-400 shrink-0">
                            <Droplets size={40} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 flex items-center gap-3">
                                <span className="text-primary text-3xl">01.</span> El Lavado: La Regla de Oro
                            </h2>
                            <ul className="space-y-4 text-gray-400 leading-relaxed">
                                <li className="flex gap-3">
                                    <span className="text-primary font-bold">•</span>
                                    <span><strong className="text-white">Lávala siempre al revés:</strong> Esto evita que el tambor de la lavadora o el roce con otras prendas dañe los escudos, parches o patrocinadores.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary font-bold">•</span>
                                    <span><strong className="text-white">Agua Fría (Máximo 30°C):</strong> El calor debilita el adhesivo de los estampados. El agua fría es esencial para mantener la integridad de los termosellados.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary font-bold">•</span>
                                    <span><strong className="text-white">Ciclo Delicado o Lavado a Mano:</strong> Recomendamos lavar a mano con jabón neutro. Si usas lavadora, selecciona el ciclo más suave y evita mezclar con ropa pesada como jeans o camperas.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary font-bold">•</span>
                                    <span><strong className="text-white">Cero Suavizante:</strong> El suavizante daña la tecnología de transpiración de la tela y puede despegar los detalles de goma.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="flex flex-col md:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <div className="bg-yellow-900/20 p-4 rounded-xl text-yellow-500 shrink-0">
                            <Sun size={40} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 flex items-center gap-3">
                                <span className="text-primary text-3xl">02.</span> El Secado: Enemigo del Calor
                            </h2>
                            <ul className="space-y-4 text-gray-400 leading-relaxed">
                                <li className="flex gap-3">
                                    <span className="text-primary font-bold">•</span>
                                    <span><strong className="text-white">Prohibida la Secadora:</strong> Es la causa #1 de daños en camisetas. El calor intenso encoge el poliéster y cuartea los números.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary font-bold">•</span>
                                    <span><strong className="text-white">Secado a la Sombra:</strong> Tiende tu camiseta Savage siempre a la sombra. El sol directo puede decolorar los tonos vibrantes y resecar los elásticos del cuello.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary font-bold">•</span>
                                    <span><strong className="text-white">Sin Perchas si está muy mojada:</strong> Para evitar que la tela se estire por el peso del agua, puedes secarla extendida sobre una superficie plana.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="flex flex-col md:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <div className="bg-red-900/20 p-4 rounded-xl text-red-500 shrink-0">
                            <Flame size={40} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 flex items-center gap-3">
                                <span className="text-primary text-3xl">03.</span> El Planchado: Solo si es necesario
                            </h2>
                            <ul className="space-y-4 text-gray-400 leading-relaxed">
                                <li className="flex gap-3">
                                    <span className="text-primary font-bold">•</span>
                                    <span><strong className="text-white">Nunca pases la plancha sobre el estampado:</strong> Si hay arrugas, plancha la prenda al revés a temperatura mínima.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary font-bold">•</span>
                                    <span><strong className="text-white">Protección extra:</strong> Coloca un paño de algodón fino entre la plancha y la camiseta para evitar brillos o quemaduras en el tejido sintético.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                </div>
            </main>
            <Footer />
        </div>
    );
};
import { useEffect } from 'react';
export default CareGuide;
