'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { FiShoppingCart, FiUser, FiLogOut, FiSearch, FiHeart, FiShield } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-[100]">
      <nav className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter hover:opacity-90 transition-opacity">
          TEXTILE<span className="text-gray-900">PRO</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/products" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Collections</Link>
          <Link href="/products?fabric_type=Silk" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Silk</Link>
          <Link href="/products?fabric_type=Cotton" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Cotton</Link>
        </div>

        <div className="flex gap-4 sm:gap-6 items-center">
          <Link href="/search" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all" title="Search">
            <FiSearch size={22} />
          </Link>

          <Link href="/wishlist" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all relative" title="Wishlist">
            <FiHeart size={22} className={wishlistItems.length > 0 ? 'fill-red-500 text-red-500' : ''} />
            {wishlistItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-black animate-pulse">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link href="/cart" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all relative" title="Cart">
            <FiShoppingCart size={22} />
            {items.length > 0 && (
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-black">
                {items.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </Link>

          <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-2 bg-gray-900 text-white text-xs font-black px-4 py-2 rounded-lg hover:bg-gray-800 transition shadow-lg shadow-gray-200"
                >
                  <FiShield size={14} className="text-blue-400" />
                  ADMIN
                </Link>
              )}

              <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-bold text-sm">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition hover:shadow-md">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </Link>

              <button
                onClick={() => logout()}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2 sm:gap-4">
              <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-blue-600 px-4 py-2 transition">
                Sign In
              </Link>
              <Link href="/register" className="hidden sm:inline-block bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 hover:shadow-lg shadow-blue-100 transition-all">
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
