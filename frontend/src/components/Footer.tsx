'use client';

import Link from 'next/link';
import { useCMSStore } from '@/store/cms';
import Editable from '@/components/Editable';
import { FiInstagram, FiFacebook, FiTwitter, FiMail, FiPhone, FiArrowUp } from 'react-icons/fi';

export default function Footer() {
  const branding = useCMSStore((state) => state.branding);
  const socials = useCMSStore((state) => state.socials);
  const footer = useCMSStore((state) => state.footer);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-premium-black border-t border-premium-gold/10">
      <div className="max-w-[1800px] mx-auto px-8 md:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16">

          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="group flex flex-col">
              <span className="text-3xl font-playfair font-black text-white tracking-[0.1em] lowercase group-hover:text-premium-gold transition-colors">
                {branding.name?.split(' ')[0] || 'iqtan'}
              </span>
              <span className="text-[10px] font-inter font-black text-premium-gold tracking-[0.5em] uppercase -mt-1">
                {branding.name?.split(' ').slice(1).join(' ') || 'perfumes'}
              </span>
            </Link>
            <Editable id="footer_about" fallback="Experience the pinnacle of fragrance craftsmanship with our exclusive collections, where every scent is a journey of heritage and luxury.">
              <p className="text-white/60 text-sm leading-relaxed max-w-sm italic">
                {footer.about_text || 'Experience the pinnacle of fragrance craftsmanship with our exclusive collections, where every scent is a journey of heritage and luxury.'}
              </p>
            </Editable>
            <div className="flex gap-10">
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-premium-gold transition-all transform hover:-translate-y-1">
                  <FiInstagram size={20} />
                </a>
              )}
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-premium-gold transition-all transform hover:-translate-y-1">
                  <FiFacebook size={20} />
                </a>
              )}
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-premium-gold transition-all transform hover:-translate-y-1">
                  <FiTwitter size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Navigation Groups */}
          <div>
            <Editable id="footer_collections_header" fallback="Collections">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 font-inter">Collections</h3>
            </Editable>
            <ul className="space-y-4">
              {['Private Reserve', 'Oud Masters', 'Floral Bloom', 'The Classics'].map((item, idx) => (
                <li key={item}>
                  <Editable id={`footer_collections_link_${idx}`} fallback={item}>
                    <Link href="/products" className="text-[11px] font-bold text-white/60 hover:text-premium-gold transition-colors uppercase tracking-widest font-inter">{item}</Link>
                  </Editable>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Editable id="footer_maison_header" fallback="Maison">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 font-inter">Maison</h3>
            </Editable>
            <ul className="space-y-4">
              {['Our Heritage', 'Scent Discovery', 'Private Atelier', 'Legal Notice'].map((item, idx) => (
                <li key={item}>
                  <Editable id={`footer_maison_link_${idx}`} fallback={item}>
                    <Link href="/about" className="text-[11px] font-bold text-white/60 hover:text-premium-gold transition-colors uppercase tracking-widest font-inter">{item}</Link>
                  </Editable>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-8">
            <div>
              <Editable id="footer_contact_header" fallback="Experience">
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 font-inter">Experience</h3>
              </Editable>
              <div className="space-y-4">
                <Editable id="footer_contact_email" fallback="concierge@iqtan.com">
                  <p className="text-[11px] text-white/60 font-bold flex items-center gap-3 uppercase tracking-widest font-inter">
                    <FiMail className="text-premium-gold" /> {footer.contact_email || 'concierge@iqtan.com'}
                  </p>
                </Editable>
                <Editable id="footer_contact_phone" fallback="+91 XXXX XXXX XX">
                  <p className="text-[11px] text-white/60 font-bold flex items-center gap-3 uppercase tracking-widest font-inter">
                    <FiPhone className="text-premium-gold" /> {footer.contact_phone || '+91 XXXX XXXX XX'}
                  </p>
                </Editable>
              </div>
            </div>
            <Editable id="footer_backtotop" fallback="Back to Apex">
              <button
                onClick={scrollToTop}
                className="group flex items-center gap-3 text-[9px] font-black text-premium-gold uppercase tracking-[0.4em] font-inter"
              >
                Back to Apex <FiArrowUp className="group-hover:-translate-y-1 transition-transform" />
              </button>
            </Editable>
          </div>

        </div>

        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <Editable id="footer_copyright" fallback="All rights reserved.">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] font-inter">
              &copy; {new Date().getFullYear()} {branding.name}. {footer.copyright_text || 'All rights reserved.'}
            </p>
          </Editable>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="w-8 h-5 bg-premium-cream rounded-sm border border-premium-gold/5"></div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
