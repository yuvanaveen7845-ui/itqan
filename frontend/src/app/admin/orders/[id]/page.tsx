'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { orderAPI } from '@/lib/api';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiMapPin, FiUser, FiMail, FiCalendar } from 'react-icons/fi';

export default function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [statusComment, setStatusComment] = useState('');

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const { data } = await orderAPI.getById(id);
            setOrder(data);
        } catch (error) {
            console.error('Failed to fetch order details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            setUpdating(true);
            await orderAPI.updateStatus(id, newStatus);
            // Backend now expects an object { status, comment } if we want comments
            // But the api service currently only sends status. Let's fix that later if needed.
            // For now, let's just refresh.
            await fetchOrderDetails();
            setStatusComment('');
        } catch (error) {
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!order) return <div className="p-10 text-center text-red-600">Order not found.</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition"
            >
                <FiArrowLeft /> Back to Orders
            </button>

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Order #{(order.display_id || order.id).slice(0, 12)}</h1>
                    <div className="flex items-center gap-4 text-gray-500 font-medium">
                        <span className="flex items-center gap-1"><FiCalendar /> {new Date(order.created_at).toLocaleString()}</span>
                        <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${order.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                            order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                order.status === 'delivered' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                    'bg-gray-50 text-gray-700 border-gray-200'
                            }`}>
                            Status: {order.status}
                        </span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <select
                        className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition"
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                        disabled={updating}
                    >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Items & Summary */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <FiPackage className="text-blue-600" /> Items Breakdown
                            </h2>
                        </div>
                        <div className="p-8 space-y-6">
                            {order.items?.map((item: any) => (
                                <div key={item.id} className="flex gap-6 items-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                                        <img src={item.products?.image_url || 'https://via.placeholder.com/80'} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-gray-900 text-lg">{item.products?.name}</h4>
                                        <p className="text-gray-400 font-medium text-sm">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-gray-900 text-xl">₹{(item.quantity * item.price).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-3 font-bold text-gray-600">
                            {(() => {
                                const itemsSubtotal = order.items?.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0) || 0;
                                const discountAmt = order.discount_amount || 0;
                                const shipping = Math.max(0, order.total_amount - itemsSubtotal + discountAmt);
                                return (<>
                                    <div className="flex justify-between items-center">
                                        <span>Items Subtotal</span>
                                        <span>₹{itemsSubtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-blue-600">
                                        <span>Shipping</span>
                                        <span>₹{shipping.toLocaleString()}</span>
                                    </div>
                                    {discountAmt > 0 && (
                                        <div className="flex justify-between items-center text-green-600">
                                            <span>Discount</span>
                                            <span>-₹{discountAmt.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-2xl font-black text-gray-900 pt-3 border-t border-gray-200">
                                        <span>Grand Total</span>
                                        <span>₹{order.total_amount.toLocaleString()}</span>
                                    </div>
                                </>);
                            })()}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="p-8 border-b border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <FiClock className="text-indigo-600" /> Activity Timeline
                            </h2>
                        </div>
                        <div className="p-8 relative">
                            <div className="absolute left-12 top-10 bottom-10 w-0.5 bg-gray-100"></div>
                            <div className="space-y-12">
                                {order.history?.map((h: any) => (
                                    <div key={h.id} className="relative flex items-start gap-8 z-10">
                                        <div className="w-10 h-10 bg-white border-2 border-indigo-600 rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
                                            {h.status === 'delivered' ? <FiCheckCircle size={20} /> : <FiClock size={18} />}
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-2xl flex-grow border border-gray-100 hover:border-indigo-100 transition shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-black text-indigo-600 uppercase tracking-tighter text-sm">{h.status}</h4>
                                                <span className="text-[10px] font-bold text-gray-400">{new Date(h.created_at).toLocaleString()}</span>
                                            </div>
                                            <p className="text-gray-700 font-medium">{h.comment}</p>
                                            <p className="text-[10px] text-gray-400 mt-2 font-black uppercase">Updated by: {h.users?.name || 'System'}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="relative flex items-start gap-8 z-10">
                                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                                        <FiPackage />
                                    </div>
                                    <div className="bg-green-50 p-6 rounded-2xl flex-grow border border-green-100 shadow-sm">
                                        <h4 className="font-black text-green-700 uppercase tracking-tighter text-sm">Order Initialized</h4>
                                        <p className="text-green-800 font-medium">Customer placed the order successfully.</p>
                                        <span className="text-[10px] font-bold text-green-600 block mt-2">{new Date(order.created_at).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer Info */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                <FiUser className="text-blue-600" /> Customer Data
                            </h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">
                                    {order.user?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900">{order.user?.name}</h4>
                                    <p className="text-gray-400 text-sm font-bold truncate max-w-[150px]">{order.user?.email}</p>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-gray-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition">
                                View Customer History
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                <FiMapPin className="text-indigo-600" /> Shipping Destination
                            </h2>
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
                                <p className="font-bold text-gray-900 leading-relaxed text-lg">
                                    {order.address?.address_line1}
                                </p>
                                <p className="text-gray-600 font-medium mt-1">
                                    {order.address?.city}, {order.address?.state}
                                </p>
                                <p className="text-indigo-600 font-black mt-4 text-xl tracking-widest">
                                    PIN: {order.address?.zipcode}
                                </p>
                            </div>
                            <button
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.address?.address_line1}, ${order.address?.city}, ${order.address?.zipcode}`)}`, '_blank')}
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
                            >
                                Track on Map
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-2xl font-black mb-2">Workflow Tip</h3>
                                <p className="text-indigo-100 font-medium text-sm leading-relaxed">
                                    Always update the status to **Processing** when picking items, and **Shipped** once handover to courier is done. This triggers customer notifications.
                                </p>
                            </div>
                            <div className="mt-10 flex justify-between items-center">
                                <FiTruck size={40} className="text-white/20" />
                                <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Automated Notifications</span>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
