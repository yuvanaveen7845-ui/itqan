'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { FiShield, FiUserPlus, FiTrash2, FiUserCheck, FiX, FiUsers, FiMail, FiLock, FiCpu } from 'react-icons/fi';
import { useAuthStore } from '@/store/auth';

export default function StaffManagementPage() {
    const { user: currentUser } = useAuthStore();
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'staff'
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const { data } = await adminAPI.getAdmins();
            setAdmins(data);
        } catch (error) {
            console.error('Failed to fetch admins:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (currentUser?.role === 'admin' && formData.role !== 'staff') {
                alert('Admins can only provision Staff operatives.');
                return;
            }
            await adminAPI.createAdmin(formData);
            setShowAddModal(false);
            fetchAdmins();
            setFormData({ name: '', email: '', password: '', role: 'staff' });
        } catch (error) {
            alert('Failed to establish operative profile');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteAdmin = async (adminId: string) => {
        if (adminId === currentUser?.id) {
            alert('You cannot revoke your own access privileges.');
            return;
        }
        if (!confirm('Eradicate this administrative operative? This action guarantees immediate loss of clearance.')) {
            return;
        }
        try {
            await adminAPI.deleteAdmin(adminId);
            fetchAdmins();
        } catch (error) {
            alert('Failed to revoke privileges');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-2 border-premium-gold/10 rounded-full"></div>
                    <div className="absolute inset-0 w-16 h-16 border-2 border-premium-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-premium-gold/20 pb-8">
                <div>
                    <h1 className="text-4xl font-playfair font-black text-premium-cream mb-2 tracking-tight">Staff Manifesto</h1>
                    <p className="text-premium-gold font-bold uppercase text-[10px] tracking-[0.3em]">Oversee the elite administrative hierarchy and command access protocols.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-premium-black text-premium-gold border-premium-gold/30 hover:bg-premium-gold hover:text-white font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-xl border hover:scale-105 active:scale-95"
                >
                    <FiUserPlus size={16} /> Mint Operative Profile
                </button>
            </div>

            <div className="bg-[#1A1A1A] shadow-2xl border border-white/5 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 pointer-events-none"></div>
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-black/40 text-premium-gold/60 text-[9px] font-black uppercase tracking-[0.3em]">
                                <th className="px-8 py-6">Operative Asset</th>
                                <th className="px-8 py-6">Clearance Level</th>
                                <th className="px-8 py-6">Joined Intelligence</th>
                                <th className="px-8 py-6 text-right">Directives</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {admins.map((admin) => (
                                <tr key={admin.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-premium-black border border-premium-gold/30 text-premium-gold rounded-full flex items-center justify-center font-playfair font-black text-2xl shadow-[0_0_20px_rgba(234,179,8,0.1)] group-hover:scale-110 transition-transform">
                                                {admin.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-playfair font-black text-premium-cream text-xl group-hover:text-premium-gold transition-colors">{admin.name}</p>
                                                <p className="text-[10px] text-white/40 font-mono tracking-[0.2em] mt-1 uppercase">{admin.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className={`px-5 py-2 text-[9px] font-black uppercase tracking-[0.3em] border ${admin.role === 'super_admin' ? 'bg-premium-gold/10 text-premium-gold border-premium-gold/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]' :
                                                admin.role === 'admin' ? 'bg-white/10 text-white border-white/20' :
                                                    'bg-transparent text-white/40 border-white/10'
                                            }`}>
                                            {admin.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <p className="text-sm font-medium text-white/50">{new Date(admin.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex justify-end gap-3">
                                            {admin.id !== currentUser?.id && (
                                                <button 
                                                    onClick={() => handleDeleteAdmin(admin.id)} 
                                                    className="p-3 bg-white/5 border border-white/10 text-white/30 hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                                    title="Purge Operative"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            )}
                                            <div className={`p-3 bg-green-500/10 border border-green-500/20 text-green-400 shadow-sm active-badge ${admin.id === currentUser?.id ? 'block' : 'hidden group-hover:block'}`} title="Operative is verified">
                                                <FiUserCheck size={16} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Provisioning Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1A1A1A] border border-premium-gold/30 w-full max-w-2xl overflow-hidden shadow-[0_0_100px_rgba(234,179,8,0.15)] animate-in zoom-in-95 duration-500">
                        <div className="p-12 border-b border-white/5 flex justify-between items-center bg-premium-gold/5 relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-premium-gold to-transparent opacity-50"></div>
                            <h2 className="text-3xl font-playfair font-black text-premium-cream italic tracking-tight">Establish Clearance</h2>
                            <button onClick={() => setShowAddModal(false)} className="w-14 h-14 bg-white/5 hover:bg-rose-600 hover:text-white border border-white/10 hover:border-rose-600 text-white/50 transition-all font-bold flex items-center justify-center"><FiX size={24} /></button>
                        </div>

                        <form onSubmit={handleAddAdmin} className="p-12 space-y-10">
                            <div className="space-y-8">
                                <div className="relative group">
                                    <label className="block text-[10px] font-black text-premium-gold/40 mb-4 uppercase tracking-[0.4em] ml-1">Identity Designation</label>
                                    <div className="relative">
                                        <FiUsers className="absolute left-6 top-1/2 -translate-y-1/2 text-premium-gold/30 group-focus-within:text-premium-gold transition-colors" />
                                        <input
                                            type="text"
                                            className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 text-premium-cream focus:border-premium-gold/50 focus:bg-white/10 outline-none transition-all font-playfair text-xl italic"
                                            placeholder="Enter operative name..."
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="relative group">
                                    <label className="block text-[10px] font-black text-premium-gold/40 mb-4 uppercase tracking-[0.4em] ml-1">Secure Comms (Email)</label>
                                    <div className="relative">
                                        <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-premium-gold/30 group-focus-within:text-premium-gold transition-colors" />
                                        <input
                                            type="email"
                                            className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all font-mono text-sm tracking-widest"
                                            placeholder="directive@itqan.systems"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="relative group">
                                    <label className="block text-[10px] font-black text-premium-gold/40 mb-4 uppercase tracking-[0.4em] ml-1">Access Cipher (Password)</label>
                                    <div className="relative">
                                        <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-premium-gold/30 group-focus-within:text-premium-gold transition-colors" />
                                        <input
                                            type="password"
                                            className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all font-mono"
                                            placeholder="••••••••••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-premium-gold/40 mb-6 uppercase tracking-[0.4em] ml-1">Clearance Stratum</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'staff' })}
                                            className={`py-5 border font-black uppercase text-[10px] tracking-[0.3em] transition-all duration-500 ${formData.role === 'staff' ? 'bg-white/10 text-white border-white/40 shadow-inner' : 'bg-transparent text-white/20 border-white/10 hover:border-white/30 hover:text-white/60'}`}
                                        >
                                            Standard (Staff)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'admin' })}
                                            className={`py-5 border font-black uppercase text-[10px] tracking-[0.3em] transition-all duration-500 ${formData.role === 'admin' ? 'bg-premium-gold/20 text-premium-gold border-premium-gold/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]' : 'bg-transparent text-white/20 border-white/10 hover:border-premium-gold/40 hover:text-white/60'}`}
                                        >
                                            Executive (Admin)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'super_admin' })}
                                            className={`py-6 border col-span-2 font-black uppercase text-[10px] tracking-[0.5em] transition-all duration-700 mt-2 ${formData.role === 'super_admin' ? 'bg-premium-black text-rose-500 border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.15)] scale-[1.02]' : 'bg-transparent text-white/10 border-white/5 hover:border-rose-500/30 hover:text-rose-500/50'}`}
                                        >
                                            System Overlord (Root)
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="w-full py-8 bg-premium-black border border-premium-gold/40 text-premium-gold font-black uppercase text-[11px] tracking-[0.5em] hover:bg-premium-gold hover:text-white transition-all duration-700 shadow-[0_0_40px_rgba(234,179,8,0.1)] hover:shadow-[0_0_60px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:grayscale relative group overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    <span className="relative z-10 flex items-center justify-center gap-4">
                                        <FiCpu className={formLoading ? 'animate-spin' : ''} />
                                        {formLoading ? 'Executing Identity Protocol...' : 'Invoke Identity Constructor'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
