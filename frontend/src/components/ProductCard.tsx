'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNotificationStore } from '@/store/notification';
import { Button } from 'antd';

export default function ProductCard({ product, badge }: any) {
    const { isInWishlist, addItem, removeItem } = useWishlistStore();
    const { addItem: addCartItem } = useCartStore();
    const { showNotification } = useNotificationStore();
    const isWishlisted = isInWishlist(product.id);
    const primaryImage = product.image_url || ((product.images && product.images.length > 0) ? product.images[0] : '/images/exotic/hero.png');

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            await removeItem(product.id);
            showNotification('Removed from wishlist', 'info');
        } else {
            await addItem(product.id);
            showNotification('Added to wishlist', 'success');
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addCartItem({
            product_id: product.id,
            name: product.name,
            price: product.price,
            image: primaryImage,
            quantity: 1
        });
        showNotification('Added to cart', 'success');
    };

    const randomReviewsCount = Math.floor((product.id || '').charCodeAt(0) * 12.5) % 800 + 100;
    const randomRating = (4.2 + ((product.id || '').charCodeAt(0) % 9) * 0.1).toFixed(1);

    return (
        <div className="group block relative w-full bg-white flex flex-col h-full rounded-[12px] overflow-hidden hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gray-50 pb-4">
            
            {/* Image Container */}
            <div className="relative aspect-[4/5] bg-[#fafafa] w-full flex-shrink-0 overflow-hidden mb-4 rounded-t-[12px]">
                <Link href={`/products/${product.id}`} className="absolute inset-0 z-0 flex items-center justify-center p-6">
                    <img
                        src={primaryImage}
                        alt={product.name}
                        onError={(e) => (e.currentTarget.src = '/images/exotic/hero.png')}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
                    />
                </Link>

                {/* Status Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
                    {badge && (
                        <div className="bg-white text-black border border-gray-100 shadow-sm text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-[4px]">
                            {badge}
                        </div>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={toggleWishlist}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full z-20 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-gray-500 hover:text-black hover:scale-105 transition-all duration-300"
                >
                    {isWishlisted ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                </button>
            </div>

            {/* Content Section */}
            <div className="px-5 flex flex-col flex-grow text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <Link href={`/products/${product.id}`} className="block flex-grow">
                    <div className="mt-1 flex items-center justify-center gap-1.5 text-xs mb-2">
                        <span className="text-[#C8A165]">★</span>
                        <span className="font-semibold text-gray-800">{randomRating}</span>
                        <span className="text-gray-300 mx-1">|</span>
                        <span className="text-gray-500 text-[11px] font-medium">{randomReviewsCount} reviews</span>
                    </div>

                    <h3 className="text-[15px] font-medium text-gray-900 group-hover:text-black line-clamp-2 leading-relaxed mb-3">
                        {product.name}
                    </h3>

                    <div className="flex items-center justify-center gap-2 mb-5">
                        <span className="text-lg font-bold text-black">
                            ₹{product.price.toLocaleString()}
                        </span>
                        {(product.original_price && product.original_price > product.price) ? (
                             <span className="text-xs text-gray-400 line-through font-medium">
                                 ₹{product.original_price.toLocaleString()}
                             </span>
                        ) : (
                             <span className="text-xs text-gray-400 line-through font-medium">
                                 ₹{Math.floor(product.price * 1.4).toLocaleString()}
                             </span>
                        )}
                    </div>
                </Link>

                {/* Add to Cart Button */}
                <div className="mt-auto pt-2">
                    <Button 
                        type="primary"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        block
                        className={`h-[44px] rounded-[8px] font-semibold tracking-wider transition-colors border-none ${
                            product.stock === 0 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-black hover:bg-gray-800 text-white'
                        }`}
                    >
                        {product.stock === 0 ? 'SOLD OUT' : 'ADD TO CART'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
