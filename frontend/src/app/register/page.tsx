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
    <div className="bg-white min-h-screen">
      <section className="bg-premium-black pt-60 pb-40 px-12 sm:px-24 grain-overlay relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10 scale-150 rotate-3 transform translate-x-20">
              <span className="text-[300px] imperial-serif text-white pointer-events-none select-none italic font-normal lowercase">Creation</span>
          </div>
          <div className="relative z-10 boutique-layout text-center">
              <div className="space-y-6">
                  <Editable id="register_eyebrow" type="text" fallback="Signature Enrollment">
                      <span className="text-premium-gold text-[10px] font-black uppercase tracking-[1rem] block">New Archive</span>
                  </Editable>
                  <h1 className="text-6xl md:text-8xl imperial-serif text-white lowercase">Join the <span className="gold-luxury-text italic font-normal">Atelier</span></h1>
              </div>
          </div>
      </section>

      <div className="boutique-layout px-12 sm:px-24 section-spacing flex justify-center">
        <div className="max-w-xl w-full space-y-16">
          {error && (
            <div className="p-8 bg-rose-50 border border-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-widest text-center animate-reveal">
              × Error: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
             <div className="space-y-2">
                <label className="text-[9px] font-black text-premium-gold uppercase tracking-widest">Master Name</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-premium-gold/20 py-4 text-2xl imperial-serif italic focus:outline-none focus:border-premium-gold transition-colors"
                  placeholder="Your Name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
             </div>

             <div className="space-y-2">
                <label className="text-[9px] font-black text-premium-gold uppercase tracking-widest">Digital Identity</label>
                <input
                  type="email"
                  className="w-full bg-transparent border-b border-premium-gold/20 py-4 text-2xl imperial-serif italic focus:outline-none focus:border-premium-gold transition-colors"
                  placeholder="master@atelier.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
             </div>

             <div className="space-y-2">
                <label className="text-[9px] font-black text-premium-gold uppercase tracking-widest">Secret Keyword</label>
                <input
                  type="password"
                  className="w-full bg-transparent border-b border-premium-gold/20 py-4 text-3xl font-bold tracking-[1em] focus:outline-none focus:border-premium-gold transition-colors"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
             </div>

             <div className="space-y-2">
                <label className="text-[9px] font-black text-premium-gold uppercase tracking-widest">Confirm Keyword</label>
                <input
                  type="password"
                  className="w-full bg-transparent border-b border-premium-gold/20 py-4 text-3xl font-bold tracking-[1em] focus:outline-none focus:border-premium-gold transition-colors"
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
                <label className="text-[9px] font-black text-premium-charcoal/40 uppercase tracking-widest cursor-pointer group-hover:text-premium-gold transition-colors">
                  I accept the <Link href="/terms" className="underline">Terms</Link> & <Link href="/privacy" className="underline">Sanctuary Privacy</Link>
                </label>
             </div>

             <button
                type="submit"
                disabled={loading || !agreedToTerms}
                className="w-full py-8 bg-premium-black text-premium-gold text-[10px] font-black uppercase tracking-[0.6em] hover:bg-premium-gold hover:text-black transition-all shadow-2xl relative overflow-hidden group/btn disabled:opacity-20 grayscale"
             >
                <span className="relative z-10">{loading ? 'Creating...' : 'Establish Profile'}</span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 opacity-10"></div>
             </button>
          </form>

          <div className="space-y-8">
             <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-premium-gold/10"></div></div>
                <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em]"><span className="px-6 bg-white text-premium-charcoal/40 italic">Signature Providers</span></div>
             </div>
             <div id="google-signup-button" className="w-full overflow-hidden luxury-card-rich outline-none"></div>
          </div>

          <p className="text-center text-[10px] font-black uppercase tracking-widest text-premium-charcoal/60">
            Already enrolled?{' '}
            <Link href="/login" className="text-premium-gold hover:underline">Entry Gateway</Link>
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
