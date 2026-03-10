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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900">Order Management</h1>
        <div className="flex gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-white border border-gray-200 px-4 py-2 rounded-xl outline-none font-bold text-gray-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-4">Order ID</th>
                <th className="px-8 py-4">Customer ID</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Total</th>
                <th className="px-8 py-4">Date & Time</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 font-bold text-gray-900 leading-tight">
                    #{(order.display_id || order.id)?.slice(0, 8) || 'N/A'}
                  </td>
                  <td className="px-8 py-4 font-semibold text-gray-600">{order.user_id}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${order.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                      order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 font-black">₹{order.total_amount.toLocaleString()}</td>
                  <td className="px-8 py-4 text-sm font-medium text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}<br />
                    <span className="text-gray-400 text-xs">{new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex justify-end gap-2">
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'shipped')}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition" title="Mark Shipped">
                          <FiBox />
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'delivered')}
                          className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition" title="Mark Delivered">
                          <FiCheck />
                        </button>
                      )}
                      {['pending', 'confirmed'].includes(order.status) && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition" title="Cancel Order">
                          <FiX />
                        </button>
                      )}
                      <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-200 transition" title="Print Invoice">
                        <FiPrinter />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                        className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-600 hover:text-white transition" title="View Details"
                      >
                        <FiEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filteredOrders.length === 0 && (
          <div className="p-20 text-center text-gray-500">
            No orders matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
