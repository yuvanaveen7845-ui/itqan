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
            announcement.text
          )}
        </div>
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] ${isScrolled
          ? 'bg-black/80 backdrop-blur-3xl py-6 border-b border-white/5'
          : 'bg-transparent py-16'
          }`}
      >
        <div className="max-w-[1700px] mx-auto px-12 sm:px-24 flex items-center justify-center relative">
          {/* Menu Trigger Pin */}
          <div className="absolute left-12 sm:left-24">
             <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-6 group"
              >
                <div className="w-12 h-[1px] bg-white group-hover:bg-premium-gold transition-all group-hover:w-16"></div>
                <span className="text-[9px] font-black text-white/40 group-hover:text-premium-gold uppercase tracking-[0.6em]">Menu</span>
              </button>
          </div>

          <div className="absolute right-12 sm:right-24 flex items-center gap-12">
            <Link href="/search" className="text-white/60 hover:text-premium-gold transition-colors"><FiSearch size={18} /></Link>
            
            <div className="relative group/cart">
               <Link href="/cart" className="text-white/60 hover:text-premium-gold transition-colors flex items-center gap-3">
                 <FiShoppingBag size={18} />
                 {itemCount > 0 && <span className="text-[8px] font-black bg-premium-gold text-premium-black w-4 h-4 rounded-full flex items-center justify-center">{itemCount}</span>}
               </Link>
            </div>

            {user ? (
              <div className="relative group/user">
                <button className="flex items-center gap-4 group/btn">
                  <div className="flex flex-col items-end">
                    <span className="text-[7px] font-black text-premium-gold uppercase tracking-[0.4em] opacity-60">Concierge</span>
                    <span className="text-[9px] font-bold text-white uppercase tracking-[0.2em]">{user.name.split(' ')[0]}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover/btn:border-premium-gold transition-all duration-700 bg-white/5">
                     <span className="text-[10px] font-black text-premium-gold">{user.name.charAt(0)}</span>
                  </div>
                </button>

                {/* Secret Privileged Dropdown */}
                <div className="absolute top-full right-0 mt-6 w-64 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-700 translate-y-4 group-hover/user:translate-y-0 z-50">
                  <div className="bg-black/90 backdrop-blur-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 gold-shimmer opacity-5 pointer-events-none"></div>
                    <div className="relative z-10 space-y-6">
                      <Link href="/profile" className="flex items-center justify-between group/link">
                        <span className="text-[9px] font-black text-white hover:text-premium-gold uppercase tracking-[0.4em] transition-colors">Profile Portfolio</span>
                        <FiChevronRight size={12} className="text-premium-gold translate-x-[-10px] opacity-0 group-hover/link:translate-x-0 group-hover/link:opacity-100 transition-all" />
                      </Link>
                      <Link href="/wishlist" className="flex items-center justify-between group/link">
                        <span className="text-[9px] font-black text-white hover:text-premium-gold uppercase tracking-[0.4em] transition-colors">Curated Likes</span>
                        <FiChevronRight size={12} className="text-premium-gold translate-x-[-10px] opacity-0 group-hover/link:translate-x-0 group-hover/link:opacity-100 transition-all" />
                      </Link>
                      <button onClick={logout} className="w-full pt-6 border-t border-white/10 text-left group/link flex items-center justify-between">
                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.4em] transition-colors">Terminate Session</span>
                        <FiLogOut size={12} className="text-rose-500 opacity-0 group-hover/link:opacity-100 transition-all" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="text-[8px] font-black text-white/40 hover:text-premium-gold uppercase tracking-[0.6em] transition-colors border border-white/10 px-6 py-3 hover:border-premium-gold">
                Initiate Access
              </Link>
            )}
          </div>
          <div className="flex items-center gap-12">
              <Editable id="nav_links" type="richtext">
                <nav className="hidden lg:flex items-center gap-12">
                  <Link href="/products" className="text-[10px] font-black uppercase tracking-[0.6em] text-white hover:text-premium-gold transition-all">Collections</Link>
                  <Link href="/about" className="text-[10px] font-black uppercase tracking-[0.6em] text-white hover:text-premium-gold transition-all">Heritage</Link>
                  <Link href="/bespoke" className="text-[10px] font-black uppercase tracking-[0.6em] text-white hover:text-premium-gold transition-all">Bespoke</Link>
                </nav>
              </Editable>

              <Link href="/" className="flex flex-col items-center group">
                <Editable id="header_logo" type="text" fallback="IQTAN">
                  <span className="text-4xl imperial-serif text-white tracking-[1.2rem] group-hover:gold-luxury-text transition-all duration-1000">IQTAN</span>
                </Editable>
                <div className="h-px w-0 group-hover:w-full bg-premium-gold transition-all duration-1000 mt-2"></div>
              </Link>

              <div className="hidden lg:flex items-center gap-12">
                <Editable id="nav_secondary" type="richtext">
                  <div className="flex items-center gap-12">
                    <Link href="/journal" className="text-[10px] font-black uppercase tracking-[0.6em] text-white hover:text-premium-gold transition-all">Journal</Link>
                    <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.6em] text-white hover:text-premium-gold transition-all">Concierge</Link>
                  </div>
                </Editable>
              </div>
            </div>
        </div>
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
