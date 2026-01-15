import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const TermsOfUse: React.FC = () => {
    return (
        <>
            <SEO title="Términos de Uso | SAVAGE" description="Términos y condiciones de uso para comprar en Savage." />
            <div className="pt-24 pb-16 px-6 lg:px-12 max-w-4xl mx-auto text-white">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Volver al Inicio</span>
                    </Link>
                </div>
                <h1 className="text-3xl md:text-5xl font-black mb-8 text-primary uppercase tracking-tighter">Términos de Uso</h1>

                <div className="space-y-8 text-gray-300 leading-relaxed font-light text-sm md:text-base">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">SAVAGE - TÉRMINOS Y CONDICIONES</h2>
                        <p>
                            Al navegar y comprar en nuestro sitio web, aceptas los siguientes términos:
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Precios y Pagos</h3>
                        <p>
                            Todos los precios están expresados en Guaraníes (Gs.) e incluyen los impuestos correspondientes. Nos reservamos el derecho de modificar los precios sin previo aviso.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Disponibilidad de Stock</h3>
                        <p>
                            Debido a la alta rotación de nuestras prendas, el stock mostrado en la web es referencial. En caso de falta de stock tras la compra, nos pondremos en contacto para ofrecerte un cambio o reembolso.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Envíos y Entregas</h3>
                        <p>
                            Los plazos de entrega son estimativos y dependen de la logística de la transportadora. No nos hacemos responsables por retrasos ajenos a nuestra gestión una vez entregado el paquete a la empresa de envío.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Políticas de Cambio</h3>
                        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
                            <li>Las prendas deben estar en perfecto estado, con etiquetas originales y sin signos de uso.</li>
                            <li>El plazo máximo para solicitar un cambio es de 48 horas tras recibir el producto.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Propiedad Intelectual</h3>
                        <p>
                            Todas las imágenes, logotipos y diseños presentados en este sitio son propiedad de SAVAGE. Queda prohibida su reproducción sin autorización previa.
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
};

export default TermsOfUse;
