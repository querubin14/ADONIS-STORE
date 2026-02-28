import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, MapPin, CheckCheck } from 'lucide-react';

const HowToBuyModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if we've shown this before in this session
        const hasShownDisplay = sessionStorage.getItem('hasShownHowToBuy');
        if (!hasShownDisplay) {
            // Slight delay for better UX
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem('hasShownHowToBuy', 'true');
            }, 1000); // 1 second delay
            return () => clearTimeout(timer);
        }
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-6 max-w-sm w-full relative shadow-2xl animate-in zoom-in-95 duration-300">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="mt-2 text-white">
                    <h2 className="text-xl font-bold mb-6 pr-8 flex flex-wrap items-center gap-2">
                        Envía tu pedido por <span className="bg-[#25D366] text-white px-2 py-0.5 rounded-md text-base shadow-lg shadow-green-500/20">WhatsApp</span>
                    </h2>

                    <div className="space-y-6">
                        <div className="flex gap-4 items-center">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg shadow-white/10">
                                <ShoppingCart size={20} className="stroke-[2.5]" />
                            </div>
                            <p className="font-medium pt-1">Agrega productos a tu carrito</p>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg shadow-white/10">
                                <MapPin size={20} className="stroke-[2.5]" />
                            </div>
                            <p className="font-medium pt-1">Marca la ubicación del envío</p>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg shadow-white/10">
                                <CheckCheck size={20} className="stroke-[2.5]" />
                            </div>
                            <p className="font-medium pt-1">Dale en "Confirmar pedido" y recibiremos tu pedido</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full bg-white text-black font-bold py-3.5 rounded-xl mt-8 hover:bg-gray-200 transition-colors"
                    >
                        Empezar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HowToBuyModal;
