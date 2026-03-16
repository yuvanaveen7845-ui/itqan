// Imperial Scent UI Deploy: Phase 12-13
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiPlay, FiStar, FiShield, FiTruck, FiShoppingBag } from 'react-icons/fi';
import { productAPI, cmsAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useCMSStore } from '@/store/cms';
import Editable from '@/components/Editable';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const branding = useCMSStore((state) => state.branding);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, bannersRes] = await Promise.all([
          productAPI.getAll({ limit: 4 }),
          cmsAPI.getBanners()
        ]);
        setFeaturedProducts(productsRes.data.products || []);
        setBanners(bannersRes.data || []);
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeBanner = banners.length > 0 ? banners.find(b => b.is_active) || banners[0] : {
    title: 'Exquisite Fragrance',
    subtitle: 'THE ART OF SCENT',
    image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=2000'
  };

  return (
    <div className="bg-white min-h-screen font-inter">

      {/* Ultra-Premium Cinematic Hero - Full Bleed */}
      <section className="relative h-screen overflow-hidden bg-premium-black grain-overlay group">
        <div className="absolute inset-0 z-0 scale-110 group-hover:scale-100 transition-transform duration-[10s] ease-out">
          <Editable id="hero_image" type="image" fallback="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=2500">
            <img
              src="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=2500"
              alt="Luxury Perfume"
              className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-[3s]"
            />
          </Editable>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-premium-black via-transparent to-transparent z-10"></div>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
           <Editable id="hero_eyebrow" type="text" fallback="The Collection">
              <span className="text-premium-gold text-[10px] font-black uppercase tracking-[1rem] mb-12 block animate-reveal">THE COLLECTION</span>
           </Editable>

           <Editable id="hero_title" type="richtext" fallback="The Art of Invisible Elegance">
              <h1 className="text-8xl md:text-[160px] imperial-serif text-white leading-none mb-16 animate-reveal" style={{ animationDelay: '0.2s' }}>
                Invisible <br />
                <span className="gold-luxury-text italic lowercase font-normal">Elegance</span>
              </h1>
           </Editable>

           <Editable id="hero_cta" type="link" href="/products">
              <button className="px-20 py-8 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.8rem] hover:bg-white hover:text-black transition-all duration-1000 animate-reveal" style={{ animationDelay: '0.4s' }}>
                Discover
              </button>
           </Editable>
        </div>
      </section>

      {/* Storytelling Section - Radical Whitespace */}
      <section className="section-spacing boutique-layout px-24 bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-60 items-center">
          <div className="relative group scroll-reveal visible">
            <div className="absolute -inset-24 border border-premium-gold/10 group-hover:inset-0 transition-all duration-[2s] rounded-none"></div>
            <div className="relative overflow-hidden p-0 border-none shadow-[0_60px_100px_rgba(0,0,0,0.1)] group/img rounded-none min-h-[900px] flex items-center justify-center bg-gray-50">
              <Editable id="story_image" type="image" fallback="https://images.unsplash.com/photo-1594035910387-fea47794268f?auto=format&fit=crop&q=80&w=1000">
                <img
                  src="https://images.unsplash.com/photo-1594035910387-fea47794268f?auto=format&fit=crop&q=80&w=1000"
                  alt="Perfume Craft"
                  className="relative z-10 w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[3s]"
                />
              </Editable>
              <div className="absolute inset-0 bg-premium-black/5 group-hover:bg-transparent transition-all duration-1000 z-20"></div>
            </div>
          </div>

          <div className="space-y-24 scroll-reveal lg:pl-24">
            <div className="space-y-12">
              <Editable id="story_eyebrow" type="text" fallback="The Artisanship">
                <span className="vogue-text">The Artisanship</span>
              </Editable>
              <Editable id="story_title" type="richtext" fallback="The Spirit of Creation">
                <h2 className="text-7xl md:text-9xl imperial-serif text-premium-black">The Spirit <br /> of <span className="italic gold-luxury-text font-normal">Creation</span></h2>
              </Editable>
              <Editable id="story_body" type="richtext" fallback="Every drop is a whispered secret, condensed into a symphony of molecules that dance upon the skin.">
                <p className="imperial-body text-2xl max-w-xl">
                  Every drop is a whispered secret, condensed into a symphony of molecules that dance upon the skin. We don't just create fragrances; we compose ephemeral soundtracks for your most intimate memories.
                </p>
              </Editable>
            </div>
            
            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-premium-gold/20">
              <div className="space-y-4">
                <span className="text-4xl imperial-serif text-premium-black italic">100%</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-premium-gold">Bespoke Extraction</p>
              </div>
              <div className="space-y-4">
                <span className="text-4xl imperial-serif text-premium-black italic">12+ Mo.</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-premium-gold">Maturation Period</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection - Artistic Grid with Shine */}
      <section className="py-40 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="max-w-[1800px] mx-auto px-8 mb-32 flex flex-col md:flex-row justify-between items-end gap-12 relative z-10">
          <div className="space-y-6">
            <Editable id="signature_edit_label" fallback="Privileged Selection">
              <p className="text-premium-gold text-[11px] font-black uppercase tracking-[0.6em]">Les Exclusifs</p>
            </Editable>
            <Editable id="signature_edit_title" fallback="The Signature Edit">
              <h2 className="text-5xl md:text-8xl imperial-serif text-premium-black">The Signature Edit</h2>
            </Editable>
          </div>
          <Editable id="discovery_cta" fallback="View All Artifacts">
            <Link href="/products" className="group relative px-12 py-6 border border-premium-black text-[11px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors duration-500">
              <span className="relative z-10">View All Artifacts</span>
              <div className="absolute inset-0 bg-premium-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </Link>
          </Editable>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="w-12 h-12 border-2 border-premium-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8 min-h-[400px] ${featuredProducts.length < 4 ? 'justify-items-center' : ''}`}>
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-premium-charcoal/40 font-bold uppercase tracking-widest">
                Discovering our private collection...
              </div>
            )}
          </div>
        )}
      </section>

      {/* The Olfactive Experience - Dramatic High-Contrast Grid */}
      <section className="py-40 bg-premium-black text-white relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-premium-gold/30 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-8 text-center mb-32">
          <Editable id="gallery_label" fallback="The Gallery">
            <p className="text-premium-gold text-[10px] font-black uppercase tracking-[0.8em] mb-6">The Gallery</p>
          </Editable>
          <Editable id="gallery_title" fallback="Elevate Your Senses">
            <h2 className="text-6xl md:text-8xl imperial-serif mb-12">The <span className="gold-luxury-text italic lowercase font-normal">Symphony</span> of Scents</h2>
          </Editable>
          <div className="w-40 h-px bg-premium-gold mx-auto opacity-30"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 h-[900px]">
          <Link href="/products?category=Oud" className="relative group overflow-hidden flex items-center justify-center p-16 text-center border-r border-white/10 min-h-[500px]">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1000" alt="Oud" className="w-full h-full object-cover grayscale brightness-75 group-hover:brightness-90 group-hover:scale-110 transition-all duration-[3s]" />
              <div className="absolute inset-0 bg-premium-black/30 group-hover:bg-premium-black/10 transition-colors duration-1000"></div>
            </div>
            <div className="relative z-10">
              <span className="text-[9px] font-black text-premium-gold tracking-[0.6em] uppercase block mb-6">Sacred Earth</span>
              <h3 className="text-5xl imperial-serif mb-6 group-hover:gold-luxury-text transition-all duration-700">Majestic Oud</h3>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-700">Explore the Origins</p>
            </div>
          </Link>

          <Link href="/products?category=Floral" className="relative group overflow-hidden flex items-center justify-center p-16 text-center border-r border-white/10 min-h-[500px]">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1595428774751-2292f398782a?auto=format&fit=crop&q=80&w=1000" alt="Floral" className="w-full h-full object-cover grayscale brightness-75 group-hover:brightness-90 group-hover:scale-110 transition-all duration-[3s]" />
              <div className="absolute inset-0 bg-premium-black/30 group-hover:bg-premium-black/10 transition-colors duration-1000"></div>
            </div>
            <div className="relative z-10">
              <span className="text-[9px] font-black text-premium-gold tracking-[0.6em] uppercase block mb-6">Royal Garden</span>
              <h3 className="text-5xl imperial-serif mb-6 group-hover:gold-luxury-text transition-all duration-700">Velvet Rose</h3>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-700">Explore the Garden</p>
            </div>
          </Link>

          <Link href="/products?category=Spicy" className="relative group overflow-hidden flex items-center justify-center p-16 text-center">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1587017739510-983625add83d?auto=format&fit=crop&q=80&w=1000" alt="Spicy" className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 transition-all duration-[3s]" />
              <div className="absolute inset-0 bg-premium-black/40 group-hover:bg-premium-black/20 transition-colors duration-1000"></div>
            </div>
            <div className="relative z-10">
              <span className="text-[9px] font-black text-premium-gold tracking-[0.6em] uppercase block mb-6">Midnight Dune</span>
              <h3 className="text-5xl imperial-serif mb-6 group-hover:gold-luxury-text transition-all duration-700">Amber Spice</h3>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-700">Explore the Night</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Trust & Services - Minimal Excellence */}
      <section className="py-40 bg-white">
        <div className="max-w-[1800px] mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-20">
          {[
            { icon: FiStar, title: 'Authenticity', desc: 'Crafted with rare essences from royal reserves.' },
            { icon: FiTruck, title: 'White Glove', desc: 'Global climate-controlled concierge delivery.' },
            { icon: FiShield, title: 'Secure Vault', desc: 'Protected by high-tier encrypted privilege.' },
            { icon: FiShoppingBag, title: 'Atelier Gift', desc: 'Unveiled in our signature gold-sealed box.' },
          ].map((item, idx) => (
            <div key={idx} className="group text-center space-y-8">
              <div className="w-20 h-20 bg-[#FAF9F6] rounded-full flex items-center justify-center mx-auto border border-premium-gold/5 group-hover:border-premium-gold/30 group-hover:shadow-xl transition-all duration-700">
                <item.icon className="text-premium-gold w-7 h-7" />
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-premium-black">{item.title}</h4>
                <p className="text-[11px] imperial-body text-premium-charcoal/60 leading-relaxed max-w-[220px] mx-auto">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Luxury Footer Newsletter CTA */}
      <section className="py-60 bg-white text-center relative overflow-hidden grain-overlay border-t border-premium-gold/10">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-premium-gold/30 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-8 space-y-16">
          <div className="space-y-6">
            <h2 className="text-6xl md:text-8xl imperial-serif text-premium-black">The Inner Circle</h2>
            <p className="text-premium-gold text-[10px] font-black uppercase tracking-[0.8em]">A Legacy of Privileged Updates</p>
          </div>
          <p className="text-premium-charcoal/60 text-lg md:text-xl imperial-body italic max-w-2xl mx-auto">
            "Membership is not merely a subscription; it is an invitation to witness the birth of ephemeral masterpieces."
          </p>
          <div className="flex flex-col md:flex-row gap-0 max-w-2xl mx-auto shadow-2xl border border-premium-gold/20 overflow-hidden rounded-none">
            <input
              type="email"
              placeholder="YOUR.ESTEEMED.EMAIL@ADDRESS.COM"
              className="flex-1 bg-white p-8 text-[11px] font-black uppercase tracking-widest outline-none focus:bg-premium-cream/30 transition-all placeholder:text-premium-charcoal/30"
            />
            <button className="bg-premium-black text-premium-gold px-12 py-8 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-premium-gold hover:text-premium-black transition-all duration-700 relative group overflow-hidden">
               <span className="relative z-10">Request Access</span>
               <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
            </button>
          </div>
          <p className="text-[9px] font-black text-premium-gold/40 uppercase tracking-[0.5em] mt-10">Limited Entries Available Monthly</p>
        </div>
      </section>
    </div>
  );
}
