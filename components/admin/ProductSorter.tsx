
import React, { useState, useEffect } from 'react';
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
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';

interface SortableItemProps {
    product: Product;
}

const SortableItem: React.FC<SortableItemProps> = ({ product }) => {
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-gray-900 border border-gray-800 rounded p-2 flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing touch-none relative group h-full"
        >
            <div className="w-full aspect-square bg-black rounded overflow-hidden relative">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute top-1 right-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] text-white">
                    #{product.display_id || 'ID'}
                </div>
            </div>
            <div className="w-full text-center">
                <p className="text-white text-xs font-bold truncate px-1">{product.name}</p>
                <p className="text-gray-500 text-[10px] uppercase truncate">{product.category}</p>
            </div>
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-1 rounded">
                <span className="material-symbols-outlined text-white text-sm">drag_indicator</span>
            </div>
        </div>
    );
};

const ProductSorter: React.FC = () => {
    const { products, updateProductOrder, categories } = useShop();
    const [filterCategory, setFilterCategory] = useState<string>('ALL');
    const [items, setItems] = useState<Product[]>([]);

    // Initialize items when products load
    useEffect(() => {
        setItems(products);
    }, [products]);

    // Handle Category Filter
    // Note: Reordering usually implies reordering the GLOBAL list. 
    // Filtering visualizes a subset, but moving Item A before Item B in a filtered list 
    // should conceptually move it before B in the global list? 
    // OR does the user want to order *within* a category?
    // "poner que producto quiero que este primero segundo y asi" implies global order typically, 
    // or category-based order. 
    // Given the previous "Featured" work, global order is safest for "All Products" view.
    // If we support filtering, we must understand that dragging in a filtered view is complex 
    // because we don't know where to insert relative to hidden items.
    // APPROACH: For V1, Show ALL products, but allow visual filtering? 
    // NO, if I filter, I cannot easily reorder the global array without knowing the "gaps".
    // SIMPLIFIED APPROACH: Just show all products for now, maybe grouped visually or just a massive grid.
    // Optimization: If `filterCategory` is set, we only sort items OF THAT CATEGORY relative to each other?
    // That's complex. Let's stick to "ALL" first or alert user.
    // ACTUALLY, usually users want to sort 'Destacados' or specific categories.
    // Let's providing a sorting view for ALL products might be too much if 100s.
    // Let's Try to show all. 

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                const newOrder: Product[] = arrayMove(items, oldIndex, newIndex);

                // Call context update
                // Note: We need to pass ONLY IDs to the context
                const ids = newOrder.map(i => i.id);
                updateProductOrder(ids);

                return newOrder;
            });
        }
    };

    // Filter logic for display only? No, arrayMove needs the index in the current specific array.
    // If we filter, 'items' must be the filtered subset.
    // If we update order of subset, we need to merge it back to global.
    // Merge Logic:
    // 1. Get global products.
    // 2. Extract subset (e.g. Joyas).
    // 3. Reorder subset.
    // 4. Place reordered subset items back into the global items list relative to... wait. 
    // If we reorder just Joyas, do we want them to stay in their "slots" relative to non-Joyas?
    // Usually yes.
    // Refined Handler for Filtered List:
    const handleDragEndFiltered = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            // 1. New Local Order
            const newSortedItems = arrayMove(items, oldIndex, newIndex);
            setItems(newSortedItems);

            // 2. Global Merge
            // We need to construct the full ID list.
            // We take the ORIGINAL global product list order, 
            // find the indices of the items we are currently looking at,
            // and slot them in? 
            // Easier: Just mapped new sorted items to IDs, and append the rest? 
            // NO. 
            // Most robust: "Global Sort" is what matters. 
            // If user views "Joyas", they reorder "Joyas". 
            // If "Joyas" are scattered in global list [A(J), B(Other), C(J)], 
            // and we swap A and C -> [C(J), B(Other), A(J)].

            // Let's stick to "Show All" or "Show Filtered" but warn that reorder only affects relative order of displayed items?

            // Implementation for now: Just pass the new full ID list of the VISIBLE items + Hidden items?
            // Let's implement global sort first (filter = ALL). 
            // If filter is active, disable sort or handle carefully.
            // I will enable filtering but warning: "Sort only works cleanly when viewing ALL or careful merge".
            // Actually, simplest is:
            // 1. Get all products.
            // 2. create a mapping of id -> index.
            // 3. Update the indices of the moved items.
            // Let's just allow sorting when "ALL" is selected to avoid bugs, for now.
        }
    }

    // Filter Items
    const displayedItems = filterCategory === 'ALL'
        ? items
        : items.filter(p => p.category === filterCategory);

    // Sync items with products when products change (and no local drag is happening? 
    // actually products update from context will trigger set, which is fine)

    return (
        <div className="p-6 bg-black min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Ordenar Productos</h2>
                    <p className="text-gray-500 text-sm">Arrastra y suelta para cambiar el orden de los productos en la tienda.</p>
                </div>
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <button
                        onClick={() => setFilterCategory('ALL')}
                        className={`px-4 py-2 rounded text-xs font-bold uppercase ${filterCategory === 'ALL' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilterCategory(cat.id)}
                            className={`px-4 py-2 rounded text-xs font-bold uppercase ${filterCategory === cat.id ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {filterCategory !== 'ALL' && (
                <div className="mb-4 bg-yellow-900/20 border border-yellow-700/50 p-3 rounded text-yellow-500 text-xs text-center">
                    ⚠️ Nota: El ordenamiento solo está habilitado en la vista "TODOS" para garantizar la consistencia global.
                </div>
            )}

            {filterCategory === 'ALL' ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items.map(i => i.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                            {items.map(product => (
                                <SortableItem key={product.id} product={product} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 opacity-50 pointer-events-none">
                    {displayedItems.map(product => (
                        <div key={product.id} className="bg-gray-900 border border-gray-800 rounded p-2 flex flex-col items-center gap-2">
                            <div className="w-full aspect-square bg-black rounded overflow-hidden">
                                <img src={product.images[0]} className="w-full h-full object-cover grayscale" />
                            </div>
                            <p className="text-white text-xs truncate w-full text-center">{product.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductSorter;
