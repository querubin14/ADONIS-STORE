import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const ExchangePolicy: React.FC = () => {
    const { cart } = useShop();
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen bg-background-dark text-white selection:bg-primary selection:text-white flex flex-col">
            <Navbar cartCount={cartCount} />

            <main className="flex-grow pt-32 pb-20 px-6 lg:px-12 max-w-4xl mx-auto w-full">
                <article className="prose prose-invert prose-lg max-w-none">
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-widest">Volver al Inicio</span>
                        </Link>
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-8 text-white border-b border-gray-800 pb-6">
                        POLÍTICA DE CAMBIOS
                    </h1>

                    <div className="space-y-8 text-gray-300 leading-relaxed text-sm md:text-base">
                        <p>
                            En <span className="text-white font-bold">SAVAGE</span>, nuestro objetivo es que quedes totalmente satisfecho con tu compra. Si necesitas realizar un cambio, te detallamos nuestras condiciones y el proceso a seguir:
                        </p>

                        <section>
                            <h2 className="text-xl font-bold text-white uppercase mb-4 flex items-center gap-2">
                                <span className="bg-primary text-white text-xs px-2 py-1 rounded">1</span> Plazos y Condiciones del Producto
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 marker:text-gray-600">
                                <li>
                                    <strong className="text-white">Plazo:</strong> Dispones de hasta 48 horas corridas después de haber recibido el producto para solicitar un cambio.
                                </li>
                                <li>
                                    <strong className="text-white">Requisitos de la prenda:</strong> El producto debe estar en perfectas condiciones:
                                    <ul className="list-circle pl-5 mt-2 space-y-1 text-gray-400">
                                        <li>Con etiqueta original intacta.</li>
                                        <li>Sin señales de uso, lavado o manchas.</li>
                                        <li>Libre de olores (perfumes, desodorantes, tabaco, etc.).</li>
                                        <li>Sin daños físicos o alteraciones.</li>
                                    </ul>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white uppercase mb-4 flex items-center gap-2">
                                <span className="bg-primary text-white text-xs px-2 py-1 rounded">2</span> Cambios vía Delivery (Zonas de Cobertura)
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 marker:text-gray-600">
                                <li>
                                    El cliente podrá solicitar el cambio dentro del plazo de 48 hs.
                                </li>
                                <li>
                                    <strong className="text-white">Costos de logística:</strong> El costo del nuevo envío por delivery corre exclusivamente a cargo del cliente y deberá abonarse nuevamente para concretar el cambio.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white uppercase mb-4 flex items-center gap-2">
                                <span className="bg-primary text-white text-xs px-2 py-1 rounded">3</span> Cambios al Interior (Vía Transportadora)
                            </h2>
                            <p className="mb-4">Para cambios con envíos de larga distancia, el proceso se divide en dos etapas:</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-gray-600">
                                <li>
                                    <strong className="text-white">Recepción y Verificación:</strong> El cliente debe enviar el producto a nuestras instalaciones. Primero debemos recibir y verificar que la prenda se encuentre en el estado óptimo mencionado anteriormente.
                                </li>
                                <li>
                                    <strong className="text-white">Envío del nuevo producto:</strong> Una vez aprobado el estado de la prenda recibida, procederemos a despachar el nuevo artículo.
                                </li>
                                <li>
                                    <strong className="text-white">Gastos de Envío:</strong> Todos los costos de transporte (tanto el de retorno a SAVAGE como el envío de la nueva prenda hacia el cliente) son responsabilidad total del cliente.
                                </li>
                            </ul>
                        </section>

                        <div className="bg-yellow-900/20 border border-yellow-900/50 p-6 rounded-lg mt-8">
                            <h3 className="text-yellow-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined">warning</span> Aclaraciones Importantes
                            </h3>
                            <ul className="space-y-4">
                                <li>
                                    <strong className="text-white">No se realizan devoluciones de dinero:</strong> Una vez concretada la compra, SAVAGE no realiza reembolsos ni devoluciones de dinero en efectivo o transferencia. Bajo nuestra política, el cliente tiene derecho exclusivamente al cambio por otro artículo de la tienda (sujeto a disponibilidad de stock).
                                </li>
                                <li>
                                    <strong className="text-white">Disponibilidad:</strong> Si el producto por el cual deseas realizar el cambio no se encuentra en stock, podrás elegir cualquier otro artículo de igual o mayor valor (abonando la diferencia).
                                </li>
                            </ul>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default ExchangePolicy;
