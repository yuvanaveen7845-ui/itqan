'use client';

import { useEffect } from 'react';
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import ProductCard from '@/components/ProductCard';
import { FiHeart, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export default function WishlistPage() {
    const { user } = useAuthStore();
    const { items, loading, fetchWishlist, removeItem } = useWishlistStore();
    const { addItem: addToCart } = useCartStore();

    useEffect(() => {
        if (user) {
            fetchWishlist();
        }
    }, [user, fetchWishlist]);

    const handleMoveToCart = async (item: any) => {
        // Add to cart
        addToCart({
            product_id: item.product_id,
            name: item.products.name,
            price: item.products.price,
            quantity: 1,
            image: item.products.image_url
        });

        // Remove from wishlist
        await removeItem(item.product_id);
    };

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                    <FiHeart size={40} />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-4">Your Wishlist awaits</h1>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Login to see your saved textile treasures and pick up where you left off.</p>
                <Link href="/login" className="btn btn-primary px-10 py-4 bg-blue-600 hover:bg-blue-700">Login Now</Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2">My Wishlist</h1>
                        <p className="text-gray-600">You have {items.length} items saved in your collection.</p>
                    </div>
                    {items.length > 0 && (
                        <Link href="/products" className="text-blue-600 font-bold flex items-center gap-2 hover:underline">
                            Continue Shopping <FiArrowRight />
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center max-w-2xl mx-auto">
                        <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <FiHeart size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8">Save items you love to keep track of them and buy them later.</p>
                        <Link href="/products" className="btn btn-primary bg-blue-600 hover:bg-blue-700 px-8 py-3">Explore Collections</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {items.map((item) => (
                            <div key={item.id} className="relative group">
                                <ProductCard product={{
                                    id: item.product_id,
                                    name: item.products.name,
                                    price: item.products.price,
                                    image_url: item.products.image_url,
                                    description: "Premium fabric from your wishlist",
                                    fabric_type: item.products.fabric_type,
                                    stock: 10 // Placeholder
                                }} />

                                <div className="mt-4 px-2">
                                    <button
                                        onClick={() => handleMoveToCart(item)}
                                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-md group-hover:shadow-blue-200"
                                    >
                                        <FiShoppingBag /> Move to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
