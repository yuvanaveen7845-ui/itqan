'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { productAPI } from '@/lib/api';
import { useCartStore } from '@/store/cart';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productAPI.getById(params.id as string);
        setProduct(data);

        // Fetch related products (mock implementation)
        const relatedRes = await productAPI.getAll({ limit: 3 });
        if (relatedRes.data && relatedRes.data.products) {
          setRelatedProducts(relatedRes.data.products.filter((p: any) => p.id !== params.id));
        } else {
          setRelatedProducts(relatedRes.data.filter((p: any) => p.id !== params.id));
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      if (quantity > product.stock) {
        alert('Cannot add more than available stock.');
        return;
      }
      addItem({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity,
      });
      alert('Added to cart!');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading product details...</div>;
  if (!product) return <div className="text-center py-20 text-xl font-bold">Product not found</div>;

  const productImages = product.images && product.images.length > 0 ? product.images : (product.image_url ? [product.image_url] : []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Image Section */}
        <div>
          <div className="relative overflow-hidden group rounded-[32px] mb-6 shadow-xl shadow-blue-50 bg-gray-50 border border-gray-100 aspect-[4/5]">
            {productImages.length > 0 ? (
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 transform group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold">No Image Available</div>
            )}
          </div>
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-blue-600 shadow-lg' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`${product.name} thumbnail ${i}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link> /
            <Link href="/products" className="hover:text-blue-600 font-medium">Shop</Link> /
            <span className="text-gray-800 font-bold">{product.fabric_type || 'Perfume'}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 text-gray-900 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-yellow-500 font-bold text-lg">
              ★★★★☆ <span className="text-gray-400 text-sm ml-2 font-medium">(128 Reviews)</span>
            </div>
            <p className="text-blue-600 font-black bg-blue-50 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest">{product.fabric_type || 'Fragrance'}</p>
          </div>

          <div className="mb-8 flex items-baseline gap-4">
            <span className="text-5xl font-black text-gray-900">₹{product.price.toLocaleString()}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-2xl text-gray-400 line-through">₹{product.original_price.toLocaleString()}</span>
            )}
            {product.discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-lg shadow-red-100">-{product.discount}% OFF</span>
            )}
          </div>

          <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest mb-3">Product Description</h3>
            <p className="text-gray-600 leading-relaxed font-medium">{product.description}</p>
          </div>

          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest">Select Quantity</h3>
              <div className="flex items-center gap-4 bg-white shadow-sm border border-gray-100 w-full justify-between rounded-xl px-4 py-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center font-black transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-black w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center font-black transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest">Bottle Size</h3>
                <button onClick={() => setShowSizeChart(true)} className="text-xs text-blue-600 hover:underline font-bold">Size Guide</button>
              </div>
              <select className="w-full bg-white shadow-sm border border-gray-100 rounded-xl px-4 py-4 font-bold text-gray-700 focus:ring-2 focus:ring-blue-600 outline-none transition-all">
                <option>Standard (50ml)</option>
                <option>100ml (+₹500)</option>
                <option>Attar (12ml)</option>
                <option>Gift Set (Contact us)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-[2] py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all duration-300 ${product.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100 hover:shadow-blue-200 active:scale-[0.98]'}`}
            >
              <FiShoppingCart size={22} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Shopping Bag'}
            </button>
            <button className="flex-1 py-5 border-2 border-gray-100 rounded-2xl text-gray-400 hover:border-red-500 hover:text-red-500 transition-all duration-300 bg-white font-black flex items-center justify-center gap-2 hover:bg-red-50 group">
              <FiHeart size={22} className="group-hover:fill-current" /> Save
            </button>
          </div>

          <div className="bg-gray-900 text-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <FiShoppingCart size={120} />
            </div>
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
              Platform Details
            </h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Fragrance Family</p>
                <p className="font-bold text-lg">{product.fabric_type || 'Signature'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Inventory</p>
                <p className={`font-bold text-lg ${product.stock < 10 ? 'text-orange-400' : 'text-green-400'}`}>{product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Shipping</p>
                <p className="font-bold text-lg text-blue-400">Free Delivery</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Quality</p>
                <p className="font-bold text-lg">Verified Grade A</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section (Simplified for performance) */}
      <div className="mt-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-gray-900">Curated For You</h2>
          <Link href="/products" className="text-blue-600 font-bold hover:underline">View All Collection</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProducts.map(p => (
            <Link key={p.id} href={`/products/${p.id}`} className="group">
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-50 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                <div className="aspect-square relative overflow-hidden bg-gray-50">
                  <img src={p.images?.[0] || p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-blue-600">{p.fabric_type || 'Perfume'}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{p.name}</h3>
                  <p className="text-xl font-black text-gray-900">₹{p.price.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] shadow-2xl p-10 max-w-2xl w-full relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowSizeChart(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 font-bold text-2xl transition-colors">✕</button>
            <h2 className="text-3xl font-black mb-8 text-gray-900">Bottle Sizes</h2>
            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-5 font-black text-xs uppercase tracking-widest text-gray-500">Unit Option</th>
                    <th className="p-5 font-black text-xs uppercase tracking-widest text-gray-500">Volume</th>
                    <th className="p-5 font-black text-xs uppercase tracking-widest text-gray-500">Ideal For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr>
                    <td className="p-5 font-bold">Standard</td>
                    <td className="p-5 text-gray-600 font-medium">50ml</td>
                    <td className="p-5 text-gray-600 font-medium">Daily Wear</td>
                  </tr>
                  <tr>
                    <td className="p-5 font-bold">Large</td>
                    <td className="p-5 text-gray-600 font-medium">100ml</td>
                    <td className="p-5 text-gray-600 font-medium">Signature Scent</td>
                  </tr>
                  <tr>
                    <td className="p-5 font-bold">Attar</td>
                    <td className="p-5 text-gray-600 font-medium">12ml</td>
                    <td className="p-5 text-gray-600 font-medium">Travel, Occasions</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
