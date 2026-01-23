import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    product?: boolean; // Type for OG
}

const SEO: React.FC<SEOProps> = ({
    title = 'ADONIS STORE',
    description = 'Las mejores camisetas de fútbol en Paraguay: Retro, internacionales y ediciones especiales. Además de calzado urbano, relojes y accesorios exclusivos. Calidad premium en ADONIS STORE.',
    image = 'https://www.savageeepy.com/logo-final.png',
    product = false
}) => {
    const location = useLocation();
    const url = `https://www.savageeepy.com${location.pathname}`;

    return (
        <Helmet>
            {/* Standard Metrics */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:url" content={url} />
            <meta property="og:type" content={product ? 'product' : 'website'} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;
