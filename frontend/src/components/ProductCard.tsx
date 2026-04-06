'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlist';
import { useAuthStore } from '@/store/auth';
import { useDevStore } from '@/store/dev';
import { FiHeart, FiEdit3, FiCopy } from 'react-icons/fi';
import { useNotificationStore } from '@/store/notification';
import AttributeEditable from '@/components/AttributeEditable';
import { useState } from 'react';
import { productAPI } from '@/lib/api';
import { useCartStore } from '@/store/cart';

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
    const { addItem: addCartItem } = useCartStore();
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
            showNotification('Added to wishlist', 'success');
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addCartItem({
            product_id: localProduct.id,
            name: localProduct.name,
            price: localProduct.price,
            image: primaryImage || '/images/exotic/hero.png',
            quantity: 1
        });
        showNotification('Added to cart', 'success');
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
            showNotification('Product duplicated successfully', 'success');
        } catch (error) {
            showNotification('Duplication failed', 'error');
        }
    };

    const randomReviewsCount = Math.floor(localProduct.id.charCodeAt(0) * 12.5) % 800 + 100;
    const randomRating = (4.2 + (localProduct.id.charCodeAt(0) % 9) * 0.1).toFixed(1);

    return (
        <div className="group block relative w-full bg-white flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-[#f4f4f4] w-full flex-shrink-0">
                <Link href={`/products/${localProduct.id}`} className="absolute inset-0 z-0 flex items-center justify-center p-4">
                    <AttributeEditable
                        productId={localProduct.id}
                        field="image_url"
                        value={localProduct.image_url}
                        type="image"
                        onUpdate={(val) => setLocalProduct({ ...localProduct, image_url: val })}
                        className="w-full h-full flex items-center justify-center"
                    >
                        <img
                            src={primaryImage || '/images/exotic/hero.png'}
                            alt={product.name}
                            onError={(e) => (e.currentTarget.src = '/images/exotic/hero.png')}
                            className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
                        />
                    </AttributeEditable>
                </Link>

                {/* Status Badges */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 pointer-events-none">
                    {(badge || (product.discount && product.discount > 0)) && (
                        <span className="bg-[#5bc2a0] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide rounded-sm shadow-sm">
                            {product.discount && product.discount > 0 ? `${product.discount}% OFF` : badge}
                        </span>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                        <span className="bg-[#e2a868] text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wide rounded-sm shadow-sm">
                            Few Left
                        </span>
                    )}
                    {product.stock === 0 && (
                        <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wide rounded-sm shadow-sm">
                            Sold Out
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={toggleWishlist}
                    className="absolute top-3 right-3 p-2 rounded-full z-20 bg-white shadow-sm hover:shadow-md text-gray-400 transition-all duration-300"
                >
                    <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'hover:text-black'}`} />
                </button>

                {/* Dev Mode Overlay */}
                {isDevMode && (
                    <div className="absolute inset-0 z-30 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                        <Link
                            href={`/admin/products/${localProduct.id}`}
                            className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-gray-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FiEdit3 size={14} /> Edit
                        </Link>
                        <button
                            onClick={handleDuplicate}
                            className="bg-black text-white border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-800"
                        >
                            <FiCopy size={14} /> Duplicate
                        </button>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="pt-4 pb-0 px-2 flex flex-col flex-grow text-center">
                <Link href={`/products/${localProduct.id}`} className="block flex-grow px-2">
                    <AttributeEditable
                        productId={localProduct.id}
                        field="name"
                        value={localProduct.name}
                        onUpdate={(val) => setLocalProduct({ ...localProduct, name: val })}
                    >
                        <h3 className="text-[13px] sm:text-sm font-semibold text-gray-900 group-hover:text-black line-clamp-2 leading-snug">
                            {localProduct.name}
                        </h3>
                    </AttributeEditable>

                    <div className="mt-2 flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs">
                        <span className="text-[#f59e0b]">★</span>
                        <span className="font-semibold text-gray-800">{randomRating}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-500">{randomReviewsCount} Reviews</span>
                    </div>

                    <div className="mt-2 sm:mt-3 flex flex-wrap items-center justify-center gap-2 mb-4">
                        <AttributeEditable
                            productId={localProduct.id}
                            field="price"
                            value={localProduct.price}
                            type="number"
                            onUpdate={(val) => setLocalProduct({ ...localProduct, price: Number(val) })}
                        >
                            <span className="text-base sm:text-lg font-bold text-black">
                                ₹{localProduct.price.toLocaleString()}
                            </span>
                        </AttributeEditable>
                        
                        {(localProduct.original_price && localProduct.original_price > localProduct.price) ? (
                             <span className="text-xs sm:text-sm text-gray-400 line-through">
                                 ₹{localProduct.original_price.toLocaleString()}
                             </span>
                        ) : (
                             <span className="text-xs sm:text-sm text-gray-400 line-through">
                                 ₹{Math.floor(localProduct.price * 1.4).toLocaleString()}
                             </span>
                        )}
                    </div>
                </Link>

                {/* Add to Cart Button */}
                <div className="mt-auto px-2 pb-4">
                    <button 
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`w-full py-2.5 sm:py-3 text-[11px] sm:text-sm font-bold tracking-wider uppercase transition-colors ${
                            product.stock === 0 
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                : 'bg-[#111111] text-white hover:bg-black rounded-sm'
                        }`}
                    >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}
