'use client';

import { useEffect } from 'react';
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { useNotificationStore } from '@/store/notification';
import ProductCard from '@/components/ProductCard';
import { FiHeart, FiShoppingBag, FiArrowRight, FiCheck } from 'react-icons/fi';
import Link from 'next/link';

export default function WishlistPage() {
    const { user } = useAuthStore();
    const { items, loading, fetchWishlist, removeItem } = useWishlistStore();
    const { addItem: addToCart } = useCartStore();
    const { showNotification } = useNotificationStore();

    useEffect(() => {
        if (user) {
            fetchWishlist();
        }
    }, [user, fetchWishlist]);

    const handleMoveToCart = async (item: any) => {
        addToCart({
            product_id: item.product_id,
            name: item.products.name,
            price: item.products.price,
            quantity: 1,
            image: item.products.image_url
        });
        await removeItem(item.product_id);
        showNotification('Artefact moved to Vault', 'luxury');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#FAF9F6] text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] scale-150 rotate-12 pointer-events-none font-playfair italic text-[300px] text-premium-gold select-none">Private</div>
                <div className="w-24 h-24 border border-premium-gold/20 rounded-full flex items-center justify-center mb-10 text-premium-gold glass-panel shadow-2xl animate-pulse">
                    <FiHeart size={36} />
                </div>
                <h1 className="text-5xl lg:text-7xl imperial-serif mb-6 text-premium-black lowercase relative z-10">Your Sanctuary</h1>
                <p className="text-[11px] font-black uppercase tracking-[0.6em] text-premium-gold/60 mb-14 max-w-sm relative z-10">Enter your private reserve to reveal your curated collection of masterpieces.</p>
                <Link href="/login" className="secondary-button !bg-premium-black !text-premium-gold !px-16 !py-6 !text-[11px] hover:!bg-premium-gold hover:!text-black transition-all duration-700 relative z-10 shadow-2xl">
                    Divine Entry
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#FAF9F6]/50 min-h-screen py-32 sm:py-40">
            <div className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
                    <div className="space-y-6">
                        <h1 className="text-6xl lg:text-8xl imperial-serif text-premium-black leading-none lowercase">The Wishlist</h1>
                        <p className="text-[11px] font-black uppercase tracking-[0.8em] text-premium-gold">{items.length} Protected Artefacts</p>
                    </div>
                    {items.length > 0 && (
                        <Link href="/products" className="text-[11px] font-black uppercase tracking-[0.4em] text-premium-black hover:text-premium-gold transition-colors flex items-center gap-6 group">
                            Seek Further <FiArrowRight className="group-hover:translate-x-4 transition-transform duration-500" />
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-premium-gold"></div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="imperial-panel text-center max-w-3xl mx-auto py-24">
                        <div className="w-24 h-24 border border-premium-gold/10 rounded-full flex items-center justify-center mx-auto mb-10 text-premium-gold/30">
                            <FiHeart size={40} />
                        </div>
                        <h2 className="text-3xl imperial-serif text-premium-black mb-6 lowercase">Silent Echoes</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-premium-charcoal/40 mb-12">No masterpieces have been secured yet.</p>
                        <Link href="/products" className="secondary-button !bg-premium-black !text-premium-gold">Explore the Atelier</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
                        {items.map((item) => (
                            <div key={item.id} className="relative group space-y-8">
                                <ProductCard product={{
                                    id: item.product_id,
                                    name: item.products.name,
                                    price: item.products.price,
                                    image_url: item.products.image_url,
                                    description: "Olfactory masterpiece from your collection",
                                    Fragrance_type: item.products.Fragrance_type,
                                    stock: 10
                                }} />

                                <button
                                    onClick={() => handleMoveToCart(item)}
                                    className="group relative w-full py-6 bg-premium-black text-premium-gold font-black text-[10px] uppercase tracking-[0.5em] overflow-hidden hover:bg-premium-gold hover:text-black transition-all duration-700 shadow-xl"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700"></div>
                                    <span className="relative z-10 flex items-center justify-center gap-4"><FiShoppingBag /> Secure Artefact</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
