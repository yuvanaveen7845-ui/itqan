'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { productAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productAPI.getAll({ limit: 6 });
        setProducts(data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12 mb-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Perfume Collection</h1>
          <p className="text-xl mb-6">Discover the finest Fragrances for every occasion. Quality guaranteed.</p>
          <Link href="/products" className="bg-white text-blue-600 px-6 py-3 rounded font-bold hover:bg-gray-100 transition-colors shadow-md">
            Shop Now
          </Link>
        </div>
        <div className="absolute right-0 top-0 opacity-10 blur-sm transform scale-150">
          {/* Abstract pattern placeholder */}
          <div className="w-96 h-96 bg-white rounded-full"></div>
        </div>
      </section>

      {/* Promotional Discount Banner */}
      <section className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 mb-12 flex justify-between items-center shadow-sm">
        <div>
          <h3 className="text-2xl font-bold">Mid-Season Sale!</h3>
          <p>Get up to 40% off on all premium signature perfumes.</p>
        </div>
        <Link href="/products?category=Oud" className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition">
          Claim Offer
        </Link>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-blue-600 hover:underline hover:text-blue-800">View All &rarr;</Link>
        </div>
        {loading ? (
          <div className="text-center py-12">Loading collection...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Trending Fragrances - Horizontal Scroll or Grid */}
      <section className="mb-12 bg-gray-50 p-8 rounded-xl border border-gray-100">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Trending Now</h2>
        {loading ? (
          <div className="text-center py-12">Loading trends...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products?.slice(0, 3).map((product: any) => (
              <ProductCard key={`trending-${product.id}`} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* New Arrivals */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8">New Arrivals</h2>
        {loading ? (
          <div className="text-center py-12">Loading arrivals...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.slice(0, 4).reverse().map((product: any) => (
              <ProductCard key={`new-${product.id}`} product={product} badge="New" />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {['Oud', 'Attar', 'Floral', 'Musk', 'Citrus'].map((category) => (
            <Link key={category} href={`/products?category=${category}`}>
              <div className="bg-white border border-gray-200 p-8 rounded-xl text-center hover:shadow-lg transition-all hover:bg-blue-50 cursor-pointer group">
                <p className="font-bold text-lg text-gray-700 group-hover:text-blue-600">{category}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="mb-16 bg-blue-900 text-white rounded-xl p-8 md:p-12 shadow-inner">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { id: 1, name: "Sarah J.", role: "Perfume Connoisseur", text: "The quality of the signature perfumes here is unmatched. I source all my premium scents from this store.", rating: 5 },
            { id: 2, name: "Michael T.", role: "Boutique Owner", text: "Incredible selection and fast shipping. The detailed scent notes make ordering online risk-free.", rating: 5 },
            { id: 3, name: "Priya R.", role: "Customer", text: "I bought the premium floral for a summer evening. The fragrance is long-lasting, vibrant, and exactly as described.", rating: 4 }
          ].map(review => (
            <div key={review.id} className="bg-blue-800 p-6 rounded-lg text-blue-50 border border-blue-700">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(review.rating)].map((_, i) => <span key={i}>★</span>)}
              </div>
              <p className="italic mb-4">"{review.text}"</p>
              <h4 className="font-bold">- {review.name}</h4>
              <p className="text-sm text-blue-300">{review.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-100 rounded-xl p-12 text-center border border-gray-200">
        <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">Join our community to get exclusive access to new Fragrance collections, early access to sales, and Perfume care tips.</p>
        <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            className="input flex-1 p-4 border-gray-300"
          />
          <button className="btn btn-primary px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700">Subscribe</button>
        </div>
      </section>
    </div>
  );
}
