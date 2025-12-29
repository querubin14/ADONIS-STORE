
import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
    Plus,
    Trash2,
    Layout,
    ShoppingBag,
    Image as ImageIcon,
    Save,
    LogOut,
    ChevronDown,
    ChevronUp,
    X,
    FileText,
    Settings,
    MessageSquare,
    Layers,
    Map,
    Edit
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroSlide, BlogPost, Product, Category, NavbarLink, BannerBento } from '../types';
import DeliveryZoneMap from '../components/DeliveryZoneMap';
import { uploadProductImage } from '../services/uploadService';
import { openGooglePicker } from '../services/googlePickerService';
import { Loader2, UploadCloud, Image as GoogleIcon } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const {
        products, addProduct, updateProduct, deleteProduct,
        heroSlides, updateHeroSlides,
        orders, updateOrderStatus, deleteOrder, clearOrders,
        blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
        socialConfig, updateSocialConfig,
        categories, addCategory, deleteCategory, updateCategory,
        navbarLinks, updateNavbarLinks,
        bannerBento, updateBannerBento,
        lifestyleConfig, updateLifestyleConfig,
        saveAllData
    } = useShop();

    const [activeTab, setActiveTab] = useState<'products' | 'hero' | 'orders' | 'blog' | 'config' | 'categories' | 'delivery' | 'webDesign'>('products');

    // Product Form State
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        originalPrice: '',
        category: '',
        subcategory: '',
        type: 'clothing' as 'clothing' | 'footwear',
        images: [''],
        sizes: [] as string[],
        tags: [] as string[],
        fit: '',
        description: '',
        isFeatured: false,
        isCategoryFeatured: false
    });

    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [isImported, setIsImported] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const blogFileInputRef = React.useRef<HTMLInputElement>(null);
    const [isBlogUploading, setIsBlogUploading] = useState(false);

    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    // Hero Form State
    const [heroForm, setHeroForm] = useState<HeroSlide[]>(heroSlides);

    // Blog Form State
    const [blogForm, setBlogForm] = useState({
        title: '',
        content: '',
        image: '',
        author: 'Admin',
        rating: 5,
        tag: 'LIFESTYLE'
    });

    const [editingPostId, setEditingPostId] = useState<string | null>(null);

    // Config Form State
    const [configForm, setConfigForm] = useState({
        instagram: '', tiktok: '', email: '', whatsapp: '', address: '', shippingText: '', ...socialConfig
    });

    const [lifestyleForm, setLifestyleForm] = useState(lifestyleConfig || {
        sectionTitle: 'THE SAVAGE LIFESTYLE',
        sectionSubtitle: 'Únete a la comunidad...',
        buttonText: 'LEER EL BLOG',
        buttonLink: '/blog'
    });

    // Web Design Form State
    const [navForm, setNavForm] = useState<NavbarLink[]>(navbarLinks || []);
    const [bentoForm, setBentoForm] = useState<BannerBento[]>(bannerBento || []);

    // Categories Form State
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategorySubcats, setNewCategorySubcats] = useState('');
    const [categoryToEdit, setCategoryToEdit] = useState<string | null>(null);
    const [editSubcats, setEditSubcats] = useState('');

    const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
    const footwearSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

    // Determine available sizes based on type
    const availableSizes = newProduct.type === 'footwear' ? footwearSizes : clothingSizes;

    const availableTags = ['Nuevo', 'Oferta', 'Importado', 'Premium', 'Limitado'];

    // --- Product Handlers ---
    // --- Product Handlers ---
    const resetForm = () => {
        setNewProduct({
            name: '',
            price: '',
            originalPrice: '',
            category: '',
            subcategory: '',
            type: 'clothing',
            images: [''],
            sizes: [],
            tags: [],
            fit: '',
            description: '',
            isFeatured: false,
            isCategoryFeatured: false
        });
        setEditingProductId(null);
        setIsImported(false);
    };

    const handleEditProduct = (product: Product) => {
        setNewProduct({
            name: product.name,
            // Logic Fix 2.0: Correct mapping to inputs 
            // newProduct.price -> "Precio Oferta" Input
            // newProduct.originalPrice -> "Precio Regular" Input

            // If Offer (original > price):
            // Regular Input = Original (High)
            // Offer Input = Price (Low)

            // If No Offer:
            // Regular Input = Price (Current)
            // Offer Input = Empty
            price: (product.originalPrice && product.originalPrice > product.price) ? product.price.toString() : '',
            originalPrice: (product.originalPrice && product.originalPrice > product.price) ? product.originalPrice.toString() : product.price.toString(),
            category: product.category,
            subcategory: product.subcategory || '',
            type: product.type || 'clothing',
            images: product.images,
            sizes: product.sizes,
            tags: product.tags,
            fit: product.fit || '',
            description: product.description || '',
            isFeatured: product.isFeatured || false,
            isCategoryFeatured: product.isCategoryFeatured || false
        });
        setEditingProductId(product.id);
        setIsImported(product.tags.includes('25 a 30 dias'));

        // Scroll main container to top
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newProduct.name) {
            alert('Por favor completa el nombre del producto.');
            return;
        }

        const validImages = newProduct.images.filter(img => img.trim() !== '');

        // Handle Imported Tag Logic
        let finalTags = [...newProduct.tags];
        const importTag = '25 a 30 dias';

        if (isImported) {
            if (!finalTags.includes(importTag)) finalTags.push(importTag);
        } else {
            finalTags = finalTags.filter(t => t !== importTag);
        }

        // Determine final prices based on user input
        // Fix for USER mental model: If user input 'originalPrice' but left 'price' empty/0, 
        // they mean "This is the price".
        let price = Number(newProduct.price) || 0;
        let originalPrice = newProduct.originalPrice ? Number(newProduct.originalPrice) : 0;

        if (price === 0 && originalPrice > 0) {
            price = originalPrice;
            originalPrice = 0;
        }

        // Tag Logic for Offer
        if (originalPrice > price) {
            if (!finalTags.includes('Oferta')) finalTags.push('Oferta');
        } else {
            finalTags = finalTags.filter(t => t !== 'Oferta');
        }

        const productData: Product = {
            id: editingProductId || Date.now().toString(),
            name: newProduct.name,
            price: price,
            originalPrice: originalPrice > price ? originalPrice : undefined,
            category: newProduct.category || categories[0]?.id || 'Uncategorized',
            subcategory: newProduct.subcategory,
            type: newProduct.type,
            images: validImages.length > 0 ? validImages : ['https://via.placeholder.com/300'],
            sizes: newProduct.sizes,
            tags: finalTags,
            fit: newProduct.fit,
            isNew: finalTags.includes('Nuevo'),
            isFeatured: newProduct.isFeatured,
            isCategoryFeatured: newProduct.isCategoryFeatured,
            description: newProduct.description
        };

        if (editingProductId) {
            updateProduct(productData);
            alert('Producto actualizado correctamente');
        } else {
            addProduct(productData);
            alert('Producto añadido correctamente');
        }

        resetForm();
    };

    const toggleSize = (size: string) => {
        setNewProduct(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size]
        }));
    };

    const toggleTag = (tag: string) => {
        setNewProduct(prev => ({
            ...prev,
            tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
        }));
    };

    const handleImageChange = (index: number, value: string) => {
        const updatedImages = [...newProduct.images];
        updatedImages[index] = value;
        setNewProduct(prev => ({ ...prev, images: updatedImages }));
    };

    const addImageField = () => {
        setNewProduct(prev => ({ ...prev, images: [...prev.images, ''] }));
    };

    const removeImageField = (index: number) => {
        const updatedImages = newProduct.images.filter((_, i) => i !== index);
        setNewProduct(prev => ({ ...prev, images: updatedImages }));
    };

    const moveImageUp = (index: number) => {
        if (index === 0) return;
        const updated = [...newProduct.images];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        setNewProduct(prev => ({ ...prev, images: updated }));
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsUploading(true);
            const files = Array.from(e.target.files);
            const uploadedUrls: string[] = [];

            for (const file of files) {
                // Organize by category folder
                const folder = newProduct.category ? newProduct.category : 'general';
                const url = await uploadProductImage(file as File, folder);
                if (url) {
                    uploadedUrls.push(url);
                }
            }

            if (uploadedUrls.length > 0) {
                setNewProduct(prev => ({
                    ...prev,
                    images: [...prev.images.filter(i => i !== ''), ...uploadedUrls] // Append new images
                }));
            }
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        }
    };

    const handleGooglePhotosSelect = () => {
        openGooglePicker(async (blob, name) => {
            setIsUploading(true);
            try {
                const file = new File([blob], name, { type: blob.type });
                const folder = newProduct.category ? newProduct.category : 'general';
                const url = await uploadProductImage(file, folder);
                if (url) {
                    setNewProduct(prev => ({
                        ...prev,
                        images: [...prev.images.filter(img => img.trim() !== ''), url]
                    }));
                }
            } catch (error) {
                console.error("Error managing Google Photo:", error);
                alert("Error al procesar la imagen de Google Photos.");
            } finally {
                setIsUploading(false);
            }
        });
    };


    // --- Hero Handlers ---
    const handleHeroSave = () => {
        updateHeroSlides(heroForm);
        alert('Banners actualizados!');
    };

    const addSlide = () => {
        setHeroForm([...heroForm, {
            id: Date.now().toString(),
            title: 'NUEVO BANNER',
            subtitle: 'Subtítulo aquí',
            buttonText: 'VER MÁS',
            image: 'https://via.placeholder.com/1920x1080'
        }]);
    };

    const removeSlide = (id: string) => {
        setHeroForm(heroForm.filter(s => s.id !== id));
    };

    const updateSlide = (id: string, field: keyof HeroSlide, value: string) => {
        setHeroForm(heroForm.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const moveSlide = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === heroForm.length - 1) return;

        const newSlides = [...heroForm];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
        setHeroForm(newSlides);
    };

    // --- Order Handlers ---
    const toggleOrderStatus = (orderId: string, currentStatus: string) => {
        // Toggle logic: Pendiente -> Entregado. Anything else -> Pendiente (Reopen)
        const newStatus = currentStatus === 'Pendiente' ? 'Entregado' : 'Pendiente';
        updateOrderStatus(orderId, newStatus as any);
    };

    // --- Blog Handlers ---
    const handleAddBlogPost = (e: React.FormEvent) => {
        e.preventDefault();
        const postData: BlogPost = {
            id: editingPostId || Date.now().toString(),
            title: blogForm.title,
            content: blogForm.content,
            image: blogForm.image || 'https://via.placeholder.com/800x600',
            author: blogForm.author,
            date: new Date().toLocaleDateString(),
            rating: blogForm.rating,
            tag: blogForm.tag
        };

        if (editingPostId) {
            updateBlogPost(postData);
            setEditingPostId(null);
            alert('Post actualizado!');
        } else {
            addBlogPost(postData);
            alert('Post/Testimonio agregado!');
        }

        setBlogForm({ title: '', content: '', image: '', author: 'Admin', rating: 5, tag: 'LIFESTYLE' });
    };

    const handleEditBlogPost = (post: BlogPost) => {
        setBlogForm({
            title: post.title,
            content: post.content,
            image: post.image || '',
            author: post.author || 'Admin',
            rating: post.rating || 5,
            tag: post.tag || 'LIFESTYLE'
        });
        setEditingPostId(post.id);
        // Scroll to form (roughly, simplified)
        const formElement = document.querySelector('form');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancelEditBlog = () => {
        setEditingPostId(null);
        setBlogForm({ title: '', content: '', image: '', author: 'Admin', rating: 5, tag: 'LIFESTYLE' });
    };

    // --- Config Handlers ---
    const handleConfigSave = () => {
        updateSocialConfig(configForm);
        updateLifestyleConfig(lifestyleForm);
        alert('Configuración guardada!');
    };

    // --- Category Handlers ---
    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        const id = newCategoryName.toLowerCase().replace(/\s+/g, '-');
        const subcategories = newCategorySubcats.split(',').map(s => s.trim()).filter(s => s !== '');

        addCategory({ id, name: newCategoryName, subcategories });
        setNewCategoryName('');
        setNewCategorySubcats('');
        alert('Categoría agregada');
    };

    const [editOpacity, setEditOpacity] = useState('');

    const handleUpdateCategory = (catId: string) => {
        const subcategories = editSubcats.split(',').map(s => s.trim()).filter(s => s !== '');
        const opacity = editOpacity ? parseFloat(editOpacity) : undefined;

        const cat = categories.find(c => c.id === catId);
        if (!cat) return;

        if (updateCategory) {
            updateCategory({ ...cat, subcategories, opacity });
        } else {
            deleteCategory(catId);
            addCategory({ ...cat, subcategories, opacity });
        }

        setCategoryToEdit(null);
        setEditSubcats('');
        setEditOpacity('');
    };

    const handleBlogFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsBlogUploading(true);
            const file = e.target.files[0];
            const url = await uploadProductImage(file, 'blog');

            if (url) {
                setBlogForm(prev => ({ ...prev, image: url }));
            }

            setIsBlogUploading(false);
            if (blogFileInputRef.current) blogFileInputRef.current.value = '';
        }
    };


    const productsByCategory = products.reduce((acc, product) => {
        // Find category name by ID
        const catObj = categories.find(c => c.id === product.category);
        const catName = catObj ? catObj.name : (product.category === 'huerfanos' ? 'Huérfanos' : 'Sin Categoría');

        if (!acc[catName]) acc[catName] = [];
        acc[catName].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

    // --- Web Design Handlers ---
    const handleNavSave = () => {
        updateNavbarLinks(navForm);
        alert('Menú de navegación actualizado!');
    };

    const addNavLink = () => {
        const newId = 'nav' + Date.now();
        setNavForm([...navForm, { id: newId, label: 'NUEVO LINK', path: '/' }]);
    };

    const removeNavLink = (id: string) => {
        setNavForm(navForm.filter(l => l.id !== id));
    };

    const updateNavLink = (id: string, field: keyof NavbarLink, value: string) => {
        setNavForm(navForm.map(l => l.id === id ? { ...l, [field]: value } : l));
    };

    const handleBentoSave = () => {
        updateBannerBento(bentoForm);
        alert('Banners de categoría actualizados!');
    };

    const updateBentoItem = (id: string, field: keyof BannerBento, value: string) => {
        setBentoForm(bentoForm.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const getBentoLabel = (id: string) => {
        switch (id) {
            case 'large': return 'Bloque Grande (Izquierda)';
            case 'top_right': return 'Bloque Medio (Arriba Derecha)';
            case 'bottom_right': return 'Bloque Medio (Abajo Derecha)';
            default: return id;
        }
    };


    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-800 p-6 flex flex-col h-screen sticky top-0">
                <h1 className="text-2xl font-black tracking-tighter text-primary mb-10">SAVAGE<span className="text-white">ADMIN</span></h1>

                <nav className="flex-1 space-y-2">
                    <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'products' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <ShoppingBag size={20} /> <span className="font-bold text-sm">Productos</span>
                    </button>
                    <button onClick={() => setActiveTab('webDesign')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'webDesign' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Layout size={20} /> <span className="font-bold text-sm">Diseño Web / Banners</span>
                    </button>
                    <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'orders' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <FileText size={20} /> <span className="font-bold text-sm">Pedidos / Ventas</span>
                    </button>
                    <button onClick={() => setActiveTab('hero')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'hero' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <ImageIcon size={20} /> <span className="font-bold text-sm">Carrusel Hero</span>
                    </button>
                    <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'categories' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Layers size={20} /> <span className="font-bold text-sm">Categorías</span>
                    </button>
                    <button onClick={() => setActiveTab('delivery')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'delivery' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Map size={20} /> <span className="font-bold text-sm">Zonas de Entrega</span>
                    </button>
                    <button onClick={() => setActiveTab('blog')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'blog' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <MessageSquare size={20} /> <span className="font-bold text-sm">Blog / Reviews</span>
                    </button>
                    <button onClick={() => setActiveTab('config')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'config' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Settings size={20} /> <span className="font-bold text-sm">Configuración</span>
                    </button>

                    <button
                        onClick={() => { saveAllData(); alert('Todos los cambios han sido guardados correctamente.'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-green-500 hover:bg-green-500/10 hover:text-green-400 mt-4 border border-green-900/50"
                    >
                        <Save size={20} /> <span className="font-bold text-sm">GUARDAR TODO</span>
                    </button>
                </nav>

                <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white transition-colors mt-auto">
                    <LogOut size={20} />
                    <span className="font-medium text-sm">Volver a Tienda</span>
                </Link>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto h-screen">

                {/* PRODUCTS TAB */}
                {activeTab === 'products' && (
                    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <header className="flex justify-between items-end border-b border-gray-800 pb-6">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Gestión de Productos</h2>
                                <p className="text-gray-400">Administra el inventario, precios y detalles.</p>
                            </div>
                        </header>

                        {/* Add Product Form */}
                        <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-8 shadow-2xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                                {editingProductId ? <Edit size={24} /> : <Plus size={24} />}
                                {editingProductId ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
                            </h3>
                            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Nombre</label>
                                        <input type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="Ej. Oversized Hoodie" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Precio Regular (Gs.)</label>
                                            <input type="number" value={newProduct.originalPrice} onChange={e => setNewProduct({ ...newProduct, originalPrice: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="0" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-primary uppercase">Precio Oferta (Gs.)</label>
                                            <input type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full bg-black border border-primary/50 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors font-bold" placeholder="0" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Categoría</label>
                                            <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors text-gray-300">
                                                <option value="">Seleccionar...</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* SUBCATEGORY UI */}
                                        {(() => {
                                            const activeCategory = categories.find(c => c.id === newProduct.category);
                                            if (activeCategory && activeCategory.subcategories && activeCategory.subcategories.length > 0) {
                                                return (
                                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Sub-Categoría</label>
                                                        <select
                                                            value={newProduct.subcategory}
                                                            onChange={e => setNewProduct({ ...newProduct, subcategory: e.target.value })}
                                                            className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors text-gray-300"
                                                        >
                                                            <option value="">Seleccionar...</option>
                                                            {activeCategory.subcategories.map(sub => (
                                                                <option key={sub} value={sub}>{sub}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Tipo de Producto</label>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setNewProduct({ ...newProduct, type: 'clothing' })}
                                                    className={`flex-1 py-3 px-2 text-xs font-bold uppercase rounded-lg border transition-all ${newProduct.type === 'clothing' ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-gray-800'}`}
                                                >
                                                    ROPA (Fit)
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setNewProduct({ ...newProduct, type: 'footwear' })}
                                                    className={`flex-1 py-3 px-2 text-xs font-bold uppercase rounded-lg border transition-all ${newProduct.type === 'footwear' ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-gray-800'}`}
                                                >
                                                    CALZADO
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Estado de Importación</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsImported(prev => !prev)}
                                            className={`w-full py-3 px-4 rounded-lg border transition-all flex items-center justify-between group ${isImported ? 'bg-purple-900/20 border-purple-500 text-purple-400' : 'bg-black border-gray-800 text-gray-400 hover:border-gray-600'}`}
                                        >
                                            <span className="font-bold uppercase text-xs">Es Producto Importado?</span>
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${isImported ? 'bg-purple-500 border-purple-500 text-black' : 'border-gray-600'}`}>
                                                {isImported && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                                            </div>
                                        </button>

                                        {isImported && (
                                            <div className="mt-2 text-[10px] text-purple-400 bg-purple-900/10 p-3 rounded border border-purple-500/20 animate-in fade-in slide-in-from-top-1">
                                                <p className="font-bold mb-1">INFO IMPORTACIÓN (A configurar):</p>
                                                <ul className="list-disc pl-4 space-y-1 opacity-80">
                                                    <li>Tiempo de espera estimado: 25 a 30 días.</li>
                                                    <li>Seña mínima requerida: 50%.</li>
                                                    <li>Se añadirá la etiqueta "25 a 30 dias" automáticamente.</li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 border border-gray-800 rounded-lg p-4 bg-[#0F0F0F]">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-yellow-500 uppercase flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">star</span> Destacados Home
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setNewProduct({ ...newProduct, isFeatured: !newProduct.isFeatured })}
                                                className={`w-full py-3 px-4 rounded-lg border transition-all flex items-center justify-between group ${newProduct.isFeatured ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-black border-gray-800 text-gray-400 hover:border-gray-600'}`}
                                            >
                                                <span className="font-bold uppercase text-xs">DESTACAR EN HOME (TOP 8)</span>
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${newProduct.isFeatured ? 'bg-yellow-500 border-yellow-500 text-black' : 'border-gray-600'}`}>
                                                    {newProduct.isFeatured && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                                                </div>
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-blue-500 uppercase flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">category</span> Destacado en Categoría
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setNewProduct({ ...newProduct, isCategoryFeatured: !newProduct.isCategoryFeatured })}
                                                className={`w-full py-3 px-4 rounded-lg border transition-all flex items-center justify-between group ${newProduct.isCategoryFeatured ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'bg-black border-gray-800 text-gray-400 hover:border-gray-600'}`}
                                            >
                                                <span className="font-bold uppercase text-xs">DESTACAR EN CATEGORÍA</span>
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${newProduct.isCategoryFeatured ? 'bg-blue-500 border-blue-500 text-black' : 'border-gray-600'}`}>
                                                    {newProduct.isCategoryFeatured && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                                                </div>
                                            </button>
                                        </div>

                                        <p className="text-[10px] text-gray-500 italic">
                                            * "Home" aparece en la página principal. "Categoría" aparece primero en su lista específica.
                                        </p>
                                    </div>

                                    {newProduct.type === 'clothing' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Fit / Calce</label>
                                            <input type="text" value={newProduct.fit} onChange={e => setNewProduct({ ...newProduct, fit: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="Ej. Oversize, Regular, Slim..." />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Descripción</label>
                                        <textarea value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors h-24 resize-none" placeholder="Descripción detallada del producto..." />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Talles Disponibles</label>
                                        <div className="flex flex-wrap gap-2">
                                            {availableSizes.map(size => (
                                                <button key={size} type="button" onClick={() => toggleSize(size)} className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${newProduct.sizes.includes(size) ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-gray-800 hover:border-gray-500'}`}>
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Etiquetas</label>
                                        <div className="flex flex-wrap gap-2">
                                            {availableTags.map(tag => (
                                                <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${newProduct.tags.includes(tag) ? 'bg-primary text-white border-primary' : 'bg-transparent text-gray-500 border-gray-800 hover:border-gray-500'}`}>
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Galería de Imágenes</label>
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-white bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded flex items-center gap-1 font-bold transition-colors">
                                                    {isUploading ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                                                    {isUploading ? 'SUBIENDO...' : 'SUBIR DESDE PC'}
                                                </button>
                                                <button type="button" onClick={handleGooglePhotosSelect} className="text-xs text-white bg-green-600 hover:bg-green-500 px-3 py-1 rounded flex items-center gap-1 font-bold transition-colors">
                                                    <GoogleIcon size={12} />
                                                    GOOGLE PHOTOS
                                                </button>
                                                <button type="button" onClick={addImageField} className="text-xs text-primary font-bold hover:underline">+ Agregar URL Manual</button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileSelect}
                                                    multiple
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                            {newProduct.images.map((img, idx) => (
                                                <div key={idx} className="flex gap-2 items-center group">
                                                    <span className="text-gray-600 font-mono text-xs w-4">{idx + 1}</span>
                                                    <div className="relative w-10 h-10 bg-gray-900 rounded overflow-hidden flex-shrink-0 border border-gray-800">
                                                        {img && <img src={img} alt="" className="w-full h-full object-cover" />}
                                                    </div>
                                                    <input type="text" value={img} onChange={e => handleImageChange(idx, e.target.value)} className="flex-1 bg-black border border-gray-800 rounded p-2 text-xs focus:border-primary focus:outline-none transition-colors" placeholder="https://..." />
                                                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button type="button" onClick={() => moveImageUp(idx)} disabled={idx === 0} className="text-gray-500 hover:text-white disabled:opacity-0"><ChevronUp size={12} /></button>
                                                    </div>
                                                    <button type="button" onClick={() => removeImageField(idx)} className="text-gray-600 hover:text-red-500"><X size={14} /></button>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-gray-500">* La imagen #1 será la portada. Usa las flechas para reordenar.</p>
                                    </div>
                                </div>
                                <div className="md:col-span-2 pt-4 border-t border-gray-800">
                                    <button type="submit" className={`w-full font-black py-4 rounded-lg transition-all uppercase text-sm tracking-widest shadow-lg transform hover:translate-y-[-2px] ${editingProductId ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-white hover:bg-gray-200 text-black'}`}>
                                        {editingProductId ? 'ACTUALIZAR PRODUCTO' : 'PUBLICAR PRODUCTO'}
                                    </button>
                                    {editingProductId && (
                                        <button type="button" onClick={resetForm} className="w-full bg-transparent border border-gray-800 text-gray-500 font-bold py-3 mt-3 rounded-lg hover:border-white hover:text-white transition-all uppercase text-xs tracking-widest">
                                            CANCELAR EDICIÓN
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Inventory List */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold border-b border-gray-800 pb-2">Inventario</h3>
                            <div className="space-y-4">
                                {Object.entries(productsByCategory).map(([category, items]: [string, Product[]]) => (
                                    <div key={category} className="border border-gray-800 rounded-xl overflow-hidden bg-[#0a0a0a]">
                                        <button onClick={() => setExpandedCategory(expandedCategory === category ? null : category)} className="w-full flex justify-between items-center p-4 bg-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className={`transition-transform duration-300 ${expandedCategory === category ? 'rotate-180' : ''}`}><ChevronDown size={20} /></span>
                                                <h4 className="font-bold text-lg uppercase tracking-wide">{category}</h4>
                                                <span className="bg-gray-800 text-xs px-2 py-1 rounded-full text-gray-300">{items.length} productos</span>
                                            </div>
                                        </button>
                                        {expandedCategory === category && (
                                            <div className="p-4 space-y-2 bg-black animate-in slide-in-from-top-2 duration-300">
                                                {items.map(p => (
                                                    <div key={p.id} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg border border-transparent hover:border-gray-800 group transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded object-cover bg-gray-900" />
                                                            <div>
                                                                <h5 className="font-bold text-sm text-white">{p.name}</h5>
                                                                <div className="flex gap-2 text-xs text-gray-500">
                                                                    <span>Gs. {p.price.toLocaleString()}</span>
                                                                    {p.originalPrice && <span className="line-through">Gs. {p.originalPrice.toLocaleString()}</span>}
                                                                    <span className="text-gray-600">•</span>
                                                                    <span>{p.sizes.join(', ')}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleEditProduct(p)} className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-all" title="Editar">
                                                                <Edit size={18} />
                                                            </button>
                                                            <button onClick={() => deleteProduct(p.id)} className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Eliminar">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {items.length === 0 && <p className="text-center text-gray-500 py-4">No hay productos en esta categoría.</p>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div >
                )}


                {/* ORDERS TAB */}
                {
                    activeTab === 'orders' && (
                        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <header className="border-b border-gray-800 pb-6 flex justify-between items-end">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Pedidos y Ventas</h2>
                                    <p className="text-gray-400">Control de pedidos iniciados via WhatsApp.</p>
                                </div>
                                {orders.length > 0 && (
                                    <button
                                        onClick={() => {
                                            if (window.confirm('¿ESTÁS SEGURO DE ELIMINAR TODOS LOS PEDIDOS? Esta acción no se puede deshacer.')) {
                                                clearOrders();
                                            }
                                        }}
                                        className="bg-red-900/20 hover:bg-red-900/40 text-red-500 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors border border-red-900/30 flex items-center gap-2"
                                    >
                                        <Trash2 size={16} /> ELIMINAR TODO
                                    </button>
                                )}
                            </header>

                            <div className="space-y-4" key={orders?.map(o => o?.id || 'null').join(',') || 'empty'}>
                                {orders.length === 0 ? (
                                    <div className="text-center py-20 bg-[#0a0a0a] border border-gray-800 rounded-xl">
                                        <p className="text-gray-500">No hay pedidos registrados aún.</p>
                                    </div>
                                ) : (
                                    orders.map(order => (
                                        <div key={order.id} className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between md:items-center gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-3 py-1 rounded text-xs font-black uppercase tracking-wider ${order.status === 'Pendiente' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                                                        {order.status}
                                                    </span>
                                                    <span className="text-gray-500 text-xs">{order.created_at}</span>
                                                    <span className="text-[10px] text-gray-700 font-mono">#{order.display_id || order.id.toString().slice(-4)}</span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteOrder(order.id);
                                                        }}
                                                        className="p-3 text-red-500 hover:bg-red-900/20 rounded-lg transition-all ml-auto md:ml-2 border border-red-900/30"
                                                        title="Eliminar DEFINITIVAMENTE"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    {/* Compatibility check for items */}
                                                    {(order.items as any[])?.map((item: any) => (
                                                        <div key={item.id + (item.selectedSize || '')} className="text-sm">
                                                            <span className="font-bold text-white">{item.quantity || 1}x {item.name}</span>
                                                            {item.selectedSize && <span className="text-gray-500 ml-2">({item.selectedSize})</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-2 text-xs text-gray-400">
                                                    Total: <span className="text-white font-bold text-base">Gs. {order.total_amount?.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                                {order.status === 'Pendiente' ? (
                                                    <button
                                                        onClick={() => toggleOrderStatus(order.id, 'Pendiente')}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors w-full md:w-auto"
                                                    >
                                                        Marcar Finalizado
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => toggleOrderStatus(order.id, 'Entregado')}
                                                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors w-full md:w-auto"
                                                    >
                                                        Reabrir Pedido
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )
                }


                {/* BLOG TAB */}
                {
                    activeTab === 'blog' && (
                        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <header className="border-b border-gray-800 pb-6">
                                <h2 className="text-3xl font-bold mb-2">Blog y Reseñas</h2>
                                <p className="text-gray-400">Gestiona entradas del blog y testimonios de clientes.</p>
                            </header>

                            {/* Add Post Form */}
                            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-8 shadow-2xl">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                                    {editingPostId ? <Edit size={24} /> : <Plus size={24} />}
                                    {editingPostId ? 'EDITAR ENTRADA / RESEÑA' : 'NUEVA ENTRADA / RESEÑA'}
                                </h3>
                                <form onSubmit={handleAddBlogPost} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Título</label>
                                        <input type="text" value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="Ej. Cliente Satisfecho" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Contenido / Comentario</label>
                                        <textarea value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors h-32 resize-none" placeholder="Escribe aquí..." required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">URL Imagen</label>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => blogFileInputRef.current?.click()}
                                                    className="text-xs text-white bg-blue-600 hover:bg-blue-500 px-3 py-3 rounded-lg flex items-center gap-2 font-bold transition-colors whitespace-nowrap"
                                                    disabled={isBlogUploading}
                                                >
                                                    {isBlogUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                                                    {isBlogUploading ? '...' : 'SUBIR PC'}
                                                </button>
                                                <input type="text" value={blogForm.image} onChange={e => setBlogForm({ ...blogForm, image: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="https://..." />
                                                <input
                                                    type="file"
                                                    ref={blogFileInputRef}
                                                    onChange={handleBlogFileSelect}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </div>

                                            {blogForm.image && (
                                                <div className="mt-3 relative w-full h-48 bg-gray-900 rounded-lg overflow-hidden border border-gray-800 group">
                                                    <img src={blogForm.image} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-xs font-bold text-white uppercase tracking-widest">Vista Previa</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Calificación (Estrellas)</label>
                                            <select value={blogForm.rating} onChange={e => setBlogForm({ ...blogForm, rating: Number(e.target.value) })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors text-white">
                                                <option value="5">5 Estrellas</option>
                                                <option value="4">4 Estrellas</option>
                                                <option value="3">3 Estrellas</option>
                                                <option value="2">2 Estrellas</option>
                                                <option value="1">1 Estrella</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Tag (Etiqueta)</label>
                                            <input type="text" value={blogForm.tag} onChange={e => setBlogForm({ ...blogForm, tag: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="Ej. LIFESTYLE" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Autor</label>
                                        <input type="text" value={blogForm.author} onChange={e => setBlogForm({ ...blogForm, author: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="Nombre del autor/cliente" />
                                    </div>
                                    <button type="submit" className={`w-full font-black py-4 rounded-lg transition-all uppercase text-sm tracking-widest shadow-lg ${editingPostId ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-white hover:bg-gray-200 text-black'}`}>
                                        {editingPostId ? 'GUARDAR CAMBIOS' : 'PUBLICAR'}
                                    </button>
                                    {editingPostId && (
                                        <button type="button" onClick={handleCancelEditBlog} className="w-full bg-transparent border border-gray-800 text-gray-500 font-bold py-3 mt-2 rounded-lg hover:border-white hover:text-white transition-all uppercase text-xs tracking-widest">
                                            CANCELAR EDICIÓN
                                        </button>
                                    )}
                                </form>
                            </div>

                            {/* List Posts */}
                            <div className="space-y-4">
                                {blogPosts.map(post => (
                                    <div key={post.id} className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 flex gap-4 items-start">
                                        <img src={post.image} alt="" className="w-24 h-24 object-cover rounded-lg bg-gray-900" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-white text-lg">{post.title}</h4>
                                                <div className="flex gap-1 text-yellow-500 text-xs">
                                                    {'★'.repeat(post.rating || 5)}{'☆'.repeat(5 - (post.rating || 5))}
                                                </div>
                                            </div>
                                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{post.content}</p>
                                            <div className="flex justify-between items-center mt-4">
                                                <span className="text-xs text-gray-600">Por {post.author} • {post.date}</span>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEditBlogPost(post)} className="text-gray-400 hover:text-white text-xs font-bold uppercase hover:underline">Editar</button>
                                                    <button onClick={() => deleteBlogPost(post.id)} className="text-red-500 hover:text-red-400 text-xs font-bold uppercase hover:underline">Eliminar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div >
                    )
                }


                {/* CONFIG TAB */}
                {
                    activeTab === 'config' && (
                        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <header className="border-b border-gray-800 pb-6">
                                <h2 className="text-3xl font-bold mb-2">Configuración General</h2>
                                <p className="text-gray-400">Redes sociales y datos de contacto.</p>
                            </header>

                            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-8 shadow-2xl space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Instagram URL</label>
                                    <input type="text" value={configForm.instagram} onChange={e => setConfigForm({ ...configForm, instagram: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">TikTok URL</label>
                                    <input type="text" value={configForm.tiktok} onChange={e => setConfigForm({ ...configForm, tiktok: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Email de Contacto</label>
                                    <input type="text" value={configForm.email} onChange={e => setConfigForm({ ...configForm, email: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp (Número sin +)</label>
                                    <input type="text" value={configForm.whatsapp} onChange={e => setConfigForm({ ...configForm, whatsapp: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Dirección / Footer Info</label>
                                    <input type="text" value={configForm.address} onChange={e => setConfigForm({ ...configForm, address: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                                </div>

                                <hr className="border-gray-800 my-4" />
                                <h3 className="text-lg font-bold text-white mb-2">Encabezado (Top Bar)</h3>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Texto del Encabezado</label>
                                    <input type="text" value={configForm.topHeaderText || ''} onChange={e => setConfigForm({ ...configForm, topHeaderText: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="Ej. ENVÍOS GRATIS..." />
                                </div>

                                <hr className="border-gray-800 my-4" />
                                <h3 className="text-lg font-bold text-white mb-2">Sección Lifestyle / Blog (Home)</h3>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Título de Sección</label>
                                    <input type="text" value={lifestyleForm.sectionTitle} onChange={e => setLifestyleForm({ ...lifestyleForm, sectionTitle: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Subtítulo</label>
                                    <input type="text" value={lifestyleForm.sectionSubtitle} onChange={e => setLifestyleForm({ ...lifestyleForm, sectionSubtitle: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Texto Botón</label>
                                        <input type="text" value={lifestyleForm.buttonText} onChange={e => setLifestyleForm({ ...lifestyleForm, buttonText: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Link Botón</label>
                                        <input type="text" value={lifestyleForm.buttonLink} onChange={e => setLifestyleForm({ ...lifestyleForm, buttonLink: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                                    </div>
                                </div>
                                <hr className="border-gray-800 my-4" />

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Texto de Envío (Info Producto)</label>
                                    <input type="text" value={configForm.shippingText} onChange={e => setConfigForm({ ...configForm, shippingText: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="Ej. Envío gratis en compras mayores a..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Texto de Devoluciones (Info Producto)</label>
                                    <input type="text" value={configForm.extraShippingInfo || ''} onChange={e => setConfigForm({ ...configForm, extraShippingInfo: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="Ej. Devoluciones gratis hasta 30 días" />
                                </div>
                                <button onClick={handleConfigSave} className="w-full bg-primary text-white font-black py-4 rounded-lg hover:bg-red-700 transition-all uppercase text-sm tracking-widest shadow-lg mt-4">
                                    Guardar Configuración
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* CATEGORIES TAB */}
                {
                    activeTab === 'categories' && (
                        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <header className="border-b border-gray-800 pb-6">
                                <h2 className="text-3xl font-bold mb-2">Gestión de Categorías</h2>
                                <p className="text-gray-400">Crea y elimina categorías para organizar tu tienda.</p>
                            </header>

                            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-8 shadow-2xl">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                                    <Plus size={24} /> NUEVA CATEGORÍA
                                </h3>
                                <form onSubmit={handleAddCategory} className="flex flex-col md:flex-row gap-4 items-end">
                                    <div className="space-y-2 flex-1 w-full">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Nombre de Categoría</label>
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={e => setNewCategoryName(e.target.value)}
                                            className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors"
                                            placeholder="Ej. Camperas"
                                        />
                                    </div>
                                    <div className="space-y-2 flex-1 w-full">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Subcategorías (Separadas por comas)</label>
                                        <input
                                            type="text"
                                            value={newCategorySubcats}
                                            onChange={e => setNewCategorySubcats(e.target.value)}
                                            className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors"
                                            placeholder="Ej. Nike, Adidas, Puma..."
                                        />
                                    </div>
                                    <button type="submit" className="bg-white text-black font-black px-8 py-3 rounded-lg hover:bg-gray-200 transition-all uppercase text-sm tracking-widest shadow-lg h-[46px] w-full md:w-auto">
                                        AGREGAR
                                    </button>
                                </form>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold border-b border-gray-800 pb-2">Categorías Existentes</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {categories.map(cat => (
                                        <div key={cat.id} className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4 flex flex-col gap-4 group">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-bold text-white text-lg">{cat.name}</h4>
                                                    <span className="text-xs text-gray-500 font-mono">ID: {cat.id}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setCategoryToEdit(cat.id);
                                                            setEditSubcats(cat.subcategories ? cat.subcategories.join(', ') : '');
                                                        }}
                                                        className="p-2 text-gray-600 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                                        title="Editar Subcategorías"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    {cat.id !== 'huerfanos' && (
                                                        <button
                                                            onClick={() => deleteCategory(cat.id)}
                                                            className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                            title="Eliminar Categoría"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Subcategories Display/Edit */}
                                            {categoryToEdit === cat.id ? (
                                                <div className="flex flex-col gap-2 animate-in fade-in">
                                                    <input
                                                        type="text"
                                                        value={editSubcats}
                                                        onChange={e => setEditSubcats(e.target.value)}
                                                        className="w-full bg-black border border-gray-700 rounded p-2 text-xs text-white"
                                                        placeholder="Subcategorías (Nike, Adidas...)"
                                                    />
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="number"
                                                            value={editOpacity}
                                                            onChange={e => setEditOpacity(e.target.value)}
                                                            className="w-24 bg-black border border-gray-700 rounded p-2 text-xs text-white"
                                                            placeholder="Opacidad (0.5)"
                                                            step="0.1"
                                                        />
                                                        <button onClick={() => handleUpdateCategory(cat.id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold">OK</button>
                                                        <button onClick={() => setCategoryToEdit(null)} className="bg-gray-700 text-white px-3 py-1 rounded text-xs">Cancelar</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-1">
                                                    {cat.subcategories?.map(sub => (
                                                        <span key={sub} className="px-2 py-1 bg-gray-900 text-gray-400 text-[10px] rounded uppercase border border-gray-800">{sub}</span>
                                                    ))}
                                                    {(!cat.subcategories || cat.subcategories.length === 0) && <span className="text-[10px] text-gray-700 italic">Sin subcategorías</span>}
                                                    {cat.opacity !== undefined && <span className="text-[10px] text-yellow-500 ml-2">Opacidad: {cat.opacity}</span>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* DELIVERY TAB */}
                {
                    activeTab === 'delivery' && (
                        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <header className="border-b border-gray-800 pb-6">
                                <h2 className="text-3xl font-bold mb-2">Zonas de Entrega</h2>
                                <p className="text-gray-400">Configura áreas geográficas y precios de envío automáticos.</p>
                            </header>

                            <DeliveryZoneMap />
                        </div>
                    )
                }

                {/* VISUAL CONFIG TAB (was activeTab === 'hero' previously? No, hero is separate) */}
                {/* HERO TAB */}
                {
                    activeTab === 'hero' && (
                        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <header className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Carrusel Hero</h2>
                                    <p className="text-gray-400">Personaliza el carrusel principal.</p>
                                </div>
                                <button onClick={handleHeroSave} className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors">
                                    <Save size={18} /> GUARDAR CAMBIOS
                                </button>
                            </header>

                            <div className="space-y-6">
                                {heroForm.map((slide, index) => (
                                    <div key={slide.id} className="bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden relative group">
                                        <div className="absolute right-4 top-4 z-10 flex gap-2">
                                            <button onClick={() => moveSlide(index, 'up')} className="p-2 bg-black/50 hover:bg-white text-white hover:text-black rounded-lg transition-colors border border-gray-700" title="Mover arriba">
                                                <ChevronUp size={16} />
                                            </button>
                                            <button onClick={() => moveSlide(index, 'down')} className="p-2 bg-black/50 hover:bg-white text-white hover:text-black rounded-lg transition-colors border border-gray-700" title="Mover abajo">
                                                <ChevronDown size={16} />
                                            </button>
                                            <button onClick={() => removeSlide(slide.id)} className="p-2 bg-red-900/50 hover:bg-red-600 text-white rounded-lg transition-colors border border-red-900">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3">
                                            {/* Preview Area */}
                                            <div className="relative h-64 md:h-auto md:col-span-1 bg-gray-900">
                                                <img src={slide.image} alt="Preview" className="w-full h-full object-cover opacity-60" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                                    <h2 className="text-xl font-black italic tracking-tighter uppercase mb-1 shadow-black drop-shadow-lg">{slide.title}</h2>
                                                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase shadow-black drop-shadow-md">{slide.subtitle}</p>
                                                </div>
                                                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-gray-300 font-mono">
                                                    Slide #{index + 1}
                                                </div>
                                            </div>

                                            {/* Edit Form */}
                                            <div className="p-6 md:col-span-2 space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">URL Imagen</label>
                                                    <input type="text" value={slide.image} onChange={e => updateSlide(slide.id, 'image', e.target.value)} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Título</label>
                                                        <input type="text" value={slide.title} onChange={e => updateSlide(slide.id, 'title', e.target.value)} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Subtítulo</label>
                                                        <input type="text" value={slide.subtitle} onChange={e => updateSlide(slide.id, 'subtitle', e.target.value)} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Texto Botón</label>
                                                        <input type="text" value={slide.buttonText} onChange={e => updateSlide(slide.id, 'buttonText', e.target.value)} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Link Botón</label>
                                                        <input type="text" value={slide.buttonLink || ''} onChange={e => updateSlide(slide.id, 'buttonLink', e.target.value)} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="/category/..." />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button onClick={addSlide} className="w-full py-8 border-2 border-dashed border-gray-800 hover:border-gray-600 rounded-xl text-gray-500 hover:text-white font-bold flex flex-col items-center justify-center gap-2 transition-colors">
                                    <Plus size={32} />
                                    AGREGAR NUEVO SLIDE
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* WEB DESIGN TAB */}
                {
                    activeTab === 'webDesign' && (
                        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <header className="border-b border-gray-800 pb-6">
                                <h2 className="text-3xl font-bold mb-2">Diseño Web y Atajos</h2>
                                <p className="text-gray-400">Personaliza la barra de navegación y los banners de categoría.</p>
                            </header>

                            {/* NAVBAR SECTION */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Layers size={20} /> BARRA DE NAVEGACIÓN (Navbar)
                                    </h3>
                                    <button onClick={handleNavSave} className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2">
                                        <Save size={16} /> Guardar Menú
                                    </button>
                                </div>

                                <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
                                    <div className="space-y-4">
                                        {navForm.map((link, idx) => (
                                            <div key={link.id} className="flex gap-4 items-center bg-black/50 p-4 rounded-lg border border-gray-800">
                                                <span className="text-gray-500 font-mono text-xs">#{idx + 1}</span>
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Texto (Label)</label>
                                                        <input
                                                            type="text"
                                                            value={link.label}
                                                            onChange={(e) => updateNavLink(link.id, 'label', e.target.value)}
                                                            className="w-full bg-black border border-gray-700 rounded p-2 text-sm text-white focus:border-primary focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Ruta (Path)</label>
                                                        <input
                                                            type="text"
                                                            value={link.path}
                                                            onChange={(e) => updateNavLink(link.id, 'path', e.target.value)}
                                                            className="w-full bg-black border border-gray-700 rounded p-2 text-sm text-gray-300 font-mono focus:border-primary focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <button onClick={() => removeNavLink(link.id)} className="text-gray-600 hover:text-red-500 p-2">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                        <button onClick={addNavLink} className="w-full py-4 border border-dashed border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                            <Plus size={16} /> Agregar Item al Menú
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* BENTO BANNERS SECTION */}
                            <div className="space-y-6 pt-6 border-t border-gray-800">
                                <div className="flex justify-between items-end">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <ImageIcon size={20} /> BANNERS DE CATEGORÍA
                                    </h3>
                                    <button onClick={handleBentoSave} className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2">
                                        <Save size={16} /> Guardar Banners
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {bentoForm.map((banner) => (
                                        <div key={banner.id} className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 group">
                                            <h4 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-2">
                                                {getBentoLabel(banner.id)}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Preview */}
                                                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                                                    {banner.image ? (
                                                        <img src={banner.image} alt={banner.title} className="w-full h-full object-cover opacity-75" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">Sin Imagen</div>
                                                    )}
                                                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                                                        <span className="text-white font-black text-xl uppercase leading-none mb-1 shadow-black drop-shadow-md">{banner.title}</span>
                                                        {banner.buttonText && <span className="text-primary text-xs font-bold uppercase shadow-black drop-shadow-md">{banner.buttonText}</span>}
                                                    </div>
                                                </div>

                                                {/* Fields */}
                                                <div className="md:col-span-2 space-y-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase">Título</label>
                                                        <input
                                                            type="text"
                                                            value={banner.title}
                                                            onChange={(e) => updateBentoItem(banner.id, 'title', e.target.value)}
                                                            className="w-full bg-black border border-gray-700 rounded p-2 text-sm text-white focus:border-primary focus:outline-none"
                                                        />
                                                    </div>
                                                    {banner.id === 'large' && (
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Subtítulo</label>
                                                            <input
                                                                type="text"
                                                                value={banner.subtitle || ''}
                                                                onChange={(e) => updateBentoItem(banner.id, 'subtitle', e.target.value)}
                                                                className="w-full bg-black border border-gray-700 rounded p-2 text-sm text-white focus:border-primary focus:outline-none"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Texto Botón</label>
                                                            <input
                                                                type="text"
                                                                value={banner.buttonText || ''}
                                                                onChange={(e) => updateBentoItem(banner.id, 'buttonText', e.target.value)}
                                                                className="w-full bg-black border border-gray-700 rounded p-2 text-sm text-white focus:border-primary focus:outline-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Link / Ruta</label>
                                                            <input
                                                                type="text"
                                                                value={banner.link}
                                                                onChange={(e) => updateBentoItem(banner.id, 'link', e.target.value)}
                                                                className="w-full bg-black border border-gray-700 rounded p-2 text-sm text-white focus:border-primary focus:outline-none font-mono"
                                                                placeholder="/category/..."
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase">URL Imagen</label>
                                                        <input
                                                            type="text"
                                                            value={banner.image}
                                                            onChange={(e) => updateBentoItem(banner.id, 'image', e.target.value)}
                                                            className="w-full bg-black border border-gray-700 rounded p-2 text-xs text-gray-300 focus:border-primary focus:outline-none font-mono"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }
            </main >
        </div >
    );
};

export default AdminDashboard;
