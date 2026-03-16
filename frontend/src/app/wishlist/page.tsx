'use client';

import { useEffect } from 'react';
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { useNotificationStore } from '@/store/notification';
import Editable from '@/components/Editable';
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
            <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-premium-black text-center relative overflow-hidden">
                <div className="w-24 h-24 border border-premium-gold/20 rounded-full flex items-center justify-center mb-10 text-premium-gold glass-panel shadow-2xl animate-pulse">
                    <FiHeart size={36} />
                </div>
                <Editable id="wishlist_unauth_title" fallback="Your Sanctuary">
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl imperial-serif mb-6 text-white lowercase relative z-10">Your Sanctuary</h1>
                </Editable>
                <Editable id="wishlist_unauth_desc" fallback="Enter your private reserve to reveal your curated collection of masterpieces.">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] text-premium-gold/60 mb-14 max-w-sm relative z-10">Enter your private reserve to reveal your curated collection of masterpieces.</p>
                </Editable>
                <Editable id="wishlist_unauth_btn" fallback="Divine Entry">
                    <Link href="/login" className="secondary-button !px-10 sm:!px-16 !py-6 !text-[11px] relative z-10 shadow-2xl">
                        Divine Entry
                    </Link>
                </Editable>
            </div>
        );
    }

    return (
        <div className="bg-premium-black min-h-screen">
            {/* Signature Header */}
            <section className="bg-premium-black pt-36 sm:pt-60 pb-16 sm:pb-40 px-4 sm:px-12 md:px-24 grain-overlay relative overflow-hidden">
                <div className="relative z-10 boutique-layout">
                    <div className="space-y-8">
                        <Editable id="wishlist_eyebrow" type="text" fallback="Signature Collection">
                            <span className="text-premium-gold text-[10px] font-black uppercase tracking-[1rem] block animate-reveal">Private Sanctuary</span>
                        </Editable>
                        <Editable id="wishlist_title" fallback="The Wishlist">
                            <h1 className="text-6xl md:text-9xl imperial-serif text-white animate-reveal lowercase" style={{ animationDelay: '0.2s' }}>
                                The <span className="gold-luxury-text italic font-normal">Wishlist</span>
                            </h1>
                        </Editable>
                        <div className="flex items-center gap-6 pt-4 animate-reveal" style={{ animationDelay: '0.4s' }}>
                            <span className="h-px w-12 bg-premium-gold/40"></span>
                            <Editable id="wishlist_count_label" fallback="Protected Artefacts">
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">{items.length} Protected Artefacts</span>
                            </Editable>
                        </div>
                    </div>
                </div>
            </section>

            <div className="boutique-layout px-4 sm:px-12 md:px-24 section-spacing">
                {loading ? (
                    <div className="py-40 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-premium-gold mx-auto"></div></div>
                ) : items.length === 0 ? (
                    <div className="py-60 text-center space-y-12 border-2 border-dashed border-premium-gold/10">
                        <FiHeart className="mx-auto text-premium-gold/10" size={100} strokeWidth={1} />
                        <div className="space-y-4">
                            <Editable id="wishlist_empty_title" fallback="Silent Echoes">
                                <h2 className="text-4xl imperial-serif text-white italic lowercase">Silent Echoes</h2>
                            </Editable>
                            <Editable id="wishlist_empty_desc" fallback="The sanctuary remains vacant. Secure your preferred masterpieces into your archive for later access.">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-premium-charcoal/40 max-w-sm mx-auto">The sanctuary remains vacant. Secure your preferred masterpieces into your archive for later access.</p>
                            </Editable>
                        </div>
                        <Editable id="wishlist_empty_btn" fallback="Start Curation">
                            <Link href="/products" className="inline-block px-12 py-5 bg-premium-black text-premium-gold text-[10px] font-black uppercase tracking-widest hover:bg-premium-gold hover:text-black transition-all">Start Curation</Link>
                        </Editable>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
                        {items.map((item) => (
                            <div key={item.id} className="space-y-8 group">
                                <ProductCard product={{
                                    id: item.product_id,
                                    name: item.products.name,
                                    price: item.products.price,
                                    image_url: item.products.image_url,
                                    description: "Masterpiece in your collection",
                                    Fragrance_type: item.products.Fragrance_type,
                                    stock: 10
                                }} />
                                <button
                                    onClick={() => handleMoveToCart(item)}
                                    className="w-full py-6 bg-premium-black text-premium-gold text-[10px] font-black uppercase tracking-[0.5em] hover:bg-premium-gold hover:text-black transition-all duration-700 shadow-2xl relative overflow-hidden group/move"
                                >
                                    <Editable id="wishlist_item_move_btn" fallback="Secure to Vault">
                                        <span className="relative z-10">Secure to Vault</span>
                                    </Editable>
                                    <div className="absolute inset-0 bg-white translate-y-full group-hover/move:translate-y-0 transition-transform duration-500 opacity-10"></div>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
