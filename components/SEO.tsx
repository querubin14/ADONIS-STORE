import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
}

const SEO: React.FC<SEOProps> = ({
    title = 'SAVAGE STORE | Camisetas de Fútbol Premium & Streetwear en Paraguay',
    description = 'Las mejores camisetas de fútbol en Paraguay: Retro, internacionales y ediciones especiales. Además de calzado urbano, relojes y accesorios exclusivos. Calidad premium en SAVAGE.',
    image = 'https://www.savageeepy.com/crown.png'
}) => {
    const location = useLocation();

    useEffect(() => {
        // Update Title
        document.title = title;

        // Update Meta Tags
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) metaDescription.setAttribute('content', description);

        // Update Open Graph
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
        document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
        document.querySelector('meta[property="og:image"]')?.setAttribute('content', image);
        document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://www.savageeepy.com${location.pathname}`);

        // Update Twitter
        document.querySelector('meta[property="twitter:title"]')?.setAttribute('content', title);
        document.querySelector('meta[property="twitter:description"]')?.setAttribute('content', description);
        document.querySelector('meta[property="twitter:image"]')?.setAttribute('content', image);

    }, [title, description, image, location]);

    return null;
};

export default SEO;
