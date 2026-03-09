'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { FiUserPlus, FiLock, FiMail, FiShield, FiAlertTriangle, FiCheckCircle, FiUser, FiRefreshCw } from 'react-icons/fi';

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);
    const [settingsLoading, setSettingsLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [sysSettings, setSysSettings] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await adminAPI.getSettings();
            setSysSettings(data);
        } catch (err) {
            console.error('Failed to fetch settings');
        } finally {
            setSettingsLoading(false);
        }
    };

    const handleToggleMaintenance = async () => {
        if (!sysSettings) return;
        const newValue = !sysSettings.maintenanceMode;
        try {
            setSettingsLoading(true);
            await adminAPI.updateSettings({ maintenanceMode: newValue });
            setSysSettings({ ...sysSettings, maintenanceMode: newValue });
            setSuccess(`Maintenance mode ${newValue ? 'enabled' : 'disabled'} successfully`);
        } catch (err) {
            setError('Failed to update system status');
        } finally {
            setSettingsLoading(false);
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            await adminAPI.createAdmin(formData);
            setSuccess(`Admin account for ${formData.name} created successfully!`);
            setFormData({ name: '', email: '', password: '', role: 'admin' });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create admin account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">System Settings</h1>
                <p className="text-gray-500 font-medium">Configure platform-wide settings and manage administrative access.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm">
                {/* Create Admin Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                            <FiUserPlus size={20} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Create New Administrator</h3>
                    </div>

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 flex items-center gap-3">
                            <FiCheckCircle className="flex-shrink-0" />
                            <p className="font-bold">{success}</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3">
                            <FiAlertTriangle className="flex-shrink-0" />
                            <p className="font-bold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleCreateAdmin} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none transition"
                                    placeholder="e.g. Jane Smith"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none transition"
                                    placeholder="admin@iqtanperfumes.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none transition"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Access Level (Role)</label>
                            <div className="relative">
                                <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none transition appearance-none font-bold bg-white"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    required
                                >
                                    <option value="admin">Administrator</option>
                                    <option value="super_admin">Super Administrator</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl mb-6">
                            <div className="flex gap-3 text-blue-700">
                                <FiShield className="flex-shrink-0 mt-1" />
                                <p className="text-xs font-medium leading-relaxed">
                                    New administrators will have full access to order management, inventory control, and customer analytics.
                                    Only <strong>Super Admins</strong> can create or revoke administrative privileges.
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-black text-white transition shadow-lg ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'}`}
                        >
                            {loading ? 'Creating Account...' : 'Add Administrator'}
                        </button>
                    </form>
                </div>

                {/* System Info / placeholder cards */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xl font-black text-gray-900 mb-6">Security & Logs</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Login Protection', status: 'Enabled', color: 'text-green-600' },
                                { label: 'Database Backup', status: 'Every 24h', color: 'text-blue-600' },
                                { label: 'SSL Certificate', status: 'Valid', color: 'text-green-600' },
                                { label: 'API Access', status: 'Restricted', color: 'text-orange-600' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                    <span className="font-bold text-gray-600">{item.label}</span>
                                    <span className={`font-black ${item.color}`}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
                        {settingsLoading && (
                            <div className="absolute inset-0 bg-white/10 flex items-center justify-center z-10 cursor-wait">
                                <FiRefreshCw className="animate-spin text-blue-400" size={24} />
                            </div>
                        )}
                        <h3 className="text-xl font-black mb-4">Maintenance Mode</h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">Toggle maintenance mode to prevent customers from placing orders during system upgrades.</p>
                        <div className="flex items-center justify-between bg-gray-800 p-4 rounded-xl">
                            <span className="font-bold">
                                System Status: {sysSettings?.maintenanceMode ?
                                    <span className="text-yellow-500">In Maintenance</span> :
                                    <span className="text-green-500">Active</span>
                                }
                            </span>
                            <button
                                onClick={handleToggleMaintenance}
                                className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${sysSettings?.maintenanceMode ? 'bg-yellow-500' : 'bg-green-500'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${sysSettings?.maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
