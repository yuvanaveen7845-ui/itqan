'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { productAPI, cmsAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useCMSStore } from '@/store/cms';
import Editable from '@/components/Editable';
import MistBackground from '@/components/MistBackground';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const heroImageUrl = useCMSStore((state) => state.inlineContent['hero_image']) || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=2500"; 
  // Perfume bottle hero

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes] = await Promise.all([
          productAPI.getAll({ limit: 4 })
        ]);
        setFeaturedProducts(productsRes.data.products || []);
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-premium-black min-h-screen selection:bg-premium-gold selection:text-black font-manrope">
      {/* Global Scent Mist */}
      <MistBackground />

      {/* Hero 2.0: The Liquid Veil */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Animated Liquid Blob Behind Hero Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-premium-gold/20 to-transparent blur-3xl opacity-50 animate-pulse mix-blend-screen pointer-events-none rounded-[40%_60%_70%_30%/40%_50%_60%_50%]"></div>

        <div className="absolute inset-0 z-0 scale-105 animate-slow-zoom">
          <Editable id="hero_image" type="image" fallback={heroImageUrl} className="w-full h-full">
            <img
              src={heroImageUrl}
              alt="Liquid Gold Perfume"
              className="w-full h-full object-cover opacity-60"
            />
          </Editable>
          <div className="absolute inset-0 bg-gradient-to-b from-premium-black/40 via-transparent to-premium-black"></div>
        </div>

        <div className="relative z-20 text-center px-4 mt-20">
          <Editable id="hero_eyebrow" fallback="L'Extrait de Parfum">
            <span className="text-[10px] font-black text-premium-gold uppercase tracking-[1.5em] mb-12 block drop-shadow-2xl animate-reveal opacity-80">
              L'Extrait de Parfum
            </span>
          </Editable>

          {/* Extreme Editorial Typography */}
          <Editable id="hero_title" fallback="The Scent of the Sublime">
            <h1 className="text-7xl sm:text-9xl md:text-[180px] lg:text-[220px] noto-serif text-white leading-[0.85] tracking-tighter mb-16 animate-reveal drop-shadow-2xl" style={{ animationDelay: '0.2s' }}>
              <span className="block ml-[-10vw] italic text-white/90 font-light">Scent</span> 
              <span className="block mr-[-10vw] gold-luxury-text">Sublime</span>
            </h1>
          </Editable>

          <Editable id="hero_cta" fallback="Inhale the Collection">
             <Link href="/products" className="inline-block mt-8 group relative px-16 py-6 border border-premium-gold/30 text-[10px] font-black uppercase tracking-[0.8em] text-white overflow-hidden glass-refraction">
                <span className="relative z-10 group-hover:text-black transition-colors duration-700">Inhale the Collection</span>
                <div className="absolute inset-0 bg-premium-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"></div>
             </Link>
          </Editable>
        </div>
      </section>

      {/* The Extraction Process - Cinematic Split Scroll */}
      <section className="py-40 relative z-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-12">
          
          <div className="mb-32 text-center">
             <Editable id="alchemy_title" fallback="The Alchemy">
               <h2 className="text-4xl md:text-8xl noto-serif text-white"><span className="italic gold-luxury-text pr-4">The</span> Alchemy</h2>
             </Editable>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden arabesque-border shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            {/* Visual Side */}
            <div className="relative h-[600px] lg:h-[800px] group bg-zinc-900 border-r border-premium-gold/10">
              <Editable id="alchemy_image" type="image" fallback="https://images.unsplash.com/photo-1615634260167-98cbce11bc0e?auto=format&fit=crop&q=80&w=1200">
                <img src="https://images.unsplash.com/photo-1615634260167-98cbce11bc0e?auto=format&fit=crop&q=80&w=1200" alt="Amber Resin Liquid" className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-[7s] opacity-80" />
              </Editable>
            </div>
            {/* Text Side */}
            <div className="bg-premium-black/80 backdrop-blur-xl p-16 lg:p-32 flex flex-col justify-center relative">
               <div className="absolute top-0 right-0 w-64 h-64 bg-premium-gold/5 blur-3xl rounded-full"></div>
               <span className="text-[9px] font-black uppercase tracking-[0.8em] text-premium-gold mb-8 block">Extract & Age</span>
               <h3 className="text-5xl lg:text-7xl imperial-serif text-white mb-12">From Resin <br/>to <span className="italic gold-luxury-text">Aura</span></h3>
               <p className="text-xl text-white/50 leading-relaxed font-manrope mb-16">
                 We do not blend; we age. Our essences are matured in pitch-black cedar-lined chambers for a minimum of thirty-six months. The result is a sillage so dense, it leaves a shadow in the air.
               </p>
               
               <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/5">
                 <div>
                   <span className="text-3xl text-premium-gold imperial-serif block mb-2">36 Mo.</span>
                   <span className="text-[9px] uppercase tracking-widest text-white/40">Dark Maturation</span>
                 </div>
                 <div>
                   <span className="text-3xl text-premium-gold imperial-serif block mb-2">0%</span>
                   <span className="text-[9px] uppercase tracking-widest text-white/40">Synthetic Filler</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Ingredient Dossier - Replaces Generic Grids */}
      <section className="py-40 relative border-y border-white/5 bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.03)_0%,transparent_100%)]"></div>
        
        <div className="max-w-[1800px] mx-auto px-4 sm:px-12 text-center mb-32 relative z-10">
          <Editable id="ingredients_eyebrow" fallback="Raw Anatomy">
             <p className="text-premium-gold text-[10px] uppercase tracking-[1em] mb-8">Raw Anatomy</p>
          </Editable>
          <Editable id="ingredients_title" fallback="The Source Material">
             <h2 className="text-6xl md:text-9xl noto-serif text-white">The <span className="italic gold-luxury-text">Source</span> Material</h2>
          </Editable>
        </div>

        {/* Masonry-style overlapping layout for ingredients */}
        <div className="relative h-auto lg:h-[1000px] max-w-[1600px] mx-auto px-4 sm:px-12">
           
           {/* Oud Element */}
           <div className="lg:absolute top-10 left-10 w-full lg:w-[45%] h-[500px] group mb-12 lg:mb-0">
              <div className="w-full h-full relative overflow-hidden arabesque-border glass-refraction">
                <Editable id="ing_oud_img" type="image" fallback="https://images.unsplash.com/photo-1608528577891-eb05fcdbfcf2?auto=format&fit=crop&q=80&w=1200">
                  <img src="https://images.unsplash.com/photo-1608528577891-eb05fcdbfcf2?auto=format&fit=crop&q=80&w=1200" alt="Agarwood Smoke" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5s] opacity-60" />
                </Editable>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-12 flex flex-col justify-end">
                  <span className="text-[9px] text-premium-gold uppercase tracking-[0.5em] mb-4">Base Note</span>
                  <h3 className="text-5xl imperial-serif text-white">Cambodian <span className="italic gold-luxury-text">Oud</span></h3>
                </div>
              </div>
           </div>

           {/* Rose Element */}
           <div className="lg:absolute bottom-10 right-10 w-full lg:w-[50%] h-[600px] group mb-12 lg:mb-0 z-20">
              <div className="w-full h-full relative overflow-hidden arabesque-border glass-refraction shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
                <Editable id="ing_rose_img" type="image" fallback="https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=1200">
                  <img src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=1200" alt="Crushed Rose Petals" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5s] opacity-70" />
                </Editable>
                <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-transparent p-16 flex flex-col justify-end">
                  <span className="text-[9px] text-premium-gold uppercase tracking-[0.5em] mb-4">Heart Note</span>
                  <h3 className="text-6xl imperial-serif text-white">Damask <span className="italic gold-luxury-text">Rose</span></h3>
                  <p className="text-sm text-white/50 mt-6 max-w-sm">Distilled immediately at dawn to capture the volatile green compounds missing from inferior absolute.</p>
                </div>
              </div>
           </div>

           {/* Saffron Element - Parallax Overlay */}
           <div className="lg:absolute top-[20%] right-[40%] w-full lg:w-[35%] h-[400px] group z-10 hidden lg:block">
              <div className="w-full h-full relative overflow-hidden border border-white/5 opacity-80 hover:opacity-100 transition-opacity duration-1000 glass-panel">
                <Editable id="ing_saffron_img" type="image" fallback="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800">
                  <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800" alt="Saffron Threads" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5s] saturate-0 group-hover:saturate-100" />
                </Editable>
                <div className="absolute inset-0 bg-black/50 p-8 flex flex-col items-center justify-center text-center">
                  <h3 className="text-4xl imperial-serif text-white">Red <span className="italic gold-luxury-text">Gold</span></h3>
                  <span className="text-[8px] text-white/40 uppercase tracking-[0.5em] mt-4">Top Note • Kashmir</span>
                </div>
              </div>
           </div>

        </div>
      </section>

      {/* The Extrait Collection - Carousel Alternative */}
      <section className="py-40 bg-premium-black relative">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-12 mb-20 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/10 pb-16">
          <div>
            <Editable id="collection_eyebrow" fallback="The Vault">
              <p className="text-premium-gold text-[11px] font-black uppercase tracking-[0.8em] mb-6">The Vault</p>
            </Editable>
            <Editable id="collection_title" fallback="Bottled Masterpieces">
              <h2 className="text-5xl md:text-8xl noto-serif text-white">Bottled <span className="gold-luxury-text italic">Masterpieces</span></h2>
            </Editable>
          </div>
          <Link href="/products" className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 hover:text-premium-gold transition-colors pb-2 border-b border-premium-gold/0 hover:border-premium-gold">
            Enter The Vault →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="w-12 h-12 border border-premium-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-24 px-4 sm:px-12 ${featuredProducts.length < 4 ? 'justify-items-center' : ''}`}>
             {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <div key={product.id} className="group cursor-pointer">
                    {/* Simplified, hyper-elegant product display */}
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a] glass-refraction border border-white/5 group-hover:border-premium-gold/30 transition-colors duration-700 mb-8">
                         <img 
                           src={product.attributes?.find((a: any) => a.name === 'image_url')?.value || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800'} 
                           alt={product.title}
                           className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                         
                         {/* Sillage Indicator Overlay */}
                         <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                            <span className="text-[8px] uppercase tracking-[0.3em] text-white/60">Sillage</span>
                            <div className="flex-1 h-px bg-white/20 relative">
                               <div className="absolute top-0 left-0 h-full bg-premium-gold w-[80%] shadow-[0_0_10px_rgba(197,160,89,0.8)]"></div>
                            </div>
                         </div>
                      </div>
                      <div className="text-center px-4">
                         <p className="text-[9px] text-premium-gold uppercase tracking-[0.4em] mb-3">{product.category?.name || 'Extrait'}</p>
                         <h4 className="text-2xl imperial-serif text-white group-hover:gold-luxury-text transition-colors duration-500 mb-2">{product.title}</h4>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <Editable id="home_products_empty" fallback="Our masterpieces are currently maturing in the vault.">
                  <div className="col-span-full text-center py-20 text-premium-charcoal/40 font-bold uppercase tracking-widest">
                    Our masterpieces are currently maturing in the vault.
                  </div>
                </Editable>
              )}
          </div>
        )}
      </section>

      {/* The Society of Scent - Newsletter */}
      <section className="py-40 bg-zinc-950 text-center relative overflow-hidden border-t border-white/5 pt-60 pb-60">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-premium-gold/10 to-transparent blur-3xl rounded-full pointer-events-none opacity-20"></div>
        
        <div className="max-w-3xl mx-auto px-4 relative z-20 space-y-16">
          <div>
            <Editable id="society_eyebrow" fallback="By Invitation Only">
              <p className="text-premium-gold text-[9px] font-black uppercase tracking-[1rem] mb-8">By Invitation Only</p>
            </Editable>
            <Editable id="society_title" fallback="The Scent Society">
              <h2 className="text-6xl sm:text-8xl md:text-[100px] noto-serif text-white leading-none">The Scent <span className="italic gold-luxury-text block mt-4">Society</span></h2>
            </Editable>
            <p className="mt-8 text-white/40 text-sm uppercase tracking-widest max-w-lg mx-auto leading-loose">
              Receive privileged access to private olfactory commissions and unreleased vintage extraits.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-0 max-w-xl mx-auto border border-premium-gold/30 bg-black/50 p-2 glass-refraction">
            <input
              type="email"
              placeholder="ENTER YOUR DETAILS"
              className="flex-1 bg-transparent px-8 py-6 text-[10px] font-black uppercase tracking-widest outline-none transition-all placeholder:text-white/20 text-white text-center sm:text-left"
            />
            <button className="bg-white/5 hover:bg-premium-gold text-premium-gold hover:text-black px-12 py-6 text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-700">
               <Editable id="society_btn" fallback="Subscribe">
                 <span>Subscribe</span>
               </Editable>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
