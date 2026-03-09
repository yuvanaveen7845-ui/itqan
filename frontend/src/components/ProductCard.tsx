'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlist';
import { useAuthStore } from '@/store/auth';
import { FiHeart } from 'react-icons/fi';

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
        fabric_type: string;
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
        <Link href={`/products/${product.id}`} className="block h-full transition-transform hover:-translate-y-1">
            <div className="card hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col relative group overflow-hidden border-transparent hover:border-blue-100 border bg-white rounded-xl">
                {(badge || (product.discount && product.discount > 0)) && (
                    <span className={`absolute top-3 left-3 text-white text-xs font-black px-2 py-1 rounded-md z-10 shadow-sm ${product.discount && product.discount > 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                        {product.discount && product.discount > 0 ? `${product.discount}% OFF` : badge}
                    </span>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={toggleWishlist}
                    className={`absolute top-3 right-3 p-2 rounded-full z-20 transition-all duration-300 ${isWishlisted
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white shadow-sm'
                        }`}
                >
                    <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                <div className="relative overflow-hidden aspect-[4/5]">
                    {primaryImage ? (
                        <img
                            src={primaryImage}
                            alt={product.name}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>

                    {/* Quick Add Overlay (Optional improvement) */}
                    <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300 z-10">
                        <div className="bg-white/90 backdrop-blur-sm py-2 px-4 rounded-lg shadow-lg text-center text-sm font-bold text-blue-600">
                            View Details
                        </div>
                    </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">{product.fabric_type}</p>
                        {product.stock <= 5 && product.stock > 0 && (
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Low Stock</span>
                        )}
                        {product.stock === 0 && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">Out of Stock</span>
                        )}
                    </div>

                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-grow leading-relaxed">{product.description}</p>

                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-gray-900">₹{product.price.toLocaleString()}</span>
                            {product.original_price && product.original_price > product.price && (
                                <span className="text-xs text-gray-400 line-through">₹{product.original_price.toLocaleString()}</span>
                            )}
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex text-yellow-400 text-xs mb-1">
                                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">{product.stock} units left</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
