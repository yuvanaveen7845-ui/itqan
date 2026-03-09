'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { orderAPI } from '@/lib/api';
import Link from 'next/link';

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user } = useAuthStore();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const { data } = await orderAPI.getById(params.id);
                setOrder(data);
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [user, params.id, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) return null;

    if (!order) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                <p className="text-gray-600 mb-8">We couldn't find the order you're looking for.</p>
                <Link href="/profile" className="btn btn-primary">Return to Dashboard</Link>
            </div>
        );
    }

    // Calculate timeline progress
    const statuses = ['processing', 'shipped', 'delivered'];
    let currentStatusIndex = statuses.indexOf(order.status);

    // Handle edge cases
    if (order.status === 'cancelled') currentStatusIndex = 0;
    if (currentStatusIndex === -1) currentStatusIndex = 0;

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link href="/profile" className="hover:text-blue-600 transition-colors">My Dashboard</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Order #{order.id.slice(0, 8)}</span>
                </div>

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Track Your Order</h1>
                        <p className="text-gray-600">Order placed on {new Date(order.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    {order.status === 'cancelled' && (
                        <span className="px-4 py-2 bg-red-100 text-red-700 font-bold rounded-lg uppercase tracking-wide">Cancelled</span>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Col: Timeline & Items */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Timeline Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Delivery Status
                            </h2>

                            {order.status === 'cancelled' ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Order Cancelled</h3>
                                    <p className="text-gray-500">This order has been cancelled and will not be shipped.</p>
                                    <p className="text-sm mt-4 text-gray-400">If you have been charged, a refund will be issued within 5-7 business days.</p>
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Line background */}
                                    <div className="absolute left-[39px] top-6 bottom-6 w-1 bg-gray-200 rounded-full"></div>
                                    {/* Active Line foreground */}
                                    <div className="absolute left-[39px] top-6 w-1 bg-blue-600 rounded-full transition-all duration-1000" style={{ height: currentStatusIndex === 0 ? '0%' : currentStatusIndex === 1 ? '50%' : '100%' }}></div>

                                    <ul className="space-y-12 relative z-10">
                                        {/* Step 1: Processing */}
                                        <li className="flex items-start gap-6">
                                            <div className={`w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 ${currentStatusIndex >= 0 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'}`}>
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                            </div>
                                            <div className="pt-4">
                                                <h4 className={`text-lg font-bold ${currentStatusIndex >= 0 ? 'text-gray-900' : 'text-gray-400'}`}>Order Processing</h4>
                                                <p className={`mt-1 ${currentStatusIndex >= 0 ? 'text-gray-600' : 'text-gray-400'}`}>We're preparing your fabrics for shipment.</p>
                                                {currentStatusIndex >= 0 && <p className="text-sm text-gray-500 mt-2">{new Date(order.created_at).toLocaleString()}</p>}
                                            </div>
                                        </li>

                                        {/* Step 2: Shipped */}
                                        <li className="flex items-start gap-6">
                                            <div className={`w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${currentStatusIndex >= 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border-4 border-gray-200 text-gray-300'}`}>
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                            </div>
                                            <div className="pt-4">
                                                <h4 className={`text-lg font-bold ${currentStatusIndex >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Shipped</h4>
                                                <p className={`mt-1 ${currentStatusIndex >= 1 ? 'text-gray-600' : 'text-gray-400'}`}>Your order has left our facility.</p>
                                                {currentStatusIndex >= 1 && (
                                                    <div className="mt-3 bg-blue-50 border border-blue-100 rounded p-3">
                                                        <span className="text-xs text-blue-600 font-bold uppercase block mb-1">Tracking Number</span>
                                                        <span className="font-mono text-gray-800">TX-{(order.id.replace(/\D/g, '') || '19827364').slice(0, 10)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </li>

                                        {/* Step 3: Delivered */}
                                        <li className="flex items-start gap-6">
                                            <div className={`w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${currentStatusIndex >= 2 ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-white border-4 border-gray-200 text-gray-300'}`}>
                                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <div className="pt-4">
                                                <h4 className={`text-lg font-bold ${currentStatusIndex >= 2 ? 'text-green-600' : 'text-gray-400'}`}>Delivered</h4>
                                                <p className={`mt-1 ${currentStatusIndex >= 2 ? 'text-gray-600' : 'text-gray-400'}`}>Your package has arrived.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Items Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                Items in this Order
                            </h2>
                            <div className="space-y-6">
                                {order.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-6 py-4 border-t border-gray-100 first:border-0 first:py-0">
                                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400">
                                            Img
                                        </div>
                                        <div className="flex-grow flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-gray-900">{item.product_id} (Product Ref)</h4>
                                                <span className="font-bold text-gray-900">₹{item.price}</span>
                                            </div>
                                            <p className="text-gray-500 text-sm mb-2">Quantity: {item.quantity}</p>
                                            <div className="flex gap-4 text-sm mt-auto">
                                                <Link href={`/products/${item.product_id}`} className="text-blue-600 font-medium hover:underline">View Product</Link>
                                                {currentStatusIndex >= 2 && <span className="text-gray-300">|</span>}
                                                {currentStatusIndex >= 2 && <button className="text-blue-600 font-medium hover:underline">Write a Review</button>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {!order.items?.length && (
                                    <p className="text-gray-500 italic py-4">No item details available in this mock database response.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Summary & Address */}
                    <div className="space-y-8">
                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6">Payment Summary</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{order.total_amount}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Estimated Tax</span>
                                    <span>₹0</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-black text-gray-900">₹{order.total_amount}</span>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Payment Method</h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center">
                                        <span className="text-xs font-bold text-blue-600 font-serif">Card</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Razorpay</p>
                                        <p className="text-xs text-green-600 uppercase font-bold tracking-wide mt-0.5">Payment Successful</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Details */}
                        <div className="bg-blue-600 text-white rounded-2xl shadow-md p-8">
                            <h2 className="text-xl font-bold mb-6 border-b border-blue-500 pb-4">Shipping Information</h2>
                            <div className="mb-6">
                                <h4 className="font-bold text-blue-100 uppercase text-xs tracking-wider mb-2">Delivery Address</h4>
                                <p className="font-medium">{user?.name}</p>
                                <p className="text-blue-100 mt-1 opacity-90">123 Textile Hub, Silk Road<br />Fashion District<br />Mumbai, Maharashtra 400001<br />India</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-100 uppercase text-xs tracking-wider mb-2">Contact Details</h4>
                                <p className="font-medium">{user?.email}</p>
                                <p className="text-blue-100 mt-1 opacity-90">+91 98765 43210</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
