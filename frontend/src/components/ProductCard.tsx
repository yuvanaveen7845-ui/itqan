'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlist';
import { useAuthStore } from '@/store/auth';
import { FiHeart, FiArrowRight } from 'react-icons/fi';

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

    const isWishlisted = isInWishlist(product.id);
    const primaryImage = product.images && product.images.length > 0 ? product.images[0] : product.image_url;

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert('Please login to add items to your wishlist.');
            return;
        }

        if (isWishlisted) {
            await removeItem(product.id);
        } else {
            await addItem(product.id);
        }
    };

    return (
        <Link href={`/products/${product.id}`} className="group block relative perspective-1000">
            <div className="relative overflow-hidden bg-premium-cream border border-premium-gold/10 transition-all duration-700 group-hover:border-premium-gold/30 group-hover:shadow-[0_20px_50px_rgba(197,160,89,0.1)]">

                {/* Status Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {(badge || (product.discount && product.discount > 0)) && (
                        <span className="bg-premium-black text-premium-gold text-[8px] font-black px-3 py-1.5 uppercase tracking-widest shadow-xl font-inter">
                            {product.discount && product.discount > 0 ? `${product.discount}% PRIVILEGE` : badge}
                        </span>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                        <span className="bg-white/90 backdrop-blur-sm text-premium-charcoal text-[7px] font-black px-2 py-1 uppercase tracking-tighter border border-premium-gold/20 font-inter">
                            Limited Allocation
                        </span>
                    )}
                </div>

                {/* Elegant Wishlist */}
                <button
                    onClick={toggleWishlist}
                    className={`absolute top-4 right-4 p-3 rounded-full z-20 transition-all duration-500 transform ${isWishlisted
                        ? 'bg-premium-gold text-premium-white scale-110 shadow-lg'
                        : 'bg-white/80 text-premium-charcoal/40 hover:text-premium-gold hover:bg-white scale-100'
                        } group-hover:scale-110`}
                >
                    <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                {/* Primary Image with Ken Burns Effect on hover */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                    <img
                        src={primaryImage || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-[2s] cubic-bezier(0.25, 0.46, 0.45, 0.94) group-hover:scale-110"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-premium-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center p-8 text-center pointer-events-none">
                        <div className="border border-premium-gold/40 w-full h-full flex flex-col items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                            <span className="text-white text-[10px] font-black tracking-[0.4em] uppercase mb-2 font-inter">View Signature</span>
                            <div className="w-12 h-px bg-premium-gold"></div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 text-center bg-white relative">
                    <div className="space-y-2">
                        <p className="text-premium-gold text-[9px] font-black uppercase tracking-[0.5em] font-inter">
                            {product.Fragrance_type || 'Private Label'}
                        </p>
                        <h3 className="text-xl font-playfair font-black text-premium-black group-hover:text-premium-gold transition-colors duration-500 truncate">
                            {product.name}
                        </h3>
                    </div>

                    <div className="mt-6 flex flex-col items-center gap-1">
                        <div className="flex items-baseline gap-3">
                            <span className="text-lg font-playfair italic text-premium-black uppercase tracking-widest">
                                ₹{product.price.toLocaleString()}
                            </span>
                            {product.original_price && product.original_price > product.price && (
                                <span className="text-[10px] text-premium-charcoal/40 line-through tracking-tighter decoration-premium-gold/30">
                                    ₹{product.original_price.toLocaleString()}
                                </span>
                            )}
                        </div>
                        <div className="h-0.5 w-0 bg-premium-gold group-hover:w-16 transition-all duration-700 mx-auto"></div>
                    </div>

                    {/* Quick Info / Stock */}
                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-[8px] font-black text-premium-charcoal/40 tracking-[0.2em] uppercase font-inter">Inventory: {product.stock}</span>
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
