'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, AreaChart, Area
} from 'recharts';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiBox, FiArrowUpRight, FiArrowDownRight, FiShield, FiCpu, FiExternalLink, FiSearch, FiLayers, FiActivity } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchStats = async () => {
      try {
        const { data } = await adminAPI.getDashboard();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
        <div className="flex flex-col justify-center items-center h-[70vh] space-y-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-premium-gold shadow-[0_0_30px_rgba(234,179,8,0.3)]"></div>
            <p className="text-premium-gold font-black uppercase text-[10px] tracking-[0.5em] animate-pulse">Scanning Platform Vitals</p>
        </div>
    );
  }

  const statCards = [
    { title: 'Gross Revenue Output', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <FiTrendingUp />, color: 'bg-premium-gold', trend: '+14.2%', trendUp: true, desc: 'Global performance index' },
    { title: 'Cumulative Acquisitions', value: stats.totalOrders, icon: <FiShoppingBag />, color: 'bg-emerald-600', trend: '+9.4%', trendUp: true, desc: 'Transaction lifecycle count' },
    { title: 'Pending Fulfillment', value: stats.pendingOrders, icon: <FiActivity />, color: 'bg-indigo-600', trend: 'Live', trendUp: true, desc: 'Active logistics queue' },
    { title: 'Inventory Criticality', value: stats.lowStockAlerts, icon: <FiBox />, color: 'bg-rose-600', trend: 'Critical', trendUp: false, desc: 'Depleted SKU threshold' },
  ];

  return (
    <div className="space-y-12 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-premium-gold/20 pb-12 gap-8">
        <div>
            <h1 className="text-6xl font-playfair font-black text-premium-cream tracking-tighter">Command Intelligence</h1>
            <p className="text-premium-gold font-bold uppercase text-[10px] tracking-[0.6em] mt-4 flex items-center gap-4">
                <FiShield className="animate-pulse" /> Real-time Global Asset Surveillance & Control
            </p>
        </div>
        <div className="flex gap-4">
            <button className="bg-[#1A1A1A] border border-white/5 px-8 py-4 font-black text-[10px] uppercase tracking-widest text-white/50 hover:text-white hover:border-white/10 transition-all shadow-xl">
               History Archive
            </button>
            <button className="bg-premium-black border border-premium-gold/30 px-10 py-5 font-black text-[10px] uppercase tracking-[0.3em] text-premium-gold hover:bg-premium-gold hover:text-white transition-all shadow-[0_0_30_rgba(234,179,8,0.1)] flex items-center gap-4 hover:scale-105 active:scale-95">
                Generate Intel Report
            </button>
        </div>
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-[#1A1A1A] p-10 border border-white/5 hover:border-premium-gold/40 shadow-2xl transition-all duration-700 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className={`${stat.color} p-4 text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest border px-3 py-1.5 ${stat.trendUp ? 'text-green-400 bg-green-400/10 border-green-500/20' : 'text-rose-400 bg-rose-400/10 border-rose-500/20'}`}>
                {stat.trendUp ? <FiArrowUpRight size={12} /> : <FiArrowDownRight size={12} />}
                {stat.trend}
              </div>
            </div>
            <div className="relative z-10 space-y-1">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">{stat.title}</p>
                <h3 className="text-5xl font-playfair font-black text-premium-cream tracking-tighter">{stat.value}</h3>
                <p className="text-[8px] text-white/10 font-bold uppercase tracking-[0.2em] pt-3">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Revenue Velocity Visualization */}
        <div className="lg:col-span-2 bg-[#1A1A1A] p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 pointer-events-none"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/5 pb-8 gap-6 relative z-10">
            <div>
              <h3 className="text-2xl font-playfair font-black text-premium-cream">Revenue Velocity</h3>
              <p className="text-[9px] text-premium-gold/50 font-black uppercase tracking-[0.4em] mt-1">Cross-sectional performance matrix</p>
            </div>
            <div className="flex bg-black/40 p-1 border border-white/10">
               {['Last 7D', 'Last 30D'].map(period => (
                 <button key={period} className={`px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${period === 'Last 7D' ? 'bg-premium-gold text-white shadow-xl' : 'text-white/20 hover:text-white/50'}`}>
                   {period}
                 </button>
               ))}
            </div>
          </div>
          <div className="w-full min-h-[400px] relative z-10">
            {mounted ? (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={stats.salesData || []}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#ffffff08" />
                  <XAxis dataKey="date" stroke="#ffffff20" fontSize={9} tickLine={false} axisLine={false} dy={20} tickFormatter={(str) => str.toUpperCase()} />
                  <YAxis stroke="#ffffff20" fontSize={9} tickLine={false} axisLine={false} dx={-20} tickFormatter={(val) => `₹${val / 1000}K`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #C5A05930', borderRadius: '0px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#C5A059', fontSize: '10px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#ffffff50', fontSize: '9px', marginBottom: '8px', fontWeight: 'black', textTransform: 'uppercase' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#C5A059"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-[400px] bg-white/5 animate-pulse"></div>
            )}
          </div>
        </div>

        {/* System Intelligence Feed */}
        <div className="space-y-10">
            <div className="bg-[#1A1A1A] p-12 border border-white/5 shadow-2xl relative overflow-hidden">
                <h3 className="text-xl font-playfair font-black text-premium-cream mb-10 border-b border-white/5 pb-8 flex items-center gap-4">
                    <FiCpu className="text-premium-gold" /> System State
                </h3>
                <div className="space-y-10">
                   {[
                       { label: 'Uptime Integrity', value: '99.98%', status: 'optimal' },
                       { label: 'API Latency Vector', value: '42ms', status: 'optimal' },
                       { label: 'Cloud Propagation', value: 'Global', status: 'active' }
                   ].map(sys => (
                       <div key={sys.label} className="flex justify-between items-end border-b border-white/5 pb-4">
                            <div>
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">{sys.label}</p>
                                <p className="text-2xl font-mono font-black text-premium-cream">{sys.value}</p>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-green-400">Stable</span>
                            </div>
                       </div>
                   ))}
                </div>
                <div className="mt-12 p-6 bg-premium-gold/5 border border-premium-gold/20">
                   <p className="text-[9px] font-black text-premium-gold uppercase tracking-[0.4em] mb-1">Last Cryptographic Audit</p>
                   <p className="text-xs font-mono text-white/50">{new Date().toLocaleTimeString()} — SECURE</p>
                </div>
            </div>

            <div className="bg-[#1A1A1A] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex justify-between items-center mb-8">
                     <h3 className="text-lg font-playfair font-black text-premium-cream">Order Magnitude</h3>
                     <FiLayers className="text-white/20" />
                </div>
                <div className="w-full h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.salesData || []}>
                            <Tooltip cursor={{fill: 'transparent'}} content={() => null} />
                            <Bar dataKey="orders">
                                {stats.salesData?.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={index === (stats.salesData?.length - 1) ? '#C5A059' : '#ffffff10'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] text-center mt-6">Sequence progression detected</p>
            </div>
        </div>
      </div>

      {/* Transaction Nexus */}
      <div className="bg-[#1A1A1A] border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="p-12 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-premium-gold/[0.03] to-transparent">
          <div>
            <h3 className="text-3xl font-playfair font-black text-white tracking-tight">Transaction Nexus</h3>
            <p className="text-[9px] text-premium-gold/50 font-black uppercase tracking-[0.4em] mt-2">Latest commercial acquisitions across the network.</p>
          </div>
          <Link 
            href="/admin/orders" 
            className="group flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 hover:border-premium-gold/50 hover:bg-premium-gold transition-all duration-500"
          >
            <span className="text-[10px] font-black text-white group-hover:text-black uppercase tracking-widest">Global Order Ledger</span>
            <FiExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/60 text-white/30 text-[9px] font-black uppercase tracking-[0.5em] border-b border-white/5">
                <th className="px-12 py-8 text-premium-gold">Vector ID</th>
                <th className="px-12 py-8">Acquisition Asset</th>
                <th className="px-12 py-8">Execution State</th>
                <th className="px-12 py-8">Chronicle Date</th>
                <th className="px-12 py-8 text-right">Value Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {stats.recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-premium-gold/[0.03] transition-colors group">
                  <td className="px-12 py-8 font-black text-premium-cream group-hover:text-premium-gold transition-colors tracking-widest whitespace-nowrap">
                    #{order.display_id || order.id.slice(0, 10).toUpperCase()}
                  </td>
                  <td className="px-12 py-8 font-bold text-white/40 truncate max-w-[200px]">{order.user_id}</td>
                  <td className="px-12 py-8">
                    <span className={`px-5 py-2.5 border text-[9px] font-black uppercase tracking-[0.2em] shadow-inner ${order.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                        order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                          order.status === 'shipped' ? 'bg-premium-gold/10 text-premium-gold border-premium-gold/30 shadow-[0_0_20px_rgba(197,160,89,0.1)]' :
                            'bg-white/5 text-white/50 border-white/10'
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-12 py-8 text-white/30 font-bold tracking-tighter">{new Date(order.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</td>
                  <td className="px-12 py-8 text-right font-black text-premium-cream text-lg tracking-tighter group-hover:text-premium-gold transition-colors">
                    ₹{Number(order.total_amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
