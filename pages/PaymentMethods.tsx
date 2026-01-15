import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const PaymentMethods: React.FC = () => {
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
                        MÉTODOS DE PAGO
                    </h1>

                    <div className="space-y-8 text-gray-300 leading-relaxed text-sm md:text-base">
                        <p>
                            En <span className="text-white font-bold">SAVAGE</span> te ofrecemos diversas opciones para que puedas concretar tu compra de forma segura y sencilla. Actualmente, aceptamos los siguientes métodos:
                        </p>

                        <section>
                            <h2 className="text-xl font-bold text-white uppercase mb-4 flex items-center gap-2">
                                <span className="bg-primary text-white text-xs px-2 py-1 rounded">1</span> Transferencia Bancaria
                            </h2>
                            <p>Puedes realizar el pago directamente desde tu entidad bancaria.</p>
                            <div className="bg-white/5 border border-white/10 p-4 rounded mt-4">
                                <p className="text-yellow-400 text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">warning</span> Importante
                                </p>
                                <p className="mt-2 text-white text-sm">
                                    Una vez realizada la transferencia, es obligatorio enviar el comprobante de la operación vía WhatsApp o Instagram para validar tu pedido y proceder al envío.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white uppercase mb-4 flex items-center gap-2">
                                <span className="bg-primary text-white text-xs px-2 py-1 rounded">2</span> Billetera Personal (Giros)
                            </h2>
                            <p>Aceptamos pagos mediante Giros o transferencias a Billetera Personal.</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-gray-600">
                                <li>
                                    El costo del giro debe ser cubierto por el cliente para que el monto neto recibido coincida con el total de la compra.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white uppercase mb-4 flex items-center gap-2">
                                <span className="bg-primary text-white text-xs px-2 py-1 rounded">3</span> Efectivo (Solo Delivery)
                            </h2>
                            <p>Esta opción está disponible exclusivamente para entregas dentro de nuestra zona de cobertura local.</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-gray-600">
                                <li>
                                    Podrás abonar al momento de recibir tu paquete directamente al encargado del delivery.
                                </li>
                            </ul>
                        </section>

                        <div className="bg-green-900/20 border border-green-900/50 p-6 rounded-lg mt-8">
                            <h3 className="text-green-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined">credit_card</span> PROCESO DE VALIDACIÓN
                            </h3>
                            <p className="mb-4 text-sm text-gray-300">Para agilizar tu envío, por favor ten en cuenta lo siguiente:</p>
                            <ol className="list-decimal pl-5 space-y-2 marker:text-green-500 font-medium">
                                <li className="text-white">Realiza el pago por el monto total de tu compra.</li>
                                <li className="text-white">Toma una captura de pantalla o foto del comprobante.</li>
                                <li className="text-white">Envíanos el comprobante junto con tu Nombre completo y Número de Pedido.</li>
                            </ol>
                            <p className="mt-4 text-xs text-gray-500 italic">
                                Nota: No se reservan ni se despachan prendas sin la confirmación del pago total (exceptuando pagos en efectivo contra entrega en zonas autorizadas).
                            </p>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default PaymentMethods;
