import React from 'react';
import { useShop } from '../context/ShopContext';

const UpcomingDrops: React.FC = () => {
    const { drops, loading, dropsConfig } = useShop();

    // If disabled, loading or no drops, what to show?
    if (dropsConfig && !dropsConfig.isEnabled && !loading) return null; // If loaded config says disabled, hide.

    // If loading, maybe skeleton.
    // If no drops, hide section.
    if (!loading && drops.length === 0) return null;

    // Limit to 6 items
    const displayDrops = drops.slice(0, 6);

    return (
        <section className="py-20 bg-background-dark border-t border-gray-900 border-b relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="flex items-end justify-between mb-10 pb-4 border-b border-gray-800">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                            Próximos Drops <span className="bg-primary text-black text-[10px] px-2 py-0.5 rounded font-black animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.6)]">HYPE</span>
                        </h2>
                        <p className="text-accent-gray mt-1 text-sm font-medium tracking-wide">Acceso exclusivo a lo que se viene. Stay Savage.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-[4/5] bg-gray-900 rounded-lg animate-pulse"></div>
                        ))
                    ) : (
                        displayDrops.map((drop) => (
                            <div key={drop.id} className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-900 border border-gray-800 hover:border-primary/50 transition-all duration-500 cursor-help">
                                <img
                                    src={drop.image}
                                    alt={drop.title || 'Savage Drop'}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                                    <span className="material-symbols-outlined text-4xl text-white mb-2 drop-shadow-lg">lock</span>
                                    <span className="text-white font-black uppercase tracking-widest text-xs border border-white/30 px-3 py-1 bg-black/50 backdrop-blur-md rounded-sm">
                                        PRÓXIMAMENTE
                                    </span>
                                </div>

                                {/* Persistent Badge */}
                                <div className="absolute top-2 right-2 z-10">
                                    <div className="size-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
                                </div>

                                {/* Title (Optional) */}
                                {drop.title && (
                                    <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <p className="text-white text-xs font-bold uppercase tracking-wider text-center">{drop.title}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default UpcomingDrops;
