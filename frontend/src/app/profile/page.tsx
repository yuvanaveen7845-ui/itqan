'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { orderAPI, authAPI } from '@/lib/api';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: '',
  });
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setProfileData({ ...profileData, name: user.name });
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setUpdating(true);
    setMessage({ type: '', text: '' });
    try {
      await authAPI.updateProfile(profileData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    setUpdating(true);
    setMessage({ type: '', text: '' });
    try {
      await authAPI.changePassword({
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password' });
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 scroll-reveal visible">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div className="space-y-4">
          <h1 className="text-5xl lg:text-7xl font-black text-premium-black imperial-serif lowercase">The Dashboard</h1>
          <p className="text-[11px] font-black text-premium-gold/60 uppercase tracking-[0.6em]">Executive Account Control</p>
        </div>
        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:w-1/4 scroll-reveal visible">
          <div className="luxury-card-rich shadow-2xl rounded-[32px] border-none overflow-hidden">
            <div className="p-8 border-b border-premium-gold/10 bg-premium-black/5 flex items-center gap-6">
              <div className="w-16 h-16 bg-premium-black text-premium-gold rounded-full flex items-center justify-center text-2xl font-black shadow-inner border border-premium-gold/20 italic imperial-serif">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-premium-black text-lg">{user.name}</h3>
                <span className="text-[9px] font-black text-premium-gold bg-premium-black/10 px-3 py-1 rounded-full uppercase tracking-widest">{user.role} Member</span>
              </div>
            </div>
            <nav className="p-6 space-y-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-4 ${activeTab === 'profile' ? 'bg-premium-black text-premium-gold shadow-xl scale-[1.02]' : 'text-premium-charcoal/50 hover:bg-premium-cream hover:text-premium-black'}`}
              >
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${activeTab === 'profile' ? 'bg-premium-gold' : 'bg-transparent'}`}></div>
                Profile details
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-4 ${activeTab === 'orders' ? 'bg-premium-black text-premium-gold shadow-xl scale-[1.02]' : 'text-premium-charcoal/50 hover:bg-premium-cream hover:text-premium-black'}`}
              >
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${activeTab === 'orders' ? 'bg-premium-gold' : 'bg-transparent'}`}></div>
                Order history
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-4 ${activeTab === 'addresses' ? 'bg-premium-black text-premium-gold shadow-xl scale-[1.02]' : 'text-premium-charcoal/50 hover:bg-premium-cream hover:text-premium-black'}`}
              >
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${activeTab === 'addresses' ? 'bg-premium-gold' : 'bg-transparent'}`}></div>
                Saved addresses
              </button>
            </nav>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="lg:w-3/4">
          {/* Tab 1: Profile */}
          {activeTab === 'profile' && (
            <div className="luxury-card-rich p-10 md:p-14 shadow-2xl rounded-[40px] border-none scroll-reveal visible">
              <h2 className="text-[14px] font-black mb-10 border-b border-premium-gold/20 pb-6 text-premium-black uppercase tracking-[0.5em]">Personal Dossier</h2>

              {message.text && (
                <div className={`p-6 rounded-2xl mb-8 font-medium ${message.type === 'success' ? 'bg-premium-cream text-premium-black border border-premium-gold/20' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-premium-gold uppercase tracking-[0.3em] ml-2">Appellation</label>
                  <input
                    type="text"
                    className="premium-input w-full rounded-2xl px-6 py-5 font-medium text-lg"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-premium-gold uppercase tracking-[0.3em] ml-2">Digital Signature</label>
                  <input type="email" className="premium-input w-full rounded-2xl px-6 py-5 font-medium text-lg bg-premium-cream/30 opacity-60" value={user.email} disabled />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-premium-gold uppercase tracking-[0.3em] ml-2">Communication line</label>
                  <input
                    type="tel"
                    className="premium-input w-full rounded-2xl px-6 py-5 font-medium text-lg"
                    placeholder="+91 98765 43210"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 mt-8 space-y-10">
                  <h3 className="text-[14px] font-black mb-10 border-t border-premium-gold/20 pt-10 text-premium-black uppercase tracking-[0.5em]">Gate Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input
                      type="password"
                      placeholder="Current Key"
                      className="premium-input w-full rounded-2xl px-6 py-5 text-sm"
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                    />
                    <input
                      type="password"
                      placeholder="New Key"
                      className="premium-input w-full rounded-2xl px-6 py-5 text-sm"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    />
                    <input
                      type="password"
                      placeholder="Verify Key"
                      className="premium-input w-full rounded-2xl px-6 py-5 text-sm"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={updating}
                    className="group relative px-10 py-5 bg-transparent border border-premium-black text-premium-black rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-premium-black hover:text-premium-gold transition-all duration-700 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-premium-black translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                    <span className="relative z-10">Rotate Credentials</span>
                  </button>
                </div>
              </div>
              <div className="mt-16 flex justify-end">
                <button
                  onClick={handleSaveChanges}
                  disabled={updating}
                  className="bg-premium-black text-premium-gold px-16 py-6 rounded-full font-black text-[11px] uppercase tracking-[0.5em] hover:bg-premium-gold hover:text-black transition-all duration-700 shadow-2xl scale-110 active:scale-95"
                >
                  {updating ? 'Recording...' : 'Finalize dossier'}
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Orders */}
          {activeTab === 'orders' && (
            <div className="luxury-card-rich shadow-2xl rounded-[40px] border-none overflow-hidden scroll-reveal visible">
              <div className="p-10 border-b border-premium-gold/10 flex justify-between items-center bg-premium-black/5">
                <h2 className="text-[14px] font-black text-premium-black uppercase tracking-[0.5em]">Investment Archive</h2>
              </div>
              <div className="p-10 min-h-[400px]">
                {loading ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-premium-gold"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">Looks like you haven't made your first purchase.</p>
                    <Link href="/products" className="btn btn-primary shadow-md hover:shadow-lg transition-all">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {orders.map((order: any) => (
                      <div key={order.id} className="bg-white/40 backdrop-blur-md border border-premium-gold/10 rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 group">
                        <div className="p-8 border-b border-premium-gold/5 flex flex-wrap justify-between items-center gap-6 bg-premium-black/5">
                          <div className="flex gap-12">
                            <div>
                              <p className="text-[9px] text-premium-gold/60 uppercase font-black tracking-widest mb-2">Acquisition Date</p>
                              <p className="font-bold text-premium-black text-lg imperial-serif italic">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-premium-gold/60 uppercase font-black tracking-widest mb-2">Total Value</p>
                              <p className="font-bold text-premium-black text-lg">₹{order.total_amount.toLocaleString()}</p>
                            </div>
                            <div className="hidden sm:block">
                              <p className="text-[9px] text-premium-gold/60 uppercase font-black tracking-widest mb-2">Ledger #</p>
                              <p className="font-mono text-sm text-premium-charcoal/60">{(order.display_id || order.id)?.slice(0, 12).toUpperCase() || 'N/A'}</p>
                            </div>
                          </div>
                          <div>
                            <span className={`px-6 py-2 rounded-full text-[9px] font-black tracking-[0.2em] uppercase shadow-inner ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                              order.status === 'shipped' ? 'bg-premium-gold text-premium-black' :
                                order.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                                  'bg-premium-cream/50 text-premium-black border border-premium-gold/10'
                              }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="p-8 flex justify-between items-center group-hover:bg-premium-cream/20 transition-colors duration-700">
                          <div className="flex -space-x-4">
                            {/* Placeholder for order item images */}
                            <div className="w-16 h-16 rounded-full border-4 border-white bg-premium-cream flex items-center justify-center text-[10px] font-black text-premium-gold uppercase tracking-tighter shadow-xl">Item</div>
                            {order.items?.length > 1 && <div className="w-16 h-16 rounded-full border-4 border-white bg-premium-black flex items-center justify-center text-[10px] font-black text-premium-gold shadow-xl">+{order.items.length - 1}</div>}
                          </div>
                          <div className="flex gap-6">
                            <button className="px-8 py-3 border border-premium-gold/20 rounded-full text-[10px] font-black text-premium-black uppercase tracking-[0.3em] hover:bg-premium-black hover:text-premium-gold transition-all duration-700 hidden sm:block">Intercept Parcel</button>
                            <Link href={`/orders/${order.id}`} className="px-8 py-3 bg-premium-gold text-premium-black rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:shadow-2xl transition-all duration-700 group/btn overflow-hidden relative">
                              <span className="relative z-10">Review Ledger</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Addresses */}
          {activeTab === 'addresses' && (
            <div className="luxury-card-rich p-10 md:p-14 shadow-2xl rounded-[40px] border-none scroll-reveal visible">
              <div className="flex justify-between items-center mb-10 border-b border-premium-gold/20 pb-6">
                <h2 className="text-[14px] font-black text-premium-black uppercase tracking-[0.5em]">Delivery Sanctuaries</h2>
                <button className="flex items-center gap-3 text-[10px] font-black text-premium-gold hover:text-premium-black uppercase tracking-[0.3em] transition-all duration-500 group">
                  <span className="w-6 h-6 rounded-full border border-premium-gold/30 flex items-center justify-center group-hover:bg-premium-gold group-hover:text-black transition-all">+</span>
                  New Arrival Point
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Mock Default Address */}
                <div className="bg-premium-black/5 border border-premium-gold/30 rounded-[32px] p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 py-2 px-6 bg-premium-gold text-black text-[9px] font-black uppercase tracking-widest rounded-bl-[20px]">Primary</div>
                   <h4 className="font-bold text-premium-black text-xl mb-4 italic imperial-serif">{user.name}</h4>
                  <p className="text-sm text-premium-charcoal/70 mb-6 leading-relaxed font-medium">123 Perfume Hub, Silk Road<br />Fashion District<br />Mumbai, Maharashtra 400001<br />India</p>
                  <p className="text-[11px] font-black text-premium-gold/60 uppercase tracking-widest mb-6">Contact: +91 98765 43210</p>
                  <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.3em]">
                    <button className="text-premium-gold hover:text-premium-black transition-colors">Edit point</button>
                    <span className="text-premium-gold/20">|</span>
                    <button className="text-red-500/60 hover:text-red-600 transition-colors">Decommission</button>
                  </div>
                </div>

                {/* Mock Secondary Address */}
                <div className="bg-white/40 backdrop-blur-md border border-premium-gold/10 rounded-[32px] p-8 relative hover:border-premium-gold/40 transition-all duration-700 group">
                  <h4 className="font-bold text-premium-black text-xl mb-4 italic imperial-serif">{user.name} (Office)</h4>
                  <p className="text-sm text-premium-charcoal/70 mb-6 leading-relaxed font-medium">456 Corporate Park, Tower B<br />Business District<br />New Delhi, Delhi 110001<br />India</p>
                  <p className="text-[11px] font-black text-premium-gold/60 uppercase tracking-widest mb-6">Contact: +91 98765 43210</p>
                  <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.3em]">
                    <button className="text-premium-gold hover:text-premium-black transition-colors">Edit point</button>
                    <span className="text-premium-gold/20">|</span>
                    <button className="text-premium-charcoal/40 hover:text-premium-black transition-colors">Set as Primary</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
