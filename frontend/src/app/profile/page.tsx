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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your account settings and orders</p>
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
        <div className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-inner">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{user.name}</h3>
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded uppercase">{user.role}</span>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'orders' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Order History
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'addresses' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Saved Addresses
              </button>
            </nav>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="lg:w-3/4">
          {/* Tab 1: Profile */}
          {activeTab === 'profile' && (
            <div className="card shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">Personal Details</h2>

              {message.text && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="input"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <input type="email" className="input bg-gray-50" value={user.email} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className="input"
                    placeholder="+91 98765 43210"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 mt-4 space-y-4">
                  <h3 className="text-lg font-bold mb-4 border-t pt-6">Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="input"
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="input"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="input"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={updating}
                    className="btn btn-secondary border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Change Password
                  </button>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSaveChanges}
                  disabled={updating}
                  className="btn btn-primary px-8"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Orders */}
          {activeTab === 'orders' && (
            <div className="card shadow-sm border border-gray-200 p-0 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <h2 className="text-xl font-bold">Order History</h2>
              </div>
              <div className="p-6 bg-gray-50 min-h-[400px]">
                {loading ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
                  <div className="space-y-6">
                    {orders.map((order: any) => (
                      <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-gray-50">
                          <div className="flex gap-8">
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Order Placed</p>
                              <p className="font-semibold text-gray-900">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total</p>
                              <p className="font-semibold text-gray-900">₹{order.total_amount}</p>
                            </div>
                            <div className="hidden sm:block">
                              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Order #</p>
                              <p className="font-mono text-sm text-gray-900">{(order.display_id || order.id)?.slice(0, 8) || 'N/A'}</p>
                            </div>
                          </div>
                          <div>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                              }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex justify-between items-center">
                          <div className="flex -space-x-2">
                            {/* Placeholder for order item images */}
                            <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-500">Item</div>
                            {order.items?.length > 1 && <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">+{order.items.length - 1}</div>}
                          </div>
                          <div className="flex gap-3">
                            <button className="px-4 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50 transition-colors hidden sm:block">Track Order</button>
                            <Link href={`/orders/${order.id}`} className="px-4 py-2 bg-blue-50 text-blue-700 rounded font-bold hover:bg-blue-100 transition-colors">
                              View Details
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
            <div className="card shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold">Saved Addresses</h2>
                <button className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add New
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mock Default Address */}
                <div className="border-2 border-blue-500 rounded-xl p-5 relative bg-blue-50">
                  <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">Default</span>
                  <h4 className="font-bold text-gray-900 mb-1">{user.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">123 Perfume Hub, Silk Road<br />Fashion District<br />Mumbai, Maharashtra 400001<br />India</p>
                  <p className="text-sm text-gray-600 mb-4">Phone: +91 98765 43210</p>
                  <div className="flex gap-3 text-sm font-medium">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <span className="text-gray-300">|</span>
                    <button className="text-red-500 hover:underline">Remove</button>
                  </div>
                </div>

                {/* Mock Secondary Address */}
                <div className="border border-gray-200 rounded-xl p-5 relative hover:border-gray-300 transition-colors">
                  <h4 className="font-bold text-gray-900 mb-1">{user.name} (Office)</h4>
                  <p className="text-sm text-gray-600 mb-4">456 Corporate Park, Tower B<br />Business District<br />New Delhi, Delhi 110001<br />India</p>
                  <p className="text-sm text-gray-600 mb-4">Phone: +91 98765 43210</p>
                  <div className="flex gap-3 text-sm font-medium">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <span className="text-gray-300">|</span>
                    <button className="text-gray-500 hover:underline">Set as Default</button>
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
