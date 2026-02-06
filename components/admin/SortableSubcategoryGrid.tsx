
import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Product } from '../../types';
import { Trash2, Edit } from 'lucide-react';

interface SortableProductItemProps {
    product: Product;
    onEdit: (p: Product) => void;
    onDelete: (id: string) => void;
}

const SortableProductItem: React.FC<SortableProductItemProps> = ({ product, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: product.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1
    };

    // Sort inventory stock pill logic
    const sortedInventory = product.inventory && product.inventory.length > 0
        ? [...product.inventory].sort((a, b) => {
            const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
            const aIdx = sizes.indexOf(a.size);
            const bIdx = sizes.indexOf(b.size);
            if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
            return a.size.localeCompare(b.size);
        })
        : [];

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-[#0F0F0F] rounded-lg p-3 flex gap-3 border border-gray-800 shadow-sm relative group hover:border-gray-600 transition-all hover:translate-y-[-2px] touch-none"
        >
            {/* Drag Handle Overlay (optional, or whole card is handle via attributes) */}
            {/* Use a drag handle to avoid conflict with clicks? */}
            {/* Usually better to have specific handle or ensure buttons preventDefault */}

            <div
                className="absolute top-2 left-2 z-20 cursor-grab active:cursor-grabbing p-1 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                {...attributes}
                {...listeners}
            >
                <span className="material-symbols-outlined text-white text-xs">drag_indicator</span>
            </div>

            {/* Image */}
            <div className="w-20 h-24 bg-gray-900 rounded overflow-hidden shrink-0 border border-gray-800">
                <img src={product.images[0]} alt="" className="w-full h-full object-cover pointer-events-none" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-between pointer-events-auto">
                <div>
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-white leading-tight truncate pr-6" title={product.name}>{product.name}</h4>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-black text-blue-500 uppercase">ADMIN</span>
                        <span className="text-[9px] font-bold text-green-500 bg-green-900/10 px-1.5 py-0.5 rounded border border-green-900/30">ACTIVE</span>
                        {product.isNew && <span className="text-[9px] font-bold text-purple-400 bg-purple-900/10 px-1.5 py-0.5 rounded border border-purple-900/30">NEW</span>}
                    </div>

                    <p className="text-[9px] text-gray-600 font-mono mt-1 truncate">ID: {product.id.slice(-6).toUpperCase()}</p>
                </div>

                {/* Stock Pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {sortedInventory.length > 0 ? (
                        sortedInventory.map(inv => (
                            <div key={inv.size} className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded border ${inv.quantity > 0 ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-red-900/10 border-red-900/30 text-red-500'}`}>
                                <span className="text-[10px] font-bold">{inv.size}</span>
                                <span className={`text-[10px] font-mono ${inv.quantity > 0 ? 'text-green-400' : 'text-red-500'}`}>{inv.quantity}</span>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded border bg-gray-800 border-gray-700 text-gray-300">
                            <span className="text-[10px] font-bold">Total</span>
                            <span className={`text-[10px] font-mono ${product.stock && product.stock > 0 ? 'text-green-400' : 'text-red-500'}`}>{product.stock || 0}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions & Price */}
            <div className="absolute top-3 right-3 flex flex-col items-end gap-2 pointer-events-auto">
                <span className="bg-gray-900 text-gray-300 text-[10px] font-mono px-2 py-1 rounded border border-gray-800 font-bold">
                    Gs. {(product.price).toLocaleString('es-PY')}
                </span>

                <div className="flex gap-1 mt-auto pt-4 md:pt-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F0F0F]/80 backdrop-blur-sm rounded-lg p-1 z-30">
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(product); }}
                        className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                    >
                        <Edit size={12} />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(product.id); }}
                        className="p-1.5 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded-full transition-colors"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
};

interface SortableSubcategoryGridProps {
    products: Product[];
    onReorder: (newOrder: Product[]) => void;
    onEdit: (p: Product) => void;
    onDelete: (id: string) => void;
}

const SortableSubcategoryGrid: React.FC<SortableSubcategoryGridProps> = ({ products, onReorder, onEdit, onDelete }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // distance requires 5px move to start drag, allowing clicks
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = products.findIndex((item) => item.id === active.id);
            const newIndex = products.findIndex((item) => item.id === over.id);
            const newOrder = arrayMove(products, oldIndex, newIndex);
            onReorder(newOrder);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={products.map(i => i.id)}
                strategy={rectSortingStrategy}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {products.map(product => (
                        <SortableProductItem
                            key={product.id}
                            product={product}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default SortableSubcategoryGrid;
