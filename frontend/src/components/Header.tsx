// Imperial Scent UI Deploy: Phase 14 - Exotic Gold Header Overhaul
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useCMSStore } from '@/store/cms';
import Editable from '@/components/Editable';
import { FiShoppingCart, FiUser, FiLogOut, FiSearch, FiHeart, FiShield, FiMenu, FiX, FiHome, FiInfo, FiGrid, FiChevronRight, FiShoppingBag, FiLayers } from 'react-icons/fi';

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
      {/* Premium Announcement Bar - Liquid Gold Flow */}
      {announcement.is_active && (
        <div className="bg-premium-black text-premium-gold text-[10px] font-black uppercase tracking-[0.4rem] py-4 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-premium-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          {announcement.link ? (
            <Link href={announcement.link} className="hover:text-white transition-colors relative z-10">
              {announcement.text}
            </Link>
          ) : (
            <Editable id="header_announcement" fallback={announcement.text}>
              <span className="relative z-10">{announcement.text}</span>
            </Editable>
          )}
          <div className="liquid-gold-divider absolute bottom-0 left-0 opacity-40"></div>
        </div>
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-[1s] ease-[cubic-bezier(0.19,1,0.22,1)] ${isScrolled
          ? 'bg-black/90 backdrop-blur-3xl py-4 border-b border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-8 sm:py-12'
          }`}
      >
        <div className="max-w-[1700px] mx-auto px-4 sm:px-12 md:px-24 flex items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-center gap-12">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-3 text-premium-gold/60 hover:text-premium-gold transition-all block lg:hidden glass-panel rounded-full"
              >
                <FiMenu size={18} />
              </button>
              
              <Link href="/" className="flex flex-col items-start group relative">
                <Editable id="header_logo" type="text" fallback="IQTAN">
                  <span className="text-3xl sm:text-4xl imperial-serif text-white tracking-[1rem] group-hover:gold-luxury-text transition-all duration-1000">IQTAN</span>
                </Editable>
                <div className="w-0 group-hover:w-full h-px bg-premium-gold absolute -bottom-2 transition-all duration-700 opacity-50"></div>
              </Link>

              <nav className="hidden lg:flex items-center gap-12 ml-12">
                <Editable id="header_nav_collections" fallback="Collections">
                  <Link href="/products" className="group text-[9px] font-black uppercase tracking-[0.5em] text-white/40 hover:text-premium-gold transition-all flex items-center gap-2">
                    <span className="w-1 h-1 bg-premium-gold/0 group-hover:bg-premium-gold transition-all rounded-full"></span>
                    Collections
                  </Link>
                </Editable>
                <Editable id="header_nav_atelier" fallback="Atelier">
                  <Link href="/about" className="group text-[9px] font-black uppercase tracking-[0.5em] text-white/40 hover:text-premium-gold transition-all flex items-center gap-2">
                    <span className="w-1 h-1 bg-premium-gold/0 group-hover:bg-premium-gold transition-all rounded-full"></span>
                    Atelier
                  </Link>
                </Editable>
              </nav>
          </div>

          {/* Action Center - Unified Boutique Cluster */}
          <div className="flex items-center gap-6 sm:gap-12">
            <Link href="/search" className="text-white/40 hover:text-premium-gold transition-all p-2 glass-panel rounded-full hidden sm:block">
              <FiSearch size={16} />
            </Link>
            
            <Link href="/cart" className="relative group p-2 text-white/40 hover:text-premium-gold transition-all glass-panel rounded-full">
              <FiShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-premium-gold text-black text-[9px] font-black rounded-full flex items-center justify-center animate-bounce-slow">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group/user">
                <button className="flex items-center gap-4 py-2 pl-6 border-l border-white/10 group-hover/user:border-premium-gold transition-colors duration-700">
                  <div className="w-10 h-10 rounded-full arabesque-border p-[1px]">
                     <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-[11px] font-black text-premium-gold">
                       {(user?.name || 'U').charAt(0)}
                     </div>
                  </div>
                  <span className="text-[9px] font-black text-white/60 group-hover/user:text-premium-gold uppercase tracking-[0.3em] hidden sm:block transition-colors">{(user?.name || 'Guest').split(' ')[0]}</span>
                </button>

                {/* Refined Exotic Dropdown */}
                <div className="absolute top-full right-0 mt-4 w-64 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-700 translate-y-4 group-hover/user:translate-y-0 z-50">
                  <div className="bg-zinc-950 border border-white/5 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.8)] arabesque-border">
                    <div className="space-y-6">
                      <Link href="/profile" className="flex items-center justify-between group/link">
                        <span className="text-[9px] font-black text-white/40 group-hover/link:text-premium-gold group-hover/link:translate-x-2 transition-all uppercase tracking-[0.4em]">Portfolio</span>
                        <FiChevronRight size={10} className="text-premium-gold opacity-0 group-hover/link:opacity-100" />
                      </Link>
                      <Link href="/wishlist" className="flex items-center justify-between group/link">
                        <span className="text-[9px] font-black text-white/40 group-hover/link:text-premium-gold group-hover/link:translate-x-2 transition-all uppercase tracking-[0.4em]">Sanctuary</span>
                        <FiChevronRight size={10} className="text-premium-gold opacity-0 group-hover/link:opacity-100" />
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" className="block text-[9px] font-black text-premium-gold uppercase tracking-[0.4em] pt-6 border-t border-white/5 group/link hover:translate-x-2 transition-all">
                          Atelier Control
                        </Link>
                      )}
                      <button onClick={logout} className="w-full pt-6 border-t border-white/5 text-left group/link flex items-center justify-between">
                        <span className="text-[9px] font-black text-rose-500/60 group-hover/link:text-rose-500 uppercase tracking-[0.4em] group-hover/link:translate-x-2 transition-all">Terminate</span>
                        <FiLogOut size={10} className="text-rose-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Editable id="header_login_btn" fallback="Login">
                <Link href="/login" className="text-[9px] font-black text-white/80 hover:text-black uppercase tracking-[0.4em] border border-premium-gold/30 px-8 py-3 hover:bg-premium-gold transition-all duration-700 signature-shimmer">
                  Login
                </Link>
              </Editable>
            )}
            
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 text-white/40 hover:text-premium-gold transition-all glass-panel rounded-full hidden lg:block"
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Exotic Navigation Sidebar Drawer */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[200] transition-opacity duration-1000 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[600px] bg-premium-black z-[201] shadow-2xl transition-all duration-1000 cubic-bezier(0.19, 1, 0.22, 1) ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col gold-dust-overlay-static border-l border-white/5`}>
        <div className="h-56 px-12 flex flex-col justify-center border-b border-white/5 relative">
          <Editable id="sidebar_title" fallback="the atlas">
            <span className="text-5xl imperial-serif text-white italic lowercase">the atlas</span>
          </Editable>
          <Editable id="sidebar_subtitle" fallback="Privileged Access Menu">
            <span className="text-[9px] font-black text-premium-gold tracking-[1rem] uppercase font-inter mt-3 opacity-60">Control Console</span>
          </Editable>
          
          <button onClick={() => setIsSidebarOpen(false)} className="absolute top-12 right-12 w-14 h-14 bg-white/5 text-premium-gold flex items-center justify-center rounded-full hover:rotate-90 hover:bg-premium-gold hover:text-black transition-all duration-700 shadow-2xl border border-white/10 group">
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-20 px-12 space-y-20">
          {/* Primary Navigation */}
          <div className="space-y-10">
            <Editable id="sidebar_universe_heading" fallback="Universe">
              <h3 className="text-[10px] font-black text-premium-gold/40 tracking-[0.6em] uppercase font-inter flex items-center gap-4">
                <FiLayers size={12} /> The Universe
              </h3>
            </Editable>
            <div className="grid grid-cols-1 gap-10">
              {[
                { label: 'Exclusif Collection', path: '/products', icon: FiGrid },
                { label: 'Olfactive Tiers', path: '/products?category=Oud', icon: FiHome },
                { label: 'The Secret Atelier', path: '/about', icon: FiInfo },
              ].map((item, idx) => (
                <Link
                  key={item.label}
                  href={item.path}
                  className="group flex items-center justify-between py-2 border-b border-white/5 hover:border-premium-gold transition-all duration-700"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Editable id={`sidebar_universe_link_${idx}`} fallback={item.label}>
                    <span className="text-4xl imperial-serif text-white/60 group-hover:text-white group-hover:translate-x-6 transition-all duration-700">{item.label}</span>
                  </Editable>
                  <FiChevronRight className="text-premium-gold opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-10 group-hover:translate-x-0" />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <Editable id="sidebar_myspace_heading" fallback="My Space">
              <h3 className="text-[10px] font-black text-premium-gold/40 tracking-[0.6em] uppercase font-inter">Personal Sanctuary</h3>
            </Editable>
            <div className="grid grid-cols-1 gap-4">
              {user ? (
                <>
                  <Link href="/profile" className="group flex items-center justify-between p-6 bg-white/5 border border-white/5 hover:border-premium-gold/40 transition-all duration-700" onClick={() => setIsSidebarOpen(false)}>
                    <span className="text-[11px] font-black text-white/80 uppercase tracking-widest">Profile Portfolio</span>
                    <FiUser className="text-premium-gold opacity-40 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link href="/wishlist" className="group flex items-center justify-between p-6 bg-white/5 border border-white/5 hover:border-premium-gold/40 transition-all duration-700" onClick={() => setIsSidebarOpen(false)}>
                    <span className="text-[11px] font-black text-white/80 uppercase tracking-widest">Scent Sanctuary</span>
                    <FiHeart className="text-premium-gold opacity-40 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="p-6 bg-premium-black border border-premium-gold/30 text-premium-gold text-[11px] font-black tracking-[0.4em] text-center uppercase hover:bg-premium-gold hover:text-black transition-all duration-700 signature-shimmer" onClick={() => setIsSidebarOpen(false)}>
                      Atelier Security Terminal
                    </Link>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <Link href="/login" className="px-8 py-6 border border-white/10 text-white text-[10px] font-black tracking-widest text-center uppercase hover:border-premium-gold transition-all duration-700" onClick={() => setIsSidebarOpen(false)}>Login</Link>
                  <Link href="/register" className="px-8 py-6 bg-premium-gold text-premium-black text-[10px] font-black tracking-widest text-center uppercase hover:bg-white transition-all duration-700 signature-shimmer" onClick={() => setIsSidebarOpen(false)}>Join Us</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-12 border-t border-white/5 flex flex-col gap-6 bg-black/40">
           <div className="liquid-gold-divider opacity-20"></div>
           <div className="flex justify-between items-center">
              <div className="text-[10px] font-black text-white/20 tracking-[0.4em] uppercase">
                © {mounted ? new Date().getFullYear() : '2024'} {branding.name || 'IQTAN'} ATELIER
              </div>
              <div className="flex gap-6">
                <div className="w-8 h-[0.5px] bg-premium-gold/40"></div>
                <div className="w-8 h-[0.5px] bg-premium-gold/40"></div>
              </div>
           </div>
        </div>
      </div>
    </>
  );
}
