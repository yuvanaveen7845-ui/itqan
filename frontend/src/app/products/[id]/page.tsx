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

  if (loading) return <div className="text-center py-40 text-premium-gold font-black uppercase tracking-widest text-[10px]">Curating specifics...</div>;
  if (!product) return <div className="text-center py-40 text-2xl imperial-serif text-premium-black">Artifact not found</div>;

  const productImages = product.images && product.images.length > 0 ? product.images : (product.image_url ? [product.image_url] : []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Product Image Section */}
        <div className="space-y-6">
          <div className="relative overflow-hidden group border border-premium-gold/10 aspect-[4/5] bg-[#FAF9F6]">
            {productImages.length > 0 ? (
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale brightness-90 hover:grayscale-0"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-premium-charcoal/40 font-black uppercase tracking-widest text-[10px]">No Image Found</div>
            )}
          </div>
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square overflow-hidden border transition-all duration-300 ${selectedImage === i ? 'border-premium-gold opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`${product.name} thumbnail ${i}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-3 text-[10px] uppercase font-black tracking-[0.4em] text-premium-charcoal/50">
            <Link href="/" className="hover:text-premium-gold transition-colors">Boutique</Link> /
            <Link href="/products" className="hover:text-premium-gold transition-colors">Reserve</Link> /
            <span className="text-premium-gold">{product.fabric_type || 'Exclusif'}</span>
          </div>
          <h1 className="text-5xl lg:text-7xl imperial-serif mb-6 text-premium-black leading-[1.1]">{product.name}</h1>

          <div className="flex items-center gap-6 mb-10">
            <div className="flex text-premium-gold text-sm tracking-widest">
              ★★★★☆
            </div>
            <span className="w-px h-4 bg-premium-gold/30"></span>
            <p className="text-premium-black text-[10px] font-black uppercase tracking-[0.4em]">{product.fabric_type || 'Signature Extract'}</p>
          </div>

          <div className="mb-12 flex items-baseline gap-6 border-b border-premium-gold/10 pb-8">
            <span className="text-4xl imperial-serif text-premium-black">₹{product.price.toLocaleString()}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-lg text-premium-charcoal/30 line-through tracking-widest">₹{product.original_price.toLocaleString()}</span>
            )}
            {product.discount > 0 && (
              <span className="bg-premium-black text-premium-gold px-4 py-2 text-[9px] font-black uppercase tracking-widest">Privilege -{product.discount}%</span>
            )}
          </div>

          <div className="mb-12 space-y-4">
            <h3 className="text-[10px] font-black text-premium-black uppercase tracking-[0.4em]">The Olfactive Profile</h3>
            <p className="text-premium-charcoal/70 leading-relaxed font-light imperial-body text-lg italic">{product.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-premium-black uppercase tracking-[0.4em]">Quantity</h3>
              <div className="flex items-center justify-between border border-premium-black p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center font-black text-premium-black hover:text-premium-gold transition-colors"
                >
                  -
                </button>
                <span className="text-lg imperial-serif">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center font-black text-premium-black hover:text-premium-gold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-premium-black uppercase tracking-[0.4em]">Concentration</h3>
                <button onClick={() => setShowSizeChart(true)} className="text-[10px] text-premium-gold font-black uppercase tracking-widest hover:underline">Guide</button>
              </div>
              <select className="w-full bg-transparent border border-premium-gold/20 p-4 text-[10px] font-black uppercase tracking-widest text-premium-black focus:border-premium-gold outline-none transition-all cursor-pointer">
                <option>Extrait de Parfum (50ml)</option>
                <option>Elite Reserve (100ml) +₹5000</option>
                <option>Pure Attar (12ml)</option>
                <option>Bespoke Consultation</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 mb-16">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-[2] py-6 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all duration-500 focus:outline-none ${product.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-premium-black text-premium-gold hover:bg-premium-gold hover:text-black relative overflow-hidden group'}`}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500"></div>
              <span className="relative z-10 flex items-center gap-3"><FiShoppingCart size={16} /> {product.stock === 0 ? 'Exhausted' : 'Acquire Artefact'}</span>
            </button>
            <button className="flex-1 py-6 border border-premium-black hover:border-premium-gold text-premium-black hover:text-premium-gold transition-all duration-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 group bg-transparent">
              <FiHeart size={16} className="group-hover:fill-current" /> Vault
            </button>
          </div>

          <div className="bg-[#FAF9F6] border border-premium-gold/10 p-10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none scale-150 rotate-12 text-premium-gold">
              <h2 className="text-9xl imperial-serif">IQTAN</h2>
            </div>
            <h3 className="text-[11px] font-black mb-8 flex items-center gap-4 text-premium-black uppercase tracking-[0.4em]">
              <span className="w-8 h-px bg-premium-gold"></span>
              Provenance
            </h3>
            <div className="grid grid-cols-2 gap-y-8 gap-x-12">
              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-premium-charcoal/50">Origin</p>
                <p className="font-medium text-sm italic imperial-body text-premium-black">{product.fabric_type || 'Signature'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-premium-charcoal/50">Allocation</p>
                <p className={`font-medium text-sm imperial-body ${product.stock < 10 ? 'text-premium-gold font-bold italic' : 'text-premium-black'}`}>{product.stock > 0 ? `${product.stock} Flacons` : 'Currently Unavailable'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-premium-charcoal/50">Logistics</p>
                <p className="font-medium text-sm italic imperial-body text-premium-black">White Glove Delivery</p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-premium-charcoal/50">Assurance</p>
                <p className="font-medium text-sm italic imperial-body text-premium-black">100% Guaranteed</p>
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
