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

  const activeBanner = banners.find(b => b.is_active) || {
    title: 'Exquisite Fragrance',
    subtitle: 'THE ART OF SCENT',
    image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=2000'
  };

  return (
    <div className="bg-white min-h-screen font-inter">

      {/* Ultra-Premium Cinematic Hero */}
      <section className="relative h-[95vh] overflow-hidden bg-premium-black">
        {/* Ambient Background with slow zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={activeBanner.image_url}
            alt="The Scent"
            className="w-full h-full object-cover opacity-60 scale-110 animate-[ken-burns_20s_ease-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-premium-black via-transparent to-premium-black/40"></div>
          <div className="absolute inset-0 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 h-full container mx-auto px-6 flex flex-col justify-center">
          <div className="max-w-5xl">
            {/* Subtitle with gold accent */}
            <Editable id="hero_subtitle" fallback="Maison de Parfum">
              <div className="flex items-center gap-4 mb-8 translate-y-8 opacity-0 animate-[fade-in-up_1s_ease-out_forwards]">
                <div className="w-12 h-px bg-premium-gold"></div>
                <span className="text-premium-gold text-[10px] font-black uppercase tracking-[0.8em] font-inter">
                  {activeBanner.subtitle || 'Maison de Parfum'}
                </span>
              </div>
            </Editable>

            {/* Title with split font personality */}
            <Editable id="hero_title" fallback="The Art of Invisible Elegance">
              <h1 className="text-7xl md:text-[120px] imperial-serif text-white leading-[0.9] mb-12 translate-y-8 opacity-0 animate-[fade-in-up_1s_ease-out_0.2s_forwards]">
                The Art of <br />
                <span className="gold-luxury-text italic lowercase font-normal">Invisible</span> Elegance
              </h1>
            </Editable>

            <Editable id="hero_description" fallback="Discover a world of olfactive perfection, where heritage meets the avant-garde.">
              <p className="text-white/60 text-lg md:text-xl imperial-body max-w-2xl mb-16 translate-y-8 opacity-0 animate-[fade-in-up_1s_ease-out_0.4s_forwards]">
                Curating the world's most rare essences into a signature of prestige.
                Experience a legacy of olfactive perfection.
              </p>
            </Editable>

            <div className="flex flex-col sm:flex-row gap-8 translate-y-8 opacity-0 animate-[fade-in-up_1s_ease-out_0.6s_forwards]">
              <Editable id="hero_cta_explore" fallback="Enter the Boutique">
                <Link
                  href="/products"
                  className="group relative px-12 py-6 bg-premium-gold text-white text-[11px] font-black uppercase tracking-[0.4em] overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10">Enter the Boutique</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500"></div>
                </Link>
              </Editable>

              <Editable id="hero_cta_philosophy" fallback="Our Heritage">
                <Link
                  href="/about"
                  className="group px-12 py-6 border border-white/20 text-white text-[11px] font-black uppercase tracking-[0.4em] hover:border-premium-gold hover:text-premium-gold transition-all duration-500 flex items-center gap-4"
                >
                  Our Heritage
                  <FiArrowRight className="group-hover:translate-x-3 transition-transform duration-500" />
                </Link>
              </Editable>
            </div>
          </div>
        </div>

        {/* Cinematic Scroll Indicator */}
        <div className="absolute bottom-10 right-10 flex items-center gap-6 rotate-90 origin-right translate-y-[-50%]">
          <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.5em]">Scroll to Discover</span>
          <div className="w-20 h-px bg-gradient-to-r from-premium-gold to-transparent"></div>
        </div>
      </section>

      {/* The Storytelling Section - High Contrast with Vertical Decor */}
      <section className="py-40 bg-[#FAF9F6] parchment-texture relative">
        {/* Vertical Decorative Label */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:block">
          <span className="vogue-text">The Scent of Heritage — Since 2012</span>
        </div>

        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="relative group">
            <div className="absolute -inset-8 border border-premium-gold/10 group-hover:inset-0 transition-all duration-1000"></div>
            <div className="relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1594035910387-fea47794268f?auto=format&fit=crop&q=80&w=1000"
                alt="Perfume Craft"
                className="relative z-10 w-full aspect-[4/5] object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s]"
              />
            </div>
            <div className="absolute -bottom-12 -right-12 z-20 bg-premium-black p-12 border border-premium-gold/20 shadow-2xl translate-y-8 group-hover:translate-y-0 transition-transform duration-1000">
              <span className="text-[10px] font-black text-premium-gold tracking-[0.8em] uppercase">Est. 2012</span>
              <p className="text-2xl imperial-serif text-white mt-4 italic lowercase">Artisanal Mastery</p>
            </div>
          </div>
          <div className="space-y-12">
            <div className="space-y-6">
              <Editable id="story_label" fallback="Our Legacy">
                <p className="text-premium-gold text-[11px] font-black uppercase tracking-[0.6em]">Heritage & Soul</p>
              </Editable>
              <Editable id="story_title" fallback="Crafting Memories Through Scent">
                <h2 className="text-5xl md:text-7xl imperial-serif text-premium-black leading-[1.1]">The Spirit of <br /> <span className="italic font-normal lowercase">Creation</span></h2>
              </Editable>
            </div>
            <Editable id="story_philosophy" fallback={`"Scent is the most intense form of memory. At ${branding.name || 'IQTAN'}, we don't just create perfumes; we capture moments, emotions, and dreams into exquisite glass artifacts."`}>
              <p className="text-premium-charcoal/80 text-xl imperial-body italic leading-relaxed">
                "Fragrance is the invisible bridge between reality and the divine. We do not simply blend notes; we compose symphonies that linger in the halls of memory."
              </p>
            </Editable>
            <div className="grid grid-cols-2 gap-12 py-12 border-y border-premium-gold/20">
              <div>
                <span className="text-4xl imperial-serif text-premium-black">100%</span>
                <p className="text-[10px] font-black text-premium-gold uppercase tracking-[0.4em] mt-2">Organic Essence</p>
              </div>
              <div>
                <span className="text-4xl imperial-serif text-premium-black">Global</span>
                <p className="text-[10px] font-black text-premium-gold uppercase tracking-[0.4em] mt-2">Reserve Status</p>
              </div>
            </div>
            <Link href="/about" className="group inline-flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.4em] text-premium-black hover:text-premium-gold transition-all">
              Discover the Alchemy <FiArrowRight className="group-hover:translate-x-4 transition-transform duration-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection - Artistic Grid with Shine */}
      <section className="py-40 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] scale-150 rotate-12 pointer-events-none">
          <h2 className="text-[300px] imperial-serif leading-none">PARFUM</h2>
        </div>

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
          <div className="flex justify-center py-40">
            <div className="w-12 h-12 border-2 border-premium-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
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
          <Link href="/products?category=Oud" className="relative group overflow-hidden flex items-center justify-center p-16 text-center border-r border-white/5">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1000" alt="Oud" className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 transition-all duration-[3s]" />
              <div className="absolute inset-0 bg-premium-black/40 group-hover:bg-premium-black/20 transition-colors duration-1000"></div>
            </div>
            <div className="relative z-10">
              <span className="text-[9px] font-black text-premium-gold tracking-[0.6em] uppercase block mb-6">Sacred Earth</span>
              <h3 className="text-5xl imperial-serif mb-6 group-hover:gold-luxury-text transition-all duration-700">Majestic Oud</h3>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-700">Explore the Origins</p>
            </div>
          </Link>

          <Link href="/products?category=Floral" className="relative group overflow-hidden flex items-center justify-center p-16 text-center border-r border-white/5">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1595428774751-2292f398782a?auto=format&fit=crop&q=80&w=1000" alt="Floral" className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 transition-all duration-[3s]" />
              <div className="absolute inset-0 bg-premium-black/40 group-hover:bg-premium-black/20 transition-colors duration-1000"></div>
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
      <section className="py-40 bg-premium-cream text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-premium-gold/30 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-8 space-y-12">
          <h2 className="text-5xl md:text-7xl font-playfair font-black text-premium-black italic">Join the Inner Circle</h2>
          <p className="text-[10px] font-black text-premium-gold uppercase tracking-[0.6em]">Receive Invitations to Private Collections & Elite Experiences</p>
          <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your elegant email adress..."
              className="flex-1 bg-white border border-premium-gold/10 p-5 text-xs font-bold outline-none focus:border-premium-gold transition-colors"
            />
            <button className="bg-premium-black text-premium-gold px-12 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-premium-gold hover:text-black transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
