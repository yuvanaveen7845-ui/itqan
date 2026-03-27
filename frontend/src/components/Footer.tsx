// Imperial Scent UI Deploy: Phase 14 - Exotic Gold Footer Overhaul
'use client';

import Link from 'next/link';
import { useCMSStore } from '@/store/cms';
import Editable from '@/components/Editable';
import { FiInstagram, FiFacebook, FiTwitter, FiMail, FiPhone, FiArrowUp, FiShield, FiGlobe, FiLayers } from 'react-icons/fi';

export default function Footer() {
  const branding = useCMSStore((state) => state.branding);
  const socials = useCMSStore((state) => state.socials);
  const footer = useCMSStore((state) => state.footer);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-premium-black relative overflow-hidden gold-dust-overlay border-t border-white/5">
      <div className="liquid-gold-divider absolute top-0 left-0"></div>
      
      <div className="max-w-[1800px] mx-auto px-8 md:px-24 py-32 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-20 lg:gap-32">

          {/* Brand Logic & Identity */}
          <div className="lg:col-span-2 space-y-12">
            <Link href="/" className="group flex flex-col items-start gap-2 relative">
              <Editable id="footer_logo_main" fallback={(branding.name || 'iqtan').split(' ')[0]}>
                <span className="text-4xl sm:text-5xl noto-serif text-white tracking-[0.8rem] group-hover:gold-luxury-text transition-all duration-1000 uppercase">
                  {(branding.name || 'iqtan').split(' ')[0]}
                </span>
              </Editable>
              <Editable id="footer_logo_sub" fallback={(branding.name || 'perfumes').split(' ').slice(1).join(' ')}>
                <span className="text-[10px] font-black text-premium-gold/60 tracking-[1rem] uppercase">
                  {(branding.name || 'perfumes').split(' ').slice(1).join(' ')}
                </span>
              </Editable>
              <div className="w-0 group-hover:w-full h-px bg-premium-gold transition-all duration-700 opacity-40"></div>
            </Link>
            
            <div className="space-y-6">
               <Editable id="footer_about" fallback="Experience the pinnacle of fragrance craftsmanship with our exclusive collections, where every scent is a journey of heritage and luxury.">
                 <p className="font-manrope text-sm leading-[2] max-w-sm text-white/60">
                   "{footer.about_text || 'Experience the pinnacle of fragrance craftsmanship with our exclusive collections, where every scent is a journey of heritage and luxury.'}"
                 </p>
               </Editable>
            </div>

            <div className="flex gap-8">
              {[
                { icon: FiInstagram, link: socials.instagram },
                { icon: FiFacebook, link: socials.facebook },
                { icon: FiTwitter, link: socials.twitter },
              ].map((social, idx) => social.link && (
                <a key={idx} href={social.link} target="_blank" rel="noopener noreferrer" className="p-4 border border-white/5 bg-white/5 text-white/40 hover:text-premium-gold hover:border-premium-gold transition-all duration-700 transform hover:-translate-y-2 rounded-full glass-panel">
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Vaults */}
          <div className="space-y-10">
            <Editable id="footer_collections_header" fallback="The Archive">
              <h3 className="text-[10px] font-black text-premium-gold/40 uppercase tracking-[0.8em] font-manrope">The Archive</h3>
            </Editable>
            <ul className="space-y-6">
              {['Private Reserve', 'Oud Masters', 'Floral Bloom', 'The Classics'].map((item, idx) => (
                <li key={item} className="group">
                  <Editable id={`footer_collections_link_${idx}`} fallback={item}>
                    <Link href="/products" className="text-[11px] font-black text-white/40 hover:text-premium-gold transition-all uppercase tracking-widest font-manrope flex items-center gap-3">
                      <span className="w-0 group-hover:w-4 h-px bg-premium-gold transition-all"></span>
                      {item}
                    </Link>
                  </Editable>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10">
            <Editable id="footer_maison_header" fallback="Maison">
              <h3 className="text-[10px] font-black text-premium-gold/40 uppercase tracking-[0.8em] font-manrope">Maison</h3>
            </Editable>
            <ul className="space-y-6">
              {['Our Heritage', 'Scent Discovery', 'Private Atelier', 'Legal Notice'].map((item, idx) => (
                <li key={item} className="group">
                  <Editable id={`footer_maison_link_${idx}`} fallback={item}>
                    <Link href="/about" className="text-[11px] font-black text-white/40 hover:text-premium-gold transition-all uppercase tracking-widest font-manrope flex items-center gap-3">
                      <span className="w-0 group-hover:w-4 h-px bg-premium-gold transition-all"></span>
                      {item}
                    </Link>
                  </Editable>
                </li>
              ))}
            </ul>
          </div>

          {/* Concierge & Support */}
          <div className="space-y-12">
            <div className="space-y-10">
              <Editable id="footer_contact_header" fallback="Concierge">
                <h3 className="text-[10px] font-black text-premium-gold/40 uppercase tracking-[0.8em] font-manrope">Concierge</h3>
              </Editable>
              <div className="space-y-6">
                <div className="flex items-center gap-4 group cursor-pointer relative">
                  <div className="p-3 border border-white/5 rounded-full group-hover:border-premium-gold/40 transition-all shadow-sm">
                    <FiMail size={12} className="text-premium-gold" />
                  </div>
                  <Editable id="footer_contact_email" fallback="concierge@iqtan.com">
                    <span className="text-[11px] text-white/40 group-hover:text-premium-gold font-black uppercase tracking-widest transition-colors">{footer.contact_email || 'concierge@iqtan.com'}</span>
                  </Editable>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer relative">
                   <div className="p-3 border border-white/5 rounded-full group-hover:border-premium-gold/40 transition-all shadow-sm">
                      <FiPhone size={12} className="text-premium-gold" />
                   </div>
                   <Editable id="footer_contact_phone" fallback="+91 XXXX XXXX XX">
                     <span className="text-[11px] text-white/40 group-hover:text-premium-gold font-black uppercase tracking-widest transition-colors">{footer.contact_phone || '+91 XXXX XXXX XX'}</span>
                   </Editable>
                </div>
              </div>
            </div>
            
            <Editable id="footer_backtotop" fallback="Ascend to Apex">
              <button
                onClick={scrollToTop}
                className="group flex items-center gap-4 text-[9px] font-black text-premium-gold p-4 border border-premium-gold/10 hover:border-premium-gold/100 uppercase tracking-[0.6em] font-manrope transition-all duration-700 signature-shimmer"
              >
                Ascend to Apex <FiArrowUp className="group-hover:-translate-y-2 transition-transform duration-700" size={12} />
              </button>
            </Editable>
          </div>

        </div>

        {/* Dynamic Boutique Footer Bottom */}
        <div className="mt-40 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-premium-gold/30 to-transparent"></div>
          
          <div className="flex flex-col gap-4 text-center md:text-left">
              <Editable id="footer_copyright" fallback="All rights reserved.">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] font-manrope">
                  &copy; {new Date().getFullYear()} {branding.name}. ALL RIGHTS RESERVED.
                </p>
              </Editable>
              <div className="flex items-center justify-center md:justify-start gap-6 opacity-30 group">
                <div className="flex items-center gap-2 text-[8px] font-black text-white uppercase tracking-widest">
                  <FiGlobe className="text-premium-gold" /> Global Concierge
                </div>
                <div className="w-px h-3 bg-white/10"></div>
                <div className="flex items-center gap-2 text-[8px] font-black text-white uppercase tracking-widest">
                  <FiShield className="text-premium-gold" /> Encrypted Privilege
                </div>
              </div>
          </div>

          <div className="flex gap-4">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="w-12 h-7 bg-zinc-950 border border-white/5 relative group cursor-pointer transition-all hover:border-premium-gold/40">
                <div className="absolute inset-0 bg-premium-gold/0 group-hover:bg-premium-gold/5 transition-all"></div>
                <div className="w-full h-full flex items-center justify-center">
                  <FiLayers size={10} className="text-premium-gold/10 group-hover:text-premium-gold/40 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
