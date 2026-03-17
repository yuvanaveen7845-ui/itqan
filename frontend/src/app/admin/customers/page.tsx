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
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-premium-gold/20 pb-8">
        <div>
          <h1 className="text-4xl font-playfair font-black text-premium-cream mb-2 tracking-tight">Clientele Portfolio</h1>
          <p className="text-premium-gold font-bold uppercase text-[10px] tracking-[0.3em]">Examine global patrons, exclusive memberships, and boutique relations.</p>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search VIPs and clients..."
            className="pl-12 pr-6 py-3 bg-[#1A1A1A] border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all placeholder-white/30 min-w-[300px] text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                <tr className="bg-black/40 text-premium-gold/60 text-[9px] font-black uppercase tracking-[0.3em] border-b border-white/5">
                  <th className="px-8 py-6">Client Identity</th>
                  <th className="px-8 py-6">Direct Contact</th>
                  <th className="px-8 py-6">Initiation Era</th>
                  <th className="px-8 py-6">Privilege Status</th>
                  <th className="px-8 py-6 text-right">Directives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCustomers.map((customer: any) => (
                  <tr key={customer.id} className="hover:bg-premium-gold/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-premium-black border border-premium-gold/30 text-premium-gold rounded-full flex items-center justify-center font-playfair font-black text-xl shadow-[0_0_15px_rgba(234,179,8,0.15)] group-hover:scale-110 transition-transform">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-premium-cream group-hover:text-premium-gold transition-colors">{customer.name}</p>
                          <p className="text-[10px] text-white/40 font-mono tracking-widest mt-1 uppercase">ID: {customer.id?.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 text-white/60 font-medium">
                        <FiMail className="text-premium-gold/50" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-white/50 font-medium text-sm">
                      <div className="flex items-center gap-3">
                        <FiCalendar className="text-premium-gold/50" />
                        {new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-2 bg-green-500/10 text-green-400 text-[9px] font-black uppercase tracking-[0.2em] border border-green-500/20">
                        Active Patron
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => router.push(`/admin/customers/${customer.id}`)}
                        className="inline-flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 text-white/50 font-black text-[9px] tracking-widest uppercase hover:bg-premium-gold hover:border-premium-gold hover:text-white transition-all shadow-sm"
                      >
                        Scan Profile <FiExternalLink size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filteredCustomers.length === 0 && (
          <div className="p-20 text-center text-white/30 font-playfair italic text-xl">
            No patrons located in your search array.
          </div>
        )}
      </div>
    </div>
  );
}
