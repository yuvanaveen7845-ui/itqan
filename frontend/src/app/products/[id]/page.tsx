'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { productAPI } from '@/lib/api';
import { useCartStore } from '@/store/cart';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useNotificationStore } from '@/store/notification';
import AttributeEditable from '@/components/AttributeEditable';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCartStore();
  const { showNotification } = useNotificationStore();

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
        showNotification('Cannot add more than available stock.', 'error');
        return;
      }
      addItem({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: productImages[0],
      });
      showNotification('Added to cart!', 'luxury');
    }
  };

  if (loading) return <div className="text-center py-40 text-premium-gold font-black uppercase tracking-widest text-[10px]">Curating specifics...</div>;
  if (!product) return <div className="text-center py-40 text-2xl imperial-serif text-premium-black">Artifact not found</div>;

  const productImages = product.images && product.images.length > 0 ? product.images : (product.image_url ? [product.image_url] : []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Product Image Section */}
        <div className="space-y-8 scroll-reveal visible">
          <div className="relative overflow-hidden group luxury-card-rich p-0 border-none aspect-[4/5] bg-[#FAF9F6] shadow-2xl rounded-[40px]">
            {productImages.length > 0 ? (
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale brightness-90 hover:grayscale-0"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-premium-charcoal/40 font-black uppercase tracking-[0.4em] text-[10px]">No Image Found</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-premium-gold/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
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
        <div className="flex flex-col justify-center scroll-reveal visible">
          <div className="mb-8 flex items-center gap-6 text-[11px] uppercase font-black tracking-[0.6em] text-premium-gold/60">
            <Link href="/" className="hover:text-premium-gold transition-colors">Boutique</Link>
            <div className="w-4 h-px bg-premium-gold/20"></div>
            <Link href="/products" className="hover:text-premium-gold transition-colors">Reserve</Link>
          </div>
          <AttributeEditable
            productId={product.id}
            field="name"
            value={product.name}
            onUpdate={(val) => setProduct({ ...product, name: val })}
          >
            <h1 className="text-6xl lg:text-8xl imperial-serif mb-8 text-premium-black leading-[1] lowercase">{product.name}</h1>
          </AttributeEditable>

          <div className="flex items-center gap-6 mb-10">
            <div className="flex text-premium-gold text-sm tracking-widest">
              ★★★★☆
            </div>
            <span className="w-px h-4 bg-premium-gold/30"></span>
            <p className="text-premium-black text-[10px] font-black uppercase tracking-[0.4em]">{product.fabric_type || 'Signature Extract'}</p>
          </div>

          <div className="mb-12 flex items-baseline gap-6 border-b border-premium-gold/10 pb-8">
            <AttributeEditable
              productId={product.id}
              field="price"
              value={product.price}
              type="number"
              onUpdate={(val) => setProduct({ ...product, price: Number(val) })}
            >
              <span className="text-4xl imperial-serif text-premium-black">₹{product.price.toLocaleString()}</span>
            </AttributeEditable>
            {product.original_price && product.original_price > product.price && (
              <span className="text-lg text-premium-charcoal/30 line-through tracking-widest">₹{product.original_price.toLocaleString()}</span>
            )}
            {product.discount > 0 && (
              <span className="bg-premium-black text-premium-gold px-4 py-2 text-[9px] font-black uppercase tracking-widest">Privilege -{product.discount}%</span>
            )}
          </div>

          <div className="mb-12 space-y-4">
            <h3 className="text-[10px] font-black text-premium-black uppercase tracking-[0.4em]">The Olfactive Profile</h3>
            <AttributeEditable
              productId={product.id}
              field="description"
              value={product.description}
              type="textarea"
              onUpdate={(val) => setProduct({ ...product, description: val })}
            >
              <p className="text-premium-charcoal/70 leading-relaxed font-light imperial-body text-lg italic">{product.description}</p>
            </AttributeEditable>
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
              className={`flex-[3] py-7 text-[11px] font-black uppercase tracking-[0.6em] flex items-center justify-center gap-6 transition-all duration-700 focus:outline-none rounded-none ${product.stock === 0 ? 'bg-premium-charcoal/10 text-premium-charcoal/30 cursor-not-allowed' : 'bg-premium-black text-premium-gold hover:bg-premium-gold hover:text-black relative overflow-hidden group shadow-2xl'}`}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center gap-4"><FiShoppingCart size={18} /> {product.stock === 0 ? 'Allocation Exhausted' : 'Acquire Artefact'}</span>
            </button>
            <button className="flex-1 py-7 border border-premium-black text-premium-black hover:bg-premium-black hover:text-premium-gold transition-all duration-700 text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 group bg-transparent shadow-lg">
              <FiHeart size={18} className="group-hover:fill-current" /> Vault
            </button>
          </div>

          <div className="luxury-card-rich p-12 relative overflow-hidden shadow-2xl rounded-[32px] border-none">
            <div className="absolute -top-12 -right-12 opacity-[0.05] pointer-events-none scale-150 rotate-12 text-premium-gold select-none">
              <h2 className="text-[120px] imperial-serif">IQTAN</h2>
            </div>
            <h3 className="text-[12px] font-black mb-10 flex items-center gap-6 text-premium-black uppercase tracking-[0.5em]">
              <span className="w-12 h-px bg-premium-gold/40"></span>
              Provenance
            </h3>
            <div className="grid grid-cols-2 gap-y-12 gap-x-16 relative z-10">
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-premium-gold/60">Origin</p>
                <p className="font-medium text-lg italic imperial-body text-premium-black">{product.fabric_type || 'Signature'}</p>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-premium-gold/60">Allocation</p>
                <p className={`font-medium text-lg imperial-body ${product.stock < 10 && product.stock > 0 ? 'gold-luxury-text font-black italic' : 'text-premium-black'}`}>{product.stock > 0 ? `${product.stock} Protected Units` : 'Private Reserve'}</p>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-premium-gold/60">Logistics</p>
                <p className="font-medium text-lg italic imperial-body text-premium-black">White Glove Delivery</p>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-premium-gold/60">Assurance</p>
                <p className="font-medium text-lg italic imperial-body text-premium-black">Masterpiece Certified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section (Simplified for performance) */}
      <div className="mt-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-premium-black uppercase tracking-widest imperial-serif lowercase">Curated For You</h2>
          <Link href="/products" className="text-[10px] font-black uppercase tracking-widest text-premium-gold hover:underline">View All Collection</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProducts.map(p => (
            <Link key={p.id} href={`/products/${p.id}`} className="group">
              <div className="bg-white overflow-hidden border border-premium-gold/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <div className="aspect-square relative overflow-hidden bg-gray-50">
                  <img src={p.images?.[0] || p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-premium-black text-premium-gold px-3 py-1.5 text-[8px] font-black uppercase tracking-widest">{p.fabric_type || 'Perfume'}</span>
                  </div>
                </div>
                <div className="p-8 text-center">
                  <h3 className="imperial-serif text-xl text-premium-black group-hover:text-premium-gold transition-colors mb-2 lowercase">{p.name}</h3>
                  <p className="text-lg imperial-serif text-premium-black tracking-widest">₹{p.price.toLocaleString()}</p>
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
