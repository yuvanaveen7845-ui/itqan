'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import { FiArrowLeft, FiUser, FiMail, FiCalendar, FiShoppingBag, FiDollarSign, FiClock, FiPackage, FiExternalLink } from 'react-icons/fi';

export default function AdminCustomerDetailsPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomerDetails();
    }, [id]);

    const fetchCustomerDetails = async () => {
        try {
            setLoading(true);
            const { data } = await adminAPI.getCustomerById(id);
            setCustomer(data);
        } catch (error) {
            console.error('Failed to fetch customer details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!customer) return <div className="p-10 text-center text-red-600">Customer profile not found.</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition"
            >
                <FiArrowLeft /> Back to Customers
            </button>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-12 text-white">
                    <div className="flex items-center gap-8">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center font-black text-4xl shadow-xl">
                            {customer.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black mb-2">{customer.name}</h1>
                            <div className="flex items-center gap-6 opacity-80 font-bold">
                                <span className="flex items-center gap-2"><FiMail /> {customer.email}</span>
                                <span className="flex items-center gap-2"><FiCalendar /> Joined {new Date(customer.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 bg-gray-50/50">
                    <div className="p-10 text-center">
                        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-2">Lifetime Value</p>
                        <p className="text-4xl font-black text-gray-900">₹{customer.total_spend?.toLocaleString()}</p>
                    </div>
                    <div className="p-10 text-center">
                        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-2">Total Orders</p>
                        <p className="text-4xl font-black text-gray-900">{customer.total_orders}</p>
                    </div>
                    <div className="p-10 text-center">
                        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-2">Average Order</p>
                        <p className="text-4xl font-black text-gray-900">₹{customer.total_orders > 0 ? (customer.total_spend / customer.total_orders).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'}</p>
                    </div>
                </div>

                <div className="p-12">
                    <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <FiShoppingBag className="text-blue-600" /> Transaction History
                    </h2>

                    <div className="space-y-4">
                        {customer.orders?.length === 0 ? (
                            <div className="p-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 text-gray-400 font-bold">
                                This customer has no transactions yet.
                            </div>
                        ) : customer.orders.map((order: any) => (
                            <div key={order.id} className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <FiPackage size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900">Order #{(order.display_id || order.id).slice(0, 12)}</p>
                                        <p className="text-xs text-gray-400 font-bold uppercase">{new Date(order.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12">
                                    <div className="hidden lg:block">
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    'bg-gray-50 text-gray-700 border-gray-200'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-xl font-black text-gray-900 w-32 border-l border-gray-100 pl-12">₹{order.total_amount.toLocaleString()}</p>
                                    <button
                                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                                        className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm"
                                    >
                                        <FiExternalLink size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        <FiClock className="text-indigo-600" /> Loyalty Analytics
                    </h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                            <span className="font-bold text-gray-600">Last Active</span>
                            <span className="font-black text-gray-900">Today</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                            <span className="font-bold text-gray-600">Churn Risk</span>
                            <span className="font-black text-green-600 font-black uppercase text-xs bg-green-50 px-3 py-1 rounded-full">Low</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                            <span className="font-bold text-gray-600">Most Used Category</span>
                            <span className="font-black text-indigo-600">Oriental Perfumes</span>
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-3xl font-black mb-4">Customer Notes</h3>
                            <p className="text-indigo-200 font-medium leading-relaxed">
                                No internal notes found for this customer. Customer notes are visible only to Staff and Admins. Use notes to track specific sizing preferences or fragrance family likes.
                            </p>
                        </div>
                        <button className="mt-8 bg-white text-indigo-900 py-4 rounded-2xl font-black hover:bg-indigo-50 transition shadow-xl">
                            Add Internal Note
                        </button>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}
