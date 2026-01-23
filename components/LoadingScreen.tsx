import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center text-white">
            {/* Logo Placeholder - User can replace with actual logo image if desired */}
            {/* <img src="/logo.png" alt="Savage" className="w-24 mb-6" /> */}
            <img src="/logo-final.png" alt="Loading" className="w-16 h-16 animate-spin mb-4 object-contain filter brightness-110" />
            <p className="text-xs font-bold tracking-[0.3em] uppercase animate-pulse">Adonis Store</p>
        </div>
    );
};

export default LoadingScreen;
