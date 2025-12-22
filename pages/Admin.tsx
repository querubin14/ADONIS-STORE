
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
    Map
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroSlide, BlogPost, Product, Category, NavbarLink, BannerBento } from '../types';
import DeliveryZoneMap from '../components/DeliveryZoneMap';

const AdminDashboard: React.FC = () => {
    const {
        products, addProduct, deleteProduct,
        heroSlides, updateHeroSlides,
        orders, updateOrderStatus, deleteOrder, clearOrders,
        blogPosts, addBlogPost, deleteBlogPost,
        socialConfig, updateSocialConfig,
        categories, addCategory, deleteCategory,
        navbarLinks, updateNavbarLinks,
        bannerBento, updateBannerBento,
        lifestyleConfig, updateLifestyleConfig
    } = useShop();

    const [activeTab, setActiveTab] = useState<'products' | 'hero' | 'orders' | 'blog' | 'config' | 'categories' | 'delivery' | 'webDesign'>('products');

    // Product Form State
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        originalPrice: '',
        category: '',
        type: 'clothing' as 'clothing' | 'footwear',
        images: [''],
        sizes: [] as string[],
        tags: [] as string[],
        fit: '',
        description: ''
    });

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

    // Config Form State
    const [configForm, setConfigForm] = useState(socialConfig);
    const [lifestyleForm, setLifestyleForm] = useState(lifestyleConfig);

    // Web Design Form State
    const [navForm, setNavForm] = useState<NavbarLink[]>(navbarLinks);
    const [bentoForm, setBentoForm] = useState<BannerBento[]>(bannerBento);

    // Categories Form State
    const [newCategoryName, setNewCategoryName] = useState('');

    const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
    const footwearSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

    // Determine available sizes based on type
    const availableSizes = newProduct.type === 'footwear' ? footwearSizes : clothingSizes;

    const availableTags = ['Nuevo', 'Oferta', 'Importado', 'Premium', 'Limitado'];

    // --- Product Handlers ---
    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newProduct.name) {
            alert('Por favor completa el nombre del producto.');
            return;
        }

        const validImages = newProduct.images.filter(img => img.trim() !== '');

        addProduct({
            id: Date.now().toString(),
            name: newProduct.name,
            price: Number(newProduct.price) || 0,
            originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
            category: newProduct.category || categories[0]?.id || 'Uncategorized',
            type: newProduct.type,
            images: validImages.length > 0 ? validImages : ['https://via.placeholder.com/300'],
            sizes: newProduct.sizes,
            tags: newProduct.tags,
            fit: newProduct.fit,
            isNew: newProduct.tags.includes('Nuevo'),
            description: newProduct.description
        });

        setNewProduct({
            name: '',
            price: '',
            originalPrice: '',
            category: '',
            type: 'clothing',
            images: [''],
            sizes: [],
            tags: [],
            fit: '',
            description: ''
        });
        alert('Producto añadido correctamente');
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
        addBlogPost({
            id: Date.now().toString(),
            title: blogForm.title,
            content: blogForm.content,
            image: blogForm.image || 'https://via.placeholder.com/800x600',
            author: blogForm.author,
            date: new Date().toLocaleDateString(),
            rating: blogForm.rating,
            tag: blogForm.tag
        });
        setBlogForm({ title: '', content: '', image: '', author: 'Admin', rating: 5, tag: 'LIFESTYLE' });
        alert('Post/Testimonio agregado!');
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
        addCategory({ id, name: newCategoryName });
        setNewCategoryName('');
        alert('Categoría agregada');
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
                                <Plus size={24} /> NUEVO PRODUCTO
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
                                            <label className="text-xs font-bold text-gray-500 uppercase">Galería de Imágenes (URL)</label>
                                            <button type="button" onClick={addImageField} className="text-xs text-primary font-bold hover:underline">+ Agregar URL</button>
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
                                    <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-lg hover:bg-gray-200 transition-all uppercase text-sm tracking-widest shadow-lg transform hover:translate-y-[-2px]">
                                        Publicar Producto
                                    </button>
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
                                                        <button onClick={() => deleteProduct(p.id)} className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {items.length === 0 && <p className="text-center text-gray-500 py-4">No hay productos en esta categoría.</p>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}


                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
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

                        <div className="space-y-4" key={orders.map(o => o.id).join(',')}>
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
                )}


                {/* BLOG TAB */}
                {activeTab === 'blog' && (
                    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <header className="border-b border-gray-800 pb-6">
                            <h2 className="text-3xl font-bold mb-2">Blog y Reseñas</h2>
                            <p className="text-gray-400">Gestiona entradas del blog y testimonios de clientes.</p>
                        </header>

                        {/* Add Post Form */}
                        <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-8 shadow-2xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                                <Plus size={24} /> NUEVA ENTRADA / RESEÑA
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
                                        <input type="text" value={blogForm.image} onChange={e => setBlogForm({ ...blogForm, image: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="https://..." />
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
                                <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-lg hover:bg-gray-200 transition-all uppercase text-sm tracking-widest shadow-lg">
                                    Publicar
                                </button>
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
                                            <button onClick={() => deleteBlogPost(post.id)} className="text-red-500 hover:text-red-400 text-xs font-bold uppercase hover:underline">Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {/* CONFIG TAB */}
                {activeTab === 'config' && (
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
                                <label className="text-xs font-bold text-gray-500 uppercase">Texto de Envío (NavBar)</label>
                                <input type="text" value={configForm.shippingText} onChange={e => setConfigForm({ ...configForm, shippingText: e.target.value })} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                            </div>
                            <button onClick={handleConfigSave} className="w-full bg-primary text-white font-black py-4 rounded-lg hover:bg-red-700 transition-all uppercase text-sm tracking-widest shadow-lg mt-4">
                                Guardar Configuración
                            </button>
                        </div>
                    </div>
                )}

                {/* CATEGORIES TAB */}
                {activeTab === 'categories' && (
                    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <header className="border-b border-gray-800 pb-6">
                            <h2 className="text-3xl font-bold mb-2">Gestión de Categorías</h2>
                            <p className="text-gray-400">Crea y elimina categorías para organizar tu tienda.</p>
                        </header>

                        <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-8 shadow-2xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                                <Plus size={24} /> NUEVA CATEGORÍA
                            </h3>
                            <form onSubmit={handleAddCategory} className="flex gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Nombre de Categoría</label>
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={e => setNewCategoryName(e.target.value)}
                                        className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors"
                                        placeholder="Ej. Camperas, Joyería..."
                                    />
                                </div>
                                <button type="submit" className="bg-white text-black font-black px-8 py-3 rounded-lg hover:bg-gray-200 transition-all uppercase text-sm tracking-widest shadow-lg h-[46px]">
                                    AGREGAR
                                </button>
                            </form>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold border-b border-gray-800 pb-2">Categorías Existentes</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {categories.map(cat => (
                                    <div key={cat.id} className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4 flex justify-between items-center group">
                                        <div>
                                            <h4 className="font-bold text-white text-lg">{cat.name}</h4>
                                            <span className="text-xs text-gray-500 font-mono">ID: {cat.id}</span>
                                        </div>
                                        {cat.id !== 'huerfanos' && (
                                            <button
                                                onClick={() => deleteCategory(cat.id)}
                                                className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Eliminar Categoría"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                        {cat.id === 'huerfanos' && (
                                            <span className="text-[10px] bg-red-900/20 text-red-500 px-2 py-1 rounded border border-red-900/30 uppercase font-bold">
                                                Sistema
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* DELIVERY TAB */}
                {activeTab === 'delivery' && (
                    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <header className="border-b border-gray-800 pb-6">
                            <h2 className="text-3xl font-bold mb-2">Zonas de Entrega</h2>
                            <p className="text-gray-400">Configura áreas geográficas y precios de envío automáticos.</p>
                        </header>

                        <DeliveryZoneMap />
                    </div>
                )}

                {/* VISUAL CONFIG TAB (was activeTab === 'hero' previously? No, hero is separate) */}
                {/* HERO TAB */}
                {activeTab === 'hero' && (
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
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Botón</label>
                                                    <input type="text" value={slide.buttonText} onChange={e => updateSlide(slide.id, 'buttonText', e.target.value)} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Subtítulo</label>
                                                <input type="text" value={slide.subtitle} onChange={e => updateSlide(slide.id, 'subtitle', e.target.value)} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
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
                )}

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
