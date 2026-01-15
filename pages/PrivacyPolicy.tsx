import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const PrivacyPolicy: React.FC = () => {
    return (
        <>
            <SEO title="Política de Privacidad | SAVAGE" description="Conoce nuestra política de privacidad y cómo protegemos tus datos en Savage." />
            <div className="pt-24 pb-16 px-6 lg:px-12 max-w-4xl mx-auto text-white">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Volver al Inicio</span>
                    </Link>
                </div>
                <h1 className="text-3xl md:text-5xl font-black mb-8 text-primary uppercase tracking-tighter">Política de Privacidad</h1>

                <div className="space-y-8 text-gray-300 leading-relaxed font-light text-sm md:text-base">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">SAVAGE - POLÍTICA DE PRIVACIDAD</h2>
                        <p>
                            En SAVAGE, la privacidad de nuestros clientes es una prioridad. Este documento detalla cómo recopilamos y protegemos tu información.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Recolección de Información</h3>
                        <p>
                            Recopilamos datos personales como nombre, número de WhatsApp, dirección de envío y correo electrónico únicamente cuando realizas un pedido o te suscribes a nuestro Newsletter.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Uso de los Datos</h3>
                        <p className="mb-2">Tu información se utiliza exclusivamente para:</p>
                        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
                            <li>Procesar y enviar tus pedidos a través de nuestras transportadoras aliadas.</li>
                            <li>Coordinar entregas personalizadas ("Entrega en el día").</li>
                            <li>Enviar promociones exclusivas y lanzamientos (solo si estás suscrito).</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Protección de Datos</h3>
                        <p>
                            Nos comprometemos a no vender, alquilar ni compartir tu información personal con terceros ajenos al proceso de logística de tu compra.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Derechos del Usuario</h3>
                        <p>
                            Puedes solicitar el acceso, rectificación o eliminación de tus datos en cualquier momento contactándonos a través de nuestras redes sociales oficiales o nuestro canal de WhatsApp.
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
