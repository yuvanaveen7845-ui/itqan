'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { FiShoppingCart, FiUser, FiLogOut, FiSearch, FiHeart, FiShield, FiMenu, FiX, FiHome, FiInfo, FiGrid, FiSettings } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-[100]">
      <nav className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            className="p-2 -ml-2 text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => setIsSidebarOpen(true)}
            title="Open Menu"
          >
            <FiMenu size={24} />
          </button>
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter hover:opacity-90 transition-opacity">
            IQTAN<span className="text-gray-900">PERFUMES</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/products" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Collections</Link>
          <Link href="/products?category=Oud" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Oud</Link>
          <Link href="/products?category=Floral" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Floral</Link>
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

      {/* Navigation Sidebar Drawer */}
      <div className={`fixed inset-0 bg-black/50 z-[200] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>

      <div className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[201] shadow-2xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="h-20 px-6 flex items-center justify-between border-b border-gray-100">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter" onClick={() => setIsSidebarOpen(false)}>
            IQTAN<span className="text-gray-900">PERFUMES</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <Link href="/" className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-bold transition-colors" onClick={() => setIsSidebarOpen(false)}>
            <FiHome size={20} />
            Home
          </Link>
          <Link href="/products" className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-bold transition-colors" onClick={() => setIsSidebarOpen(false)}>
            <FiGrid size={20} />
            All Collections
          </Link>
          <Link href="/about" className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-bold transition-colors" onClick={() => setIsSidebarOpen(false)}>
            <FiInfo size={20} />
            Shop Details
          </Link>

          <div className="my-6 border-t border-gray-100"></div>

          {user && (
            <>
              <h3 className="px-4 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">My Account</h3>
              <Link href="/profile" className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-bold transition-colors" onClick={() => setIsSidebarOpen(false)}>
                <FiUser size={20} />
                Profile Dashboard
              </Link>
              <Link href="/wishlist" className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-500 font-bold transition-colors" onClick={() => setIsSidebarOpen(false)}>
                <div className="flex items-center gap-4">
                  <FiHeart size={20} />
                  Wishlist
                </div>
                {wishlistItems.length > 0 && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-black">{wishlistItems.length}</span>}
              </Link>
              <Link href="/cart" className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-bold transition-colors" onClick={() => setIsSidebarOpen(false)}>
                <div className="flex items-center gap-4">
                  <FiShoppingCart size={20} />
                  Shopping Cart
                </div>
                {items.length > 0 && <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-black">{items.length}</span>}
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <div className="my-6 border-t border-gray-100"></div>
              <h3 className="px-4 text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Admin</h3>
              <Link href="/admin" className="flex items-center gap-4 px-4 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 font-bold transition-colors shadow-md" onClick={() => setIsSidebarOpen(false)}>
                <FiShield size={20} className="text-blue-400" />
                Admin Panel
              </Link>
            </>
          )}

          {!user && (
            <div className="mt-8 px-4 space-y-3">
              <Link href="/login" className="block w-full text-center py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:border-blue-600 hover:text-blue-600 transition-colors" onClick={() => setIsSidebarOpen(false)}>
                Sign In
              </Link>
              <Link href="/register" className="block w-full text-center py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-md" onClick={() => setIsSidebarOpen(false)}>
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
