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
            alert('Failed to establish promotion. Cipher might already exist.');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Deactivate and eradicate this promotional cipher?')) {
            try {
                await couponAPI.delete(id);
                fetchCoupons();
            } catch (error) {
                alert('Failed to eradicate cipher');
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold"></div>
        </div>
    );

    return (
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-premium-gold/20 pb-8">
                <div>
                    <h1 className="text-4xl font-playfair font-black text-premium-cream mb-2 tracking-tight">Promotional Engine</h1>
                    <p className="text-premium-gold font-bold uppercase text-[10px] tracking-[0.3em]">Construct and monitor elite discount sequences and client incentives.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-3 px-8 py-4 font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-xl border ${showForm ? 'bg-[#1A1A1A] text-white/50 border-white/10 hover:border-premium-gold' : 'bg-premium-black text-premium-gold border-premium-gold/30 hover:bg-premium-gold hover:text-white hover:scale-105 active:scale-95'
                        }`}
                >
                    {showForm ? <><FiX size={16} /> Abort Campaign</> : <><FiPlus size={16} /> Mint Campaign</>}
                </button>
            </div>

            {showForm && (
                <div className="bg-[#1A1A1A] shadow-2xl border border-white/5 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-premium-gold/5 pointer-events-none"></div>
                    <div className="bg-premium-gold/5 px-10 py-6 border-b border-premium-gold/10 relative z-10">
                        <h2 className="text-xl font-playfair font-black text-premium-cream tracking-wide flex items-center gap-4">
                            <FiTag className="text-premium-gold" /> Cipher Configuration Array
                        </h2>
                    </div>
                    <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        <div className="md:col-span-2">
                            <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Campaign Cipher Designation</label>
                            <input
                                type="text"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 text-premium-cream focus:border-premium-gold/50 focus:bg-white/10 outline-none transition-all font-mono font-black text-xl uppercase tracking-widest"
                                placeholder="E.G. LUXURY2026"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Algorithmic Type</label>
                            <select
                                className="w-full px-6 py-4 bg-[#1A1A1A] border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all appearance-none cursor-pointer font-bold"
                                value={formData.discount_type}
                                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                            >
                                <option value="percentage">Relative Yield (%)</option>
                                <option value="fixed">Absolute Value (₹)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Reduction Magnitude</label>
                            <input
                                type="number"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 text-premium-gold focus:border-premium-gold/50 outline-none transition-all font-black text-lg"
                                value={formData.discount_value}
                                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Validation Floor (₹)</label>
                            <input
                                type="number"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all font-mono font-bold"
                                value={formData.min_order_amount}
                                onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Maximum Ceiling (₹)</label>
                            <input
                                type="number"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all font-mono font-bold"
                                value={formData.max_discount_amount}
                                onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Epoch Commencement</label>
                            <input
                                type="date"
                                className="w-full px-6 py-4 bg-[#1A1A1A] border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all font-mono text-sm"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Epoch Termination</label>
                            <input
                                type="date"
                                className="w-full px-6 py-4 bg-[#1A1A1A] border border-white/10 text-white focus:border-rose-500/50 outline-none transition-all font-mono text-sm"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Distribution Quota</label>
                            <input
                                type="number"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all font-mono"
                                placeholder="Absolute Infinity (Blank)"
                                value={formData.usage_limit}
                                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-3 mt-8 pt-8 border-t border-white/10">
                            <button type="submit" className="w-full py-6 bg-premium-black border border-premium-gold/30 text-premium-gold font-black uppercase text-[10px] tracking-[0.3em] shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:bg-premium-gold hover:text-white transition-all">
                                Deploy Global Intel Cipher
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coupons.length === 0 ? (
                    <div className="md:col-span-3 py-24 text-center bg-[#1A1A1A] border border-white/5">
                        <p className="text-white/30 font-playfair italic text-xl">The promotional matrix observes zero active anomalies.</p>
                    </div>
                ) : coupons.map(c => (
                    <div key={c.id} className="bg-[#1A1A1A] border border-white/5 p-8 relative group hover:border-premium-gold/50 transition-all overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <button onClick={() => handleDelete(c.id)} className="p-3 bg-white/5 border border-white/10 hover:bg-rose-600 hover:border-rose-600 hover:text-white text-white/50 transition-all shadow-sm">
                                <FiTrash2 size={16} />
                            </button>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                        <div className="flex items-center gap-5 mb-8 relative z-10">
                            <div className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center text-premium-gold group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(234,179,8,0)] group-hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                <FiTag size={20} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black font-mono text-premium-cream tracking-widest uppercase">{c.code}</h3>
                                <p className="text-[9px] font-black uppercase text-white/40 tracking-[0.3em] mt-1">Campaign Signature</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8 relative z-10 font-mono text-xs">
                            <div className="flex justify-between items-center bg-black/40 border border-white/5 p-4">
                                <span className="text-white/50 font-bold uppercase tracking-widest">Yield Vector</span>
                                <span className="font-black text-premium-gold text-sm">{c.discount_type === 'percentage' ? `${c.discount_value}% RELATIVE` : `₹${c.discount_value} ABSOLUTE`}</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/40 border border-white/5 p-4 overflow-hidden">
                                <span className="text-white/50 font-bold uppercase tracking-widest shrink-0">Validity Horizon</span>
                                <span className="truncate ml-4 text-white/70">{c.start_date ? new Date(c.start_date).toLocaleDateString() : 'T=0'} → {c.end_date ? new Date(c.end_date).toLocaleDateString() : 'T=∞'}</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/40 border border-white/5 p-4">
                                <span className="text-white/50 font-bold uppercase tracking-widest">Telemetry Limit</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 h-1 bg-white/10 overflow-hidden">
                                        <div className="h-full bg-premium-gold shadow-[0_0_10px_rgba(234,179,8,0.8)]" style={{ width: c.usage_limit ? `${(c.usage_count / c.usage_limit) * 100}%` : '5%' }}></div>
                                    </div>
                                    <span className="font-black text-white">{c.usage_count}/{c.usage_limit || '∞'}</span>
                                </div>
                            </div>
                        </div>

                        <div className={`py-2 px-4 text-[9px] font-black uppercase tracking-[0.3em] inline-block relative z-10 border ${c.is_active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-white/30 border-white/10'}`}>
                            {c.is_active ? 'Status: Active' : 'Status: Dormant'}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[#1A1A1A] border border-white/5 p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 pointer-events-none"></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                            <FiActivity className="text-3xl text-premium-gold" />
                        </div>
                        <h2 className="text-4xl font-playfair font-black text-premium-cream mb-6 tracking-tight">Intelligence <span className="font-light italic text-premium-gold">Protocols</span></h2>
                        <p className="text-white/60 font-medium leading-relaxed text-sm">
                            Ciphers are autonomously cross-referenced against global transactions. Deploy **Absolute Value (₹)** vectors for cold-start client acquisition or **Relative Yield (%)** during high-volume seasonal fluxes.
                        </p>
                        <div className="mt-12 flex gap-10">
                            <div>
                                <p className="text-4xl font-playfair font-black text-white">{coupons.filter(c => c.is_active).length}</p>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mt-2">Active Matrices</p>
                            </div>
                            <div className="w-px h-16 bg-white/10"></div>
                            <div>
                                <p className="text-4xl font-playfair font-black text-premium-gold shadow-premium-gold/20 text-shadow-sm">₹{coupons.reduce((sum, c) => sum + (c.usage_count * (c.discount_type === 'fixed' ? c.discount_value : 100)), 0).toLocaleString()}</p>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mt-2">Value Dispensed</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-10">
                        <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-white mb-8 flex items-center gap-4">
                            <FiInfo className="text-premium-gold text-lg" /> Strategic Constraints
                        </h4>
                        <ul className="space-y-6 font-mono text-xs text-white/50">
                            <li className="flex items-start gap-4">
                                <FiCheckCircle className="text-premium-gold mt-0.5 shrink-0" />
                                Ciphers possess global case-insensitivity traits.
                            </li>
                            <li className="flex items-start gap-4">
                                <FiCheckCircle className="text-premium-gold mt-0.5 shrink-0" />
                                Distribution quotas intercept destructive viral campaigns.
                            </li>
                            <li className="flex items-start gap-4">
                                <FiCheckCircle className="text-premium-gold mt-0.5 shrink-0" />
                                Recursive stacking is globally nullified (One cipher per vector).
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
