'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';

import { orderAPI, couponAPI } from '@/lib/api';
import { useNotificationStore } from '@/store/notification';

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

      // Mock order in dev mode
      if (!orderData.razorpayOrder || orderData.razorpayOrder.id?.startsWith('mock_order')) {
        setTimeout(async () => {
          try {
            await orderAPI.verifyPayment({
              orderId: orderData.order.id,
              razorpayOrderId: 'order_mock_' + Math.random().toString(36).substr(2, 9),
              paymentId: 'pay_mock_' + Math.random().toString(36).substr(2, 9),
              signature: 'sig_mock_' + Math.random().toString(36).substr(2, 9),
            });
            clearCart();
            window.location.href = `/order-confirmation/${orderData.order.id}`;
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
              window.location.href = `/order-confirmation/${orderData.order.id}`;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
      <div className="mb-10">
        <h1 className="text-4xl imperial-serif text-premium-black mb-1">Checkout</h1>
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-premium-gold">Secure Acquisition</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Checkout Form */}
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-4 flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <div className="border border-premium-gold/15 p-8 space-y-6 bg-white">
            <h2 className="text-[10px] font-black text-premium-black uppercase tracking-[0.4em] border-b border-premium-gold/15 pb-4">Shipping Destination</h2>

            <form onSubmit={handleCheckout} className="space-y-5">
              <div>
                <label className="block text-[9px] font-black text-premium-charcoal/50 mb-2 uppercase tracking-widest">Street Address</label>
                <textarea
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-premium-gold/10 focus:border-premium-gold outline-none transition font-medium text-sm"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  placeholder="House No, Building, Area..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-premium-charcoal/50 mb-2 uppercase tracking-widest">City</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-premium-gold/10 focus:border-premium-gold outline-none transition font-medium text-sm"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    placeholder="e.g. Coimbatore"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-premium-charcoal/50 mb-2 uppercase tracking-widest">State</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-premium-gold/10 focus:border-premium-gold outline-none transition font-medium text-sm"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                    placeholder="e.g. Tamil Nadu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-premium-charcoal/50 mb-2 uppercase tracking-widest">Pincode</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-premium-gold/10 focus:border-premium-gold outline-none transition font-bold tracking-widest text-sm"
                  value={formData.zipcode}
                  onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                  required
                  placeholder="641001"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-5 bg-premium-black text-premium-gold font-black text-[10px] uppercase tracking-[0.4em] hover:bg-premium-gold hover:text-black transition-all duration-700 overflow-hidden disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700"></div>
                <span className="relative z-10">{loading ? 'Processing...' : 'Complete Acquisition'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="border border-premium-gold/15 p-8 bg-white">
            <h2 className="text-[10px] font-black text-premium-black uppercase tracking-[0.4em] border-b border-premium-gold/15 pb-4 mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6 max-h-[260px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product_id} className="flex justify-between items-center py-3 border-b border-premium-gold/10">
                  <div>
                    <p className="font-bold text-premium-black text-sm">{item.name}</p>
                    <p className="text-[9px] text-premium-charcoal/40 font-black uppercase tracking-widest">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-black text-premium-black text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="mb-6 p-4 bg-[#FAF9F6] border border-premium-gold/10">
              <p className="text-[9px] font-black text-premium-gold uppercase tracking-widest mb-3">Promo Code</p>
              <div className="flex flex-wrap gap-2">
                <input
                  className="flex-1 min-w-0 px-3 py-2 bg-white border border-premium-gold/10 focus:border-premium-gold outline-none font-black uppercase text-xs"
                  placeholder="Enter Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={couponApplied}
                />
                <button
                  onClick={applyCoupon}
                  disabled={couponLoading || couponApplied}
                  className="flex-shrink-0 px-4 py-2 bg-premium-black text-premium-gold text-[9px] font-black uppercase tracking-widest hover:bg-premium-gold hover:text-black transition-all disabled:opacity-40"
                >
                  {couponLoading ? '...' : couponApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {couponApplied && (
                <p className="text-[9px] text-green-600 font-black mt-2 uppercase">✓ Promo Applied <button onClick={() => { setCouponApplied(false); setDiscountAmount(0); setCouponCode(''); }} className="underline ml-2">Remove</button></p>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-3 text-sm font-bold text-premium-charcoal/60">
              <div className="flex justify-between"><span>Subtotal</span><span className="text-premium-black">₹{getTotal().toLocaleString()}</span></div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? 'text-premium-charcoal/30' : 'text-premium-gold font-black'}>
                  {formData.zipcode.length === 6 ? `₹${shippingCost}` : '—'}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{discountAmount.toLocaleString()}</span></div>
              )}
              <div className="flex justify-between items-center pt-4 border-t border-premium-gold/20">
                <span className="text-[9px] font-black uppercase tracking-widest text-premium-gold">Total</span>
                <span className="text-3xl imperial-serif text-premium-black">
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
