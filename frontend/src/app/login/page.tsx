'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useEffect } from 'react';

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
          { theme: 'outline', size: 'large' }
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

export default function LoginPage() {
  const router = useRouter();
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
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card shadow-2xl border-0 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-premium-gold focus:border-transparent transition-all outline-none"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <Link href="/forgot-password" className="text-sm font-semibold text-premium-gold hover:text-blue-800 transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-premium-gold focus:border-transparent transition-all outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 flex justify-center items-center gap-2 rounded-lg font-bold text-white transition-all shadow-md ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-premium-gold hover:bg-premium-black hover:shadow-lg'}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 mb-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center w-full">
          <div id="google-signin-button" className="w-full"></div>
        </div>

        <script dangerouslySetInnerHTML={{
          __html: `
            function handleGoogleSignIn(response) {
              const event = new CustomEvent('googleSignIn', { detail: response.credential });
              window.dispatchEvent(event);
            }
          `
        }} />

        <GoogleLoader onSignIn={async (credential) => {
          setLoading(true);
          setError('');
          try {
            const { data } = await authAPI.googleLogin(credential);
            login(data.user, data.token);
            await Promise.all([fetchCart(), fetchWishlist()]);
            router.push('/');
          } catch (err: any) {
            setError(err.response?.data?.error || 'Google login failed');
          } finally {
            setLoading(false);
          }
        }} />

        <p className="text-center mt-8 text-gray-600 font-medium">
          Don't have an account?{' '}
          <Link href="/register" className="text-premium-gold hover:text-blue-800 hover:underline transition-colors font-bold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
