'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { couponAPI } from '@/lib/api';
import { FiTag, FiPlus, FiTrash2, FiClock, FiActivity, FiX, FiCheckCircle, FiInfo } from 'react-icons/fi';

export default function AdminCouponsPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order_amount: '',
        max_discount_amount: '',
        start_date: '',
        end_date: '',
        usage_limit: '',
        is_active: true
    });

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
            router.push('/');
            return;
        }
        fetchCoupons();
    }, [user, router]);

    const fetchCoupons = async () => {
        try {
            const { data } = await couponAPI.getAll();
            setCoupons(data || []);
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                code: formData.code.toUpperCase(),
                discount_value: Number(formData.discount_value),
                min_order_amount: formData.min_order_amount ? Number(formData.min_order_amount) : 0,
                max_discount_amount: formData.max_discount_amount ? Number(formData.max_discount_amount) : null,
                usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
                start_date: formData.start_date || null,
                end_date: formData.end_date || null
            };

            await couponAPI.create(payload);
            setShowForm(false);
            setFormData({
                code: '', discount_type: 'percentage', discount_value: '',
                min_order_amount: '', max_discount_amount: '', start_date: '',
                end_date: '', usage_limit: '', is_active: true
            });
            fetchCoupons();
        } catch (error) {
            alert('Failed to create coupon. Code might already exist.');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Deactivate and delete this promotional code?')) {
            try {
                await couponAPI.delete(id);
                fetchCoupons();
            } catch (error) {
                alert('Failed to delete coupon');
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold"></div>
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Promotional Engine</h1>
                    <p className="text-gray-500 font-medium text-sm">Create and monitor discount sequences and customer incentives.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all shadow-lg ${showForm ? 'bg-gray-100 text-gray-700' : 'bg-rose-600 text-white shadow-rose-100 hover:bg-rose-700'
                        }`}
                >
                    {showForm ? <><FiX /> Cancel</> : <><FiPlus /> New Campaign</>}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-4 duration-500">
                    <div className="bg-rose-50/50 p-8 border-b border-rose-100">
                        <h2 className="text-xl font-black text-rose-900 flex items-center gap-2">
                            <FiTag className="text-rose-600" /> Campaign Configuration
                        </h2>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Coupon Code</label>
                            <input
                                type="text"
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-rose-50 outline-none transition font-black text-lg uppercase"
                                placeholder="e.g. FESTIVE50"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Type</label>
                            <select
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-rose-50 outline-none transition font-bold"
                                value={formData.discount_type}
                                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Discount Value</label>
                            <input
                                type="number"
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-rose-50 outline-none transition font-black"
                                value={formData.discount_value}
                                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Min Order (₹)</label>
                            <input
                                type="number"
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-rose-50 outline-none transition font-black text-indigo-600"
                                value={formData.min_order_amount}
                                onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Max Discount (₹)</label>
                            <input
                                type="number"
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-rose-50 outline-none transition font-black text-indigo-600"
                                value={formData.max_discount_amount}
                                onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Start Date</label>
                            <input
                                type="date"
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-rose-50 outline-none transition font-bold"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Expiry Date</label>
                            <input
                                type="date"
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-rose-50 outline-none transition font-bold text-rose-600"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Usage Limit</label>
                            <input
                                type="number"
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-rose-50 outline-none transition font-bold"
                                placeholder="Unlimited"
                                value={formData.usage_limit}
                                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-3 flex justify-end gap-4 mt-6">
                            <button type="submit" className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-100 hover:bg-rose-700 transition transform active:scale-95">
                                Initialize Global Coupon
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.length === 0 ? (
                    <div className="md:col-span-3 py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100 text-gray-400 font-bold">
                        No active campaigns. Start by creating your first coupon.
                    </div>
                ) : coupons.map(c => (
                    <div key={c.id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-rose-50 transition-all relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDelete(c.id)} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition shadow-sm">
                                <FiTrash2 />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center font-black text-xl border border-rose-100">
                                <FiTag />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">{c.code}</h3>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Campaign Reference</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                <span className="text-xs font-bold text-gray-500">Incentive</span>
                                <span className="font-black text-indigo-600">{c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}</span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest overflow-hidden">
                                <span className="text-gray-400 shrink-0">Validity Period</span>
                                <span className="truncate ml-4">{c.start_date ? new Date(c.start_date).toLocaleDateString() : 'N/A'} — {c.end_date ? new Date(c.end_date).toLocaleDateString() : 'Forever'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400">Total Usage</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-rose-500 rounded-full" style={{ width: c.usage_limit ? `${(c.usage_count / c.usage_limit) * 100}%` : '10%' }}></div>
                                    </div>
                                    <span className="text-[10px] font-black">{c.usage_count}/{c.usage_limit || '∞'}</span>
                                </div>
                            </div>
                        </div>

                        <div className={`py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {c.is_active ? 'Active Now' : 'Draft / Disabled'}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-indigo-900 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-md">
                            <FiActivity className="text-3xl text-indigo-300" />
                        </div>
                        <h2 className="text-4xl font-black mb-6">Promotional Intelligence</h2>
                        <p className="text-indigo-200 font-medium leading-relaxed text-lg">
                            Coupons are automatically validated against order totals and customer segments. Use **Fixed Amount** for new user acquisition and **Percentage** for festive sales.
                        </p>
                        <div className="mt-10 flex gap-6">
                            <div className="text-center">
                                <p className="text-3xl font-black">{coupons.filter(c => c.is_active).length}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Live Codes</p>
                            </div>
                            <div className="w-px h-12 bg-white/10"></div>
                            <div className="text-center">
                                <p className="text-3xl font-black">₹{coupons.reduce((sum, c) => sum + (c.usage_count * (c.discount_type === 'fixed' ? c.discount_value : 100)), 0).toLocaleString()}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Savings Generated</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                        <h4 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                            <FiInfo className="text-indigo-400" /> Best Practice
                        </h4>
                        <ul className="space-y-4 font-medium text-indigo-100 text-sm">
                            <li className="flex items-start gap-3">
                                <FiCheckCircle className="text-green-400 mt-1 shrink-0" />
                                Coupons are case-insensitive and globally unique.
                            </li>
                            <li className="flex items-start gap-3">
                                <FiCheckCircle className="text-green-400 mt-1 shrink-0" />
                                Usage limits prevent over-spending on massive campaigns.
                            </li>
                            <li className="flex items-start gap-3">
                                <FiCheckCircle className="text-green-400 mt-1 shrink-0" />
                                Stacking is disabled by default (one code per order).
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
}
