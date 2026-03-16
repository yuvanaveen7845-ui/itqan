'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import Editable from '@/components/Editable';

declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function GoogleLoader({ onSignIn }: { onSignIn: (credential: string) => void }) {
  useEffect(() => {
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: any) => onSignIn(response.credential),
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signup-button'),
          { theme: 'outline', size: 'large', width: '100%', text: 'signup_with' }
        );
      }
    };

    const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (script) {
      script.addEventListener('load', initGoogle);
      if (window.google) initGoogle();
    }

    return () => {
      if (script) script.removeEventListener('load', initGoogle);
    };
  }, [onSignIn]);

  return null;
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreedToTerms) {
      setError('Agreement Protocol Required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Secret Keywords mismatch');
      return;
    }

    setLoading(true);

    try {
      const { data } = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      login(data.user, data.token);
      await Promise.all([fetchCart(), fetchWishlist()]);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Archive creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-premium-black min-h-screen">
      <section className="bg-premium-black pt-36 sm:pt-60 pb-16 sm:pb-40 px-4 sm:px-12 md:px-24 grain-overlay relative overflow-hidden">
          <div className="relative z-10 boutique-layout text-center">
              <div className="space-y-6">
                  <Editable id="register_eyebrow" type="text" fallback="Signature Enrollment">
                      <span className="text-premium-gold text-[10px] font-black uppercase tracking-[1rem] block">New Archive</span>
                  </Editable>
                  <Editable id="register_title" fallback="Join the Atelier">
                      <h1 className="text-6xl md:text-8xl imperial-serif text-white lowercase">Join the <span className="gold-luxury-text italic font-normal">Atelier</span></h1>
                  </Editable>
              </div>
          </div>
      </section>

      <div className="boutique-layout px-4 sm:px-12 md:px-24 section-spacing flex justify-center">
        <div className="max-w-xl w-full space-y-16">
          {error && (
            <div className="p-6 sm:p-8 bg-rose-900/20 border border-rose-500/20 text-rose-300 text-[10px] font-black uppercase tracking-widest text-center animate-reveal">
              × Error: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
             <div className="space-y-2">
                <Editable id="register_label_name" fallback="Master Name">
                  <label className="text-[9px] font-black text-premium-gold uppercase tracking-widest">Master Name</label>
                </Editable>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-premium-gold/20 py-4 text-lg sm:text-2xl imperial-serif italic text-white focus:outline-none focus:border-premium-gold transition-colors placeholder:text-white/30"
                  placeholder="Your Name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
             </div>

             <div className="space-y-2">
                <Editable id="register_label_email" fallback="Digital Identity">
                  <label className="text-[9px] font-black text-premium-gold uppercase tracking-widest">Digital Identity</label>
                </Editable>
                <input
                  type="email"
                  className="w-full bg-transparent border-b border-premium-gold/20 py-4 text-lg sm:text-2xl imperial-serif italic text-white focus:outline-none focus:border-premium-gold transition-colors placeholder:text-white/30"
                  placeholder="master@atelier.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
             </div>

             <div className="space-y-2">
                <Editable id="register_label_password" fallback="Secret Keyword">
                  <label className="text-[9px] font-black text-premium-gold uppercase tracking-widest">Secret Keyword</label>
                </Editable>
                <input
                  type="password"
                  className="w-full bg-transparent border-b border-premium-gold/20 py-4 text-2xl sm:text-3xl font-bold tracking-[0.5em] sm:tracking-[1em] text-white focus:outline-none focus:border-premium-gold transition-colors"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
             </div>

             <div className="space-y-2">
                <Editable id="register_label_confirm" fallback="Confirm Keyword">
                  <label className="text-[9px] font-black text-premium-gold uppercase tracking-widest">Confirm Keyword</label>
                </Editable>
                <input
                  type="password"
                  className="w-full bg-transparent border-b border-premium-gold/20 py-4 text-2xl sm:text-3xl font-bold tracking-[0.5em] sm:tracking-[1em] text-white focus:outline-none focus:border-premium-gold transition-colors"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
             </div>

             <div className="flex items-center gap-6 group cursor-pointer" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                <div className={`w-6 h-6 border ${agreedToTerms ? 'bg-premium-gold border-premium-gold' : 'border-premium-gold/20'} flex items-center justify-center transition-all`}>
                   {agreedToTerms && <span className="text-black text-[10px] font-bold">✓</span>}
                </div>
                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest cursor-pointer group-hover:text-premium-gold transition-colors block leading-relaxed">
                  <Editable id="register_terms" fallback="I accept the Terms & Sanctuary Privacy">
                    <span>I accept the <Link href="/terms" className="underline hover:text-white transition-colors">Terms</Link> & <Link href="/privacy" className="underline hover:text-white transition-colors">Sanctuary Privacy</Link></span>
                  </Editable>
                </label>
             </div>

             <button
                type="submit"
                disabled={loading || !agreedToTerms}
                className="w-full py-6 sm:py-8 bg-premium-gold text-premium-black text-[10px] font-black uppercase tracking-[0.6em] hover:bg-white hover:text-premium-black transition-all shadow-2xl relative overflow-hidden group/btn disabled:opacity-20 grayscale"
             >
                <Editable id="register_submit_btn" fallback="Establish Profile">
                  <span className="relative z-10">{loading ? 'Creating...' : 'Establish Profile'}</span>
                </Editable>
                <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 opacity-10"></div>
             </button>
          </form>

           <div className="space-y-8">
             <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-premium-gold/10"></div></div>
                <Editable id="register_providers_label" fallback="Signature Providers">
                  <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em]"><span className="px-6 bg-premium-black text-white/40 italic">Signature Providers</span></div>
                </Editable>
             </div>
             <div id="google-signup-button" className="w-full overflow-hidden luxury-card-rich outline-none"></div>
          </div>

          <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/60">
            <Editable id="register_has_account_text" fallback="Already enrolled?">
              <span>Already enrolled?{' '}</span>
            </Editable>
            <Editable id="register_login_link" fallback="Entry Gateway">
              <Link href="/login" className="text-premium-gold hover:underline">Entry Gateway</Link>
            </Editable>
          </p>

          <GoogleLoader onSignIn={async (credential) => {
            setLoading(true);
            setError('');
            try {
              const { data } = await authAPI.googleLogin(credential);
              login(data.user, data.token);
              await Promise.all([fetchCart(), fetchWishlist()]);
              router.push('/');
            } catch (err: any) {
              setError(err.response?.data?.error || 'Google verification failed');
            } finally {
              setLoading(false);
            }
          }} />
        </div>
      </div>
    </div>
  );
}
