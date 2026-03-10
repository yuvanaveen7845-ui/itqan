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

  const branding = useCMSStore((state) => state.branding);
  const announcement = useCMSStore((state) => state.announcement);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
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
        className={`sticky top-0 z-[100] transition-all duration-500 border-b ${isScrolled
          ? 'bg-white/95 backdrop-blur-md py-2 border-premium-gold/10 shadow-sm'
          : 'bg-white py-6 border-transparent'
          }`}
      >
        <nav className="max-w-[1800px] mx-auto px-8 grid grid-cols-3 items-center">

          {/* Left: Desktop Nav / Mobile Menu */}
          <div className="flex items-center gap-8">
            <button
              className="p-2 -ml-2 text-premium-black hover:text-premium-gold transition-all duration-300 transform hover:scale-110"
              onClick={() => setIsSidebarOpen(true)}
              title="Open Menu"
            >
              <FiMenu size={20} />
            </button>
            <div className="hidden lg:flex items-center gap-10">
              <Editable id="nav_collections" fallback="Collections">
                <Link href="/products" className="text-[11px] font-bold text-premium-charcoal hover:text-premium-gold transition-colors uppercase tracking-[0.2em] font-inter">Collections</Link>
              </Editable>
              <Editable id="nav_oud" fallback="Oud">
                <Link href="/products?category=Oud" className="text-[11px] font-bold text-premium-charcoal hover:text-premium-gold transition-colors uppercase tracking-[0.2em] font-inter">Oud</Link>
              </Editable>
              <Editable id="nav_floral" fallback="Floral">
                <Link href="/products?category=Floral" className="text-[11px] font-bold text-premium-charcoal hover:text-premium-gold transition-colors uppercase tracking-[0.2em] font-inter">Floral</Link>
              </Editable>
            </div>
          </div>

          {/* Center: Centered Logo */}
          <div className="flex justify-center flex-col items-center">
            <Link href="/" className="group flex flex-col items-center text-center">
              <Editable id="header_logo_main" fallback="iqtan">
                <span className="text-3xl md:text-4xl font-playfair font-black text-premium-black tracking-[0.1em] lowercase group-hover:text-premium-gold transition-colors duration-500">
                  {branding.name?.split(' ')[0] || 'iqtan'}
                </span>
              </Editable>
              <Editable id="header_logo_sub" fallback="perfumes">
                <span className="text-[10px] font-inter font-black text-premium-gold tracking-[0.5em] uppercase -mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  {branding.name?.split(' ').slice(1).join(' ') || 'perfumes'}
                </span>
              </Editable>
            </Link>
          </div>

          {/* Right: Icons & Profile */}
          <div className="flex justify-end items-center gap-2 sm:gap-6">
            <Link href="/search" className="hidden sm:block p-2 text-premium-charcoal hover:text-premium-gold transition-all" title="Search">
              <FiSearch size={20} />
            </Link>

            <Link href="/wishlist" className="p-2 text-premium-charcoal hover:text-premium-gold transition-all relative group" title="Wishlist">
              <FiHeart size={20} className={wishlistItems.length > 0 ? 'fill-premium-gold text-premium-gold' : ''} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-premium-black text-premium-gold text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-black border border-premium-gold/30">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="p-2 text-premium-charcoal hover:text-premium-gold transition-all relative group" title="Cart">
              <FiShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-premium-black text-premium-gold text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-black border border-premium-gold/30">
                  {items.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </Link>

            <div className="h-4 w-px bg-premium-gold/20 mx-2 hidden md:block"></div>

            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="group flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-premium-gold/30 bg-premium-white overflow-hidden flex items-center justify-center group-hover:border-premium-gold transition-colors">
                    <span className="text-xs font-black text-premium-gold">{user.name.charAt(0)}</span>
                  </div>
                  <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest text-premium-charcoal group-hover:text-premium-gold transition-colors font-inter">{user.name.split(' ')[0]}</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden lg:flex items-center gap-2 text-[9px] font-black tracking-widest text-premium-gold border border-premium-gold/30 px-3 py-1.5 rounded-full hover:bg-premium-gold hover:text-premium-white transition-all font-inter"
                  >
                    <Editable id="header_surveillance_label" fallback="SURVEILLANCE">
                      <span>SURVEILLANCE</span>
                    </Editable>
                  </Link>
                )}
                <button
                  onClick={() => logout()}
                  className="p-2 text-premium-charcoal/40 hover:text-rose-600 transition-colors"
                  title="Logout"
                >
                  <FiLogOut size={16} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-premium-black border border-premium-black px-6 py-2.5 hover:bg-premium-black hover:text-premium-gold transition-all duration-500 font-inter">
                Sign In
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

      <div className={`fixed top-0 left-0 h-full w-full sm:w-[500px] bg-white z-[201] shadow-2xl transition-all duration-700 cubic-bezier(0.19, 1, 0.22, 1) ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="h-32 px-12 flex items-center justify-between border-b border-gray-50">
          <div className="flex flex-col">
            <span className="text-2xl font-playfair font-black text-premium-black tracking-widest">MENU</span>
            <span className="text-[8px] font-black text-premium-gold tracking-[0.5em] uppercase font-inter">Private Collection</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="group p-4 bg-premium-black text-premium-gold rounded-full hover:rotate-90 transition-all duration-500">
            <FiX size={20} />
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
            © {new Date().getFullYear()} {branding.name || 'IQTAN'}
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
