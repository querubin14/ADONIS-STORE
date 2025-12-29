
import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Plus, Minus, Trash2, MapPin, Truck, ArrowLeft } from 'lucide-react';
import LocationPicker from './LocationPicker';
import { isPointInPolygon } from '../types';

const CartDrawer: React.FC = () => {
    const {
        cart,
        isCartOpen,
        toggleCart,
        updateQuantity,
        updateCartItemSize, // Consume new function
        removeFromCart,
        cartTotal,
        createOrder,
        socialConfig,
        deliveryZones
    } = useShop();

    const [showMap, setShowMap] = React.useState(false);
    const [selectedLocation, setSelectedLocation] = React.useState<{ lat: number, lng: number } | null>(null);
    const [shippingCost, setShippingCost] = React.useState(0);

    // Lock Body Scroll when Cart is Open
    React.useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    // Recalculate shipping when location changes
    React.useEffect(() => {
        if (!selectedLocation || deliveryZones.length === 0) {
            setShippingCost(0);
            return;
        }

        // Find which zone the user is in
        const zone = deliveryZones.find(z => isPointInPolygon(selectedLocation, z.points));
        if (zone) {
            setShippingCost(zone.price);
        } else {
            // Default logic if outside zones (maybe standard price or 0/contact needed)
            // For now let's set 0 (A convenir)
            setShippingCost(0);
        }
    }, [selectedLocation, deliveryZones]);

    const finalTotal = cartTotal + shippingCost;

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        const orderId = crypto.randomUUID();
        const displayId = Math.floor(1000 + Math.random() * 9000); // Simple ID for display

        const newOrder: any = { // Temporary any to bridge types while refactoring
            id: orderId,
            display_id: displayId,
            product_ids: cart.map(item => item.id), // Storing Product IDs
            customerInfo: {
                location: selectedLocation || undefined
            },
            items: cart, // Storing full cart items for local UI
            total_amount: finalTotal,
            delivery_cost: shippingCost,
            status: 'Pendiente',
            created_at: new Date().toLocaleDateString()
        };

        createOrder(newOrder);

        // WhatsApp Checkout Logic
        const phoneNumber = socialConfig.whatsapp || "595983840235";

        // Helper for formatting currency
        const formatPrice = (price: number) => price.toLocaleString('es-PY') + ' Gs';

        const message = `*NUEVO PEDIDO SAVAGE #${displayId}* \n\n` +
            cart.map(item => {
                const imgLink = item.images && item.images.length > 0 ? `\n🖼️ Ver foto: ${item.images[0]}` : '';
                return `▪️ *${item.name}*\n   Cant: ${item.quantity} | Talle: ${item.selectedSize}\n   Precio: ${formatPrice(item.price * item.quantity)}${imgLink}`;
            }).join('\n\n') +
            `\n\n--------------------------------\n` +
            `*SUBTOTAL:* ${formatPrice(cartTotal)}\n` +
            (shippingCost > 0 ? `*ENVÍO:* ${formatPrice(shippingCost)}\n` : '') +
            `*TOTAL FINAL:* ${formatPrice(finalTotal)}` +
            (selectedLocation ? `\n\n📍 *UBICACIÓN DE ENVÍO:*\nhttps://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}` : '');

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[9999] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={toggleCart}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-[#0a0a0a] border-l border-gray-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a]">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleCart} className="md:hidden text-gray-400 hover:text-white">
                            <ArrowLeft size={24} />
                        </button>
                        <h2 className="text-xl font-bold tracking-wider">CARRITO ({cart.length})</h2>
                    </div>
                    <button onClick={toggleCart} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-500 mt-20">
                            <p>Tu carrito está vacío.</p>
                            <button
                                onClick={toggleCart}
                                className="mt-4 text-primary hover:underline text-sm font-bold"
                            >
                                IR A COMPRAR
                            </button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 p-3 bg-white/5 rounded-lg border border-white/5">
                                <img
                                    src={item.images ? item.images[0] : 'https://via.placeholder.com/150'}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-md"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-sm">{item.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                                            className="text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <p className="text-accent-gray text-xs mb-2">{item.category}</p>

                                    {/* Size Selector */}
                                    <div className="mb-3">
                                        {item.sizes && item.sizes.length > 0 && (
                                            <select
                                                value={item.selectedSize}
                                                onChange={(e) => updateCartItemSize(item.id, item.selectedSize, e.target.value)}
                                                className="bg-black border border-gray-700 text-white text-xs rounded px-2 py-1 outline-none focus:border-white"
                                            >
                                                {item.sizes.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        )}
                                        {(!item.sizes || item.sizes.length === 0) && (
                                            <span className="text-xs text-gray-400">One Size</span>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="font-mono font-bold">Gs. {item.price.toLocaleString()}</span>
                                        <div className="flex items-center gap-3 bg-black rounded-lg px-2 py-1 border border-gray-800">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                                                className="p-1 hover:text-primary transition-colors disabled:opacity-50"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                                                className="p-1 hover:text-primary transition-colors"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t border-gray-800 bg-[#0a0a0a]">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-400">Total Productos</span>
                            <span className="text-xl font-bold font-mono">Gs. {cartTotal.toLocaleString()}</span>
                        </div>
                        {selectedLocation && (
                            <div className="flex justify-between items-center mb-6 animate-in fade-in">
                                <span className="text-gray-400 flex items-center gap-2"><Truck size={16} /> Costo de Envío</span>
                                {shippingCost > 0 ? (
                                    <span className="text-white font-bold font-mono">Gs. {shippingCost.toLocaleString()}</span>
                                ) : (
                                    <span className="text-yellow-500 font-bold text-xs uppercase">A convenir / Fuera de Zona</span>
                                )}
                            </div>
                        )}
                        <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-800">
                            <span className="text-gray-200 font-bold uppercase">Total a Pagar</span>
                            <span className="text-2xl text-primary font-black font-mono">Gs. {finalTotal.toLocaleString()}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-sm tracking-widest transition-all uppercase flex items-center justify-center gap-2"
                        >
                            CONFIRMAR PEDIDO
                        </button>

                        <div className="mt-4">
                            {!selectedLocation ? (
                                <button
                                    onClick={() => setShowMap(true)}
                                    className="w-full border border-gray-700 hover:border-white text-gray-400 hover:text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all text-sm font-bold uppercase"
                                >
                                    <MapPin size={16} /> Marcar Ubicación de Envío
                                </button>
                            ) : (
                                <div className="bg-white/5 border border-green-500/30 rounded-lg p-3 flex justify-between items-center group">
                                    <div className="flex items-center gap-2 text-green-500">
                                        <MapPin size={16} />
                                        <span className="text-xs font-bold uppercase">Ubicación Marcada</span>
                                    </div>
                                    <button onClick={() => setShowMap(true)} className="text-xs text-gray-500 hover:text-white underline">
                                        Cambiar
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            El pedido se enviará a través de WhatsApp para confirmar detalles.
                        </p>
                    </div>
                )}
            </div>

            {/* Location Picker Modal */}
            {showMap && (
                <LocationPicker
                    onClose={() => setShowMap(false)}
                    initialLocation={selectedLocation || undefined}
                    onLocationSelect={(lat, lng) => {
                        setSelectedLocation({ lat, lng });
                    }}
                />
            )}
        </div>
    );
};

export default CartDrawer;
