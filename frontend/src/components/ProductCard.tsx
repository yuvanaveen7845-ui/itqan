'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlist';
import { useAuthStore } from '@/store/auth';
import { useDevStore } from '@/store/dev';
import { FiHeart, FiArrowRight, FiEdit3, FiCopy } from 'react-icons/fi';
import { useNotificationStore } from '@/store/notification';
import AttributeEditable from '@/components/AttributeEditable';
import { useState } from 'react';
import { productAPI } from '@/lib/api';

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        original_price?: number;
        discount?: number;
        image_url: string;
        images?: string[];
        description: string;
        Fragrance_type: string;
        stock: number;
    };
    badge?: string;
}

export default function ProductCard({ product, badge }: ProductCardProps) {
    const { user } = useAuthStore();
    const { isInWishlist, addItem, removeItem } = useWishlistStore();
    const isDevMode = useDevStore((state) => state.isDevMode);

    const { showNotification } = useNotificationStore();
    const [localProduct, setLocalProduct] = useState(product);

    const isWishlisted = isInWishlist(localProduct.id);
    const primaryImage = localProduct.images && localProduct.images.length > 0 ? localProduct.images[0] : localProduct.image_url;

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            showNotification('Please login to add items to your wishlist.', 'info');
            return;
        }

        if (isWishlisted) {
            await removeItem(localProduct.id);
            showNotification('Removed from wishlist', 'info');
        } else {
            await addItem(localProduct.id);
            showNotification('Added to wishlist', 'luxury');
        }
    };

    const handleDuplicate = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const { id, ...duplicateData } = localProduct as any;
            const newProduct = {
                ...duplicateData,
                name: `${localProduct.name} (Copy)`,
                sku: `${(localProduct as any).sku || 'SKU'}-${Math.floor(Math.random() * 1000)}`
            };
            await productAPI.create(newProduct);
            showNotification('Masterpiece Duplicated Successfully', 'luxury');
        } catch (error) {
            showNotification('Duplication failed', 'error');
        }
    };

    return (
        <Link href={`/products/${product.id}`} className="group block relative perspective-1000">
            <div className="relative overflow-hidden luxury-card-rich transition-all duration-1000 group-hover:shadow-[0_40px_80px_rgba(197,160,89,0.15)] rounded-none">

                {/* Status Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {(badge || (product.discount && product.discount > 0)) && (
                        <span className="bg-premium-black text-premium-gold text-[8px] font-black px-3 py-1.5 uppercase tracking-widest shadow-xl font-inter">
                            {product.discount && product.discount > 0 ? `${product.discount}% PRIVILEGE` : badge}
                        </span>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                        <span className="bg-white/10 backdrop-blur-sm text-white text-[7px] font-black px-2 py-1 uppercase tracking-tighter border border-premium-gold/20 font-inter">
                            Limited Allocation
                        </span>
                    )}
                </div>

                {/* Elegant Wishlist */}
                <button
                    onClick={toggleWishlist}
                    className={`absolute top-4 right-4 p-3 rounded-full z-20 transition-all duration-500 transform ${isWishlisted
                        ? 'bg-premium-gold text-premium-white scale-110 shadow-lg'
                        : 'bg-white/10 backdrop-blur-sm text-white/60 hover:text-premium-gold hover:bg-white/20 scale-100'
                        } group-hover:scale-110`}
                >
                    <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                {/* Dev Mode Overlay */}
                {isDevMode && (
                    <div className="absolute inset-0 z-30 bg-premium-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 pointer-events-none">
                        <Link
                            href={`/admin/products/${localProduct.id}`}
                            className="pointer-events-auto bg-white text-premium-black px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FiEdit3 size={14} /> Full Editor
                        </Link>
                        <button
                            onClick={handleDuplicate}
                            className="pointer-events-auto bg-premium-gold text-premium-black px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                        >
                            <FiCopy size={14} /> Quick Duplicate
                        </button>
                    </div>
                )}

                {/* Primary Image with Ken Burns & Shine Effect */}
                <div className="relative aspect-[4/5] overflow-hidden bg-white/[0.02] shine-effect glass-refraction">
                    <AttributeEditable
                        productId={localProduct.id}
                        field="image_url"
                        value={localProduct.image_url}
                        type="image"
                        onUpdate={(val) => setLocalProduct({ ...localProduct, image_url: val })}
                        className="w-full h-full"
                    >
                        <img
                            src={primaryImage || '/images/exotic/hero.png'}
                            alt={product.name}
                            onError={(e) => (e.currentTarget.src = '/images/exotic/hero.png')}
                            className="w-full h-full object-cover transition-transform duration-[2s] cubic-bezier(0.25, 0.46, 0.45, 0.94) group-hover:scale-110"
                        />
                    </AttributeEditable>

                    {/* Hover Overlay - Light Leak Style */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-premium-gold/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 flex items-center justify-center p-8 text-center pointer-events-none">
                        <div className="border border-premium-gold/30 w-full h-full flex flex-col items-center justify-center translate-y-8 group-hover:translate-y-0 transition-transform duration-1000 backdrop-blur-[2px]">
                            <span className="text-white text-[10px] font-black tracking-[0.8em] uppercase mb-4 font-inter text-shadow-lg">View Details</span>
                            <div className="w-12 h-px bg-premium-gold/50"></div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 text-center bg-white/[0.02] relative">
                    <div className="space-y-3">
                        <p className="text-premium-gold text-[8px] font-black uppercase tracking-[0.6em] font-inter">
                            {product.Fragrance_type || 'Private Label'}
                        </p>
                        <AttributeEditable
                            productId={localProduct.id}
                            field="name"
                            value={localProduct.name}
                            onUpdate={(val) => setLocalProduct({ ...localProduct, name: val })}
                        >
                            <h3 className="text-2xl imperial-serif text-white group-hover:text-premium-gold transition-all duration-700 truncate lowercase font-normal">
                                {localProduct.name}
                            </h3>
                        </AttributeEditable>
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-1">
                        <div className="flex items-baseline gap-4">
                            <AttributeEditable
                                productId={localProduct.id}
                                field="price"
                                value={localProduct.price}
                                type="number"
                                onUpdate={(val) => setLocalProduct({ ...localProduct, price: Number(val) })}
                            >
                                <span className="text-xl imperial-serif text-premium-gold tracking-[0.2em]">
                                    ₹{localProduct.price.toLocaleString()}
                                </span>
                            </AttributeEditable>
                            {localProduct.original_price && localProduct.original_price > localProduct.price && (
                                <span className="text-[10px] text-white/30 font-light line-through tracking-[0.3em]">
                                    ₹{localProduct.original_price.toLocaleString()}
                                </span>
                            )}
                        </div>
                        <div className="h-px w-0 bg-premium-gold/30 group-hover:w-20 transition-all duration-1000 mx-auto mt-2"></div>
                    </div>

                    {/* Quick Info / Stock */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-[8px] font-black text-white/30 tracking-[0.2em] uppercase font-inter">Inventory: {product.stock}</span>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-1 h-1 rounded-full bg-premium-gold"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
