'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiMapPin, FiPackage, FiShoppingBag, FiSettings, FiLogOut, FiEdit2, FiChevronRight, FiCheckCircle, FiPlus } from 'react-icons/fi';
import { useAuthStore } from '@/store/auth';
import { orderAPI, authAPI, addressAPI } from '@/lib/api';
import { useNotificationStore } from '@/store/notification';
import Link from 'next/link';
import Editable from '@/components/Editable';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'settings'>('orders');
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
  const { showNotification } = useNotificationStore();

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({ ...prev, name: user.name }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    const fetchData = async () => {
        setLoading(true);
        try {
            const [ordersRes, addrRes] = await Promise.all([
                orderAPI.getAll(),
                addressAPI.getAll()
            ]);
            setOrders(ordersRes.data || []);
            setAddresses(addrRes.data || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            showNotification('Failed to retrieve dossier records.', 'error');
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [user, router, showNotification]);

  const handleSaveChanges = async () => {
    setUpdating(true);
    try {
      await authAPI.updateProfile(profileData);
      showNotification('Profile updated successfully!', 'luxury');
    } catch (error) {
      showNotification('Failed to update profile.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      showNotification('Passwords do not match.', 'error');
      return;
    }
    setUpdating(true);
    try {
      await authAPI.changePassword({
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      });
      showNotification('Password updated successfully!', 'luxury');
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showNotification('Failed to update password.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-premium-black min-h-screen">
      {/* Executive Boutique Header */}
      <section className="bg-premium-black pt-36 sm:pt-60 pb-16 sm:pb-40 px-4 sm:px-12 md:px-24 grain-overlay relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 scale-150 rotate-3 transform translate-x-20">
          <Editable id="profile_bg_text" fallback="Concierge">
            <span className="text-[300px] imperial-serif text-white pointer-events-none select-none italic font-normal">Concierge</span>
          </Editable>
        </div>
        <div className="relative z-10 boutique-layout flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="space-y-8">
            <Editable id="profile_eyebrow" type="text" fallback="Signature Account">
              <span className="text-premium-gold text-[10px] font-black uppercase tracking-[1rem] block animate-reveal">Privileged Access</span>
            </Editable>
            <div className="space-y-4">
               <h1 className="text-6xl md:text-9xl imperial-serif text-white animate-reveal" style={{ animationDelay: '0.2s' }}>
                  {user.name.split(' ')[0]} <br />
                  <span className="gold-luxury-text italic lowercase font-normal">{user.name.split(' ').slice(1).join(' ')}</span>
               </h1>
               <div className="flex items-center gap-6 pt-4 animate-reveal" style={{ animationDelay: '0.4s' }}>
                  <span className="h-px w-12 bg-premium-gold/40"></span>
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">{user.email}</span>
               </div>
            </div>
          </div>

          <div className="flex gap-8 animate-reveal" style={{ animationDelay: '0.6s' }}>
             <button onClick={() => { logout(); router.push('/'); }} className="px-12 py-5 border border-white/10 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:border-rose-500 transition-all flex items-center gap-4 group">
                <Editable id="profile_logout_btn" fallback="Terminate Session">
                  <span>Terminate Session</span>
                </Editable>
                <FiLogOut className="group-hover:translate-x-2 transition-transform" />
             </button>
          </div>
        </div>
      </section>

      <div className="boutique-layout px-4 sm:px-12 md:px-24 section-spacing">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Navigation Dossier */}
          <div className="lg:col-span-3 space-y-12">
            <div className="space-y-4">
               <Editable id="profile_sidebar_title" fallback="Dossier Sections">
                 <h3 className="text-[10px] font-black text-premium-gold uppercase tracking-[0.4em] mb-12">Dossier Sections</h3>
               </Editable>
               <nav className="space-y-4">
                  {[
                    { id: 'orders', label: 'Order Archive', icon: FiPackage },
                    { id: 'addresses', label: 'Signature Locales', icon: FiMapPin },
                    { id: 'settings', label: 'Security Details', icon: FiSettings }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center justify-between py-6 border-b border-white/5 group transition-all ${activeTab === tab.id ? 'border-premium-gold' : 'hover:border-premium-gold/40'}`}
                    >
                      <div className="flex items-center gap-6">
                         <tab.icon size={18} className={activeTab === tab.id ? 'text-premium-gold' : 'text-white/30 group-hover:text-premium-gold transition-colors'} />
                         <span className={`text-xl imperial-serif italic transition-all ${activeTab === tab.id ? 'text-white translate-x-4' : 'text-white/50 group-hover:translate-x-4'}`}>
                            {tab.label}
                         </span>
                      </div>
                      <FiChevronRight size={14} className={`text-premium-gold transition-opacity ${activeTab === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
                    </button>
                  ))}
               </nav>
            </div>
          </div>

          {/* Content Pane */}
          <div className="lg:col-span-9">
            {activeTab === 'orders' && (
              <div className="space-y-24">
                <div className="flex justify-between items-end border-b border-premium-gold/10 pb-12">
                   <Editable id="profile_orders_title" fallback="The Order Archive">
                     <h2 className="text-3xl sm:text-5xl imperial-serif text-white">The Order <span className="italic gold-luxury-text font-normal lowercase">Archive</span></h2>
                   </Editable>
                   <Editable id="profile_orders_count_label" fallback="Records">
                     <span className="text-[10px] font-black text-premium-gold tracking-widest uppercase">{orders.length} Records</span>
                   </Editable>
                </div>
                
                {loading ? (
                    <div className="py-40 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-premium-gold mx-auto"></div></div>
                ) : orders.length > 0 ? (
                  <div className="space-y-12">
                    {orders.map((order) => (
                      <div key={order.id} className="relative group luxury-card-rich p-8 sm:p-12 border border-premium-gold/5 hover:border-premium-gold/30 transition-all duration-700">
                        <div className="flex flex-col md:flex-row justify-between gap-12">
                           <div className="space-y-6">
                              <div className="flex items-center gap-6">
                                 <span className="text-[9px] font-black text-premium-gold uppercase tracking-[0.4em]">Allocation ID</span>
                                 <span className="text-xs font-bold text-white font-inter">#{order.id.slice(0, 8)}</span>
                              </div>
                              <h4 className="text-2xl sm:text-3xl imperial-serif text-white">{new Date(order.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</h4>
                              <div className="flex items-center gap-4">
                                 <div className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-emerald-500' : 'bg-premium-gold animate-pulse'}`}></div>
                                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{order.status}</span>
                              </div>
                           </div>
                           <div className="md:text-right space-y-4">
                              <span className="text-[9px] font-black text-premium-gold uppercase tracking-widest block font-inter">Investment</span>
                              <span className="text-4xl imperial-serif gold-luxury-text block">₹{order.total_amount.toLocaleString()}</span>
                              <div className="flex items-center md:justify-end gap-2 text-white/30 text-[9px] font-black uppercase tracking-tighter">
                                 <FiPackage /> {order.items?.length || 0} Artefacts
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-40 text-center space-y-8 border-2 border-dashed border-premium-gold/10">
                     <FiShoppingBag className="mx-auto text-premium-gold/20" size={60} />
                     <Editable id="profile_orders_empty_text" fallback="The archive remains silent...">
                       <p className="imperial-serif italic text-2xl text-white/30">The archive remains silent...</p>
                     </Editable>
                     <Editable id="profile_orders_empty_btn" fallback="Begin Selection">
                       <Link href="/products" className="inline-block mt-8 px-12 py-5 bg-premium-gold text-premium-black text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-premium-black transition-all">Begin Selection</Link>
                     </Editable>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'addresses' && (
              <div className="space-y-24">
                <div className="flex justify-between items-end border-b border-premium-gold/10 pb-12">
                   <Editable id="profile_addresses_title" fallback="Signature Locales">
                     <h2 className="text-3xl sm:text-5xl imperial-serif text-white">Signature <span className="italic gold-luxury-text font-normal lowercase">Locales</span></h2>
                   </Editable>
                   <button className="flex items-center gap-4 text-premium-gold group">
                      <FiPlus className="group-hover:rotate-90 transition-transform" />
                      <Editable id="profile_addresses_new_btn" fallback="New Protocol">
                        <span className="text-[10px] font-black uppercase tracking-widest">New Protocol</span>
                      </Editable>
                   </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   {addresses.map((addr) => (
                      <div key={addr.id} className="p-8 sm:p-12 border border-premium-gold/10 luxury-card-rich space-y-8 group transition-all hover:border-premium-gold">
                         <div className="flex justify-between items-start">
                            <span className="text-[8px] font-black text-premium-gold uppercase tracking-widest">{addr.is_default ? 'Primary Protocol' : 'Reserve Locale'}</span>
                            <FiEdit2 className="text-white/20 hover:text-premium-gold cursor-pointer transition-colors" size={14} />
                         </div>
                         <div className="space-y-4">
                            <h4 className="text-2xl imperial-serif italic text-white">{addr.full_name}</h4>
                            <p className="text-sm font-medium text-white/50 leading-relaxed font-inter">
                               {addr.address_line1}<br />
                               {addr.city}, {addr.state} {addr.postal_code}<br />
                               {addr.country}
                            </p>
                         </div>
                      </div>
                   ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-24">
                <div className="flex justify-between items-end border-b border-premium-gold/10 pb-12">
                   <Editable id="profile_settings_title" fallback="Security Details">
                     <h2 className="text-3xl sm:text-5xl imperial-serif text-white">Security <span className="italic gold-luxury-text font-normal lowercase">Details</span></h2>
                   </Editable>
                </div>
                
                <div className="max-w-xl space-y-12">
                   <div className="space-y-2">
                      <Editable id="profile_settings_name_label" fallback="Master Name">
                        <label className="text-[9px] font-black text-premium-gold uppercase tracking-widest">Master Name</label>
                      </Editable>
                      <input 
                        type="text" 
                        value={profileData.name} 
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-transparent border-b border-premium-gold/20 py-4 text-lg sm:text-2xl imperial-serif italic text-white focus:outline-none focus:border-premium-gold transition-colors"
                      />
                   </div>
                   <div className="space-y-2">
                      <Editable id="profile_settings_email_label" fallback="Encrypted Identity">
                        <label className="text-[9px] font-black text-premium-gold uppercase tracking-widest">Encrypted Identity</label>
                      </Editable>
                      <p className="text-xl imperial-serif text-white/40 italic">{user.email}</p>
                   </div>
                   <button onClick={handleSaveChanges} className="px-12 sm:px-20 py-6 bg-premium-gold text-premium-black text-[10px] font-black uppercase tracking-[0.6em] hover:bg-white hover:text-premium-black transition-all shadow-2xl">
                      <Editable id="profile_settings_update_btn" fallback="Update Protocol">
                        <span>{updating ? 'Recording...' : 'Update Protocol'}</span>
                      </Editable>
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
