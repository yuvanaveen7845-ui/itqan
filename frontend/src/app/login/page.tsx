'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
          document.getElementById('google-signin-button'),
          { theme: 'outline', size: 'large', width: '100%', shape: 'rectangular' }
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

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';
  const { login } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await authAPI.login(formData);
      login(data.user, data.token);
      await Promise.all([fetchCart(), fetchWishlist()]);
      router.push(returnTo);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Access denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-premium-black pt-60 pb-40 px-12 sm:px-24 grain-overlay relative overflow-hidden">
          <div className="relative z-10 boutique-layout text-center">
              <div className="space-y-6">
                  <Editable id="login_eyebrow" type="text" fallback="Signature Authentication">
                      <span className="text-premium-gold text-[10px] font-black uppercase tracking-[1rem] block">Private Gateway</span>
                  </Editable>
                  <h1 className="text-6xl md:text-8xl imperial-serif text-white lowercase">Welcome <span className="gold-luxury-text italic font-normal">Back</span></h1>
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
                <div className="flex justify-between items-end">
                   <label className="text-[9px] font-black text-premium-gold uppercase tracking-widest">Secret Keyword</label>
                   <Link href="/forgot-password" className="text-[8px] font-black text-premium-charcoal/40 hover:text-premium-gold uppercase tracking-widest transition-colors mb-2">Forgot Protocol?</Link>
                </div>
                <input
                  type="password"
                  className="w-full bg-transparent border-b border-premium-gold/20 py-4 text-3xl font-bold tracking-[1em] focus:outline-none focus:border-premium-gold transition-colors"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
             </div>

             <button
                type="submit"
                disabled={loading}
                className="w-full py-8 bg-premium-black text-premium-gold text-[10px] font-black uppercase tracking-[0.6em] hover:bg-premium-gold hover:text-black transition-all shadow-2xl relative overflow-hidden group/btn"
             >
                <span className="relative z-10">{loading ? 'Verifying...' : 'Establish Session'}</span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 opacity-10"></div>
             </button>
          </form>

          <div className="space-y-8">
             <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-premium-gold/10"></div></div>
                <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em]"><span className="px-6 bg-white text-premium-charcoal/40 italic">Signature Providers</span></div>
             </div>
             <div id="google-signin-button" className="w-full overflow-hidden luxury-card-rich outline-none"></div>
          </div>

          <p className="text-center text-[10px] font-black uppercase tracking-widest text-premium-charcoal/60">
            No archives yet?{' '}
            <Link href="/register" className="text-premium-gold hover:underline">Create Protocol</Link>
          </p>

          <GoogleLoader onSignIn={async (credential) => {
            setLoading(true);
            setError('');
            try {
              const { data } = await authAPI.googleLogin(credential);
              login(data.user, data.token);
              await Promise.all([fetchCart(), fetchWishlist()]);
              router.push(returnTo);
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-60 text-center text-[10px] font-black uppercase tracking-[1rem] text-premium-gold animate-pulse">Establishing Connection...</div>}>
      <LoginContent />
    </Suspense>
  );
}
