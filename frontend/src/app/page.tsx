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

      {/* Ultra-Premium Parallax Hero */}
      <section className="relative h-[90vh] overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img
            src={activeBanner.image_url}
            alt="Hero Scent"
            className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-[10s] ease-out"
          />
          <div className="absolute inset-0 bg-premium-black/20 backdrop-brightness-90"></div>
        </div>

        <div className="relative z-10 h-full max-w-[1800px] mx-auto px-8 md:px-12 flex flex-col justify-center items-start">
          <div className="space-y-6 max-w-4xl">
            <Editable id="hero_subtitle" fallback="Private Collection">
              <p className="text-premium-gold text-xs font-black uppercase tracking-[0.6em] animate-fade-in-up">
                {activeBanner.subtitle || 'Private Collection'}
              </p>
            </Editable>
            <Editable id="hero_title" fallback="The Essence of Elegance">
              <h1 className="text-6xl md:text-8xl font-playfair font-black text-white leading-tight animate-fade-in-up delay-100">
                {activeBanner.title || 'The Essence of Elegance'}
              </h1>
            </Editable>
            <div className="h-0.5 w-32 bg-premium-gold animate-fade-in-up delay-200"></div>
            <Editable id="hero_description" fallback="Discover a world of olfactive perfection, where every note tells a story of heritage and luxury.">
              <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl animate-fade-in-up delay-300">
                Discover a world of olfactive perfection, where every note tells a story of heritage and luxury.
              </p>
            </Editable>
            <div className="flex flex-col sm:flex-row gap-6 pt-8 animate-fade-in-up delay-400">
              <Editable id="hero_cta_explore" fallback="Explore the Collection">
                <Link
                  href="/products"
                  className="px-10 py-5 bg-white text-premium-black text-[11px] font-black uppercase tracking-widest hover:bg-premium-gold hover:text-white transition-all duration-500 shadow-2xl"
                >
                  Explore the Collection
                </Link>
              </Editable>
              <Editable id="hero_cta_philosophy" fallback="Our Philosophy">
                <Link
                  href="/about"
                  className="px-10 py-5 border border-white/30 text-white text-[11px] font-black uppercase tracking-widest hover:border-premium-gold hover:text-premium-gold transition-all duration-500 flex items-center gap-2"
                >
                  Our Philosophy <FiArrowRight />
                </Link>
              </Editable>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/40">
          <span className="text-[9px] font-black uppercase tracking-widest">Scroll to discover</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"></div>
        </div>
      </section>

      {/* The Storytelling Section */}
      <section className="py-32 bg-premium-cream">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 border border-premium-gold/20 group-hover:inset-0 transition-all duration-700"></div>
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea477a4268f?auto=format&fit=crop&q=80&w=1000"
              alt="Perfume Craft"
              className="relative z-10 w-full aspect-[4/5] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute bottom-8 right-8 z-20 bg-white p-8 border border-premium-gold/10 shadow-2xl translate-y-12 group-hover:translate-y-0 transition-transform duration-700">
              <span className="text-[10px] font-black text-premium-gold tracking-widest uppercase">Since 2012</span>
              <p className="text-xl font-playfair font-black text-premium-black mt-2 italic">Artisanal Mastery</p>
            </div>
          </div>
          <div className="space-y-10">
            <div className="space-y-4">
              <Editable id="story_label" fallback="Our Legacy">
                <p className="text-premium-gold text-[11px] font-black uppercase tracking-[0.4em]">Our Legacy</p>
              </Editable>
              <Editable id="story_title" fallback="Crafting Memories Through Scent">
                <h2 className="text-4xl md:text-5xl font-playfair font-black text-premium-black leading-tight">Crafting Memories Through Scent</h2>
              </Editable>
            </div>
            <Editable id="story_philosophy" fallback={`"Scent is the most intense form of memory. At ${branding.name || 'IQTAN'}, we don't just create perfumes; we capture moments, emotions, and dreams into exquisite glass artifacts."`}>
              <p className="text-premium-charcoal/70 text-lg leading-relaxed font-light italic">
                "Scent is the most intense form of memory. At {branding.name || 'IQTAN'}, we don't just create perfumes; we capture moments, emotions, and dreams into exquisite glass artifacts."
              </p>
            </Editable>
            <div className="grid grid-cols-2 gap-8 py-8 border-y border-premium-gold/10">
              <div>
                <span className="text-3xl font-playfair font-black text-premium-black">100%</span>
                <p className="text-[10px] font-black text-premium-gold uppercase tracking-widest mt-1">Natural Origins</p>
              </div>
              <div>
                <span className="text-3xl font-playfair font-black text-premium-black">Private</span>
                <p className="text-[10px] font-black text-premium-gold uppercase tracking-widest mt-1">Global Reserve</p>
              </div>
            </div>
            <Link href="/about" className="group inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-premium-black hover:text-premium-gold transition-colors">
              Meet our master perfumers <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection: Horizontal Gallery */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-8 mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-4">
            <Editable id="signature_edit_label" fallback="Privileged Selection">
              <p className="text-premium-gold text-[11px] font-black uppercase tracking-[0.4em]">Privileged Selection</p>
            </Editable>
            <Editable id="signature_edit_title" fallback="The Signature Edit">
              <h2 className="text-4xl md:text-6xl font-playfair font-black text-premium-black">The Signature Edit</h2>
            </Editable>
          </div>
          <Editable id="discovery_cta" fallback="Discovery Full Collection">
            <Link href="/products" className="px-8 py-4 border border-premium-black text-[10px] font-black uppercase tracking-widest hover:bg-premium-black hover:text-premium-gold transition-all duration-500">
              Discovery Full Collection
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

      {/* The Olfactive Experience - Interactive Grid */}
      <section className="py-32 bg-premium-black text-white">
        <div className="max-w-7xl mx-auto px-8 text-center mb-24">
          <Editable id="gallery_label" fallback="The Gallery">
            <p className="text-premium-gold text-[11px] font-black uppercase tracking-[0.4em] mb-4">The Gallery</p>
          </Editable>
          <Editable id="gallery_title" fallback="Elevate Your Senses">
            <h2 className="text-4xl md:text-6xl font-playfair font-black mb-8">Elevate Your Senses</h2>
          </Editable>
          <div className="w-24 h-0.5 bg-premium-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 h-[800px] border-y border-white/5">
          <Link href="/products?category=Oud" className="relative group overflow-hidden border-r border-white/5 flex items-center justify-center p-12 text-center">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1000" alt="Oud" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-40 group-hover:opacity-60" />
            </div>
            <div className="relative z-10 transition-all duration-700">
              <span className="text-[10px] font-black text-premium-gold tracking-[0.6em] uppercase block mb-4">Purest Origins</span>
              <h3 className="text-4xl font-playfair font-black mb-4 group-hover:italic transition-all">Sacred Oud</h3>
              <div className="h-0.5 w-0 bg-premium-gold group-hover:w-full transition-all duration-700 mx-auto"></div>
            </div>
          </Link>

          <Link href="/products?category=Floral" className="relative group overflow-hidden border-r border-white/5 flex items-center justify-center p-12 text-center bg-premium-cream/5">
            <div className="absolute inset-0 z-0 text-center">
              <img src="https://images.unsplash.com/photo-1595428774751-2292f398782a?auto=format&fit=crop&q=80&w=1000" alt="Floral" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-40 group-hover:opacity-60" />
            </div>
            <div className="relative z-10 transition-all duration-700">
              <span className="text-[10px] font-black text-premium-gold tracking-[0.6em] uppercase block mb-4">Eternal Bloom</span>
              <h3 className="text-4xl font-playfair font-black mb-4 group-hover:italic transition-all">Royal Floral</h3>
              <div className="h-0.5 w-0 bg-premium-gold group-hover:w-full transition-all duration-700 mx-auto"></div>
            </div>
          </Link>

          <Link href="/products?category=Spicy" className="relative group overflow-hidden flex items-center justify-center p-12 text-center">
            <div className="absolute inset-0 z-0 text-center">
              <img src="https://images.unsplash.com/photo-1587017739510-983625add83d?auto=format&fit=crop&q=80&w=1000" alt="Spicy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-40 group-hover:opacity-60" />
            </div>
            <div className="relative z-10 transition-all duration-700">
              <span className="text-[10px] font-black text-premium-gold tracking-[0.6em] uppercase block mb-4">Exotic Night</span>
              <h3 className="text-4xl font-playfair font-black mb-4 group-hover:italic transition-all">Golden Spice</h3>
              <div className="h-0.5 w-0 bg-premium-gold group-hover:w-full transition-all duration-700 mx-auto"></div>
            </div>
          </Link>
        </div>
      </section>

      {/* Trust & Services */}
      <section className="py-32 bg-white">
        <div className="max-w-[1800px] mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
          {[
            { icon: FiStar, title: 'Authenticity Guaranteed', desc: 'Sourced directly from the oldest distilleries in the world.' },
            { icon: FiTruck, title: 'Concierge Delivery', desc: 'Complimentary shipping in climate-controlled packaging.' },
            { icon: FiShield, title: 'Secure Privilege', desc: 'End-to-end encrypted transactions for your privacy.' },
            { icon: FiShoppingBag, title: 'Signature Wrapping', desc: 'Every scent arrives in our iconic golden-embossed gift box.' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-6">
              <div className="w-16 h-16 bg-premium-cream rounded-full flex items-center justify-center mx-auto transition-transform hover:rotate-[360deg] duration-1000">
                <item.icon className="text-premium-gold w-6 h-6" />
              </div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">{item.title}</h4>
              <p className="text-[11px] text-premium-charcoal/60 leading-relaxed max-w-[200px] mx-auto">{item.desc}</p>
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
