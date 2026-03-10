'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiBox, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <FiTrendingUp />, color: 'bg-blue-600', trend: '+12.5%', trendUp: true },
    { title: 'Total Orders', value: stats.totalOrders, icon: <FiShoppingBag />, color: 'bg-indigo-600', trend: '+8.2%', trendUp: true },
    { title: 'Customers', value: stats.totalCustomers, icon: <FiUsers />, color: 'bg-purple-600', trend: '+5.4%', trendUp: true },
    { title: 'Stock Items', value: stats.totalProducts, icon: <FiBox />, color: 'bg-pink-600', trend: '-2.1%', trendUp: false },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Platform Overview</h1>
          <p className="text-gray-500 font-medium">Detailed analytics and performance metrics for your Perfume enterprise.</p>
        </div>
        <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
          Download Report
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-opacity-20`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trendUp ? <FiArrowUpRight /> : <FiArrowDownRight />}
                {stat.trend}
              </div>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
            <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-900">Revenue Analysis</h3>
            <select className="bg-gray-50 text-sm font-bold px-3 py-1.5 rounded-lg border-none outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="w-full h-[350px] min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <LineChart data={stats.salesData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Bar Chart */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-8">Order Volume</h3>
          <div className="w-full h-[250px] min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <BarChart data={stats.salesData || []}>
                <XAxis dataKey="date" hide />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="orders" radius={[6, 6, 0, 0]}>
                  {stats.salesData?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === (stats.salesData?.length - 1) ? '#2563eb' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm text-gray-500 font-medium mt-4 italic">Peak order volume on weekend</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-black text-gray-900">Recent Transactions</h3>
          <Link href="/admin/orders" className="text-blue-600 font-bold hover:underline">View All Orders</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest">
                <th className="px-8 py-4">Order ID</th>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 font-bold text-gray-900">#{order.id.slice(0, 8)}</td>
                  <td className="px-8 py-5 font-semibold text-gray-600">{order.user_id}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-500 font-medium">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-8 py-5 text-right font-black text-gray-900">₹{order.total_amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
