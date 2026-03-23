'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { productAPI } from '@/lib/api';
import { useCartStore } from '@/store/cart';
import { FiShoppingBag, FiHeart, FiShare2, FiShield, FiTruck, FiRefreshCw, FiStar, FiChevronRight, FiChevronLeft, FiBox, FiArchive, FiPlus, FiMinus } from 'react-icons/fi';
import { useNotificationStore } from '@/store/notification';
import { useAuthStore } from '@/store/auth';
import { useWishlistStore } from '@/store/wishlist';
import Editable from '@/components/Editable';
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
  const { user } = useAuthStore();
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

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
        image: product.image_url,
      });
      showNotification('Added to cart!', 'luxury');
    }
  };

  const isInWishlist = product && wishlistItems.some((item: any) => item.id === product.id);

  const handleToggleWishlist = () => {
    if (!user) {
      showNotification('Please log in to manage your wishlist.', 'error');
      return;
    }
    if (product) {
      if (isInWishlist) {
        removeFromWishlist(product.id);
        showNotification('Removed from wishlist.', 'info');
      } else {
        addToWishlist(product);
        showNotification('Added to wishlist!', 'luxury');
      }
    }
  };

  if (loading) return <div className="text-center py-40 text-premium-gold font-black uppercase tracking-widest text-[10px]">Curating specifics...</div>;
  if (!product) return <div className="text-center py-40 text-2xl imperial-serif text-premium-black">Artifact not found</div>;

  return (
    <div>
      {/* Breadcrumbs - Minimalist */}
      <nav className="boutique-layout px-4 sm:px-12 md:px-24 py-8 sm:py-16 flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-white/40">
        <Editable id="product_detail_breadcrumb_home" fallback="Atelier">
          <Link href="/" className="hover:text-premium-gold transition-colors">Atelier</Link>
        </Editable>
        <FiChevronRight size={10} />
        <Editable id="product_detail_breadcrumb_products" fallback="Collections">
          <Link href="/products" className="hover:text-premium-gold transition-colors">Collections</Link>
        </Editable>
        <FiChevronRight size={10} />
        <span className="text-premium-gold">{product.name}</span>
      </nav>

      <section className="boutique-layout px-4 sm:px-12 md:px-24 pb-20 sm:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-40 items-start">
          
          {/* Visual Showcase - Full Height Vertical */}
          <div className="lg:col-span-7 space-y-12">
            <div className="relative group overflow-hidden bg-white/[0.02] luxury-card-rich rounded-none min-h-[400px] sm:min-h-[900px] flex items-center justify-center">
              <div className="absolute inset-0 bg-premium-black/5 z-10 group-hover:bg-transparent transition-all duration-1000"></div>
              <AttributeEditable
                productId={product.id}
                field="image_url"
                value={product.image_url}
                type="image"
                onUpdate={(val) => { /* State is handled by parent re-fetch usually, but we can optimistically update if needed */ window.location.reload(); }}
                className="w-full h-full"
              >
                <img
                  src={product.image_url || '/images/exotic/hero.png'}
                  alt={product.name}
                  onError={(e) => (e.currentTarget.src = '/images/exotic/hero.png')}
                  className="relative z-0 w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[3s]"
                />
              </AttributeEditable>
              <div className="absolute top-12 left-12 z-20">
                <Editable id="product_detail_badge" fallback="Signature Reserve">
                  <span className="bg-premium-black text-premium-gold text-[8px] font-black uppercase tracking-[0.6em] px-6 py-3 shadow-2xl">Signature Reserve</span>
                </Editable>
              </div>
            </div>
          </div>

          {/* Product Dossier - Sticky Details */}
          <div className="lg:col-span-5 lg:sticky lg:top-40 space-y-20 min-w-0">
            <div className="space-y-8">
              <Editable id={`product_eyebrow_${product.id}`} type="text" fallback={product.category || 'Extract'}>
                <span className="text-premium-gold text-[10px] font-black uppercase tracking-[0.8rem] block">Olfactive Edition</span>
              </Editable>
              <h1 className="product-title text-3xl sm:text-4xl lg:text-4xl xl:text-5xl text-white w-full">
                <Editable id={`product_title_v2_${product.id}`} type="text" fallback={product.name}>
                  {product.name}
                </Editable>
              </h1>
              <div className="flex items-center gap-8 pt-4">
                 <span className="text-3xl imperial-serif gold-luxury-text">₹{product.price.toLocaleString()}</span>
                 <div className="h-px flex-1 bg-premium-gold/10"></div>
              </div>
            </div>

            <div className="space-y-12">
              <Editable id={`product_desc_${product.id}`} type="richtext" fallback={product.description}>
                <p className="imperial-body text-xl max-w-lg">{product.description}</p>
              </Editable>

              {/* Attributes - Boutique Grid */}
              <div className="grid grid-cols-2 gap-12 py-12 border-y border-premium-gold/10">
                 <div className="space-y-2">
                    <Editable id="product_detail_spec_1_label" fallback="Concentration">
                      <span className="text-[8px] font-black text-premium-gold uppercase tracking-widest">Concentration</span>
                    </Editable>
                    <Editable id="product_detail_spec_1_value" fallback="Extrait de Parfum">
                      <p className="text-xs font-bold text-white uppercase tracking-widest">Extrait de Parfum</p>
                    </Editable>
                 </div>
                 <div className="space-y-2">
                    <Editable id="product_detail_spec_2_label" fallback="Allocation">
                      <span className="text-[8px] font-black text-premium-gold uppercase tracking-widest">Allocation</span>
                    </Editable>
                    <p className={`font-medium text-lg imperial-body ${product.stock < 10 && product.stock > 0 ? 'gold-luxury-text font-black italic' : 'text-white'}`}>{product.stock > 0 ? `${product.stock} Units` : 'Private Reserve'}</p>
                 </div>
              </div>
            </div>

            {/* Interaction Suite */}
            <div className="space-y-8 pt-12">
               <div className="flex items-center gap-12">
                  <div className="flex items-center border border-premium-gold/20 px-6 sm:px-8 py-4 gap-8 sm:gap-12 bg-white/5 shadow-sm">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white hover:text-premium-gold transition-colors"><FiMinus size={14}/></button>
                    <span className="text-sm font-black w-4 text-center text-white">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-white hover:text-premium-gold transition-colors"><FiPlus size={14}/></button>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-premium-black text-premium-gold py-6 text-[10px] font-black uppercase tracking-[0.6em] hover:bg-premium-gold hover:text-premium-black transition-all duration-700 shadow-2xl relative overflow-hidden group/add"
                  >
                    <Editable id="product_detail_add_to_cart_btn" fallback="Allocate to Vault">
                      <span className="relative z-10">Allocate to Vault</span>
                    </Editable>
                    <div className="absolute inset-0 bg-white translate-y-full group-hover/add:translate-y-0 transition-transform duration-500 opacity-10"></div>
                  </button>
               </div>
               
               <button 
                onClick={handleToggleWishlist}
                className="w-full py-5 border border-premium-gold/10 flex items-center justify-center gap-4 group/wish hover:border-premium-gold transition-all"
               >
                 <FiHeart className={isInWishlist ? 'fill-premium-gold text-premium-gold' : 'text-premium-charcoal group-hover/wish:text-premium-gold'} size={18} />
                 <Editable id="product_detail_wishlist_btn" fallback="Curate to Likes">
                   <span className="text-[9px] font-black tracking-widest uppercase">Curate to Likes</span>
                 </Editable>
               </button>
            </div>
            
            {/* Boutique Guarantees */}
            <div className="pt-12 space-y-6">
               <div className="flex items-center gap-6 group">
                  <FiTruck className="text-premium-gold group-hover:scale-110 transition-transform" />
                  <Editable id="product_detail_guarantee_1" fallback="Complimentary Global Courier">
                    <span className="text-[8px] font-black uppercase tracking-widest">Complimentary Global Courier</span>
                  </Editable>
               </div>
               <div className="flex items-center gap-6 group">
                  <FiShield className="text-premium-gold group-hover:scale-110 transition-transform" />
                  <Editable id="product_detail_guarantee_2" fallback="Provenance Certificate Included">
                    <span className="text-[8px] font-black uppercase tracking-widest">Provenance Certificate Included</span>
                  </Editable>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Section (Simplified for performance) */}
      <div className="boutique-layout px-12 sm:px-24 section-spacing">
        <div className="flex items-center justify-between mb-24 border-b border-premium-gold/10 pb-8">
          <Editable id="product_detail_related_title" fallback="Curated Portfolio">
            <h2 className="text-3xl sm:text-5xl imperial-serif text-white lowercase">Curated Portfolio</h2>
          </Editable>
          <Editable id="product_detail_related_link" fallback="Full Collection">
            <Link href="/products" className="text-[10px] font-black uppercase tracking-[0.4em] text-premium-gold hover:underline">Full Collection</Link>
          </Editable>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {relatedProducts.map(p => (
            <Link key={p.id} href={`/products/${p.id}`} className="group">
              <div className="bg-white/[0.02] overflow-hidden border border-premium-gold/5 transition-all duration-1000 hover:border-premium-gold/30">
                <div className="aspect-[3/4] relative overflow-hidden bg-white/[0.02] flex items-center justify-center">
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale brightness-95 group-hover:grayscale-0" />
                </div>
                <div className="p-8 text-center space-y-4">
                  <h3 className="imperial-serif text-2xl text-white group-hover:gold-luxury-text transition-all lowercase">{p.name}</h3>
                  <p className="text-sm imperial-serif gold-luxury-text tracking-widest">₹{p.price.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
