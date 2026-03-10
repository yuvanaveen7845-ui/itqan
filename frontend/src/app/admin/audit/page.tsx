'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { FiShield, FiClock, FiUser, FiActivity, FiSearch, FiFilter, FiEye } from 'react-icons/fi';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const { data } = await adminAPI.getAuditLogs();
            setLogs(data);
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getActionColor = (action: string) => {
        if (action.includes('DELETE')) return 'text-rose-600 bg-rose-50';
        if (action.includes('CREATE')) return 'text-emerald-600 bg-emerald-50';
        if (action.includes('UPDATE')) return 'text-amber-600 bg-amber-50';
        return 'text-indigo-600 bg-indigo-50';
    };

    if (loading) return <div className="p-20 text-center animate-pulse">Scanning Security Logs...</div>;

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20">
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">System Audit Console</h1>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2 flex items-center gap-2">
                    <FiShield className="text-indigo-600" /> Historical Administrative Surveillance
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full max-w-md group">
                    <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by action, user or target..."
                        className="w-full pl-16 pr-6 py-4 bg-white rounded-[2rem] border border-gray-100 shadow-sm outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all font-bold text-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <button className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-600 hover:text-indigo-600 transition-colors">
                        <FiFilter />
                    </button>
                    <button
                        onClick={fetchLogs}
                        className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200"
                    >
                        Refresh Log Stream
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] p-4 border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="border-b border-gray-50">
                        <tr>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Administrator</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Execution</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Target</th>
                            <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <FiClock className="text-gray-300" />
                                        <span className="font-bold text-gray-600 text-xs">
                                            {new Date(log.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-[10px]">
                                            {log.users?.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-sm">{log.users?.name || 'Unknown'}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{log.users?.email || '-'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-gray-100 rounded-md text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                                            {log.target_type || 'SYSTEM'}
                                        </span>
                                        <span className="text-xs text-gray-400 font-mono truncate max-w-[100px]">
                                            {log.target_id || '-'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 group-hover:text-indigo-600 transition-colors shadow-sm">
                                        <FiEye />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredLogs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-20 text-center text-gray-400 font-black uppercase text-xs tracking-widest">
                                    No administrative events found in this trajectory
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
