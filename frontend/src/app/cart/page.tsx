'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { orderAPI } from '@/lib/api';
import { useNotificationStore } from '@/store/notification';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiShield, FiTruck, FiPackage } from 'react-icons/fi';
import Editable from '@/components/Editable';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const { showNotification } = useNotificationStore();
  const [pincode, setPincode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<any>(null);
  const [estimating, setEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState('');

  const checkDelivery = async () => {
    if (!pincode || pincode.length !== 6) {
      setEstimateError('Please enter a valid 6-digit Indian pincode');
      return;
    }
    setEstimating(true);
    setEstimateError('');
    try {
      const { data } = await orderAPI.estimateDelivery(pincode);
      setDeliveryEstimate(data);
      showNotification('Logistics profile calculated', 'luxury');
    } catch (error: any) {
      setEstimateError(error.response?.data?.error || 'Failed to estimate delivery');
      showNotification('Address out of reach', 'error');
    } finally {
      setEstimating(false);
    }
  };

  const handleRemove = (id: string, name: string) => {
    removeItem(id);
    showNotification(`Artifact removed: ${name}`, 'info');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#FAF9F6] text-center">
        <div className="w-24 h-24 border border-premium-gold/20 rounded-full flex items-center justify-center mb-8 animate-pulse text-premium-gold">
          <FiPackage size={40} />
        </div>
        <h1 className="text-4xl imperial-serif mb-4 text-premium-black">Your Vault is Empty</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-premium-charcoal/40 mb-12">The collection awaits your discovery</p>
        <Link href="/products" className="px-8 py-4 border border-premium-black bg-premium-black text-premium-gold text-[9px] font-black uppercase tracking-[0.3em] hover:bg-premium-gold hover:text-black transition-all duration-500">
          Return to Atelier
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-24 sm:py-32 lg:px-24">
      <section className="pt-24 pb-16 sm:pt-60 sm:pb-40 px-6 sm:px-24 boutique-layout border-b border-premium-gold/5">
        <div className="flex flex-col items-center text-center space-y-12">
          <Editable id="cart_eyebrow" type="text" fallback="Selected Artefacts">
            <span className="text-premium-gold text-[10px] font-black uppercase tracking-[1rem] block animate-reveal">Your Selection</span>
          </Editable>
          <Editable id="cart_title" type="richtext" fallback="Shopping Bag">
            <h1 className="text-5xl sm:text-7xl md:text-9xl imperial-serif text-premium-black animate-reveal" style={{ animationDelay: '0.2s' }}>
              Vault <br />
              <span className="gold-luxury-text italic lowercase font-normal">Allocation</span>
            </h1>
          </Editable>
        </div>
      </section>
      <div className="flex justify-end mt-12">
        <button
          onClick={() => { clearCart(); showNotification('Vault cleared', 'info'); }}
          className="text-[9px] font-black uppercase tracking-widest text-rose-500/60 hover:text-rose-500 transition-colors"
        >
          Clear All Artefacts
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-12">
          {items.map((item) => (
            <div key={item.product_id} className="group relative flex flex-col sm:flex-row items-center gap-10 py-12 px-8 border border-premium-gold/5 hover:border-premium-gold/20 luxury-card-rich shadow-none hover:shadow-2xl transition-all duration-1000 rounded-2xl">
              <div className="w-44 aspect-[4/5] bg-gray-50 overflow-hidden rounded-lg border border-premium-gold/10">
                <img 
                  src={item.image || '/images/exotic/hero.png'} 
                  alt={item.name} 
                  onError={(e) => (e.currentTarget.src = '/images/exotic/hero.png')}
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
                />
              </div>

              <div className="flex-1 space-y-4 text-center sm:text-left">
                <h3 className="imperial-serif text-2xl text-premium-black lowercase">{item.name}</h3>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-premium-gold">{item.price > 5000 ? 'Reserve Allocation' : 'Signature Collection'}</p>

                <div className="flex items-center justify-center sm:justify-start gap-8 mt-6">
                  <div className="flex items-center border border-premium-gold/20 p-1">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:text-premium-gold transition-colors text-xs"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:text-premium-gold transition-colors text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-6 text-right">
                <span className="text-2xl imperial-serif text-premium-black">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
                <button
                  onClick={() => handleRemove(item.product_id, item.name)}
                  className="p-3 text-premium-charcoal/20 hover:text-rose-500 hover:bg-rose-50 transition-all rounded-full group/del"
                >
                  <FiTrash2 size={16} className="group-hover/del:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-36 h-fit space-y-8">
          <div className="luxury-card-rich p-12 space-y-12 shadow-2xl rounded-3xl border-none">
            <div className="space-y-4 text-center">
              <h2 className="text-[11px] font-black text-premium-gold uppercase tracking-[0.6em] mb-2">Vault Allocation</h2>
              <div className="h-px bg-gradient-to-r from-transparent via-premium-gold/30 to-transparent"></div>
            </div>

            <div className="space-y-8">
              <div className="flex justify-between items-center group">
                <span className="text-[10px] font-black uppercase tracking-widest text-premium-charcoal/40 group-hover:text-premium-black transition-colors">Selected Artefacts</span>
                <span className="text-xl imperial-serif text-premium-black">₹{getTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-[10px] font-black uppercase tracking-widest text-premium-charcoal/40 group-hover:text-premium-black transition-colors">Logistics Concierge</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-premium-gold animate-pulse">Complimentary</span>
              </div>
            </div>

            <div className="pt-10 border-t border-premium-gold/10 space-y-2 text-center">
              <span className="text-[8px] font-black uppercase tracking-[0.8em] text-premium-gold/60">Total Value</span>
              <p className="text-5xl imperial-serif text-premium-black font-normal">₹{getTotal().toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              <Link href="/checkout" className="group relative w-full bg-premium-black text-premium-gold py-6 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-premium-gold hover:text-black transition-all duration-700 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700"></div>
                <span className="relative z-10 flex items-center gap-3">Complete Acquisition <FiArrowRight /></span>
              </Link>
              <div className="flex items-center justify-center gap-3 text-[8px] font-black text-premium-gold/40 tracking-[0.2em] uppercase">
                <FiShield size={10} /> Escrow Protected • White Glove Logistics
              </div>
            </div>
          </div>

          {/* Delivery Check */}
          <div className="bg-white border border-premium-gold/10 p-8 space-y-6 transition-all duration-700 hover:border-premium-gold/30 hover:shadow-[0_20px_50px_rgba(197,160,89,0.08)]">
            <h3 className="text-[9px] font-black text-premium-black uppercase tracking-[0.3em] flex items-center gap-3">
              <FiTruck className="text-premium-gold" /> Logistics Availability
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                placeholder="PINCODE"
                className="flex-1 bg-transparent border border-premium-gold/10 p-3 text-[10px] font-black tracking-[0.4em] focus:border-premium-gold outline-none"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              />
              <button
                className="bg-premium-black text-white px-6 text-[9px] font-black uppercase tracking-widest hover:bg-premium-gold hover:text-black transition-all disabled:opacity-30"
                onClick={checkDelivery}
                disabled={estimating || pincode.length !== 6}
              >
                {estimating ? '...' : 'Verify'}
              </button>
            </div>

            {estimateError && <p className="text-rose-500 text-[8px] font-black uppercase tracking-widest">{estimateError}</p>}

            {deliveryEstimate && !estimateError && (
              <div className="animate-in fade-in slide-in-from-top-2 p-4 bg-emerald-50/50 border border-emerald-500/20 space-y-2">
                <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">{deliveryEstimate.message}</p>
                <p className="text-[7px] text-emerald-600/60 uppercase">Signature Service Included</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
