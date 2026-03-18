// Imperial Scent UI Deploy: Phase 14 - Exotic Gold Admin Overhaul
'use client';

import { useAuthStore } from '@/store/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
    FiPieChart,
    FiBox,
    FiShoppingBag,
    FiUsers,
    FiSettings,
    FiLogOut,
    FiChevronRight,
    FiBarChart2,
    FiMessageSquare,
    FiGrid,
    FiTag,
    FiLayout,
    FiActivity,
    FiZap,
    FiCpu
} from 'react-icons/fi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, isInitialized } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isInitialized && (!user || (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'staff'))) {
            router.push('/');
        }
    }, [user, router, isInitialized]);

    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-premium-black flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-2 border-premium-gold/10 rounded-full"></div>
                    <div className="absolute inset-0 w-16 h-16 border-2 border-premium-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!user || (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'staff')) {
        return null;
    }

    const menuItems = [
        { name: 'Analytics', icon: <FiPieChart />, path: '/admin', roles: ['staff', 'admin', 'super_admin'] },
        { name: 'Orders', icon: <FiShoppingBag />, path: '/admin/orders', roles: ['staff', 'admin', 'super_admin'] },
        { name: 'Products', icon: <FiBox />, path: '/admin/products', roles: ['admin', 'super_admin'] },
        { name: 'Categories', icon: <FiGrid />, path: '/admin/categories', roles: ['admin', 'super_admin'] },
        { name: 'Inventory', icon: <FiBox />, path: '/admin/inventory', roles: ['admin', 'super_admin'] },
        { name: 'Coupons', icon: <FiTag />, path: '/admin/coupons', roles: ['admin', 'super_admin'] },
        { name: 'Content Management', icon: <FiLayout />, path: '/admin/cms', roles: ['super_admin'] },
        { name: 'Audit Logs', icon: <FiActivity />, path: '/admin/audit', roles: ['super_admin'] },
        { name: 'Customers', icon: <FiUsers />, path: '/admin/customers', roles: ['admin', 'super_admin'] },
        { name: 'Reviews', icon: <FiMessageSquare />, path: '/admin/reviews', roles: ['admin', 'super_admin'] },
        { name: 'Settings', icon: <FiSettings />, path: '/admin/settings', roles: ['super_admin'] },
    ].filter(item => item.roles.includes(user.role));

    return (
        <div className="flex min-h-screen bg-premium-black pt-20 selection:bg-premium-gold selection:text-black">
            {/* Dark Exotic Admin Sidebar */}
            <aside className="w-80 bg-zinc-950 border-r border-white/5 hidden md:flex flex-col sticky top-20 h-[calc(100vh-80px)] z-40 gold-dust-overlay">
                
                <div className="p-12 border-b border-white/5 relative group">
                    <div className="liquid-gold-divider absolute bottom-0 left-0 opacity-20"></div>
                    <Link href="/" className="flex flex-col items-start gap-1 group">
                        <div className="flex items-center gap-4">
                            <FiCpu className="text-premium-gold animate-pulse" size={20} />
                            <span className="text-2xl imperial-serif text-white tracking-widest group-hover:gold-luxury-text transition-all duration-700">Command</span>
                        </div>
                        <p className="text-[10px] font-black text-premium-gold/40 uppercase tracking-[0.5rem] mt-4 ml-1">Executive Core</p>
                    </Link>
                </div>

                <nav className="flex-grow p-8 space-y-4 mt-8 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center justify-between px-8 py-5 transition-all duration-700 group relative border ${isActive
                                    ? 'bg-white/5 border-premium-gold/30 text-premium-gold shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                                    : 'text-white/30 border-transparent hover:border-white/10 hover:bg-white/[0.02] hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-6">
                                    <span className={`text-xl transition-all duration-700 ${isActive ? 'text-premium-gold scale-110' : 'group-hover:text-premium-gold group-hover:scale-110'}`}>
                                        {item.icon}
                                    </span>
                                    <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${isActive ? 'text-white' : ''}`}>{item.name}</span>
                                </div>
                                {isActive && (
                                    <div className="flex gap-1">
                                        <div className="w-1 h-3 bg-premium-gold animate-pulse"></div>
                                        <div className="w-1 h-3 bg-premium-gold/40"></div>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-8 border-t border-white/5 relative">
                    <div className="liquid-gold-divider absolute top-0 left-0 opacity-20 rotate-180"></div>
                    <div className="arabesque-border glass-panel p-8 mb-8 group hover:border-premium-gold/40 transition-all duration-1000">
                        <p className="text-[9px] font-black text-premium-gold/30 uppercase tracking-[0.6em] mb-6">Operative</p>
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-zinc-900 border border-premium-gold/20 flex items-center justify-center text-premium-gold imperial-serif text-2xl group-hover:border-premium-gold transition-colors">
                                {(user?.name || 'A').charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="imperial-serif text-white truncate text-lg group-hover:gold-luxury-text transition-all">{user?.name || 'Administrator'}</p>
                                <p className="text-[10px] text-premium-gold/40 font-black tracking-widest uppercase truncate mt-1">{(user?.role || 'admin').replace('_', ' ')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => {
                            logout();
                            router.push('/');
                        }}
                        className="w-full flex items-center justify-center gap-4 py-5 bg-transparent border border-rose-500/20 text-rose-500/60 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500 transition-all duration-700"
                    >
                        <FiLogOut size={16} />
                        <span>Sever Session</span>
                    </button>
                </div>
            </aside>

            {/* Main Executive Content Area */}
            <main className="flex-grow p-12 bg-premium-black relative overflow-hidden">
                <div className="absolute inset-0 gold-dust-overlay opacity-30 pointer-events-none"></div>
                <div className="max-w-[1600px] mx-auto relative z-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
