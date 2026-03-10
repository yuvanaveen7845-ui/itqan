'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import { FiUser, FiMail, FiCalendar, FiShoppingBag, FiSearch, FiMoreVertical, FiExternalLink } from 'react-icons/fi';

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await adminAPI.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((c: any) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900">Customer Database</h1>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition min-w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Contact</th>
                <th className="px-8 py-4">Joined Date</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer: any) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-400 font-medium">ID: #{customer.id?.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                      <FiMail className="text-gray-400" />
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-gray-500 font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-gray-400" />
                      {new Date(customer.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-full border border-green-100">
                      Active
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => router.push(`/admin/customers/${customer.id}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-xs hover:bg-blue-600 hover:text-white transition shadow-sm"
                    >
                      View Profile <FiExternalLink />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filteredCustomers.length === 0 && (
          <div className="p-20 text-center text-gray-500">
            No customers found.
          </div>
        )}
      </div>
    </div>
  );
}
