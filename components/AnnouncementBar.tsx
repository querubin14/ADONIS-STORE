import React from 'react';
import { useShop } from '../context/ShopContext';

const AnnouncementBar: React.FC = () => {
    const { socialConfig } = useShop();

    if (!socialConfig.topHeaderText) return null;

    return (
        <div className="bg-white text-black text-[9px] font-bold text-center py-1 px-4 uppercase tracking-widest leading-none">
            {socialConfig.topHeaderText}
        </div>
    );
};

export default AnnouncementBar;
