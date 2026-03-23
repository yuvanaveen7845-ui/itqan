'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';

import { orderAPI, couponAPI } from '@/lib/api';
import { useNotificationStore } from '@/store/notification';
import Editable from '@/components/Editable';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isInitialized } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const { showNotification } = useNotificationStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipcode: '',
  });
  const [error, setError] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [confirmedTotal, setConfirmedTotal] = useState<number | null>(null);

  useEffect(() => {
    if (formData.zipcode.length === 6) {
      orderAPI.estimateDelivery(formData.zipcode)
        .then(({ data }) => setShippingCost(data.shippingCost || 0))
        .catch(() => setShippingCost(200)); // Default fallback
    } else {
      setShippingCost(0);
    }
  }, [formData.zipcode]);


  useEffect(() => {
    // Wait for auth store to hydrate from localStorage before redirecting
    if (isInitialized && !user) {
      router.push('/login?returnTo=/checkout');
    }
  }, [user, router, isInitialized]);

  // Show nothing until we know auth state, then redirect if not logged in
  if (!isInitialized || !user) return null;

  const validateForm = () => {
    if (!user.email) {
      setError('Customer email is required. Please update your profile.');
      return false;
    }
    if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zipcode.trim()) {
      setError('Please fill in all delivery address fields.');
      return false;
    }
    setError('');
    return true;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const { data: orderData } = await orderAPI.create({
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        address: formData,
        couponCode: couponApplied ? couponCode : null,
      });

      // Use backend-authoritative total (not frontend recalc)
      const backendTotal = orderData.order?.total_amount || (getTotal() + shippingCost - discountAmount);
      setConfirmedTotal(backendTotal);

      // Mock order in dev mode or if backend explicitly sent a mock/id-mismatch
      if (!orderData.razorpayOrder || 
          orderData.razorpayOrder.id?.startsWith('mock_order') || 
          !orderData.razorpayOrder.id?.startsWith('order_')) {
        console.warn('⚠️  Handling payment as MOCK/INTERNAL order:', orderData.razorpayOrder?.id);
        setTimeout(async () => {
          try {
            await orderAPI.verifyPayment({
              orderId: orderData.order.id,
              razorpayOrderId: 'order_mock_' + Math.random().toString(36).substr(2, 9),
              paymentId: 'pay_mock_' + Math.random().toString(36).substr(2, 9),
              signature: 'sig_mock_' + Math.random().toString(36).substr(2, 9),
            });
            clearCart();
            router.push(`/order-confirmation/${orderData.order.id}`);
          } catch (mockErr) {
            console.error('Mock payment error:', mockErr);
            showNotification('Mock payment verification failed', 'error');
          } finally {
            setLoading(false);
          }
        }, 1500);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          amount: Math.round(backendTotal * 100), // Use backend total
          currency: 'INR',
          name: 'Itqan Perfumes',
          description: 'Order Payment',
          order_id: orderData.razorpayOrder.id,
          handler: async (response: any) => {
            try {
              await orderAPI.verifyPayment({
                orderId: orderData.order.id,
                razorpayOrderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });
              clearCart();
              router.push(`/order-confirmation/${orderData.order.id}`);
            } catch (verifyErr) {
              console.error('Payment verification error:', verifyErr);
              showNotification('Payment verification failed. Contact support.', 'error');
            }
          },
          prefill: { email: user?.email, name: user?.name },
          theme: { color: '#C5A059' },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
      document.body.appendChild(script);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        showNotification('Session expired. Please log in again.', 'error');
        setTimeout(() => router.push('/login?returnTo=/checkout'), 1500);
        return;
      }
      const msg = error?.response?.data?.error || error?.response?.data?.message || 'Transaction process interrupted';
      setError(msg);
      showNotification(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    setError('');
    try {
      const { data } = await couponAPI.validate(couponCode, getTotal());
      setDiscountAmount(data.discount_amount);
      setCouponApplied(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid coupon code');
      setDiscountAmount(0);
      setCouponApplied(false);
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div className="bg-premium-black min-h-screen">
      {/* Signature Header */}
      <section className="bg-premium-black pt-36 sm:pt-60 pb-16 sm:pb-40 px-4 sm:px-12 md:px-24 grain-overlay relative overflow-hidden">
          <div className="relative z-10 boutique-layout">
              <div className="space-y-8">
                  <Editable id="checkout_eyebrow" type="text" fallback="Final Acquisition">
                      <span className="text-premium-gold text-[10px] font-black uppercase tracking-[1rem] block animate-reveal">Secure Portal</span>
                  </Editable>
                  <Editable id="checkout_title" fallback="The Final Step">
                      <h1 className="text-6xl md:text-9xl imperial-serif text-white animate-reveal lowercase" style={{ animationDelay: '0.2s' }}>
                          The <span className="gold-luxury-text italic font-normal">Final Step</span>
                      </h1>
                  </Editable>
              </div>
          </div>
      </section>

      <div className="boutique-layout px-4 sm:px-12 md:px-24 section-spacing">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-16 lg:gap-24 items-start">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-16">
            <div className="flex items-center gap-8 border-b border-premium-gold/10 pb-8">
               <span className="text-4xl imperial-serif italic text-premium-gold">01</span>
               <Editable id="checkout_section_1_title" fallback="Delivery Sanctuary">
                 <h2 className="text-2xl sm:text-3xl imperial-serif text-white lowercase">Delivery Sanctuary</h2>
               </Editable>
            </div>

            {error && (
              <div className="p-6 sm:p-8 bg-rose-900/20 border border-rose-500/20 text-rose-300 text-[10px] font-black uppercase tracking-widest animate-reveal">
                × Error: {error}
              </div>
            )}

            <form onSubmit={handleCheckout} className="space-y-12">
               <div className="space-y-2">
                  <Editable id="checkout_label_address" fallback="Street Locale">
                    <label className="text-[9px] font-black text-premium-gold uppercase tracking-widest">Street Locale</label>
                  </Editable>
                  <textarea
                    className="w-full bg-transparent border-b border-premium-gold/20 py-4 text-lg sm:text-2xl imperial-serif italic text-white focus:outline-none focus:border-premium-gold transition-colors min-h-[100px] sm:min-h-[120px] placeholder:text-white/30"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    placeholder="Grand Avenue, Suite 101..."
                  />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-20">
                  <div className="space-y-2">
                    <Editable id="checkout_label_city" fallback="City">
                      <label className="text-[9px] font-black text-premium-gold uppercase tracking-widest">City</label>
                    </Editable>
                    <input
                      type="text"
                      className="w-full bg-transparent border-b border-premium-gold/20 py-4 text-lg sm:text-2xl imperial-serif italic text-white focus:outline-none focus:border-premium-gold transition-colors placeholder:text-white/30"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Editable id="checkout_label_state" fallback="State">
                      <label className="text-[9px] font-black text-premium-gold uppercase tracking-widest">State</label>
                    </Editable>
                    <input
                      type="text"
                      className="w-full bg-transparent border-b border-premium-gold/20 py-4 text-lg sm:text-2xl imperial-serif italic text-white focus:outline-none focus:border-premium-gold transition-colors placeholder:text-white/30"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>
               </div>

               <div className="space-y-2">
                  <Editable id="checkout_label_zip" fallback="Postal Code">
                    <label className="text-[9px] font-black text-premium-gold uppercase tracking-widest">Postal Code</label>
                  </Editable>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-premium-gold/20 py-4 text-2xl sm:text-3xl font-bold tracking-[0.5em] sm:tracking-[1em] text-white focus:outline-none focus:border-premium-gold transition-colors placeholder:text-white/30"
                    value={formData.zipcode}
                    onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                    required
                    maxLength={6}
                  />
               </div>

               <button
                  type="submit"
                  disabled={loading}
                  className="w-full lg:w-max px-10 sm:px-20 py-6 sm:py-8 bg-premium-gold text-premium-black text-[10px] font-black uppercase tracking-[0.6em] hover:bg-white hover:text-premium-black transition-all shadow-2xl relative overflow-hidden group/btn"
               >
                  <Editable id="checkout_submit_btn" fallback="Finalize Acquisition">
                    <span className="relative z-10">{loading ? 'Acquiring...' : 'Finalize Acquisition'}</span>
                  </Editable>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 opacity-10"></div>
               </button>
            </form>
          </div>

          {/* Detailed Summary Side */}
          <div className="lg:col-span-5 lg:sticky lg:top-40 space-y-12 sm:space-y-16 lg:pl-8">
            <div className="flex items-center gap-6 sm:gap-8 border-b border-premium-gold/10 pb-8">
               <span className="text-4xl imperial-serif italic text-premium-gold">02</span>
               <Editable id="checkout_section_2_title" fallback="Acquisition Ledger">
                 <h2 className="text-2xl sm:text-3xl imperial-serif text-white lowercase">Acquisition Ledger</h2>
               </Editable>
            </div>

            <div className="space-y-8">
               {items.map((item) => (
                 <div key={item.product_id} className="flex justify-between items-end group">
                    <div className="space-y-2">
                       <p className="imperial-serif text-lg sm:text-2xl italic text-white lowercase">{item.name}</p>
                       <p className="text-[8px] font-black text-premium-gold uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-lg sm:text-xl imperial-serif text-white">₹{(item.price * item.quantity).toLocaleString()}</span>
                 </div>
               ))}
            </div>

            {/* Coupon Protocol */}
            <div className="py-8 border-y border-premium-gold/10 space-y-4">
               <Editable id="checkout_coupon_label" fallback="Signature Token">
                 <label className="text-[8px] font-black text-premium-gold uppercase tracking-[0.4em] block">Signature Token</label>
               </Editable>
               <div className="flex gap-4">
                  <input
                    className="flex-1 bg-transparent border-b border-premium-gold/20 py-2 text-xl imperial-serif italic focus:outline-none focus:border-premium-gold transition-colors"
                    placeholder="Token Code..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={couponApplied}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading || couponApplied}
                    className="text-[9px] font-black uppercase tracking-widest text-premium-gold hover:text-white transition-colors"
                  >
                    {couponLoading ? '...' : couponApplied ? 'Applied' : 'Validate'}
                  </button>
               </div>
            </div>

            {/* Totals */}
            <div className="space-y-6 pt-4">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                  <Editable id="checkout_summary_subtotal" fallback="Subtotal">
                    <span>Subtotal</span>
                  </Editable>
                  <span>₹{getTotal().toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                  <Editable id="checkout_summary_logistics" fallback="Logistics">
                    <span>Logistics</span>
                  </Editable>
                  <span className="text-premium-gold">+{shippingCost === 0 ? 'Evaluating' : `₹${shippingCost}`}</span>
               </div>
               {discountAmount > 0 && (
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-600">
                    <Editable id="checkout_summary_discount" fallback="Token Credit">
                      <span>Token Credit</span>
                    </Editable>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                 </div>
               )}
               <div className="flex justify-between items-center pt-8 border-t border-premium-gold">
                  <Editable id="checkout_summary_total" fallback="Investment">
                    <span className="text-[11px] font-black text-premium-gold uppercase tracking-[0.4em]">Investment</span>
                  </Editable>
                  <span className="text-3xl sm:text-5xl imperial-serif text-white">
                    ₹{(confirmedTotal ?? (getTotal() + shippingCost - discountAmount)).toLocaleString()}
                  </span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
