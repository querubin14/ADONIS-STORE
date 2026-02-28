
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { X, Plus, Minus, Trash2, MapPin, Truck, ArrowLeft, User, Map as MapIcon, CheckCircle2 } from 'lucide-react';
import LocationPicker from './LocationPicker';
import { isPointInPolygon } from '../types';
import CustomAlert from './CustomAlert';

const CartDrawer: React.FC = () => {
    const navigate = useNavigate();
    const {
        cart,
        isCartOpen,
        toggleCart,
        updateQuantity,
        updateCartItemSize,
        removeFromCart,
        cartTotal,
        createOrder,
        socialConfig,
        deliveryZones
    } = useShop();

    // Steps: 'cart' -> 'details'
    const [step, setStep] = React.useState<'cart' | 'details'>('cart');
    const [customerData, setCustomerData] = React.useState({ name: '', surname: '' });

    const [showMap, setShowMap] = React.useState(false);
    const [selectedLocation, setSelectedLocation] = React.useState<{ lat: number, lng: number } | null>(null);
    const [shippingCost, setShippingCost] = React.useState(0);
    const [alertConfig, setAlertConfig] = React.useState<{ isOpen: boolean; title: string; message: string }>({
        isOpen: false,
        title: '',
        message: ''
    });

    // Reset step when cart opens/closes
    React.useEffect(() => {
        if (!isCartOpen) {
            setStep('cart');
        } else {
            document.body.style.overflow = 'hidden';
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
        const zone = deliveryZones.find(z => isPointInPolygon(selectedLocation, z.points));
        if (zone) {
            setShippingCost(zone.price);
        } else {
            // Default logic if outside zones (maybe standard price or 0/contact needed)
            setShippingCost(0);
        }
    }, [selectedLocation, deliveryZones]);

    const finalTotal = cartTotal + shippingCost;

    if (!isCartOpen) return null;

    const handleInitialCheckoutClick = () => {
        if (cart.length === 0) return;
        setStep('details');
    };

    const handleFinalCheckout = () => {
        // Validation
        if (!customerData.name.trim() || !customerData.surname.trim()) {
            setAlertConfig({
                isOpen: true,
                title: 'Datos Incompletos',
                message: 'Por favor, completa tu nombre y apellido.'
            });
            return;
        }

        if (!selectedLocation) {
            setAlertConfig({
                isOpen: true,
                title: 'Ubicación Requerida',
                message: 'Por favor, marca tu ubicación en el mapa para calcular el envío.'
            });
            return;
        }

        const orderId = crypto.randomUUID();
        const displayId = Math.floor(1000 + Math.random() * 9000);

        const newOrder: any = {
            id: orderId,
            display_id: displayId,
            product_ids: cart.map(item => item.id),
            customerInfo: {
                name: `${customerData.name} ${customerData.surname}`,
                location: selectedLocation || undefined
            },
            items: cart,
            total_amount: finalTotal,
            delivery_cost: shippingCost,
            status: 'Pendiente',
            created_at: new Date().toLocaleDateString()
        };

        createOrder(newOrder);

        const phoneNumber = socialConfig.whatsapp || "595983840235";
        const formatPrice = (price: number) => price.toLocaleString('es-PY') + ' Gs';
        const previewImage = cart.find(item => item.images && item.images.length > 0 && item.images[0])?.images?.[0];

        const message =
            (previewImage ? `${previewImage}\n\n` : '') +
            `*ADONIS STORE #${displayId}* \n` +
            `Hola! Soy *${customerData.name} ${customerData.surname}* y quiero confirmar mi pedido:\n\n` +
            cart.map(item => {
                const imgLink = item.images && item.images.length > 0 ? `\n🔗 Foto: ${item.images[0]}` : '';
                const colorInfo = item.selectedColor ? ` | Color: ${item.selectedColor}` : '';
                return `▪️ *${item.name}*\n   Cant: ${item.quantity} | Talle: ${item.selectedSize}${colorInfo}\n   Precio: ${formatPrice(item.price * item.quantity)}${imgLink}`;
            }).join('\n\n') +
            `\n\n--------------------------------\n` +
            `*SUBTOTAL:* ${formatPrice(cartTotal)}\n` +
            (shippingCost > 0 ? `*ENVÍO:* ${formatPrice(shippingCost)}\n` : '') +
            `*TOTAL FINAL:* ${formatPrice(finalTotal)}` +
            (selectedLocation ? `\n\n📍 *UBICACIÓN DE ENVÍO:*\nhttps://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}` : '');

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        toggleCart(); // Close cart after checkout
    };

    return (
        <div className="fixed inset-0 z-[9999] flex justify-end">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={toggleCart}
            />

            <div className="relative w-full max-w-md bg-[#0a0a0a] border-l border-gray-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a] z-10">
                    <div className="flex items-center gap-4">
                        {step === 'details' ? (
                            <button onClick={() => setStep('cart')} className="text-gray-400 hover:text-white transition-colors">
                                <ArrowLeft size={24} />
                            </button>
                        ) : (
                            <button onClick={toggleCart} className="md:hidden text-gray-400 hover:text-white">
                                <ArrowLeft size={24} />
                            </button>
                        )}
                        <h2 className="text-xl font-bold tracking-wider uppercase">
                            {step === 'cart' ? `CARRITO (${cart.length})` : 'DATOS DE ENVÍO'}
                        </h2>
                    </div>
                    <button onClick={toggleCart} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {step === 'cart' ? (
                        /* Step 1: Cart Items */
                        <>
                            {cart.length === 0 ? (
                                <div className="text-center text-gray-500 mt-20">
                                    <p>Tu carrito está vacío.</p>
                                    <button
                                        onClick={() => { toggleCart(); navigate('/'); }}
                                        className="mt-4 text-primary hover:underline text-sm font-bold"
                                    >
                                        IR A COMPRAR
                                    </button>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor || 'default'}`} className="flex gap-4 p-4 bg-[#111111] rounded-xl border border-gray-800">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#1a1a1a] shrink-0 border border-gray-800">
                                            <img
                                                src={item.images ? item.images[0] : 'https://via.placeholder.com/150'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="font-bold text-[13px] text-white leading-tight pr-6">{item.name}</h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                                                        className="text-gray-500 hover:text-white transition-colors mt-1"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">{item.category}</p>
                                                {item.selectedColor && <p className="text-gray-400 text-[10px] uppercase mt-0.5">Color: {item.selectedColor}</p>}
                                            </div>

                                            <div className="mt-3">
                                                {item.sizes && item.sizes.length > 0 ? (
                                                    <select
                                                        value={item.selectedSize}
                                                        onChange={(e) => updateCartItemSize(item.id, item.selectedSize, e.target.value, item.selectedColor)}
                                                        className="w-full bg-[#0a0a0a] border border-gray-800 text-white text-xs rounded-md px-3 py-2 outline-none focus:border-white appearance-none cursor-pointer hover:border-gray-600 transition-colors"
                                                    >
                                                        {item.sizes.map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div className="w-full bg-[#0a0a0a] border border-gray-800 text-white text-xs rounded-md px-3 py-2">Único</div>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center mt-4">
                                                <span className="font-mono font-bold text-white text-sm tracking-tight">Gs. {item.price.toLocaleString()}</span>
                                                <div className="flex items-center gap-3 bg-[#0a0a0a] rounded-md px-2 py-1 border border-gray-800">
                                                    <button onClick={() => updateQuantity(item.id, item.selectedSize, -1, item.selectedColor)} className="p-1.5 text-gray-500 hover:text-white transition-colors disabled:opacity-50">
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-xs w-4 text-center font-bold text-white">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.selectedSize, 1, item.selectedColor)} className="p-1.5 text-gray-500 hover:text-white transition-colors">
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </>
                    ) : (
                        /* Step 2: Customer Data & Map */
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">

                            {/* Customer Data */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <User size={14} className="text-primary" /> Datos del Cliente
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nombre *</label>
                                        <input
                                            type="text"
                                            value={customerData.name}
                                            onChange={e => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Tu nombre"
                                            className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white placeholder-gray-600 focus:border-primary focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Apellido *</label>
                                        <input
                                            type="text"
                                            value={customerData.surname}
                                            onChange={e => setCustomerData(prev => ({ ...prev, surname: e.target.value }))}
                                            placeholder="Tu apellido"
                                            className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white placeholder-gray-600 focus:border-primary focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Location Section */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <MapPin size={14} className="text-primary" /> Ubicación de Envío
                                </h3>

                                {!selectedLocation ? (
                                    <button
                                        onClick={() => setShowMap(true)}
                                        className="w-full h-32 border-2 border-dashed border-gray-700 hover:border-primary/50 text-gray-400 hover:text-primary bg-white/5 rounded-xl flex flex-col items-center justify-center gap-3 transition-all group"
                                    >
                                        <div className="p-3 bg-black rounded-full border border-gray-800 group-hover:border-primary/50 transition-colors">
                                            <MapIcon size={24} />
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-sm font-bold uppercase">Marcar en el Mapa</span>
                                            <span className="text-[10px] text-gray-500">Requerido para calcular envío</span>
                                        </div>
                                    </button>
                                ) : (
                                    <div className="bg-white/5 border border-primary/30 rounded-xl p-4 flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-500/10 p-2 rounded-full text-green-500">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold text-white uppercase">Ubicación Lista</span>
                                                <span className="text-[10px] text-gray-400">Coordenadas guardadas</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowMap(true)}
                                            className="text-xs font-bold text-gray-500 hover:text-white underline uppercase"
                                        >
                                            Cambiar
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Order Summary Brief */}
                            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Resumen del Pedido</h3>
                                <div className="space-y-3 pb-4 border-b border-gray-800">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Productos ({cart.length})</span>
                                        <span className="text-white font-mono">Gs. {cartTotal.toLocaleString()}</span>
                                    </div>
                                    {selectedLocation && (
                                        <div className="flex justify-between text-sm animate-in fade-in">
                                            <span className="text-gray-400">Costo de Envío</span>
                                            <span className="text-white font-mono font-bold">
                                                {shippingCost > 0 ? `Gs. ${shippingCost.toLocaleString()}` : 'A convenir'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-sm font-bold text-white uppercase">Total</span>
                                    <span className="text-xl text-primary font-black font-mono">Gs. {finalTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {cart.length > 0 && (
                    <div className="p-6 border-t border-gray-800 bg-[#0a0a0a] z-10">
                        {step === 'cart' ? (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-200 font-bold uppercase">Subtotal</span>
                                    <span className="text-2xl text-primary font-black font-mono">Gs. {cartTotal.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={handleInitialCheckoutClick}
                                    className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-sm tracking-widest transition-all uppercase flex items-center justify-center gap-2"
                                >
                                    CONTINUAR COMPRA
                                </button>
                                <button
                                    onClick={() => { toggleCart(); navigate('/'); }}
                                    className="w-full mt-3 bg-transparent border border-gray-800 hover:border-gray-500 text-gray-400 hover:text-white py-3 rounded-sm tracking-widest transition-all uppercase flex items-center justify-center gap-2 text-xs font-bold"
                                >
                                    SEGUIR COMPRANDO
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleFinalCheckout}
                                    className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-sm tracking-widest transition-all uppercase flex items-center justify-center gap-2 shadow-lg"
                                >
                                    CONFIRMAR PEDIDO
                                </button>
                                <p className="text-center text-[10px] text-gray-500 mt-4 max-w-[80%] mx-auto leading-tight">
                                    El pedido se enviará a través de WhatsApp para confirmar detalles con un asesor.
                                </p>
                            </>
                        )}
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
                        setShowMap(false);
                    }}
                />
            )}

            <CustomAlert
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                title={alertConfig.title}
                message={alertConfig.message}
            />
        </div>
    );
};

export default CartDrawer;
