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
    FiZap
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold shadow-[0_0_20px_rgba(234,179,8,0.3)]"></div>
            </div>
        );
    }

    if (!user || (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'staff')) {
        return null;
    }

    // Role-based Menu Items
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
        <div className="flex min-h-screen bg-premium-black pt-20">
            {/* Dark Admin Sidebar */}
            <aside className="w-72 bg-[#111] border-r border-white/5 hidden md:flex flex-col sticky top-20 h-[calc(100vh-80px)] z-40 overflow-y-auto">

                <div className="p-10 border-b border-white/5 bg-gradient-to-br from-premium-gold/5">
                    <Link href="/" className="text-2xl font-black text-premium-gold flex items-center gap-3 group">
                        <FiZap className="text-premium-gold group-hover:scale-125 transition-transform" />
                        <span className="font-playfair italic tracking-tighter">Command</span>
                    </Link>
                    <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.4em] mt-3 px-1">Executive Interface</p>
                </div>

                <nav className="flex-grow p-6 space-y-3 mt-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center justify-between px-6 py-4 rounded-none transition-all duration-300 group relative ${isActive
                                    ? 'bg-premium-gold/10 text-premium-gold shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-premium-gold shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>}
                                <div className="flex items-center gap-5">
                                    <span className={`text-xl transition-colors ${isActive ? 'text-premium-gold' : 'text-white/20 group-hover:text-premium-gold'}`}>
                                        {item.icon}
                                    </span>
                                    <span className={`text-[11px] font-black uppercase tracking-widest ${isActive ? 'text-white' : ''}`}>{item.name}</span>
                                </div>
                                {isActive && <FiChevronRight className="animate-pulse text-premium-gold" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-white/5">
                    <div className="bg-black/40 border border-white/5 p-6 mb-6">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 text-center">Active Operative</p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-premium-black border border-premium-gold/30 flex items-center justify-center text-premium-gold font-playfair font-black text-xl shadow-inner group-hover:scale-110 transition-transform">
                                {user.name.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-playfair font-black text-premium-cream truncate text-base">{user.name}</p>
                                <p className="text-[9px] text-premium-gold/50 font-mono tracking-widest uppercase truncate">{user.role.replace('_', ' ')}</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            router.push('/');
                        }}
                        className="w-full flex items-center justify-center gap-4 px-6 py-4 text-rose-500/60 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20"
                    >
                        <FiLogOut size={16} />
                        <span>Sever Session</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow p-12 bg-premium-black relative">
                <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 pointer-events-none"></div>
                <div className="max-w-[1600px] mx-auto relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
