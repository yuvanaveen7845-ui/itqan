'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiShoppingBag, FiStar, FiGift, FiTruck } from 'react-icons/fi';
import { productAPI } from '@/lib/api';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productAPI.getAll({ limit: 6 });
        setFeaturedProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Premium Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 z-10" />
        
        {/* Gold accents */}
        <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-yellow-500 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-yellow-500 to-transparent" />
        
        <div className="relative z-20 text-center px-4 max-w-7xl mx-auto">
          <div className="mb-8">
            <span className="inline-block px-8 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black text-xs font-bold tracking-widest uppercase rounded-full">
              The Royal Collection
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
              iqtan
            </span>
            <span className="block text-white/90 text-4xl md:text-5xl mt-2">
              PERFUMES
            </span>
          </h1>
          
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover the essence of luxury with our ultra-premium fragrance collection
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/products" 
              className="group relative px-12 py-5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black text-lg tracking-widest uppercase hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25"
            >
              <span className="relative z-10 flex items-center gap-3">
                <FiShoppingBag className="w-5 h-5" />
                Explore Collection
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
            </Link>
            
            <Link 
              href="/products?collection=royal" 
              className="px-12 py-5 border-2 border-yellow-500 text-yellow-400 font-black text-lg tracking-widest uppercase hover:bg-yellow-500 hover:text-black transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                <FiStar className="w-5 h-5" />
                Royal Exclusive
              </span>
            </Link>
          </div>
        </div>
        
        {/* Floating elements for premium feel */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-500/30 animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-yellow-500/20 animate-pulse" />
        <div className="absolute bottom-40 left-32 w-3 h-3 bg-yellow-500/25 rounded-full animate-ping" />
      </section>

      {/* Premium Features */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
              <FiStar className="w-8 h-8 text-yellow-500" />
              <div className="w-12 h-px bg-gradient-to-r from-yellow-500 via-transparent to-transparent" />
            </div>
            <h2 className="text-4xl font-black text-white mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">iqtan</span>
            </h2>
            <p className="text-white/60 text-lg max-w-3xl mx-auto">
              Experience the pinnacle of fragrance craftsmanship with our exclusive collections
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/25">
                  <FiStar className="w-8 h-8 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Premium Quality</h3>
              <p className="text-white/60 leading-relaxed">
                Crafted with the finest ingredients from around the world
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/25">
                  <FiTruck className="w-8 h-8 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Luxury Delivery</h3>
              <p className="text-white/60 leading-relaxed">
                Complimentary white glove delivery on all orders
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/25">
                  <FiGift className="w-8 h-8 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Exclusive Gifts</h3>
              <p className="text-white/60 leading-relaxed">
                Complimentary samples and premium packaging with every order
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-6">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">Fragrances</span>
            </h2>
            <p className="text-white/60 text-lg">
              Discover our most coveted scents
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
                    {product.image_url && (
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="p-6">
                      <h3 className="text-xl font-black text-white mb-3">{product.name}</h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-black text-yellow-400">₹{product.price}</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
                          ))}
                        </div>
                      </div>
                      <Link 
                        href={`/products/${product.id}`}
                        className="block w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black text-center tracking-widest uppercase hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300"
                      >
                        Discover Scent
                      </Link>
                    </div>
                    
                    {/* Premium badge */}
                    {product.stock < 10 && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-black tracking-widest uppercase rounded-full">
                        Rare
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              href="/products"
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-yellow-500 text-yellow-400 font-black text-lg tracking-widest uppercase hover:bg-yellow-500 hover:text-black transition-all duration-300"
            >
              View Complete Collection
              <FiShoppingBag className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Footer CTA */}
      <section className="py-24 px-4 bg-gradient-to-t from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <FiStar className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Begin Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">Royal Journey</span>
          </h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Join the exclusive circle of connoisseurs who appreciate the finest fragrances
          </p>
          <Link 
            href="/products"
            className="group relative inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black text-lg tracking-widest uppercase hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25"
          >
            <span className="relative z-10">
              Start Your Collection
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
          </Link>
        </div>
      </section>
    </div>
  );
}
