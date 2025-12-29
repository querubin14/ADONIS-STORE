import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase/client';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, useMap, Polyline } from 'react-leaflet';
import { useShop } from '../context/ShopContext';
import { DeliveryZone } from '../types';
import { Trash2, Plus, Save, Edit2, X, MousePointer2, PenTool, Eraser, Brush, Palette } from 'lucide-react';
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icons using CDN
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- GEOMETRY HELPERS ---

const getSqDist = (p1: { lat: number, lng: number }, p2: { lat: number, lng: number }) => {
    const dx = p1.lat - p2.lat;
    const dy = p1.lng - p2.lng;
    return dx * dx + dy * dy;
}

const getSqSegDist = (p: { lat: number, lng: number }, p1: { lat: number, lng: number }, p2: { lat: number, lng: number }) => {
    let x = p1.lat, y = p1.lng, dx = p2.lat - x, dy = p2.lng - y;
    if (dx !== 0 || dy !== 0) {
        const t = ((p.lat - x) * dx + (p.lng - y) * dy) / (dx * dx + dy * dy);
        if (t > 1) {
            x = p2.lat;
            y = p2.lng;
        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }
    dx = p.lat - x;
    dy = p.lng - y;
    return dx * dx + dy * dy;
}

const simplifyPoints = (points: { lat: number, lng: number }[], sqTolerance: number) => {
    const len = points.length;
    if (len < 3) return points;

    const markers = new Uint8Array(len);
    let first = 0;
    let last = len - 1;
    const stack = [first, last];
    let index = 0;
    let maxSqDist = 0;

    markers[first] = markers[last] = 1;

    while (stack.length) {
        last = stack.pop()!;
        first = stack.pop()!;
        maxSqDist = 0;

        for (let i = first + 1; i < last; i++) {
            const sqDist = getSqSegDist(points[i], points[first], points[last]);
            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (maxSqDist > sqTolerance) {
            markers[index] = 1;
            stack.push(first, index, index, last);
        }
    }

    return points.filter((_, i) => markers[i]);
};

// --- COMPONENTS ---

const MapFixer = () => {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => { map.invalidateSize(); }, 400);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
};

// Color Palette
const COLORS = [
    { name: 'Savage Red', hex: '#dc2626' },
    { name: 'Ocean Blue', hex: '#2563eb' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Purple', hex: '#7c3aed' },
    { name: 'Amber', hex: '#d97706' },
    { name: 'Pink', hex: '#db2777' },
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Lime', hex: '#84cc16' },
    { name: 'Fuchsia', hex: '#d946ef' },
    { name: 'Indigo', hex: '#4f46e5' },
    { name: 'Rose', hex: '#e11d48' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Teal', hex: '#14b8a6' },
    { name: 'Violet', hex: '#8b5cf6' },
    { name: 'Sky', hex: '#0ea5e9' },
    { name: 'Yellow', hex: '#eab308' },
];

// Basic Point-In-Polygon check (Ray Casting)
const isPointInPoly = (pt: LatLng, poly: { lat: number, lng: number }[]) => {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i].lat, yi = poly[i].lng;
        const xj = poly[j].lat, yj = poly[j].lng;
        const intersect = ((yi > pt.lng) !== (yj > pt.lng))
            && (pt.lat < (xj - xi) * (pt.lng - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

const InteractableMapArea: React.FC<{
    points: { lat: number, lng: number }[],
    tool: 'pointer' | 'lasso' | 'eraser' | 'brush',
    onUpdatePoints: (points: { lat: number, lng: number }[]) => void,
    otherZones: DeliveryZone[]
}> = ({ points, tool, onUpdatePoints, otherZones }) => {
    const map = useMap();
    const [isDragging, setIsDragging] = useState(false);
    const [cursorPos, setCursorPos] = useState<LatLng | null>(null);
    const lastMousePos = useRef<LatLng | null>(null);

    // Tools Config
    const BRUSH_RADIUS = 0.006; // Radius for Brush/Eraser
    const SQ_BRUSH_RADIUS = BRUSH_RADIUS * BRUSH_RADIUS;

    // Disable map dragging when using drawing tools
    useEffect(() => {
        const disableTools = ['lasso', 'eraser', 'brush'];
        if (disableTools.includes(tool)) {
            map.dragging.disable();
            map.scrollWheelZoom.disable();
            map.getContainer().style.cursor = 'none'; // We render custom cursor
        } else {
            map.dragging.enable();
            map.scrollWheelZoom.enable();
            map.getContainer().style.cursor = '';
        }
        return () => {
            map.dragging.enable();
            map.scrollWheelZoom.enable();
            map.getContainer().style.cursor = '';
        };
    }, [tool, map]);

    const processingRef = useRef(false);

    useMapEvents({
        mousedown(e) {
            if (tool !== 'pointer') {
                L.DomEvent.stopPropagation(e.originalEvent);
                setIsDragging(true);
                lastMousePos.current = e.latlng;

                if (tool === 'lasso') {
                    // Only prompt if we have a lot of points (existing zone)
                    // If points is small, just assume overwrite
                    if (points.length > 10 && !window.confirm("¿Dibujar nueva zona? Esto reemplazará la actual.")) {
                        setIsDragging(false);
                        return;
                    }
                    onUpdatePoints([{ lat: e.latlng.lat, lng: e.latlng.lng }]);
                } else if (tool === 'eraser') {
                    eraseNear(e.latlng);
                } else if (tool === 'brush') {
                    applyBrush(e.latlng);
                }
            }
        },
        mousemove(e) {
            setCursorPos(e.latlng);
            if (!isDragging) return;

            // Throttle
            if (processingRef.current) return;
            processingRef.current = true;

            requestAnimationFrame(() => {
                const currentPos = e.latlng;

                if (tool === 'lasso') {
                    onUpdatePoints([...points, { lat: currentPos.lat, lng: currentPos.lng }]);
                } else if (tool === 'eraser') {
                    eraseNear(currentPos);
                } else if (tool === 'brush') {
                    // Calculate delta if possible
                    if (lastMousePos.current) {
                        applyBrush(currentPos, lastMousePos.current);
                    }
                    lastMousePos.current = currentPos;
                }

                processingRef.current = false;
            });
        },
        mouseup() {
            if (isDragging) {
                setIsDragging(false);
                lastMousePos.current = null;
                if (tool === 'lasso') {
                    const simplified = simplifyPoints(points, 0.00005);
                    onUpdatePoints(simplified);
                }
                // Optional: Simplify after brush? Maybe not, preserves detail.
                if (tool === 'brush') {
                    // Check for self-intersection or clean up? 
                    // Just simplify slightly to keep point count sane
                    const simplified = simplifyPoints(points, 0.00001);
                    if (simplified.length < points.length) onUpdatePoints(simplified);
                }
            }
        },
        mouseout() {
            setCursorPos(null);
            setIsDragging(false);
        }
    });

    const eraseNear = (latlng: LatLng) => {
        const newPoints = points.filter(p => {
            const dist = (p.lat - latlng.lat) ** 2 + (p.lng - latlng.lng) ** 2;
            return dist > SQ_BRUSH_RADIUS;
        });
        if (newPoints.length !== points.length) {
            onUpdatePoints(newPoints);
        }
    };

    const applyBrush = (current: LatLng, previous?: LatLng) => {
        let newPoints = [...points];

        // 1. DYNAMIC SUBDIVISION: Inject points in long segments near the brush
        // This ensures we have vertices to move "like dough"
        const subdivided: typeof points = [];
        for (let i = 0; i < newPoints.length; i++) {
            const p1 = newPoints[i];
            const p2 = newPoints[(i + 1) % newPoints.length];
            subdivided.push(p1);

            // Check if segment is close to cursor
            const dist1 = (p1.lat - current.lat) ** 2 + (p1.lng - current.lng) ** 2;
            const dist2 = (p2.lat - current.lat) ** 2 + (p2.lng - current.lng) ** 2;

            // If either point is near, or we simply want to be dense:
            // Let's split if length is large implies lack of detail
            // And we are close.
            if (dist1 < SQ_BRUSH_RADIUS * 2 || dist2 < SQ_BRUSH_RADIUS * 2) {
                const segLen = (p1.lat - p2.lat) ** 2 + (p1.lng - p2.lng) ** 2;
                if (segLen > 0.00001) { // Split
                    subdivided.push({
                        lat: (p1.lat + p2.lat) / 2,
                        lng: (p1.lng + p2.lng) / 2
                    });
                }
            }
        }
        newPoints = subdivided;

        // 2. MOVE POINTS WITH COLLISION
        if (previous) {
            const deltaLat = current.lat - previous.lat;
            const deltaLng = current.lng - previous.lng;

            newPoints = newPoints.map(p => {
                const dist = (p.lat - current.lat) ** 2 + (p.lng - current.lng) ** 2;
                if (dist < SQ_BRUSH_RADIUS) {
                    // Candidate new position
                    const candidate = { lat: p.lat + deltaLat, lng: p.lng + deltaLng };

                    // COLLISION CHECK: Is candidate inside any OTHER zone?
                    let isCollision = false;
                    for (const zone of otherZones) {
                        // Optimization: Quick bbox check first? 
                        // Just run point in poly for now, sufficient for <10 zones
                        if (isPointInPoly(candidate as LatLng, zone.points)) {
                            isCollision = true;
                            // SNAP: If collision, keep old point? 
                            // Better: Project to edge? Too complex for JS loop.
                            // Simply: Don't move if collides. Acts like a wall.
                            break;
                        }
                    }

                    if (!isCollision) {
                        return candidate;
                    } else {
                        return p; // Hit a wall, stay put.
                    }
                }
                return p;
            });
        }

        onUpdatePoints(newPoints);
    };

    // Calculate midpoints for handles
    const midpoints = React.useMemo(() => {
        if (tool !== 'pointer' || points.length < 3) return [];
        if (points.length > 300) return [];
        return points.map((p, i) => {
            const nextP = points[(i + 1) % points.length];
            return {
                lat: (p.lat + nextP.lat) / 2,
                lng: (p.lng + nextP.lng) / 2,
                insertIndex: i + 1
            };
        });
    }, [points, tool]);

    return (
        <>
            {/* Custom Cursors */}
            {cursorPos && (tool === 'eraser' || tool === 'brush') && (
                <Marker
                    position={cursorPos}
                    icon={L.divIcon({
                        className: 'tool-cursor',
                        html: `<div style="
                            width: 30px; 
                            height: 30px; 
                            border: 2px solid ${tool === 'brush' ? '#3b82f6' : 'red'}; 
                            background: ${tool === 'brush' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 0, 0, 0.2)'}; 
                            border-radius: 50%;
                            transform: translate(-50%, -50%);
                            pointer-events: none;
                        "></div>`,
                        iconSize: [0, 0]
                    })}
                    zIndexOffset={1000}
                    interactive={false}
                />
            )}

            {points.length > 0 && (
                <Polygon
                    positions={points}
                    pathOptions={{
                        color: tool === 'eraser' ? '#ef4444' : (tool === 'brush' ? '#3b82f6' : '#3b82f6'),
                        weight: 2,
                        dashArray: tool === 'lasso' ? '5,5' : undefined,
                        fillOpacity: 0.2,
                        interactive: false
                    }}
                />
            )}

            {tool === 'lasso' && isDragging && points.length > 0 && (
                <Polyline positions={points} pathOptions={{ color: '#3b82f6', weight: 2, interactive: false }} />
            )}

            {tool === 'pointer' && (
                <>
                    {points.map((pt, idx) => (
                        <Marker
                            key={`v-${idx}`}
                            position={pt}
                            draggable={true}
                            icon={L.divIcon({
                                className: 'custom-div-icon',
                                html: `<div style="background-color: white; width: 10px; height: 10px; border-radius: 50%; border: 2px solid black; box-shadow: 0 1px 2px rgba(0,0,0,0.3);"></div>`,
                                iconSize: [10, 10],
                                iconAnchor: [5, 5]
                            })}
                            eventHandlers={{
                                dragend: (e) => {
                                    const newPoints = [...points];
                                    const ll = e.target.getLatLng();
                                    newPoints[idx] = { lat: ll.lat, lng: ll.lng };
                                    onUpdatePoints(newPoints);
                                },
                                contextmenu: () => {
                                    const newPoints = points.filter((_, i) => i !== idx);
                                    onUpdatePoints(newPoints);
                                }
                            }}
                        />
                    ))}
                    {midpoints.map((pt, idx) => (
                        <Marker
                            key={`m-${idx}`}
                            position={pt}
                            draggable={true}
                            opacity={0.6}
                            icon={L.divIcon({
                                className: 'midpoint-div-icon',
                                html: `<div style="background-color: transparent; width: 8px; height: 8px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.5); box-shadow: 0 1px 2px rgba(0,0,0,0.1);"></div>`,
                                iconSize: [8, 8],
                                iconAnchor: [4, 4]
                            })}
                            eventHandlers={{
                                dragstart: (e: any) => e.target.setOpacity(1),
                                dragend: (e) => {
                                    const ll = e.target.getLatLng();
                                    const newPoints = [...points];
                                    newPoints.splice(pt.insertIndex, 0, { lat: ll.lat, lng: ll.lng });
                                    onUpdatePoints(newPoints);
                                }
                            }}
                        />
                    ))}
                </>
            )}
        </>
    );
};

const DeliveryZoneMap: React.FC = () => {
    const { deliveryZones, addDeliveryZone, deleteDeliveryZone, updateDeliveryZone } = useShop();

    const [mode, setMode] = useState<'view' | 'create' | 'edit' | 'import'>('view');
    const [activeTool, setActiveTool] = useState<'pointer' | 'lasso' | 'eraser' | 'brush'>('pointer');

    // Editor State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentPoints, setCurrentPoints] = useState<{ lat: number, lng: number }[]>([]);
    const [zoneName, setZoneName] = useState('');
    const [zonePrice, setZonePrice] = useState('');
    const [zoneColor, setZoneColor] = useState(COLORS[0].hex);

    // Import State
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // --- Actions ---

    const startCreating = () => {
        setMode('create');
        setCurrentPoints([]);
        setZoneName('');
        setZonePrice('');
        setZoneColor(COLORS[0].hex);
        setEditingId(null);
        setActiveTool('lasso');
    };

    const startEditing = (zone: DeliveryZone) => {
        setMode('edit');
        setEditingId(zone.id);
        setCurrentPoints([...zone.points]);
        setZoneName(zone.name);
        setZonePrice(zone.price.toString());
        setZoneColor(zone.color || COLORS[0].hex);
        setActiveTool('pointer');
    };

    const startImporting = () => {
        setMode('import');
        setSearchQuery('');
        setZoneName('');
        setZonePrice('');
        setZoneColor('#3b82f6');
        setCurrentPoints([]);
    };

    const handleUpdatePoints = (newPoints: { lat: number, lng: number }[]) => {
        setCurrentPoints(newPoints);
    };

    const fetchCityBoundary = async () => {
        if (!searchQuery) return;
        setIsSearching(true);
        try {
            const query = searchQuery.toLowerCase().includes('paraguay') ? searchQuery : `${searchQuery}, Paraguay`;
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&polygon_geojson=1&limit=1`);
            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                const geojson = result.geojson;
                let points: { lat: number, lng: number }[] = [];

                if (geojson.type === 'Polygon') {
                    points = geojson.coordinates[0].map((c: any) => ({ lat: c[1], lng: c[0] }));
                } else if (geojson.type === 'MultiPolygon') {
                    // Get largest
                    let max: any[] = [];
                    geojson.coordinates.forEach((p: any) => {
                        if (p[0].length > max.length) max = p[0];
                    });
                    points = max.map((c: any) => ({ lat: c[1], lng: c[0] }));
                }

                if (points.length > 2) {
                    const simplified = simplifyPoints(points, 0.00005);
                    setCurrentPoints(simplified);
                    setZoneName(result.display_name.split(',')[0]);
                } else {
                    alert('No se pudo obtener el límite.');
                }
            } else {
                alert('Ciudad no encontrada.');
            }
        } catch (e) {
            console.error(e);
            alert('Error de conexión.');
        } finally {
            setIsSearching(false);
        }
    };

    // --- FUNCIÓN DE GUARDADO CONECTADA A SUPABASE ---
    const handleSave = async () => {
        // 1. Validaciones básicas
        if (!zoneName || !zonePrice || currentPoints.length < 3) {
            alert('⚠️ Completa el nombre, el precio y dibuja una zona válida (mínimo 3 puntos).');
            return;
        }

        const isNew = !editingId;
        const priceNum = Number(zonePrice);

        try {
            // 2. Preparar los datos para la base de datos
            const payload = {
                name: zoneName,
                price: priceNum,
                coordinates: currentPoints, // Se guarda como JSON automáticamente
                color: zoneColor,
                active: true
            };

            let savedData;

            if (isNew) {
                // A) CREAR NUEVA ZONA (INSERT)
                const { data, error } = await supabase
                    .from('delivery_zones')
                    .insert([payload])
                    .select()
                    .single();

                if (error) throw error;
                savedData = data;

            } else {
                // B) ACTUALIZAR ZONA EXISTENTE (UPDATE)
                const { data, error } = await supabase
                    .from('delivery_zones')
                    .update(payload)
                    .eq('id', editingId)
                    .select()
                    .single();

                if (error) throw error;
                savedData = data;
            }

            // 3. Actualizar la interfaz visual (Contexto)
            const zoneForState: DeliveryZone = {
                id: savedData.id, // Usamos el ID real de la base de datos (UUID)
                name: savedData.name,
                price: savedData.price,
                points: savedData.coordinates, // Supabase devuelve JSON, JS lo lee como objeto
                color: savedData.color || zoneColor
            };

            if (isNew) {
                addDeliveryZone(zoneForState);
            } else {
                updateDeliveryZone(zoneForState);
            }

            // 4. Éxito
            alert("✅ ¡Zona guardada en la Nube correctamente!");
            reset();

        } catch (error: any) {
            console.error("Error crítico al guardar:", error);
            alert("❌ Error al guardar en base de datos: " + (error.message || error));
        }
    };

    const reset = () => {
        setMode('view');
        setCurrentPoints([]);
        setEditingId(null);
        setSearchQuery('');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
            {/* Sidebar */}
            <div className="md:col-span-1 bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 h-full flex flex-col">
                <h3 className="text-xl font-bold mb-2 text-white">Zonas de Entrega</h3>

                {mode === 'view' ? (
                    <div className="space-y-4">
                        <p className="text-xs text-gray-500">Gestiona precios y áreas de entrega.</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={startImporting} className="col-span-2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg text-xs font-bold uppercase border border-white/5 flex items-center justify-center gap-2">✨ Auto-Ciudad</button>
                            <button onClick={startCreating} className="col-span-2 bg-primary hover:bg-red-700 text-white p-3 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-2"><Plus size={16} /> Crear Manual</button>
                        </div>

                        <div className="flex-1 overflow-y-auto mt-4 space-y-2 border-t border-gray-800 pt-4 max-h-[400px]">
                            {deliveryZones.map(z => (
                                <div key={z.id} className="flex justify-between items-center p-3 bg-white/5 rounded border border-gray-800 hover:border-gray-600">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: z.color }}></div>
                                        <div>
                                            <div className="font-bold text-sm text-white">{z.name}</div>
                                            <div className="text-xs text-gray-400">Gs. {z.price.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => startEditing(z)} className="p-1 hover:text-white text-gray-400"><Edit2 size={14} /></button>
                                        <button onClick={() => deleteDeliveryZone(z.id)} className="p-1 hover:text-red-500 text-gray-400"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-left-4 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-primary font-bold uppercase text-sm">{mode === 'import' ? 'Importar' : (mode === 'create' ? 'Nueva Zona' : 'Editar Zona')}</h4>
                            <button onClick={reset} className="text-gray-500 hover:text-white"><X size={16} /></button>
                        </div>

                        {mode === 'import' && (
                            <div className="mb-4">
                                <div className="flex gap-2 mb-2">
                                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchCityBoundary()} placeholder="Buscar ciudad..." className="bg-black border border-gray-700 rounded p-2 text-xs w-full text-white" />
                                    <button onClick={fetchCityBoundary} disabled={isSearching} className="bg-blue-600 text-white p-2 rounded">{isSearching ? '...' : '🔍'}</button>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {['Asuncion', 'Luque', 'San Lorenzo', 'Lambare', 'Limpio', 'Capiata'].map(c => (
                                        <button key={c} onClick={() => { setSearchQuery(c); setTimeout(fetchCityBoundary, 100) }} className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300 hover:bg-white/20">{c}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4 flex-1">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Nombre</label>
                                <input value={zoneName} onChange={e => setZoneName(e.target.value)} className="w-full bg-black border border-gray-700 text-white p-2 rounded text-sm" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Precio</label>
                                <input type="number" value={zonePrice} onChange={e => setZonePrice(e.target.value)} className="w-full bg-black border border-gray-700 text-white p-2 rounded text-sm" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Color de Zona</label>
                                <div className="flex gap-2 flex-wrap">
                                    {COLORS.map(c => (
                                        <button
                                            key={c.hex}
                                            onClick={() => setZoneColor(c.hex)}
                                            className={`w-6 h-6 rounded-full border-2 transition-all ${zoneColor === c.hex ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                            style={{ backgroundColor: c.hex }}
                                            title={c.name}
                                        />
                                    ))}
                                    {/* Custom Color Picker */}
                                    <div className="relative group">
                                        <input
                                            type="color"
                                            value={zoneColor}
                                            onChange={(e) => setZoneColor(e.target.value)}
                                            className="w-8 h-8 p-0 border-0 rounded-full overflow-hidden opacity-0 absolute inset-0 cursor-pointer"
                                        />
                                        <div
                                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-transparent transition-all ${!COLORS.some(c => c.hex === zoneColor) ? 'border-white' : 'border-gray-600'}`}
                                            style={{ background: !COLORS.some(c => c.hex === zoneColor) ? zoneColor : 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}
                                            title="Color Personalizado"
                                        >
                                            <Palette size={14} className="text-white drop-shadow-md mix-blend-difference" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-800 flex gap-2">
                            <button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold uppercase text-xs flex justify-center gap-2"><Save size={14} /> Guardar</button>
                            <button onClick={reset} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded font-bold uppercase text-xs">Cancelar</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Map */}
            <div className="md:col-span-2 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 relative shadow-2xl">
                <MapContainer center={[-25.2637, -57.5759]} zoom={11} style={{ width: '100%', height: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                    <MapFixer />

                    {/* View Zones */}
                    {deliveryZones.map(z => {
                        if (z.id === editingId) return null;
                        return (
                            <Polygon key={z.id} positions={z.points} pathOptions={{ color: z.color, fillOpacity: 0.2, weight: 1 }} />
                        );
                    })}

                    {/* Active Editor */}
                    {(mode !== 'view') && (
                        <InteractableMapArea
                            points={currentPoints}
                            tool={activeTool}
                            onUpdatePoints={handleUpdatePoints}
                            otherZones={deliveryZones.filter(z => z.id !== editingId)}
                        />
                    )}
                </MapContainer>

                {/* Floating Toolbar */}
                {(mode !== 'view') && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-black/90 text-white p-2 rounded-full border border-gray-700 shadow-2xl flex gap-2">
                        <button
                            onClick={() => setActiveTool('pointer')}
                            className={`p-2 rounded-full transition-all ${activeTool === 'pointer' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                            title="Mover y Ajustar"
                        >
                            <MousePointer2 size={18} />
                        </button>
                        <button
                            onClick={() => setActiveTool('brush')}
                            className={`p-2 rounded-full transition-all ${activeTool === 'brush' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                            title="Pincel (Expandir)"
                        >
                            <Brush size={18} />
                        </button>
                        <button
                            onClick={() => setActiveTool('lasso')}
                            className={`p-2 rounded-full transition-all ${activeTool === 'lasso' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                            title="Dibujo Nuevo (Reemplazar)"
                        >
                            <PenTool size={18} />
                        </button>
                        <button
                            onClick={() => setActiveTool('eraser')}
                            className={`p-2 rounded-full transition-all ${activeTool === 'eraser' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                            title="Borrador de Puntos"
                        >
                            <Eraser size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryZoneMap;
