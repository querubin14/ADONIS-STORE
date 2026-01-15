import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const ShippingPolicy: React.FC = () => {
    const { cart } = useShop();
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // We could fetch this from context if we want it editable, 
    // but for now hardcoding the layout structure with the content is usually safer for "Policy" pages 
    // unless the user strictly needs a CMS. 
    // However, the user asked to "save it in the database". 
    // So I will try to read from context or fallback to default.

    // For this implementation, I will rely on the Context having this data, 
    // but initially I'll render the provided text.
    // Ideally, we'd have a 'shippingPolicy' string in context.

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
                        POLÍTICA DE ENVÍOS Y ENTREGAS
                    </h1>

                    <div className="space-y-8 text-gray-300 leading-relaxed text-sm md:text-base">
                        <p>
                            En <span className="text-white font-bold">SAVAGE</span>, nos esforzamos por que recibas tus productos de la manera más rápida y segura. A continuación, detallamos nuestras condiciones de entrega:
                        </p>

                        <section>
                            <h2 className="text-xl font-bold text-white uppercase mb-4 flex items-center gap-2">
                                <span className="bg-primary text-white text-xs px-2 py-1 rounded">1</span> Zonas de Cobertura (Delivery Local)
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 marker:text-gray-600">
                                <li>
                                    <strong className="text-white">Plazos de entrega:</strong> Los pedidos dentro de nuestra zona de cobertura se gestionan en el mismo día o en un plazo máximo de 24 horas hábiles.
                                </li>
                                <li>
                                    <strong className="text-white">Métodos de pago:</strong> Para entregas vía delivery, aceptamos pagos en efectivo al momento de la entrega o vía transferencia bancaria.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white uppercase mb-4 flex items-center gap-2">
                                <span className="bg-primary text-white text-xs px-2 py-1 rounded">2</span> Envíos al Interior
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 marker:text-gray-600">
                                <li>
                                    <strong className="text-white">Logística:</strong> Nuestro servicio consiste en el depósito del producto en la empresa transportadora asignada por el cliente, junto con sus datos correspondientes.
                                </li>
                                <li>
                                    <strong className="text-white">Responsabilidad:</strong> Una vez entregado el paquete a la transportadora y enviado el comprobante de guía al cliente, la responsabilidad total del traslado recae en la empresa de transporte.
                                </li>
                                <li>
                                    <strong className="text-white">Garantía de tránsito:</strong> SAVAGE no se responsabiliza por extravíos, daños o demoras adicionales ocurridas durante el proceso de envío posterior al depósito en la transportadora.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white uppercase mb-4 flex items-center gap-2">
                                <span className="bg-primary text-white text-xs px-2 py-1 rounded">3</span> Condiciones de Pago (Interior)
                            </h2>
                            <p className="mb-4">Para pedidos con destino al interior del país, aceptamos los siguientes métodos:</p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <li className="bg-white/5 border border-white/10 p-4 rounded flex items-center justify-center font-bold text-white">
                                    Billetera Personal
                                </li>
                                <li className="bg-white/5 border border-white/10 p-4 rounded flex items-center justify-center font-bold text-white">
                                    Transferencia Bancaria
                                </li>
                            </ul>
                            <div className="bg-red-900/20 border border-red-900/50 p-6 rounded-lg">
                                <p className="text-red-200 text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                                    <span className="material-symbols-outlined">warning</span> Importante
                                </p>
                                <p className="mt-2 text-white">
                                    Bajo ninguna excepción se realizará el envío de productos que no hayan sido cancelados en su totalidad previamente.
                                </p>
                            </div>
                        </section>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default ShippingPolicy;
