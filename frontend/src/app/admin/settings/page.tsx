'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { FiShield, FiUserPlus, FiTrash2, FiKey, FiCpu, FiActivity, FiUserCheck, FiX } from 'react-icons/fi';
import { useAuthStore } from '@/store/auth';

export default function AdminSettingsPage() {
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
    const [systemSettings, setSystemSettings] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [adminsRes, settingsRes] = await Promise.all([
                adminAPI.getAdmins(),
                adminAPI.getSettings()
            ]);
            setAdmins(adminsRes.data);
            setSystemSettings(settingsRes.data);
        } catch (error) {
            console.error('Failed to fetch settings data:', error);
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
            fetchData();
            setFormData({ name: '', email: '', password: '', role: 'staff' });
        } catch (error) {
            alert('Failed to establish operative profile');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteAdmin = async (adminId: string) => {
        if (!confirm('Eradicate this administrative operative? This action guarantees immediate loss of clearance.')) {
            return;
        }
        try {
            await adminAPI.deleteAdmin(adminId);
            fetchData();
        } catch (error) {
            alert('Failed to revoke privileges');
        }
    };

    const toggleMaintenance = async () => {
        try {
            const newStatus = !systemSettings.maintenanceMode;
            await adminAPI.updateSettings({ maintenanceMode: newStatus });
            setSystemSettings({ ...systemSettings, maintenanceMode: newStatus });
        } catch (error) {
            alert('Failed to execute protocol override');
        }
    };

    if (loading) {
        return <div className="p-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold mx-auto"></div></div>;
    }

    return (
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-premium-gold/20 pb-8">
                <div>
                    <h1 className="text-4xl font-playfair font-black text-premium-cream mb-2 tracking-tight">System Sovereignty</h1>
                    <p className="text-premium-gold font-bold uppercase text-[10px] tracking-[0.3em]">Global Security & Administrative Intelligence Control</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-premium-black text-premium-gold border-premium-gold/30 hover:bg-premium-gold hover:text-white font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-xl border hover:scale-105 active:scale-95"
                >
                    <FiUserPlus size={16} /> Mint Operative Profile
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* System Vitals */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-[#1A1A1A] shadow-2xl border border-white/5 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 pointer-events-none"></div>
                        <div className="p-10 border-b border-white/5 flex items-center gap-4 relative z-10">
                            <FiShield className="text-premium-gold text-2xl" />
                            <h2 className="text-2xl font-playfair font-black text-premium-cream tracking-wide">
                                Operative Hierarchy
                            </h2>
                        </div>
                        <div className="overflow-x-auto relative z-10 p-6">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-black/40 text-premium-gold/60 text-[9px] font-black uppercase tracking-[0.3em]">
                                        <th className="px-8 py-6">Operative Asset</th>
                                        <th className="px-8 py-6">Clearance Directive</th>
                                        <th className="px-8 py-6">Network Traces</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {admins.map((admin) => (
                                        <tr key={admin.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-premium-black border border-premium-gold/30 text-premium-gold rounded-full flex items-center justify-center font-playfair font-black text-xl shadow-[0_0_15px_rgba(234,179,8,0.15)] group-hover:scale-110 transition-transform">
                                                        {admin.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-playfair font-black text-premium-cream text-lg group-hover:text-premium-gold transition-colors">{admin.name}</p>
                                                        <p className="text-[10px] text-white/40 font-mono tracking-widest mt-1 uppercase">{admin.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-2 rounded-none text-[9px] font-black uppercase tracking-[0.2em] border ${admin.role === 'super_admin' ? 'bg-premium-gold/10 text-premium-gold border-premium-gold/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]' :
                                                        admin.role === 'admin' ? 'bg-white/10 text-white border-white/20' :
                                                            'bg-transparent text-white/50 border-white/10'
                                                    }`}>
                                                    {admin.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 text-green-400 font-mono font-black text-[10px] uppercase">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                                                        ONLINE
                                                    </div>
                                                    {currentUser?.role === 'super_admin' && currentUser?.id !== admin.id && (
                                                        <button 
                                                            onClick={() => handleDeleteAdmin(admin.id)} 
                                                            className="p-3 bg-white/5 border border-white/10 text-white/50 hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                                            title="Purge Operative"
                                                        >
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Global Overrides */}
                <div className="space-y-10">
                    <div className="bg-[#1A1A1A] shadow-2xl border border-white/5 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-premium-gold/5 pointer-events-none"></div>
                        <div className="p-10 border-b border-white/5 flex items-center gap-4 relative z-10">
                            <FiCpu className="text-premium-gold text-2xl" />
                            <h2 className="text-2xl font-playfair font-black text-premium-cream tracking-wide">
                                Core Overrides
                            </h2>
                        </div>

                        <div className="p-10 space-y-6 relative z-10">
                            <div className={`p-8 border flex justify-between items-center transition-all ${systemSettings?.maintenanceMode ? 'bg-rose-500/10 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.1)]' : 'bg-white/5 border-white/10'}`}>
                                <div>
                                    <p className={`font-black uppercase tracking-widest text-xs mb-1 ${systemSettings?.maintenanceMode ? 'text-rose-400' : 'text-premium-cream'}`}>Maintenance Quarantine</p>
                                    <p className="text-[10px] text-white/40 font-mono">Restricts external telemetry access</p>
                                </div>
                                <button
                                    onClick={toggleMaintenance}
                                    className={`w-16 h-8 border transition-all relative ${systemSettings?.maintenanceMode ? 'bg-rose-600 border-rose-400' : 'bg-transparent border-white/30'}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 transition-all ${systemSettings?.maintenanceMode ? 'bg-white right-1 shadow-md' : 'bg-white/30 left-1'}`}></div>
                                </button>
                            </div>

                            <div className="p-8 bg-white/5 border border-white/10">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <p className="font-black uppercase tracking-widest text-xs text-premium-cream mb-1">Traffic Firewall</p>
                                        <p className="text-[10px] text-white/40 font-mono">Simulate API restriction rules</p>
                                    </div>
                                    <FiActivity className="text-white/30 text-xl" />
                                </div>
                                <div className="flex gap-4">
                                    <button className="flex-1 py-4 bg-premium-black border border-premium-gold/30 text-premium-gold text-[9px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:bg-premium-gold hover:text-white transition">Permissive</button>
                                    <button className="flex-1 py-4 bg-white/5 border border-white/10 text-white/50 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition">Zero-Trust</button>
                                </div>
                            </div>

                            <div className="p-8 bg-premium-gold/5 border border-premium-gold/20 flex flex-col gap-4">
                                <div className="flex items-center gap-4 text-premium-gold">
                                    <FiKey className="text-2xl" />
                                    <p className="font-playfair font-black text-lg">System Audit Checksum</p>
                                </div>
                                <p className="text-sm font-mono text-premium-gold/70">{new Date(systemSettings?.lastBackup).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Provisioning Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1A1A1A] border border-premium-gold/30 w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.1)] animate-in zoom-in-95 duration-300">
                        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-premium-gold/5">
                            <h2 className="text-2xl font-playfair font-black text-premium-cream">Authorize Access Profile</h2>
                            <button onClick={() => setShowAddModal(false)} className="w-12 h-12 bg-white/5 hover:bg-premium-gold hover:text-white border border-white/10 hover:border-premium-gold text-white/50 transition-all font-bold flex items-center justify-center"><FiX size={20} /></button>
                        </div>

                        <form onSubmit={handleAddAdmin} className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Operative Designation</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 text-premium-cream focus:border-premium-gold/50 focus:bg-white/10 outline-none transition-all font-playfair text-xl italic"
                                        placeholder="Cipher Protocol Alpha"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Network Comm Link (Email)</label>
                                    <input
                                        type="email"
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all font-mono text-sm"
                                        placeholder="directive@itqan.systems"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Encryption Phrase</label>
                                    <input
                                        type="password"
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all font-mono"
                                        placeholder="Requires maximum complex entropy"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[9px] font-black text-white/40 mb-4 uppercase tracking-[0.3em]">Clearance Level Array</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'staff' })}
                                            className={`py-5 border font-black uppercase text-[10px] tracking-widest transition-all ${formData.role === 'staff' ? 'bg-white/10 text-white border-white/30 shadow-inner' : 'bg-transparent text-white/30 border-white/10 hover:border-white/20 hover:text-white/70'}`}
                                        >
                                            Standard Operative (Staff)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'admin' })}
                                            className={`py-5 border font-black uppercase text-[10px] tracking-widest transition-all ${formData.role === 'admin' ? 'bg-premium-gold/20 text-premium-gold border-premium-gold/50 shadow-[0_0_20px_rgba(234,179,8,0.15)]' : 'bg-transparent text-white/30 border-white/10 hover:border-premium-gold/30 hover:text-white/70'}`}
                                        >
                                            Inventory Architect (Admin)
                                        </button>
                                        {currentUser?.role === 'super_admin' && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: 'super_admin' })}
                                                className={`py-5 border col-span-2 font-black uppercase text-[10px] tracking-widest transition-all ${formData.role === 'super_admin' ? 'bg-premium-black text-rose-500 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.15)]' : 'bg-transparent text-white/20 border-white/5 hover:border-rose-500/20 hover:text-rose-500/50'}`}
                                            >
                                                System Overlord (Root)
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="w-full py-6 bg-premium-black border border-premium-gold/30 text-premium-gold font-black uppercase text-[10px] tracking-[0.3em] hover:bg-premium-gold hover:text-white transition-all shadow-[0_0_20px_rgba(234,179,8,0.15)] disabled:opacity-50 disabled:shadow-none"
                                >
                                    {formLoading ? 'Executing Blockchain Provision...' : 'Invoke Identity Constructor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
