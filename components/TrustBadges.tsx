import React from 'react';
import { useShop } from '../context/ShopContext';
import { Truck, ShieldCheck, Star, CreditCard } from 'lucide-react';

export interface TrustBadge {
    id: string;
    icon: string;
    title: string;
    description: string;
}

const DEFAULT_BADGES: TrustBadge[] = [
    { id: 'b1', icon: 'truck', title: 'Envío Seguro', description: 'Envíos a todo el país, rápidos y asegurados.' },
    { id: 'b2', icon: 'shield', title: 'Compra Protegida', description: 'Tu compra 100% segura y garantizada.' },
    { id: 'b3', icon: 'star', title: 'Reseñas 5 Estrellas', description: 'Cientos de clientes satisfechos nos respaldan.' },
    { id: 'b4', icon: 'credit', title: 'Opciones de Pago', description: 'Múltiples métodos de pago disponibles.' },
];

const iconMap: Record<string, React.ReactNode> = {
    truck: <Truck size={28} strokeWidth={1.5} />,
    shield: <ShieldCheck size={28} strokeWidth={1.5} />,
    star: <Star size={28} strokeWidth={1.5} />,
    credit: <CreditCard size={28} strokeWidth={1.5} />,
};

const TrustBadges: React.FC = () => {
    const { trustBadges } = useShop();
    const badges = trustBadges && trustBadges.length > 0 ? trustBadges : DEFAULT_BADGES;
    const [currentIndex, setCurrentIndex] = React.useState(0);

    // Auto-slide effect for mobile every 5 seconds
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % badges.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [badges.length]);

    return (
        <section className="w-full border-y border-gray-800/60 bg-[#0d0d0d] overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">

                {/* Desktop Grid (4 columns) */}
                <div className="hidden md:grid grid-cols-4 gap-8">
                    {badges.map((badge) => (
                        <div key={`desktop-${badge.id}`} className="flex flex-col items-center text-center gap-3 group">
                            <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center text-white group-hover:border-white group-hover:scale-110 transition-all duration-300">
                                {iconMap[badge.icon] || <ShieldCheck size={28} strokeWidth={1.5} />}
                            </div>
                            <div>
                                <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-1">
                                    {badge.title}
                                </h4>
                                <p className="text-gray-500 text-xs leading-relaxed">
                                    {badge.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Slider (1 item at a time) */}
                <div className="md:hidden relative w-full flex flex-col items-center">
                    <div
                        className="flex transition-transform duration-700 ease-in-out w-full"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {badges.map((badge) => (
                            <div key={`mobile-${badge.id}`} className="w-full flex-shrink-0 flex flex-col items-center text-center gap-3 px-4">
                                <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center text-white">
                                    {iconMap[badge.icon] || <ShieldCheck size={28} strokeWidth={1.5} />}
                                </div>
                                <div className="max-w-[280px]">
                                    <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-1">
                                        {badge.title}
                                    </h4>
                                    <p className="text-gray-500 text-[10px] leading-relaxed">
                                        {badge.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dots indicator for mobile */}
                    <div className="flex justify-center gap-2 mt-6">
                        {badges.map((_, idx) => (
                            <button
                                key={`dot-${idx}`}
                                onClick={() => setCurrentIndex(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`h-1 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-6 bg-white' : 'w-2 bg-gray-700'}`}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default TrustBadges;
