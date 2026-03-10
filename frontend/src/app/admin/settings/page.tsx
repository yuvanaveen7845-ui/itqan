'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { FiShield, FiUserPlus, FiTrash2, FiKey, FiCpu, FiActivity, FiUserCheck } from 'react-icons/fi';
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
                alert('Admins can only create Staff accounts.');
                return;
            }
            await adminAPI.createAdmin(formData);
            setShowAddModal(false);
            fetchData();
            setFormData({ name: '', email: '', password: '', role: 'staff' });
        } catch (error) {
            alert('Failed to create account');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteAdmin = async (adminId: string) => {
        if (!confirm('Are you sure you want to delete this administrative account? This action cannot be undone.')) {
            return;
        }
        try {
            await adminAPI.deleteAdmin(adminId);
            fetchData();
        } catch (error) {
            alert('Failed to delete administrative account');
        }
    };

    const toggleMaintenance = async () => {
        try {
            const newStatus = !systemSettings.maintenanceMode;
            await adminAPI.updateSettings({ maintenanceMode: newStatus });
            setSystemSettings({ ...systemSettings, maintenanceMode: newStatus });
        } catch (error) {
            alert('Failed to update maintenance mode');
        }
    };

    if (loading) {
        return <div className="p-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>;
    }

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 border-l-8 border-indigo-600 pl-4">System Sovereignty</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2 ml-4">Global Security & Administrative Control</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 transition shadow-xl shadow-indigo-100"
                >
                    <FiUserPlus /> Provision New Actor
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* System Vitals */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <FiShield className="text-indigo-600" />
                            Administrative Hierarchy
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                                        <th className="pb-4">Actor</th>
                                        <th className="pb-4">Privilege Level</th>
                                        <th className="pb-4">Access Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {admins.map((admin) => (
                                        <tr key={admin.id} className="group">
                                            <td className="py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                                                        {admin.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 uppercase text-sm tracking-tight">{admin.name}</p>
                                                        <p className="text-xs text-gray-400 font-bold">{admin.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${admin.role === 'super_admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                        admin.role === 'admin' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                            'bg-gray-50 text-gray-600 border-gray-100'
                                                    }`}>
                                                    {admin.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                    Active
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
                <div className="space-y-8">
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-gray-200">
                        <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                            <FiCpu className="text-indigo-400" />
                            Global Overrides
                        </h2>

                        <div className="space-y-6">
                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex justify-between items-center">
                                <div>
                                    <p className="font-black text-sm uppercase tracking-tight">Maintenance Mode</p>
                                    <p className="text-[10px] text-gray-400 font-bold">Locks frontend for all users</p>
                                </div>
                                <button
                                    onClick={toggleMaintenance}
                                    className={`w-14 h-8 rounded-full transition-all relative ${systemSettings?.maintenanceMode ? 'bg-rose-600' : 'bg-gray-700'}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${systemSettings?.maintenanceMode ? 'right-1' : 'left-1'}`}></div>
                                </button>
                            </div>

                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="font-black text-sm uppercase tracking-tight">API Rate Limits</p>
                                    <FiActivity className="text-gray-500" />
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 bg-indigo-600 rounded-xl text-[10px] font-black uppercase">Normal</button>
                                    <button className="flex-1 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase">Strict</button>
                                </div>
                            </div>

                            <div className="p-6 bg-indigo-600/20 rounded-3xl border border-indigo-400/20 flex items-center gap-4">
                                <FiKey className="text-indigo-400 text-xl" />
                                <div>
                                    <p className="font-black text-sm uppercase">Last Security Audit</p>
                                    <p className="text-[10px] text-indigo-300 font-bold">{new Date(systemSettings?.lastBackup).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
                        <FiUserCheck className="text-indigo-600 text-3xl mb-4" />
                        <h3 className="font-black text-indigo-900 uppercase text-sm mb-2">Role Permissions Heuristic</h3>
                        <p className="text-xs text-indigo-600/70 font-medium leading-relaxed">
                            Super Admins possess root authority. Admins can manage catalog and staff. Staff are restricted to order operations and analytics observation.
                        </p>
                    </div>
                </div>
            </div>

            {/* Provisioning Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-gray-900">Provision New Actor</h2>
                            <button onClick={() => setShowAddModal(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors font-bold">✕</button>
                        </div>

                        <form onSubmit={handleAddAdmin} className="p-10 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Identity Name</label>
                                <input
                                    type="text"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-50 transition outline-none font-bold"
                                    placeholder="Full Legal Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Access Email</label>
                                <input
                                    type="email"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-50 transition outline-none font-bold"
                                    placeholder="corporate@itqan.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Secure Credentials</label>
                                <input
                                    type="password"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-50 transition outline-none font-bold"
                                    placeholder="Min 12 Characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Target Privilege Level</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'staff' })}
                                        className={`py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition border ${formData.role === 'staff' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 border-gray-100 hover:border-indigo-100'}`}
                                    >
                                        Sales Staff
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'admin' })}
                                        className={`py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition border ${formData.role === 'admin' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-white text-gray-400 border-gray-100 hover:border-blue-100'}`}
                                    >
                                        Inventory Admin
                                    </button>
                                    {currentUser?.role === 'super_admin' && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'super_admin' })}
                                            className={`py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition border col-span-2 ${formData.role === 'super_admin' ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-200' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-900'}`}
                                        >
                                            Super Admin (Root)
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={formLoading}
                                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-2xl shadow-indigo-200 disabled:opacity-50"
                            >
                                {formLoading ? 'Executing Genesis...' : 'Initialize Actor'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
