
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, HeroSlide, Order, SocialConfig, BlogPost, Category, DeliveryZone, NavbarLink, BannerBento, LifestyleConfig } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants';
import { supabase } from '../services/supabase';

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
    updateCartItemSize: (productId: string, currentSize: string, newSize: string) => void;
    addProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (productId: string) => void;
    updateHeroSlides: (slides: HeroSlide[]) => void;
    createOrder: (order: Order) => void;
    updateOrderStatus: (orderId: string, status: 'Pendiente' | 'Confirmado en Mercado' | 'En Camino' | 'Entregado') => void;
    deleteOrder: (orderId: string) => void;
    clearOrders: () => void;
    addBlogPost: (post: BlogPost) => void;
    updateBlogPost: (post: BlogPost) => void;
    deleteBlogPost: (id: string) => void;
    updateSocialConfig: (config: SocialConfig) => void;
    cartTotal: number;
    categories: Category[];
    addCategory: (category: Category) => void;
    updateCategory: (category: Category) => void;
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
    saveAllData: () => void;
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
        buttonLink: '/category/Deportivo',
        image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=2000&auto=format&fit=crop'
    }
];

const DEFAULT_SOCIAL_CONFIG: SocialConfig = {
    instagram: 'https://instagram.com/savage',
    tiktok: 'https://tiktok.com/@savage',
    email: 'contacto@savagebrand.com',
    whatsapp: '595983840235',
    address: 'Palermo Soho, Buenos Aires',
    shippingText: 'Envío gratis en compras mayores a 500.000 Gs',
    extraShippingInfo: 'Devoluciones gratis hasta 30 días',
    topHeaderText: 'ENVÍOS GRATIS A TODO EL PAÍS 🇵🇾'
};

const DEFAULT_CATEGORIES: Category[] = [
    { id: 'ropa', name: 'Ropa', image: '', subcategories: ['Remeras', 'Hoodies', 'Pantalones', 'Shorts'] },
    { id: 'deportivo', name: 'Deportivo', image: '', subcategories: ['Player', 'Fan', 'Retro'] },
    { id: 'calzados', name: 'Calzados', image: '', subcategories: ['Nike', 'Adidas', 'Puma', 'New Balance'] },
    { id: 'joyas', name: 'Joyas', image: '' },
    { id: 'accesorios', name: 'Accesorios', image: '' },
    { id: 'huerfanos', name: 'Huérfanos', image: '' }
];

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Products
    // Products - Now synced with Supabase
    const [products, setProducts] = useState<Product[]>([]);

    // Categories - Now synced with Supabase
    const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

    // Cart - Stays in LocalStorage (Cart shouldn't be shared across devices usually unless logged in user, which we don't have yet)
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
    // Delivery Zones
    const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // --- SUPABASE MIGRATION: FETCH DATA ---
    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Products
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*');

            if (productsError) {
                console.error('Error fetching products from Supabase:', productsError);
                if (productsError.code === '42501' || productsError.message.includes('row-level security')) {
                    alert('ERROR: Bloqueo de seguridad de Base de Datos. Desactiva RLS en Supabase o agrega políticas de acceso "Select" para visualizarlos.');
                } else {
                    alert(`Error cargando productos: ${productsError.message}`);
                }
            } else if (productsData) {
                // Transform Supabase data if needed to match frontend Product type
                // Assuming Database columns match Product interface closely
                setProducts(productsData.map(p => ({
                    ...p,
                    price: Number(p.price),
                    originalPrice: p.original_price ? Number(p.original_price) : undefined,
                    isFeatured: p.is_featured,
                    isCategoryFeatured: p.is_category_featured,
                    isNew: p.is_new,
                    subcategory: p.subcategory || '' // Handle nulls gracefully
                })));
            }

            // Fetch Categories (if you plan to store them in DB too, otherwise keep default)
            const { data: categoriesData, error: catError } = await supabase
                .from('categories')
                .select('*');

            if (!catError && categoriesData && categoriesData.length > 0) {
                setCategories(categoriesData);
            }

            // Fetch Delivery Zones
            const { data: zonesData, error: zonesError } = await supabase
                .from('delivery_zones')
                .select('*');

            if (zonesError) {
                console.error('Error fetching delivery zones:', zonesError);
            } else if (zonesData) {
                setDeliveryZones(zonesData.map(z => ({
                    ...z,
                    price: Number(z.price),
                    // Points is JSONB, Supabase returns it as object/array automatically
                    points: typeof z.points === 'string' ? JSON.parse(z.points) : z.points
                })));
            }

            // Fetch Orders
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (ordersError) {
                console.error('Error fetching orders:', ordersError);
            } else if (ordersData) {
                setOrders(ordersData.map(o => ({
                    ...o,
                    total_amount: Number(o.total_amount),
                    delivery_cost: Number(o.delivery_cost),
                    // JSONB columns come as objects already
                })));
            }

            // Fetch Blog Posts
            const { data: blogData, error: blogError } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (blogError) {
                console.error('Error fetching blog posts:', blogError);
            } else if (blogData) {
                setBlogPosts(blogData);
            }

        } catch (error) {
            console.error('Exception fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- END SUPABASE FETCH ---

    // Persistence Effects (Legacy LocalStorage for non-critical stuff or backup)
    useEffect(() => { localStorage.setItem('savage_cart', JSON.stringify(cart)); }, [cart]);
    useEffect(() => { localStorage.setItem('savage_hero_slides', JSON.stringify(heroSlides)); }, [heroSlides]);
    useEffect(() => { localStorage.setItem('savage_hero_slides', JSON.stringify(heroSlides)); }, [heroSlides]);
    // useEffect(() => { localStorage.setItem('savage_orders', JSON.stringify(orders)); }, [orders]);
    // useEffect(() => { localStorage.setItem('savage_blog_posts', JSON.stringify(blogPosts)); }, [blogPosts]);
    useEffect(() => { localStorage.setItem('savage_social_config', JSON.stringify(socialConfig)); }, [socialConfig]);
    useEffect(() => { localStorage.setItem('savage_social_config', JSON.stringify(socialConfig)); }, [socialConfig]);
    // useEffect(() => { localStorage.setItem('savage_delivery_zones', JSON.stringify(deliveryZones)); }, [deliveryZones]);
    // useEffect(() => { localStorage.setItem('savage_orders', JSON.stringify(orders)); }, [orders]);
    // useEffect(() => { localStorage.setItem('savage_blog_posts', JSON.stringify(blogPosts)); }, [blogPosts]);


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

    const updateCartItemSize = (productId: string, currentSize: string, newSize: string) => {
        setCart(prev => {
            // 1. Find the item to update
            const itemToUpdate = prev.find(item => item.id === productId && item.selectedSize === currentSize);
            if (!itemToUpdate) return prev;

            // 2. Check if an item with the NEW size already exists
            const targetItem = prev.find(item => item.id === productId && item.selectedSize === newSize);

            if (targetItem) {
                // MERGE: Remove the old one, update the target one
                return prev.map(item => {
                    if (item.id === productId && item.selectedSize === newSize) {
                        return { ...item, quantity: item.quantity + itemToUpdate.quantity };
                    }
                    return item;
                }).filter(item => !(item.id === productId && item.selectedSize === currentSize));
            } else {
                // JUST UPDATE: Change size
                return prev.map(item =>
                    (item.id === productId && item.selectedSize === currentSize)
                        ? { ...item, selectedSize: newSize }
                        : item
                );
            }
        });
    };

    const toggleCart = () => setIsCartOpen(prev => !prev);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Admin Logic - SUPABASE SYNCED
    const addProduct = async (product: Product) => {
        // Optimistic UI update (using the temporary ID passed from Admin)
        setProducts(prev => [...prev, product]);

        try {
            // DB Mapping: OMIT 'id' so Supabase generates a UUID
            const dbProduct = {
                // id: product.id, <--- REMOVED to let DB generate UUID
                savage_id: `SVG-${product.id}`, // Temporary filler using the timestamp, user might want to change this later
                name: product.name,
                price: parseFloat(product.price.toString()),
                original_price: product.originalPrice ? parseFloat(product.originalPrice.toString()) : null,
                category: product.category,
                subcategory: product.subcategory,
                type: product.type,
                images: product.images,
                sizes: product.sizes,
                tags: product.tags,
                fit: product.fit,
                is_new: product.isNew,
                is_featured: product.isFeatured,
                is_category_featured: product.isCategoryFeatured,
                description: product.description,
                stock_quantity: 0
            };

            const { data, error } = await supabase
                .from('products')
                .insert([dbProduct])
                .select()
                .single();

            if (error) {
                console.error('Error adding product to Supabase:', error);

                // Security policy error check
                if (error.code === '42501') {
                    alert('ERROR: Permisos denegados (RLS). Revisa las políticas en Supabase.');
                } else {
                    alert(`Hubo un error guardando en la base de datos: ${error.message}`);
                }

                // Revert optimistic update on error
                setProducts(prev => prev.filter(p => p.id !== product.id));
            } else if (data) {
                // Success! Update the local state with the REAL UUID from the DB
                // This replaces the temporary timestamp ID with the valid UUID
                setProducts(prev => prev.map(p => p.id === product.id ? { ...p, id: data.id } : p));
            }

        } catch (err) {
            console.error(err);
            setProducts(prev => prev.filter(p => p.id !== product.id));
        }
    };

    const updateProduct = async (updatedProduct: Product) => {
        // Optimistic UI
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));

        try {
            const dbProduct = {
                name: updatedProduct.name,
                price: parseFloat(updatedProduct.price.toString()),
                original_price: updatedProduct.originalPrice ? parseFloat(updatedProduct.originalPrice.toString()) : null,
                category: updatedProduct.category,
                subcategory: updatedProduct.subcategory,
                type: updatedProduct.type,
                images: updatedProduct.images,
                sizes: updatedProduct.sizes,
                tags: updatedProduct.tags,
                fit: updatedProduct.fit,
                is_new: updatedProduct.isNew,
                is_featured: updatedProduct.isFeatured,
                is_category_featured: updatedProduct.isCategoryFeatured,
                description: updatedProduct.description
            };

            const { error } = await supabase
                .from('products')
                .update(dbProduct)
                .eq('id', updatedProduct.id);

            if (error) {
                console.error('Error updating product in Supabase:', error);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteProduct = async (productId: string) => {
        // Optimistic UI
        setProducts(prev => prev.filter(p => p.id !== productId));

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId);

            if (error) {
                console.error('Error deleting product from Supabase:', error);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateHeroSlides = (slides: HeroSlide[]) => {
        setHeroSlides(slides);
    };

    // Order Logic
    // Order Logic - SUPABASE SYNCED
    const createOrder = async (order: Order) => {
        // Optimistic UI
        setOrders(prev => [order, ...prev]);
        setCart([]); // Clear cart immediately for better UX
        localStorage.removeItem('savage_cart');

        try {
            const dbOrder = {
                // Let DB generate ID or use the one we created? Better to let DB generate UUID if possible,
                // but we used crypto.randomUUID() which is valid UUID. 
                // Let's use the generated ID to ensure consistency with the WhatsApp message.
                id: order.id,
                display_id: order.display_id,
                total_amount: order.total_amount,
                delivery_cost: order.delivery_cost,
                status: order.status,
                items: order.items,
                customer_info: order.customerInfo,
                product_ids: order.product_ids || []
            };

            const { error } = await supabase
                .from('orders')
                .insert([dbOrder]);

            if (error) {
                console.error('Error creating order in Supabase:', error);
                alert('Hubo un error guardando tu pedido en el sistema, pero el enlace de WhatsApp se generó correctamente.');
                // Don't revert optimistic UI here to avoid confusing user, 
                // but admins won't see it until fixed or manually added.
            }
        } catch (e) {
            console.error('Exception creating order:', e);
        }
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
    // Blog Logic - SUPABASE SYNCED
    const addBlogPost = async (post: BlogPost) => {
        setBlogPosts(prev => [post, ...prev]);

        try {
            // Omit ID to let DB generate it, OR use the optimistic one.
            // Let's use optimistic ID if it's UUID, or omit if timestamp.
            // The frontend usually generates "blog-date" or similar.
            // Let's rely on DB UUID for cleanliness, but we need to update local or re-fetch.
            const { data, error } = await supabase
                .from('blog_posts')
                .insert([{
                    title: post.title,
                    content: post.content,
                    image: post.image,
                    rating: post.rating,
                    tag: post.tag,
                    author: post.author
                }])
                .select()
                .single();

            if (error) {
                console.error('Error creating blog post:', error);
                setBlogPosts(prev => prev.filter(p => p.id !== post.id));
            } else if (data) {
                setBlogPosts(prev => prev.map(p => p.id === post.id ? { ...p, id: data.id } : p));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const updateBlogPost = async (updatedPost: BlogPost) => {
        setBlogPosts(prev => prev.map(post => post.id === updatedPost.id ? updatedPost : post));

        try {
            const { error } = await supabase
                .from('blog_posts')
                .update({
                    title: updatedPost.title,
                    content: updatedPost.content,
                    image: updatedPost.image,
                    rating: updatedPost.rating,
                    tag: updatedPost.tag,
                    author: updatedPost.author
                })
                .eq('id', updatedPost.id);

            if (error) console.error('Error updating blog post:', error);
        } catch (e) {
            console.error(e);
        }
    };

    const deleteBlogPost = async (id: string) => {
        setBlogPosts(prev => prev.filter(p => p.id !== id));
        try {
            const { error } = await supabase
                .from('blog_posts')
                .delete()
                .eq('id', id);

            if (error) console.error('Error deleting blog post:', error);
        } catch (e) {
            console.error(e);
        }
    };

    // Social Logic
    const updateSocialConfig = (config: SocialConfig) => {
        setSocialConfig(config);
    };

    // Category Logic
    // Category Logic - SUPABASE SYNCED
    const addCategory = async (category: Category) => {
        setCategories(prev => [...prev, category]);

        try {
            const { error } = await supabase
                .from('categories')
                .insert([category]);

            if (error) {
                console.error('Error adding category to DB:', error);
                alert('Error al guardar categoría en la nube.');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteCategory = async (categoryId: string) => {
        // Prevent deleting 'huerfanos'
        if (categoryId === 'huerfanos') return;

        // Optimistic UI
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        setProducts(prev => prev.map(p =>
            p.category === categoryId
                ? { ...p, category: 'huerfanos', tags: [...p.tags, 'Sin Categoría'] }
                : p
        ));

        try {
            // 1. Move products to 'huerfanos' in DB
            // IMPORTANT: 'huerfanos' category MUST exist in the DB for this to work if there is a FK constraint.
            // If it doesn't exist, this might fail or create inconsistent data depending on DB setup.
            // Assuming 'huerfanos' exists or FK is loose.
            const { error: productsError } = await supabase
                .from('products')
                .update({ category: 'huerfanos' })
                .eq('category', categoryId); // Relies on exact match. categoryId comes from UI layer.

            if (productsError) {
                console.error('Error moving products to huerfanos:', productsError);
                throw new Error('No se pudieron mover los productos a Huérfanos.');
            }

            // 2. Delete category
            const { error: deleteError } = await supabase
                .from('categories')
                .delete()
                .eq('id', categoryId);

            if (deleteError) {
                console.error('Error deleting category from DB:', deleteError);
                // If violation of FK, alert specific message
                if (deleteError.code === '23503') { // foreign_key_violation
                    alert('No se pudo eliminar la categoría porque aún tiene productos vinculados. Intenta recargar la página.');
                } else {
                    alert(`Error al eliminar categoría: ${deleteError.message}`);
                }
                // Rollback optimistic update
                const { data: catData } = await supabase.from('categories').select('*');
                if (catData) setCategories(catData);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const updateCategory = async (updatedCategory: Category) => {
        setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));

        try {
            const { error } = await supabase
                .from('categories')
                .update(updatedCategory)
                .eq('id', updatedCategory.id);

            if (error) console.error('Error updating category in DB:', error);
        } catch (e) {
            console.error(e);
        }
    };

    // Delivery Zone Logic
    // Delivery Zone Logic - SUPABASE SYNCED
    const addDeliveryZone = async (zone: DeliveryZone) => {
        // Optimistic UI
        setDeliveryZones(prev => [...prev, zone]);

        try {
            console.log('Sending zone to DB:', zone);
            const { data, error } = await supabase
                .from('delivery_zones')
                .insert([{
                    name: zone.name,
                    price: Number(zone.price), // Ensure number
                    points: zone.points,
                    color: zone.color
                }])
                .select()
                .single();

            if (error) {
                console.error('Error adding zone:', error);
                alert(`Error guardando zona en la nube: ${error.message} (${error.details || ''})`);
                setDeliveryZones(prev => prev.filter(z => z.id !== zone.id)); // Revert
            } else if (data) {
                console.log('Zone saved, DB ID:', data.id);
                // Update temp ID with real DB ID
                setDeliveryZones(prev => prev.map(z => z.id === zone.id ? { ...z, id: data.id } : z));
            }
        } catch (e) {
            console.error('Exception adding zone:', e);
            alert('Error inesperado al guardar zona.');
        }
    };

    const deleteDeliveryZone = async (id: string) => {
        // Optimistic
        setDeliveryZones(prev => prev.filter(z => z.id !== id));

        try {
            const { error } = await supabase
                .from('delivery_zones')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting zone:', error);
                alert('No se pudo eliminar la zona de la base de datos.');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const updateDeliveryZone = async (zone: DeliveryZone) => {
        // Optimistic
        setDeliveryZones(prev => prev.map(z => z.id === zone.id ? zone : z));

        try {
            const { error } = await supabase
                .from('delivery_zones')
                .update({
                    name: zone.name,
                    price: Number(zone.price), // Ensure number
                    points: zone.points,
                    color: zone.color
                })
                .eq('id', zone.id);

            if (error) {
                console.error('Error updating zone:', error);
                alert(`Error actualizando zona: ${error.message}`);
                // Revert logic could be complex here, assuming simple success usually.
            }
        } catch (e) {
            console.error(e);
        }
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

    const saveAllData = () => {
        localStorage.setItem('savage_products', JSON.stringify(products));
        localStorage.setItem('savage_categories', JSON.stringify(categories));
        localStorage.setItem('savage_cart', JSON.stringify(cart));
        localStorage.setItem('savage_hero_slides', JSON.stringify(heroSlides));
        localStorage.setItem('savage_orders', JSON.stringify(orders));
        localStorage.setItem('savage_blog_posts', JSON.stringify(blogPosts));
        localStorage.setItem('savage_social_config', JSON.stringify(socialConfig));
        localStorage.setItem('savage_delivery_zones', JSON.stringify(deliveryZones));
        localStorage.setItem('savage_navbar_links', JSON.stringify(navbarLinks));
        localStorage.setItem('savage_banner_bento', JSON.stringify(bannerBento));
        localStorage.setItem('savage_lifestyle_config', JSON.stringify(lifestyleConfig));
    };

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
            updateCartItemSize,
            addProduct,
            updateProduct,
            deleteProduct,
            updateHeroSlides,
            createOrder,
            updateOrderStatus,
            deleteOrder,
            clearOrders,
            addBlogPost,
            updateBlogPost,
            deleteBlogPost,
            updateSocialConfig,

            cartTotal,
            categories,
            addCategory,
            updateCategory,
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
            updateLifestyleConfig,
            saveAllData

        }}>
            {children}
        </ShopContext.Provider>
    );
};
