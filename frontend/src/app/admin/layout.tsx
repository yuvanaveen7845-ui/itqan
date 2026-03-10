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
    FiTag
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
        { name: 'Customers', icon: <FiUsers />, path: '/admin/customers', roles: ['admin', 'super_admin'] },
        { name: 'Reviews', icon: <FiMessageSquare />, path: '/admin/reviews', roles: ['admin', 'super_admin'] },
        { name: 'Settings', icon: <FiSettings />, path: '/admin/settings', roles: ['super_admin'] },
    ].filter(item => item.roles.includes(user.role));

    return (
        <div className="flex min-h-screen bg-gray-50 pt-20">
            {/* Admin Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-20 h-[calc(100vh-80px)] z-40">
                <div className="p-8 border-b border-gray-100">
                    <Link href="/" className="text-2xl font-black text-blue-600 flex items-center gap-2">
                        <FiBarChart2 className="text-blue-600" />
                        <span>AdminHub</span>
                    </Link>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2 px-1">Control Panel</p>
                </div>

                <nav className="flex-grow p-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                    : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`text-xl ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-bold">{item.name}</span>
                                </div>
                                {isActive && <FiChevronRight className="animate-pulse" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Logged in as</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black">
                                {user.name.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-gray-900 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate capitalize">{user.role.replace('_', ' ')}</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            router.push('/');
                        }}
                        className="w-full flex items-center gap-4 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <FiLogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-8">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
