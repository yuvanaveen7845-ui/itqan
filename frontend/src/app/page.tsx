// Imperial Scent UI Deploy: Phase 14 - Exotic Gold Overhaul
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiPlay, FiStar, FiShield, FiTruck, FiShoppingBag, FiLayers } from 'react-icons/fi';
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

  return (
    <div className="bg-premium-black min-h-screen font-inter selection:bg-premium-gold selection:text-black">

      {/* Ultra-Premium Cinematic Hero - Exotic Gold Dust */}
      <section className="relative h-screen overflow-hidden bg-premium-black gold-dust-overlay group">
        <div className="absolute inset-0 z-0 scale-110 group-hover:scale-100 transition-transform duration-[10s] ease-out">
          <Editable id="hero_image" type="image" fallback="/images/exotic/hero.png">
            <img
              src="/images/exotic/hero.png"
              alt="Luxury Perfume"
              className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-[3s]"
            />
          </Editable>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-premium-black via-transparent to-transparent z-10"></div>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
           <Editable id="hero_eyebrow" type="text" fallback="The Collection">
              <span className="text-premium-gold text-[10px] font-black uppercase tracking-[1.2rem] mb-12 block animate-reveal">THE COLLECTION</span>
           </Editable>

           <Editable id="hero_title" type="richtext" fallback="The Art of Invisible Elegance">
              <h1 className="text-8xl md:text-[160px] imperial-serif text-white leading-none mb-16 animate-reveal" style={{ animationDelay: '0.2s' }}>
                Invisible <br />
                <span className="gold-luxury-text italic lowercase font-normal">Elegance</span>
              </h1>
           </Editable>

           <Editable id="hero_cta" type="link" href="/products">
              <button className="px-20 py-8 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.8rem] signature-shimmer hover:border-premium-gold transition-all duration-1000 animate-reveal" style={{ animationDelay: '0.4s' }}>
                Discover
              </button>
           </Editable>
        </div>

        {/* Liquid Gold Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
          <span className="text-[8px] font-black text-premium-gold uppercase tracking-[0.5em]">Descent</span>
          <div className="w-px h-24 bg-gradient-to-b from-premium-gold to-transparent"></div>
        </div>
      </section>

      <div className="liquid-gold-divider"></div>

      {/* Storytelling Section - Exotic Saffron Accent */}
      <section className="section-spacing boutique-layout px-6 sm:px-24 bg-premium-black overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-premium-gold/[0.03] to-transparent pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-60 items-center">
          <div className="relative group scroll-reveal visible order-2 lg:order-1">
            <div className="absolute -inset-24 border border-premium-gold/10 group-hover:border-premium-gold/30 transition-all duration-[2s] rounded-none"></div>
            <div className="relative arabesque-border shadow-[0_60px_100px_rgba(0,0,0,0.3)] group/img rounded-none min-h-[900px] flex items-center justify-center bg-zinc-900">
              <Editable id="story_image" type="image" fallback="/images/exotic/saffron_gold.png">
                <img
                  src="/images/exotic/saffron_gold.png"
                  alt="Saffron Gold"
                  className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-all duration-[4s]"
                />
              </Editable>
              <div className="absolute inset-0 bg-premium-black/20 group-hover:bg-transparent transition-all duration-1000 z-20"></div>
            </div>
          </div>

          <div className="space-y-24 scroll-reveal lg:pl-24">
            <div className="space-y-12">
              <Editable id="story_eyebrow" type="text" fallback="The Artisanship">
                <span className="vogue-text">The Artisanship</span>
              </Editable>
              <Editable id="story_title" type="richtext" fallback="The Spirit of Creation">
                <h2 className="text-5xl md:text-7xl lg:text-9xl imperial-serif text-white">The Spirit <br /> of <span className="italic gold-luxury-text font-normal">Creation</span></h2>
              </Editable>
              <Editable id="story_body" type="richtext" fallback="Every drop is a whispered secret, condensed into a symphony of molecules that dance upon the skin.">
                <p className="imperial-body text-2xl max-w-xl">
                  Every drop is a whispered secret, condensed into a symphony of molecules that dance upon the skin. We don't just create fragrances; we compose ephemeral soundtracks for your most intimate memories.
                </p>
              </Editable>
            </div>
            
            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-premium-gold/20">
              <div className="space-y-4">
                <span className="text-4xl imperial-serif text-white italic gold-luxury-text">100%</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-premium-gold">Bespoke Extraction</p>
              </div>
              <div className="space-y-4">
                <span className="text-4xl imperial-serif text-white italic gold-luxury-text">12+ Mo.</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-premium-gold">Maturation Period</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="liquid-gold-divider opacity-30"></div>

      {/* Featured Collection - Exotic Shimmer Cards */}
      <section className="py-20 sm:py-40 bg-premium-black relative overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 mb-16 sm:mb-32 flex flex-col md:flex-row justify-between items-end gap-12 relative z-10">
          <div className="space-y-6">
            <Editable id="signature_edit_label" fallback="Privileged Selection">
              <p className="text-premium-gold text-[11px] font-black uppercase tracking-[0.6em]">Les Exclusifs</p>
            </Editable>
            <Editable id="signature_edit_title" fallback="The Signature Edit">
              <h2 className="text-5xl md:text-8xl imperial-serif text-white leading-none">The <span className="gold-luxury-text italic">Signature</span> Edit</h2>
            </Editable>
          </div>
          <Editable id="discovery_cta" fallback="View All Artifacts">
            <Link href="/products" className="group relative px-12 py-6 border border-premium-gold/30 text-[11px] font-black uppercase tracking-[0.4em] text-premium-gold hover:text-white transition-colors duration-500 signature-shimmer">
              <span className="relative z-10">View All Artifacts</span>
              <div className="absolute inset-0 bg-premium-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </Link>
          </Editable>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="w-12 h-12 border-2 border-premium-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-8 min-h-[400px] ${featuredProducts.length < 4 ? 'justify-items-center' : ''}`}>
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div key={product.id} className="arabesque-border group">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <Editable id="home_products_empty" fallback="Discovering our private collection...">
                <div className="col-span-full text-center py-20 text-premium-charcoal/40 font-bold uppercase tracking-widest">
                  Discovering our private collection...
                </div>
              </Editable>
            )}
          </div>
        )}
      </section>

      <div className="liquid-gold-divider"></div>

      {/* The Olfactive Experience - Exotic Oud Display */}
      <section className="py-40 bg-premium-black text-white relative">
        <div className="max-w-7xl mx-auto px-8 text-center mb-32">
          <Editable id="gallery_label" fallback="The Gallery">
            <p className="text-premium-gold text-[10px] font-black uppercase tracking-[1rem] mb-6">The Gallery</p>
          </Editable>
          <Editable id="gallery_title" fallback="Elevate Your Senses">
            <h2 className="text-6xl md:text-9xl imperial-serif mb-12 leading-tight">The <span className="gold-luxury-text italic lowercase font-normal">Symphony</span> of Scents</h2>
          </Editable>
          <div className="w-40 h-px bg-gradient-to-r from-transparent via-premium-gold to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 h-[900px] border-y border-white/5">
          <Link href="/products?category=Oud" className="relative group overflow-hidden flex items-center justify-center p-16 text-center border-r border-white/5 min-h-[500px]">
            <div className="absolute inset-0 z-0">
              <Editable id="gallery_oud_image" type="image" fallback="/images/exotic/oud_gold.png">
                <img src="/images/exotic/oud_gold.png" alt="Oud Smoke Gold" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-[4s]" />
              </Editable>
              <div className="absolute inset-0 bg-premium-black/40 group-hover:bg-premium-black/10 transition-colors duration-1000"></div>
            </div>
            <div className="relative z-10">
              <Editable id="gallery_oud_eyebrow" fallback="Sacred Earth">
                <span className="text-[9px] font-black text-premium-gold tracking-[0.6em] uppercase block mb-6">Sacred Earth</span>
              </Editable>
              <Editable id="gallery_oud_title" fallback="Majestic Oud">
                <h3 className="text-5xl imperial-serif mb-6 group-hover:gold-luxury-text transition-all duration-700">Majestic Oud</h3>
              </Editable>
              <Editable id="gallery_oud_cta" fallback="Explore the Origins">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-700">Explore the Origins</p>
              </Editable>
            </div>
          </Link>

          <Link href="/products?category=Floral" className="relative group overflow-hidden flex items-center justify-center p-16 text-center border-r border-white/5 min-h-[500px]">
            <div className="absolute inset-0 z-0">
              <Editable id="gallery_floral_image" type="image" fallback="/images/exotic/rose_gold.png">
                <img src="/images/exotic/rose_gold.png" alt="Rose Gold Dew" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-[4s]" />
              </Editable>
              <div className="absolute inset-0 bg-premium-black/40 group-hover:bg-premium-black/10 transition-colors duration-1000"></div>
            </div>
            <div className="relative z-10">
              <Editable id="gallery_floral_eyebrow" fallback="Royal Garden">
                <span className="text-[9px] font-black text-premium-gold tracking-[0.6em] uppercase block mb-6">Royal Garden</span>
              </Editable>
              <Editable id="gallery_floral_title" fallback="Velvet Rose">
                <h3 className="text-5xl imperial-serif mb-6 group-hover:gold-luxury-text transition-all duration-700">Velvet Rose</h3>
              </Editable>
              <Editable id="gallery_floral_cta" fallback="Explore the Garden">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-700">Explore the Garden</p>
              </Editable>
            </div>
          </Link>

          <Link href="/products?category=Spicy" className="relative group overflow-hidden flex items-center justify-center p-16 text-center">
            <div className="absolute inset-0 z-0">
              <Editable id="gallery_spicy_image" type="image" fallback="/images/exotic/saffron_gold.png">
                <img src="/images/exotic/saffron_gold.png" alt="Spicy" className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 transition-all duration-[4s]" />
              </Editable>
              <div className="absolute inset-0 bg-premium-black/50 group-hover:bg-premium-black/20 transition-colors duration-1000"></div>
            </div>
            <div className="relative z-10">
              <Editable id="gallery_spicy_eyebrow" fallback="Midnight Dune">
                <span className="text-[9px] font-black text-premium-gold tracking-[0.6em] uppercase block mb-6">Midnight Dune</span>
              </Editable>
              <Editable id="gallery_spicy_title" fallback="Amber Spice">
                <h3 className="text-5xl imperial-serif mb-6 group-hover:gold-luxury-text transition-all duration-700">Amber Spice</h3>
              </Editable>
              <Editable id="gallery_spicy_cta" fallback="Explore the Night">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-700">Explore the Night</p>
              </Editable>
            </div>
          </Link>
        </div>
      </section>

      <div className="liquid-gold-divider opacity-20"></div>

      {/* Trust & Services - Boutique Signature */}
      <section className="py-20 sm:py-40 bg-premium-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-20">
          {[
            { icon: FiStar, title: 'Authenticity', desc: 'Crafted with rare essences from royal reserves.' },
            { icon: FiTruck, title: 'White Glove', desc: 'Global climate-controlled concierge delivery.' },
            { icon: FiShield, title: 'Secure Vault', desc: 'Protected by high-tier encrypted privilege.' },
            { icon: FiShoppingBag, title: 'Atelier Gift', desc: 'Unveiled in our signature gold-sealed box.' },
          ].map((item, idx) => (
            <div key={idx} className="group text-center space-y-10 relative">
              <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-white/5 relative group-hover:border-premium-gold/40 transition-all duration-700 glass-panel">
                <div className="absolute inset-0 rounded-full bg-premium-gold/0 group-hover:bg-premium-gold/5 transition-all duration-700"></div>
                <item.icon className="text-premium-gold w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="space-y-4">
                <Editable id={`trust_title_${idx}`} fallback={item.title}>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-white group-hover:text-premium-gold transition-colors duration-700">{item.title}</h4>
                </Editable>
                <div className="w-12 h-px bg-premium-gold/20 mx-auto group-hover:w-24 group-hover:bg-premium-gold/50 transition-all duration-700"></div>
                <Editable id={`trust_desc_${idx}`} fallback={item.desc}>
                  <p className="text-[12px] imperial-body text-premium-charcoal/60 leading-relaxed max-w-[240px] mx-auto group-hover:text-white/60 transition-colors duration-700">{item.desc}</p>
                </Editable>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Luxury Footer Newsletter CTA */}
      <section className="py-20 sm:py-60 bg-premium-black text-center relative overflow-hidden gold-dust-overlay border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-20 relative z-20">
          <div className="space-y-8">
            <Editable id="newsletter_eyebrow" fallback="A Legacy of Privileged Updates">
              <p className="text-premium-gold text-[10px] font-black uppercase tracking-[1rem] animate-pulse">A Legacy of Privileged Updates</p>
            </Editable>
            <Editable id="newsletter_title" fallback="The Inner Circle">
              <h2 className="text-5xl sm:text-7xl md:text-9xl imperial-serif text-white leading-none">The <span className="gold-luxury-text italic">Inner</span> Circle</h2>
            </Editable>
          </div>
          
          <div className="relative group max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-premium-gold/20 via-transparent to-premium-gold/20 blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative flex flex-col md:flex-row gap-0 shadow-2xl border border-white/10 bg-premium-black overflow-hidden rounded-none">
              <input
                type="email"
                placeholder="YOUR.EMAIL@ADDRESS.COM"
                className="flex-1 bg-transparent p-8 text-[11px] font-black uppercase tracking-widest outline-none focus:bg-white/5 transition-all placeholder:text-white/20 text-white"
              />
              <button className="bg-premium-gold text-premium-black px-16 py-8 text-[11px] font-black uppercase tracking-[0.6em] hover:bg-white transition-all duration-700 signature-shimmer">
                 <Editable id="newsletter_btn" fallback="Request Access">
                   <span className="relative z-10">Request Access</span>
                 </Editable>
              </button>
            </div>
          </div>
          
          <Editable id="newsletter_footer_note" fallback="Limited Entries Available Monthly">
            <p className="text-[9px] font-black text-premium-gold/50 uppercase tracking-[0.8rem] mt-10">Limited Entries Available Monthly</p>
          </Editable>
        </div>
      </section>
    </div>
  );
}
