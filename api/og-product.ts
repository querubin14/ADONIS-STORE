import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { slug } = req.query;
    const userAgent = req.headers['user-agent'] || '';

    // Configuration
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables');
    }

    // Default metadata
    let title = 'SAVAGE STORE | Camisetas de Fútbol Premium';
    let description = 'Las mejores camisetas de fútbol en Paraguay: Retro, internacionales y ediciones especiales.';
    let image = 'https://www.savageeepy.com/crown.png';
    const siteUrl = 'https://www.savageeepy.com';
    let currentUrl = `${siteUrl}/product/${slug}`;

    // Fallback for root or invalid slug
    if (!slug) {
        return res.redirect(307, '/');
    }

    try {
        // Fetch product from Supabase
        const params = new URLSearchParams({
            slug: `eq.${slug}`,
            select: 'name,description,images,id'
        });

        let response = await fetch(`${supabaseUrl}/rest/v1/products?${params}`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });

        let data = await response.json();
        let product: any = null;

        if (data && data.length > 0) {
            product = data[0];
        } else {
            // Fallback: Try ID
            const idParams = new URLSearchParams({
                id: `eq.${slug}`,
                select: 'name,description,images,id'
            });
            response = await fetch(`${supabaseUrl}/rest/v1/products?${idParams}`, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            });
            data = await response.json();
            if (data && data.length > 0) {
                product = data[0];
            }
        }

        if (product) {
            title = `${product.name} | Savage Store`;
            if (product.description) {
                description = product.description.replace(/\s+/g, ' ').substring(0, 160) + '...';
            }
            if (product.images && product.images.length > 0) {
                if (typeof product.images[0] === 'string') {
                    image = product.images[0];
                }
            }
        }

    } catch (error) {
        console.error('Error fetching product:', error);
    }

    // Generate HTML
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${currentUrl}" />
    
    <!-- Open Graph -->
    <meta property="og:type" content="product">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:url" content="${currentUrl}">
    <meta property="og:site_name" content="Savage Store">
    <meta property="og:image:width" content="800">
    <meta property="og:image:height" content="800">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}">
</head>
<body>
    <h1>${title}</h1>
    <img src="${image}" alt="${title}" style="max-width:100%" />
    <p>${description}</p>
</body>
</html>`;

    // Force 200 OK header
    res.status(200).setHeader('Content-Type', 'text/html').send(html);
}
