import React from 'react';
import { useShop } from '../context/ShopContext';

const AnnouncementBar: React.FC = () => {
    const { socialConfig } = useShop();

    if (!socialConfig.topHeaderText) return null;

    return (
        <div className="bg-white text-black text-xs font-black text-center py-2 px-4 uppercase tracking-[0.2em] leading-tight">
            {socialConfig.topHeaderText}
        </div>
    );
};

export default AnnouncementBar;
