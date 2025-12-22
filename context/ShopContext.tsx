
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, HeroSlide, Order, SocialConfig, BlogPost, Category, DeliveryZone, NavbarLink, BannerBento, LifestyleConfig } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants';

interface CartItem extends Product {
    quantity: number;
    selectedSize: string;
}

interface ShopContextType {
    products: Product[];
    cart: CartItem[];
    heroSlides: HeroSlide[];
    orders: Order[];
    blogPosts: BlogPost[];
    socialConfig: SocialConfig;
    isCartOpen: boolean;
    toggleCart: () => void;
    addToCart: (product: Product, size?: string) => void;
    removeFromCart: (productId: string, size: string) => void;
    updateQuantity: (productId: string, size: string, delta: number) => void;
    addProduct: (product: Product) => void;
    deleteProduct: (productId: string) => void;
    updateHeroSlides: (slides: HeroSlide[]) => void;
    createOrder: (order: Order) => void;
    updateOrderStatus: (orderId: string, status: 'Pendiente' | 'Confirmado en Mercado' | 'En Camino' | 'Entregado') => void;
    deleteOrder: (orderId: string) => void;
    clearOrders: () => void;
    addBlogPost: (post: BlogPost) => void;
    deleteBlogPost: (id: string) => void;
    updateSocialConfig: (config: SocialConfig) => void;
    cartTotal: number;
    categories: Category[];
    addCategory: (category: Category) => void;
    deleteCategory: (categoryId: string) => void;
    deliveryZones: DeliveryZone[];
    addDeliveryZone: (zone: DeliveryZone) => void;
    deleteDeliveryZone: (id: string) => void;
    updateDeliveryZone: (zone: DeliveryZone) => void;
    navbarLinks: NavbarLink[];
    updateNavbarLinks: (links: NavbarLink[]) => void;
    bannerBento: BannerBento[];
    updateBannerBento: (banners: BannerBento[]) => void;
    lifestyleConfig: LifestyleConfig;
    updateLifestyleConfig: (config: LifestyleConfig) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
};

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
    {
        id: 'h1',
        title: 'SAVAGE ESSENCE 2026',
        subtitle: 'REDEFINIENDO EL STREETWEAR PREMIUM URBANO.',
        buttonText: 'EXPLORAR AHORA',
        image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=2000&auto=format&fit=crop'
    }
];

const DEFAULT_SOCIAL_CONFIG: SocialConfig = {
    instagram: 'https://instagram.com/savage',
    tiktok: 'https://tiktok.com/@savage',
    email: 'contacto@savagebrand.com',
    whatsapp: '5491112345678',
    address: 'Palermo Soho, Buenos Aires',
    shippingText: 'Envío gratis en compras mayores a $200'
};

const DEFAULT_CATEGORIES: Category[] = [
    { id: 'ropa', name: 'Ropa', image: '' },
    { id: 'deportivo', name: 'Deportivo', image: '' },
    { id: 'calzados', name: 'Calzados', image: '' },
    { id: 'joyas', name: 'Joyas', image: '' },
    { id: 'accesorios', name: 'Accesorios', image: '' },
    { id: 'huerfanos', name: 'Huérfanos', image: '' }
];

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Products
    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem('savage_products');
        return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    });

    // Categories
    const [categories, setCategories] = useState<Category[]>(() => {
        const saved = localStorage.getItem('savage_categories');
        return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    });

    // Cart
    const [cart, setCart] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('savage_cart');
        return saved ? JSON.parse(saved) : [];
    });

    // Hero List
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
        const saved = localStorage.getItem('savage_hero_slides');
        return saved ? JSON.parse(saved) : DEFAULT_HERO_SLIDES;
    });

    // Orders
    const [orders, setOrders] = useState<Order[]>(() => {
        const saved = localStorage.getItem('savage_orders');
        return saved ? JSON.parse(saved) : [];
    });

    // Blog
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
        const saved = localStorage.getItem('savage_blog_posts');
        return saved ? JSON.parse(saved) : [];
    });

    // Social Config
    const [socialConfig, setSocialConfig] = useState<SocialConfig>(() => {
        const saved = localStorage.getItem('savage_social_config');
        return saved ? JSON.parse(saved) : DEFAULT_SOCIAL_CONFIG;
    });

    // Delivery Zones
    const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => {
        const saved = localStorage.getItem('savage_delivery_zones');
        return saved ? JSON.parse(saved) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Persistence Effects
    // Persistence Effects
    useEffect(() => { localStorage.setItem('savage_products', JSON.stringify(products)); }, [products]);
    useEffect(() => { localStorage.setItem('savage_categories', JSON.stringify(categories)); }, [categories]);
    useEffect(() => { localStorage.setItem('savage_cart', JSON.stringify(cart)); }, [cart]);
    useEffect(() => { localStorage.setItem('savage_hero_slides', JSON.stringify(heroSlides)); }, [heroSlides]);
    useEffect(() => {
        localStorage.setItem('savage_orders', JSON.stringify(orders));
    }, [orders]);
    useEffect(() => { localStorage.setItem('savage_blog_posts', JSON.stringify(blogPosts)); }, [blogPosts]);
    useEffect(() => { localStorage.setItem('savage_social_config', JSON.stringify(socialConfig)); }, [socialConfig]);
    useEffect(() => { localStorage.setItem('savage_delivery_zones', JSON.stringify(deliveryZones)); }, [deliveryZones]);


    // Cart Logic
    const addToCart = (product: Product, size?: string) => {
        const finalSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'One Size');

        setCart(prev => {
            const existing = prev.find(item => item.id === product.id && item.selectedSize === finalSize);
            if (existing) {
                return prev.map(item =>
                    (item.id === product.id && item.selectedSize === finalSize) ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1, selectedSize: finalSize }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string, size: string) => {
        setCart(prev => prev.filter(item => !(item.id === productId && item.selectedSize === size)));
    };

    const updateQuantity = (productId: string, size: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId && item.selectedSize === size) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const toggleCart = () => setIsCartOpen(prev => !prev);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Admin Logic
    const addProduct = (product: Product) => {
        setProducts(prev => [...prev, product]);
    };

    const deleteProduct = (productId: string) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    };

    const updateHeroSlides = (slides: HeroSlide[]) => {
        setHeroSlides(slides);
    };

    // Order Logic
    const createOrder = (order: Order) => {
        setOrders(prev => [order, ...prev]);
        // Optional: clear cart here? Usually yes, but user might want to keep it if they didn't finish.
        // For WhatsApp checkout, usually we clear it after they click "Confirmar".
        setCart([]);
    };

    const updateOrderStatus = (orderId: string, status: 'Pendiente' | 'Confirmado en Mercado' | 'En Camino' | 'Entregado') => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    };

    const deleteOrder = (orderId: string) => {
        const targetId = String(orderId);
        setOrders(prev => {
            const filtered = prev.filter(o => String(o.id) !== targetId);
            return filtered;
        });
    };

    const clearOrders = () => {
        setOrders([]);
        localStorage.removeItem('savage_orders');
    };

    // Blog Logic
    const addBlogPost = (post: BlogPost) => {
        setBlogPosts(prev => [post, ...prev]);
    };

    const deleteBlogPost = (id: string) => {
        setBlogPosts(prev => prev.filter(p => p.id !== id));
    };

    // Social Logic
    const updateSocialConfig = (config: SocialConfig) => {
        setSocialConfig(config);
    };

    // Category Logic
    const addCategory = (category: Category) => {
        setCategories(prev => [...prev, category]);
    };

    const deleteCategory = (categoryId: string) => {
        // Prevent deleting 'huerfanos'
        if (categoryId === 'huerfanos') return;

        setCategories(prev => prev.filter(c => c.id !== categoryId));

        // Move products to 'huerfanos'
        setProducts(prev => prev.map(p =>
            p.category === categoryId
                ? { ...p, category: 'huerfanos', tags: [...p.tags, 'Sin Categoría'] }
                : p
        ));
    };

    // Delivery Zone Logic
    const addDeliveryZone = (zone: DeliveryZone) => {
        setDeliveryZones(prev => [...prev, zone]);
    };

    const deleteDeliveryZone = (id: string) => {
        setDeliveryZones(prev => prev.filter(z => z.id !== id));
    };

    const updateDeliveryZone = (zone: DeliveryZone) => {
        setDeliveryZones(prev => prev.map(z => z.id === zone.id ? zone : z));
    };

    // --- Web Layout Config ---

    const DEFAULT_NAVBAR: NavbarLink[] = [
        { id: 'nav1', label: 'INICIO', path: '/' },
        { id: 'nav2', label: 'DEPORTIVO', path: '/category/Deportivo' },
        { id: 'nav3', label: 'CALZADOS', path: '/category/Calzados' },
        { id: 'nav4', label: 'CLIENTES', path: '/' }
    ];

    const DEFAULT_BANNERS: BannerBento[] = [
        {
            id: 'large',
            title: 'Joyas',
            subtitle: 'Plata esterlina y acero inoxidable. Diseños agresivos para un estilo sin límites.',
            buttonText: 'Ver Colección',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAqGbUj2FJLIGgcAKZAKLYBngrFEDRYfQoeV7VkDrTvzr13ECdtmX2qfvHu6Qd8h9Up5ZVYnAg66Dv1QOA9uM8kN4zE3xiXEEsDqWkYlRgdrn9-7nULwBuow4fqc66fDikz66FszvQXmPZaVivdWb8Urjz5K3eTyglcRqwOmNXSLR2hI_IURHsacCZ16ekg-ZEtzvjJHTnBJn5SM0Xb7JrstUnlakaQ8iAMvY2D23ZbcsDUdHvwFwsWY5KbMOvBFBjhyaDMh0mhrc',
            link: '/category/Joyas'
        },
        {
            id: 'top_right',
            title: 'Ropa',
            buttonText: 'Explorar',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyAeoyNm7zGmNtvPtnOAzDOnFCMqNI5GjDezYSapx09Jzqb2J2YHFfQd-9uyoWu-hCvaOzmQsy6GbAS4FqEzWscWIUzekY1vjZjUwnjojprLpYk0VW2NPY-UofDRuLKAnpsEmj0-8a6BAJ-j_ta15GW7wu9GI3IyZiYO2wt1huNB_KCyaad9JCU4z_eRdOVUxVTBIHxytiKBBJ0aPGEnIwAWjhooQnJzAb2BXKpa842Xhj16wQ9kCXIkW1kP78huM7WzXjvu9sAoM',
            link: '/category/Ropa'
        },
        {
            id: 'bottom_right',
            title: 'Nuevos Ingresos',
            subtitle: 'La última gota',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtj6EY5btq8X5E8_8GCid2GriBY3VTDKQBFQUT1C5CC2AiohgJiQRz0LUBMOku2H8qrVJIPPTVlwnNNIbhzigrSBC9tFulP2vcuiKTE8Y5BnVFWSoauuXZxTs0YHEP1_cbOkJE6KR3vLSsLIj61LOBTteCP5CgxQN7fN_b9kLQkH_-G9Afu1VHCOqdSebpMKz_g4qZvRlX7jmBLrnA-zjE5iBTFCd8mc_hy0FZyuRp1z0f4Ypwb1VP_tXyHN-xQiKQXcTp3i9Rpe0',
            link: '/category/New'
        }
    ];

    const [navbarLinks, setNavbarLinks] = useState<NavbarLink[]>(() => {
        const saved = localStorage.getItem('savage_navbar');
        return saved ? JSON.parse(saved) : DEFAULT_NAVBAR;
    });

    const [bannerBento, setBannerBento] = useState<BannerBento[]>(() => {
        const saved = localStorage.getItem('savage_banners_bento');
        return saved ? JSON.parse(saved) : DEFAULT_BANNERS;
    });

    useEffect(() => { localStorage.setItem('savage_navbar', JSON.stringify(navbarLinks)); }, [navbarLinks]);
    useEffect(() => { localStorage.setItem('savage_banners_bento', JSON.stringify(bannerBento)); }, [bannerBento]);

    const updateNavbarLinks = (links: NavbarLink[]) => setNavbarLinks(links);
    const updateBannerBento = (banners: BannerBento[]) => setBannerBento(banners);

    // --- Lifestyle Config ---
    const DEFAULT_LIFESTYLE: LifestyleConfig = {
        sectionTitle: 'THE SAVAGE LIFESTYLE',
        sectionSubtitle: 'Únete a la comunidad que redefine las reglas. Historias reales, estilo sin filtros.',
        buttonText: 'LEER EL BLOG',
        buttonLink: '/blog'
    };

    const [lifestyleConfig, setLifestyleConfig] = useState<LifestyleConfig>(() => {
        const saved = localStorage.getItem('savage_lifestyle_config');
        return saved ? JSON.parse(saved) : DEFAULT_LIFESTYLE;
    });

    useEffect(() => { localStorage.setItem('savage_lifestyle_config', JSON.stringify(lifestyleConfig)); }, [lifestyleConfig]);

    const updateLifestyleConfig = (config: LifestyleConfig) => setLifestyleConfig(config);

    return (
        <ShopContext.Provider value={{
            products,
            cart,
            heroSlides,
            orders,
            blogPosts,
            socialConfig,
            isCartOpen,
            toggleCart,
            addToCart,
            removeFromCart,
            updateQuantity,
            addProduct,
            deleteProduct,
            updateHeroSlides,
            createOrder,
            updateOrderStatus,
            deleteOrder,
            clearOrders,
            addBlogPost,
            deleteBlogPost,
            updateSocialConfig,

            cartTotal,
            categories,
            addCategory,
            deleteCategory,
            deliveryZones,
            addDeliveryZone,
            deleteDeliveryZone,
            updateDeliveryZone,

            navbarLinks,
            updateNavbarLinks,
            bannerBento,
            updateBannerBento,

            lifestyleConfig,
            updateLifestyleConfig

        }}>
            {children}
        </ShopContext.Provider>
    );
};
