'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useCMSStore } from '@/store/cms';
import Editable from '@/components/Editable';
import { FiShoppingCart, FiUser, FiLogOut, FiSearch, FiHeart, FiShield, FiMenu, FiX, FiHome, FiInfo, FiGrid, FiChevronRight } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const branding = useCMSStore((state) => state.branding);
  const announcement = useCMSStore((state) => state.announcement);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Premium Announcement Bar */}
      {announcement.is_active && (
        <div className="bg-premium-black text-premium-gold text-[10px] font-black uppercase tracking-[0.3em] py-3 text-center border-b border-premium-gold/10 font-inter">
          {announcement.link ? (
            <Link href={announcement.link} className="hover:opacity-80 transition-opacity">
              {announcement.text}
            </Link>
          ) : (
            announcement.text
          )}
        </div>
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${isScrolled
          ? 'glass-panel py-3 shadow-2xl translate-y-2 mx-auto max-w-[98%] px-10 rounded-2xl'
          : 'bg-transparent py-10'
          }`}
      >
        <nav className="max-w-[1800px] mx-auto px-6 grid grid-cols-3 items-center">

          {/* Left: Desktop Nav - High Tracking */}
          <div className="flex items-center gap-10">
            <button
              className={`p-2 -ml-2 transition-all duration-500 transform hover:scale-110 ${isScrolled ? 'text-premium-black' : 'text-white'}`}
              onClick={() => setIsSidebarOpen(true)}
              title="Open Menu"
            >
              <FiMenu size={20} />
            </button>
            <div className="hidden lg:flex items-center gap-10">
              <Editable id="nav_collections" fallback="Collections">
                <Link href="/products" className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${isScrolled ? 'text-premium-black' : 'text-white'} hover:text-premium-gold`}>Collections</Link>
              </Editable>
              <Editable id="nav_oud" fallback="Oud">
                <Link href="/products?category=Oud" className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${isScrolled ? 'text-premium-black' : 'text-white'} hover:text-premium-gold`}>Oud</Link>
              </Editable>
              <Editable id="nav_floral" fallback="Floral">
                <Link href="/products?category=Floral" className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${isScrolled ? 'text-premium-black' : 'text-white'} hover:text-premium-gold`}>Floral</Link>
              </Editable>
            </div>
          </div>

          {/* Center: Imperial Logo */}
          <div className="flex justify-center flex-col items-center">
            <Link href="/" className="group flex flex-col items-center text-center">
              <Editable id="header_logo_main" fallback="iqtan">
                <span className={`text-3xl md:text-5xl imperial-serif lowercase tracking-[0.2em] group-hover:gold-luxury-text transition-all duration-700 ${isScrolled ? 'text-premium-black' : 'text-white'}`}>
                  {branding.name?.split(' ')[0] || 'iqtan'}
                </span>
              </Editable>
              <Editable id="header_logo_sub" fallback="perfumes">
                <span className="text-[9px] font-black text-premium-gold tracking-[0.8em] uppercase -mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  {branding.name?.split(' ').slice(1).join(' ') || 'perfumes'}
                </span>
              </Editable>
            </Link>
          </div>

          {/* Right: Icons & Profile */}
          <div className="flex justify-end items-center gap-3 sm:gap-6">
            <Link href="/search" className={`hidden md:flex p-2 items-center justify-center transition-all ${isScrolled ? 'text-premium-black' : 'text-white'} hover:text-premium-gold`} title="Search">
              <FiSearch size={22} />
            </Link>

            <Link href="/wishlist" className={`hidden sm:block p-2 transition-all relative group ${isScrolled ? 'text-premium-black' : 'text-white'} hover:text-premium-gold`} title="Wishlist">
              <FiHeart size={20} className={wishlistItems.length > 0 ? 'fill-premium-gold text-premium-gold' : ''} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-premium-black text-premium-gold text-[7px] rounded-full w-4 h-4 flex items-center justify-center font-black border border-premium-gold/30">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className={`p-2 transition-all relative group ${isScrolled ? 'text-premium-black' : 'text-white'} hover:text-premium-gold`} title="Cart">
              <FiShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-premium-black text-premium-gold text-[7px] rounded-full w-4 h-4 flex items-center justify-center font-black border border-premium-gold/30">
                  {items.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </Link>

            <div className="h-6 w-px bg-premium-gold/20 mx-1 hidden sm:block"></div>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link href="/profile" className="group flex items-center gap-3">
                  <div className="hidden md:block">
                    <p className="text-[9px] font-black text-premium-gold uppercase tracking-widest text-right">Concierge</p>
                    <p className={`text-[10px] font-bold ${isScrolled ? 'text-premium-black' : 'text-white'} group-hover:text-premium-gold transition-colors`}>{user.name.split(' ')[0]}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-premium-gold/20 bg-premium-black/5 overflow-hidden flex items-center justify-center group-hover:border-premium-gold transition-all duration-700 shadow-xl">
                    <span className="text-[10px] sm:text-xs font-black text-premium-gold">{user.name.charAt(0)}</span>
                  </div>
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={`hidden xl:flex items-center gap-2 text-[8px] font-black tracking-[0.4em] ${isScrolled ? 'text-premium-gold/60 border-premium-gold/20' : 'text-white/60 border-white/10'} border px-4 py-2 rounded-none hover:bg-premium-gold hover:text-white transition-all duration-700`}
                  >
                    <Editable id="header_surveillance_label" fallback="ATELIER">
                      <span>ATELIER</span>
                    </Editable>
                  </Link>
                )}
              </div>
            ) : (
              <Link href="/login" className={`text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] overflow-hidden group relative border px-4 sm:px-7 py-2 sm:py-3 transition-all duration-700 ${isScrolled ? 'border-premium-black text-premium-black' : 'border-white/30 text-white hover:border-premium-gold'}`}>
                 <span className="relative z-10 group-hover:text-premium-gold transition-colors">Sign In</span>
                 <div className="absolute inset-0 bg-premium-black translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Navigation Sidebar Drawer */}
      <div
        className={`fixed inset-0 bg-premium-black/60 backdrop-blur-sm z-[200] transition-opacity duration-700 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <div className={`fixed top-0 left-0 h-full w-full sm:w-[550px] bg-white z-[201] shadow-2xl transition-all duration-1000 cubic-bezier(0.19, 1, 0.22, 1) ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col backdrop-blur-3xl bg-white/98`}>
        <div className="h-40 px-12 flex items-center justify-between border-b border-premium-gold/10 bg-premium-black/5">
          <div className="flex flex-col">
            <span className="text-3xl imperial-serif text-premium-black italic lowercase">the atlas</span>
            <span className="text-[8px] font-black text-premium-gold tracking-[0.8em] uppercase font-inter mt-1 opacity-70">Privileged Access Menu</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="group w-14 h-14 bg-premium-black text-premium-gold flex items-center justify-center rounded-full hover:rotate-90 transition-all duration-700 border border-premium-gold/20 shadow-xl">
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-12 px-12 space-y-12">
          {/* Primary Navigation */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-premium-gold tracking-[0.4em] uppercase font-inter">Universe</h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'The Collection', path: '/products', icon: FiGrid },
                { label: 'Fragrance Houses', path: '/products?category=Oud', icon: FiHome },
                { label: 'Scent Discovery', path: '/about', icon: FiInfo },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.path}
                  className="group flex items-center justify-between py-2 border-b border-gray-100 hover:border-premium-gold transition-colors"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="text-xl font-playfair italic text-premium-black group-hover:translate-x-4 transition-transform duration-500">{item.label}</span>
                  <FiChevronRight className="text-premium-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Account & Administration */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-premium-gold tracking-[0.4em] uppercase font-inter">My Space</h3>
            <div className="grid grid-cols-1 gap-2">
              {user ? (
                <>
                  <Link href="/profile" className="text-sm font-bold text-premium-black hover:text-premium-gold py-2 block font-inter" onClick={() => setIsSidebarOpen(false)}>Dashboard Overview</Link>
                  <Link href="/wishlist" className="text-sm font-bold text-premium-black hover:text-premium-gold py-2 block font-inter" onClick={() => setIsSidebarOpen(false)}>Signature Likes</Link>
                  {isAdmin && (
                    <Link href="/admin" className="mt-4 px-6 py-4 bg-premium-black text-premium-gold text-xs font-black tracking-widest text-center block rounded-none hover:bg-premium-gold hover:text-premium-black transition-all font-inter" onClick={() => setIsSidebarOpen(false)}>
                      ACCESS SECURITY PANEL
                    </Link>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/login" className="px-6 py-4 border border-premium-black text-premium-black text-[10px] font-black tracking-widest text-center uppercase hover:bg-premium-black hover:text-premium-gold transition-all font-inter" onClick={() => setIsSidebarOpen(false)}>Login</Link>
                  <Link href="/register" className="px-6 py-4 bg-premium-black text-premium-gold text-[10px] font-black tracking-widest text-center uppercase hover:bg-premium-gold hover:text-premium-black transition-all font-inter" onClick={() => setIsSidebarOpen(false)}>Join Us</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-12 border-t border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div className="text-[9px] font-black text-premium-charcoal tracking-widest uppercase font-inter">
            © {mounted ? new Date().getFullYear() : '2024'} {branding.name || 'IQTAN'}
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-premium-black/5"></div>
            <div className="w-6 h-6 rounded-full bg-premium-black/5"></div>
          </div>
        </div>
      </div>
    </>
  );
}
