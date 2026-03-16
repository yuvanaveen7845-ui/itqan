'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useCMSStore } from '@/store/cms';
import Editable from '@/components/Editable';
import { FiShoppingCart, FiUser, FiLogOut, FiSearch, FiHeart, FiShield, FiMenu, FiX, FiHome, FiInfo, FiGrid, FiChevronRight, FiShoppingBag } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const { items: wishlistItems } = useWishlistStore();
  const wishlistCount = wishlistItems.length;
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
            <Editable id="header_announcement" fallback={announcement.text}>
              {announcement.text}
            </Editable>
          )}
        </div>
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-[1s] ease-[cubic-bezier(0.19,1,0.22,1)] ${isScrolled
          ? 'bg-black/95 backdrop-blur-3xl py-4 border-b border-premium-gold/20 shadow-[0_4px_30px_rgba(197,160,89,0.08)]'
          : 'bg-transparent py-6 sm:py-10'
          }`}
      >
        <div className="max-w-[1700px] mx-auto px-4 sm:px-12 md:px-24 flex items-center justify-between">
          {/* Brand Identity - Center Link */}
          <div className="flex items-center gap-12">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-white/60 hover:text-premium-gold transition-colors block lg:hidden"
              >
                <FiMenu size={20} />
              </button>
              
              <Link href="/" className="flex flex-col items-start group">
                <Editable id="header_logo" type="text" fallback="IQTAN">
                  <span className="text-2xl sm:text-3xl imperial-serif text-white tracking-[0.8rem] group-hover:gold-luxury-text transition-all duration-700">IQTAN</span>
                </Editable>
              </Link>

              <nav className="hidden lg:flex items-center gap-10 ml-8">
                <Editable id="header_nav_collections" fallback="Collections">
                  <Link href="/products" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60 hover:text-premium-gold transition-all">Collections</Link>
                </Editable>
                <Editable id="header_nav_atelier" fallback="Atelier">
                  <Link href="/about" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60 hover:text-premium-gold transition-all">Atelier</Link>
                </Editable>
              </nav>
          </div>

          {/* Action Center - Unified Cluster */}
          <div className="flex items-center gap-6 sm:gap-10">
            <Link href="/search" className="text-white/60 hover:text-premium-gold transition-colors hidden sm:block"><FiSearch size={16} /></Link>
            
            <Link href="/cart" className="text-white/60 hover:text-premium-gold transition-colors flex items-center gap-2">
              <FiShoppingBag size={16} />
              {itemCount > 0 && <span className="text-[8px] font-black text-premium-gold tracking-widest">{itemCount}</span>}
            </Link>

            {user ? (
              <div className="relative group/user">
                <button className="flex items-center gap-3 py-2 pl-4 border-l border-white/10">
                  <span className="text-[8px] font-black text-white uppercase tracking-widest hidden sm:block">{user.name.split(' ')[0]}</span>
                  <div className="w-8 h-8 rounded-full border border-premium-gold/20 flex items-center justify-center bg-white/5">
                     <span className="text-[9px] font-black text-premium-gold">{user.name.charAt(0)}</span>
                  </div>
                </button>

                {/* Refined Dropdown */}
                <div className="absolute top-full right-0 mt-2 w-56 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-500 translate-y-2 group-hover/user:translate-y-0 z-50">
                  <div className="bg-premium-black border border-white/10 p-6 shadow-2xl skew-x-[-1deg]">
                    <div className="space-y-4 skew-x-[1deg]">
                      <Link href="/profile" className="flex items-center justify-between group/link">
                        <Editable id="header_dropdown_portfolio" fallback="Portfolio">
                          <span className="text-[8px] font-black text-white/60 hover:text-premium-gold uppercase tracking-widest transition-colors">Portfolio</span>
                        </Editable>
                        <FiChevronRight size={10} className="text-premium-gold opacity-0 group-hover/link:opacity-100" />
                      </Link>
                      <Link href="/wishlist" className="flex items-center justify-between group/link">
                        <Editable id="header_dropdown_sanctuary" fallback="Sanctuary">
                          <span className="text-[8px] font-black text-white/60 hover:text-premium-gold uppercase tracking-widest transition-colors">Sanctuary</span>
                        </Editable>
                        <FiChevronRight size={10} className="text-premium-gold opacity-0 group-hover/link:opacity-100" />
                      </Link>
                      {isAdmin && (
                        <Editable id="header_dropdown_admin" fallback="Atelier Control">
                          <Link href="/admin" className="block text-[8px] font-black text-premium-gold uppercase tracking-widest pt-4 border-t border-white/5">Atelier Control</Link>
                        </Editable>
                      )}
                      <button onClick={logout} className="w-full pt-4 border-t border-white/5 text-left group/link flex items-center justify-between">
                        <Editable id="header_dropdown_logout" fallback="Terminate">
                          <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Terminate</span>
                        </Editable>
                        <FiLogOut size={10} className="text-rose-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Editable id="header_login_btn" fallback="Login">
                <Link href="/login" className="text-[8px] font-black text-white hover:text-premium-gold uppercase tracking-widest border border-premium-gold/20 px-5 py-2 hover:bg-premium-gold hover:text-black transition-all">
                  Login
                </Link>
              </Editable>
            )}
            
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-white/60 hover:text-premium-gold transition-colors hidden lg:block"
            >
              <FiMenu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sidebar Drawer */}
      <div
        className={`fixed inset-0 bg-premium-black/60 backdrop-blur-sm z-[200] transition-opacity duration-700 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <div className={`fixed top-0 left-0 h-full w-full sm:w-[550px] bg-premium-black z-[201] shadow-2xl transition-all duration-1000 cubic-bezier(0.19, 1, 0.22, 1) ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col backdrop-blur-3xl border-r border-premium-gold/10`}>
        <div className="h-40 px-6 sm:px-12 flex items-center justify-between border-b border-premium-gold/10">
          <div className="flex flex-col">
            <Editable id="sidebar_title" fallback="the atlas">
              <span className="text-3xl imperial-serif text-white italic lowercase">the atlas</span>
            </Editable>
            <Editable id="sidebar_subtitle" fallback="Privileged Access Menu">
              <span className="text-[8px] font-black text-premium-gold tracking-[0.8em] uppercase font-inter mt-1 opacity-70">Privileged Access Menu</span>
            </Editable>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="group w-14 h-14 bg-premium-black text-premium-gold flex items-center justify-center rounded-full hover:rotate-90 transition-all duration-700 border border-premium-gold/20 shadow-xl">
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-12 px-6 sm:px-12 space-y-12">
          {/* Primary Navigation */}
          <div className="space-y-6">
            <Editable id="sidebar_universe_heading" fallback="Universe">
              <h3 className="text-[10px] font-black text-premium-gold tracking-[0.4em] uppercase font-inter">Universe</h3>
            </Editable>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'The Collection', path: '/products', icon: FiGrid },
                { label: 'Fragrance Houses', path: '/products?category=Oud', icon: FiHome },
                { label: 'Scent Discovery', path: '/about', icon: FiInfo },
              ].map((item, idx) => (
                <Link
                  key={item.label}
                  href={item.path}
                  className="group flex items-center justify-between py-2 border-b border-white/5 hover:border-premium-gold transition-colors"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Editable id={`sidebar_universe_link_${idx}`} fallback={item.label}>
                    <span className="text-xl font-playfair italic text-white group-hover:text-premium-gold group-hover:translate-x-4 transition-all duration-500">{item.label}</span>
                  </Editable>
                  <FiChevronRight className="text-premium-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Account & Administration */}
          <div className="space-y-6">
            <Editable id="sidebar_myspace_heading" fallback="My Space">
              <h3 className="text-[10px] font-black text-premium-gold tracking-[0.4em] uppercase font-inter">My Space</h3>
            </Editable>
            <div className="grid grid-cols-1 gap-2">
              {user ? (
                <>
                  <Editable id="sidebar_myspace_dashboard" fallback="Dashboard Overview">
                    <Link href="/profile" className="text-sm font-bold text-white/70 hover:text-premium-gold py-2 block font-inter" onClick={() => setIsSidebarOpen(false)}>Dashboard Overview</Link>
                  </Editable>
                  <Editable id="sidebar_myspace_wishlist" fallback="Signature Likes">
                    <Link href="/wishlist" className="text-sm font-bold text-white/70 hover:text-premium-gold py-2 block font-inter" onClick={() => setIsSidebarOpen(false)}>Signature Likes</Link>
                  </Editable>
                  {isAdmin && (
                    <Editable id="sidebar_myspace_admin" fallback="ACCESS SECURITY PANEL">
                      <Link href="/admin" className="mt-4 px-6 py-4 bg-premium-black text-premium-gold text-xs font-black tracking-widest text-center block rounded-none hover:bg-premium-gold hover:text-premium-black transition-all font-inter" onClick={() => setIsSidebarOpen(false)}>
                        ACCESS SECURITY PANEL
                      </Link>
                    </Editable>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Editable id="sidebar_myspace_login" fallback="Login">
                    <Link href="/login" className="px-6 py-4 border border-premium-gold/30 text-premium-gold text-[10px] font-black tracking-widest text-center uppercase hover:bg-premium-gold hover:text-premium-black transition-all font-inter" onClick={() => setIsSidebarOpen(false)}>Login</Link>
                  </Editable>
                  <Editable id="sidebar_myspace_register" fallback="Join Us">
                    <Link href="/register" className="px-6 py-4 bg-premium-gold text-premium-black text-[10px] font-black tracking-widest text-center uppercase hover:bg-white hover:text-premium-black transition-all font-inter" onClick={() => setIsSidebarOpen(false)}>Join Us</Link>
                  </Editable>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-12 border-t border-premium-gold/10 flex justify-between items-center bg-white/[0.02]">
          <div className="text-[9px] font-black text-white/40 tracking-widest uppercase font-inter">
            © {mounted ? new Date().getFullYear() : '2024'} {branding.name || 'IQTAN'}
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-premium-gold/10"></div>
            <div className="w-6 h-6 rounded-full bg-premium-gold/10"></div>
          </div>
        </div>
      </div>
    </>
  );
}
