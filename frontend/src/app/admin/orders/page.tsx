'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI, orderAPI } from '@/lib/api';
import { FiSearch, FiFilter, FiEye, FiCheck, FiX, FiPrinter, FiBox } from 'react-icons/fi';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await adminAPI.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      // Refresh local state
      setOrders(orders.map((o: any) => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-premium-gold/20 pb-8">
        <div>
          <h1 className="text-4xl font-playfair font-black text-premium-cream mb-2 tracking-tight">Order Manifesto</h1>
          <p className="text-premium-gold font-bold uppercase text-[10px] tracking-[0.3em]">Oversee global dispatches and command customer fulfillment.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search manifests..."
              className="pl-12 pr-6 py-3 bg-[#1A1A1A] border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all placeholder-white/30 min-w-[250px] text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-[#1A1A1A] border border-white/10 px-6 py-3 font-black text-[9px] uppercase tracking-widest text-premium-cream focus:border-premium-gold/50 outline-none appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Directives</option>
            <option value="pending">Pending Validation</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">In Transit (Shipped)</option>
            <option value="delivered">Fulfilled (Delivered)</option>
            <option value="cancelled">Voided</option>
          </select>
        </div>
      </div>

      <div className="bg-[#1A1A1A] shadow-2xl border border-white/5 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 pointer-events-none"></div>
        {loading ? (
          <div className="p-20 text-center relative z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/40 text-premium-gold/60 text-[9px] font-black uppercase tracking-[0.3em]">
                  <th className="px-8 py-6">Manifest ID</th>
                  <th className="px-8 py-6">Target Client</th>
                  <th className="px-8 py-6">Operations Status</th>
                  <th className="px-8 py-6">Valuation</th>
                  <th className="px-8 py-6">Timestamp</th>
                  <th className="px-8 py-6 text-right">Directives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-premium-gold/5 transition-colors group">
                    <td className="px-8 py-6 font-mono text-premium-cream tracking-widest text-sm">
                      #{(order.display_id || order.id)?.slice(0, 8) || 'N/A'}
                    </td>
                    <td className="px-8 py-6 font-semibold text-white/50">{order.user_id}</td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] border ${order.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          order.status === 'shipped' ? 'bg-premium-gold/10 text-premium-gold border-premium-gold/30' :
                            order.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                              'bg-white/5 text-white/50 border-white/10'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-black text-white text-base">₹{Number(order.total_amount).toLocaleString()}</td>
                    <td className="px-8 py-6 text-sm font-medium text-white/70">
                      {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}<br />
                      <span className="text-premium-gold/50 text-[10px] uppercase font-mono tracking-widest">{new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-3">
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'shipped')}
                            className="p-3 bg-white/5 border border-white/10 text-white/50 hover:bg-premium-gold hover:border-premium-gold hover:text-white transition-all shadow-sm" title="Dispatch order">
                            <FiBox size={16} />
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'delivered')}
                            className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Confirm Fulfillment">
                            <FiCheck size={16} />
                          </button>
                        )}
                        {['pending', 'confirmed'].includes(order.status) && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                            className="p-3 bg-rose-500/5 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Void Manifest">
                            <FiX size={16} />
                          </button>
                        )}
                        <button className="p-3 bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all shadow-sm" title="Mint Invoice">
                          <FiPrinter size={16} />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                          className="p-3 bg-white/5 border border-white/10 text-white/50 hover:bg-premium-gold hover:border-premium-gold hover:text-white transition-all shadow-sm" title="Review Intelligence"
                        >
                          <FiEye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filteredOrders.length === 0 && (
          <div className="p-20 text-center text-white/30 font-playfair italic text-xl">
            No active manifestations matching your query.
          </div>
        )}
      </div>
    </div>
  );
}
