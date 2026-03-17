'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { FiShield, FiClock, FiUser, FiActivity, FiSearch, FiFilter, FiEye, FiRefreshCw } from 'react-icons/fi';

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
        if (action.includes('DELETE')) return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
        if (action.includes('CREATE')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
        if (action.includes('UPDATE')) return 'text-premium-gold bg-premium-gold/10 border-premium-gold/30';
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold shadow-[0_0_20px_rgba(234,179,8,0.3)]"></div>
        </div>
    );

    return (
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-premium-gold/20 pb-8">
                <div>
                    <h1 className="text-4xl font-playfair font-black text-premium-cream mb-2 tracking-tight">Intelligence Surveillance</h1>
                    <p className="text-premium-gold font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-3">
                        <FiShield /> Permanent Administrative Forensic Records
                    </p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={fetchLogs}
                        className="flex items-center gap-3 px-8 py-4 bg-premium-black text-premium-gold border border-premium-gold/30 hover:bg-premium-gold hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:scale-105 active:scale-95"
                    >
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Synchronize Log Stream
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="relative w-full max-w-xl group">
                    <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-premium-gold transition-colors" />
                    <input
                        type="text"
                        placeholder="Filter by action, operative or target vector..."
                        className="w-full pl-16 pr-6 py-5 bg-[#1A1A1A] border border-white/5 focus:border-premium-gold/50 outline-none transition-all font-mono text-[11px] font-bold text-premium-cream uppercase tracking-widest"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <button className="p-5 bg-[#1A1A1A] border border-white/5 text-white/30 hover:text-premium-gold hover:border-premium-gold/30 transition-all">
                        <FiFilter size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-[#1A1A1A] shadow-2xl border border-white/5 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 pointer-events-none"></div>
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-black/40 text-premium-gold/60 text-[9px] font-black uppercase tracking-[0.3em] border-b border-white/5">
                                <th className="px-10 py-6">Epoch / Timestamp</th>
                                <th className="px-10 py-6">Administrative Asset</th>
                                <th className="px-10 py-6">Execution Logic</th>
                                <th className="px-10 py-6">Target Vector</th>
                                <th className="px-10 py-6 text-right">Observation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-premium-gold/5 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <FiClock className="text-premium-gold/40 group-hover:text-premium-gold transition-colors" />
                                            <span className="font-mono font-bold text-white/60 text-[10px] tracking-tighter">
                                                {new Date(log.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'medium' }).toUpperCase()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-premium-black border border-premium-gold/30 flex items-center justify-center text-premium-gold font-playfair font-black text-sm shadow-inner group-hover:scale-110 transition-transform">
                                                {log.users?.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-playfair font-black text-premium-cream text-base group-hover:text-premium-gold transition-colors">{log.users?.name || 'Omnipotent System'}</p>
                                                <p className="text-[9px] text-white/30 font-mono tracking-widest uppercase mt-1">{log.users?.email || 'SYSTEM_CORE'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-2 border text-[8px] font-black uppercase tracking-[0.2em] shadow-sm ${getActionColor(log.action)}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col gap-2">
                                            <span className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-black text-white/60 uppercase tracking-widest w-fit">
                                                {log.target_type || 'GLOBAL_STATE'}
                                            </span>
                                            <span className="text-[10px] text-white/20 font-mono truncate max-w-[150px] group-hover:text-white/40 transition-colors italic">
                                                {log.target_id || 'NULL_ID'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button className="p-3 bg-white/5 border border-white/10 text-white/30 hover:bg-premium-gold hover:border-premium-gold hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100">
                                            <FiEye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-32 text-center text-white/30 font-playfair italic text-xl">
                                        The administrative chronicles observe zero relevant events.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-[#1A1A1A] border border-white/5 p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-premium-black border border-premium-gold/30 flex items-center justify-center text-premium-gold shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                            <FiActivity size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-playfair font-black text-premium-cream">Log Integrity Verified</h3>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mt-2">All administrative sequences are secured via cryptographic validation.</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-premium-gold mb-2">Total Monitored Sequences</p>
                        <p className="text-5xl font-playfair font-black text-white">{logs.length}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
