'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { orderAPI, couponAPI } from '@/lib/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipcode: '',
  });
  const [error, setError] = useState('');
  const [shippingCost, setShippingCost] = useState(0);

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
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

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
      // Create order
      const { data: orderData } = await orderAPI.create({
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        address: formData, // Send address details to be saved
        couponCode: couponApplied ? couponCode : null,
      });

      // If mock order, simulate success
      if (orderData.razorpayOrder.id.startsWith('mock_order')) {
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
          } catch (error) {
            console.error('Mock payment error:', error);
            alert('Mock payment verification failed');
          } finally {
            setLoading(false);
          }
        }, 1500);
        return;
      }

      // Load Razorpay script (Production/Real Test mode)
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const finalAmount = getTotal() + shippingCost;
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          amount: Math.round(finalAmount * 100),
          currency: 'INR',
          name: 'Perfume Store',
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
            } catch (error) {
              console.error('Payment verification error:', error);
              alert('Payment verification failed');
            }
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
      document.body.appendChild(script);
    } catch (error) {
      alert('Checkout failed');
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-10 text-gray-900 tracking-tight">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-gray-900 border-b pb-4">Shipping Destination</h2>

            <form onSubmit={handleCheckout} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Street Address</label>
                <textarea
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-50 outline-none transition font-medium"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  placeholder="House No, Building, Area..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">City</label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-50 outline-none transition font-medium"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    placeholder="e.g. Coimbatore"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">State</label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-50 outline-none transition font-medium"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                    placeholder="e.g. Tamil Nadu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Pincode</label>
                <input
                  type="text"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-50 outline-none transition font-bold tracking-widest"
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
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition transform active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Processing Transaction...' : 'Complete Purchase'}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-10">
            <h2 className="text-xl font-black text-gray-900 border-b pb-6 mb-6">Purchase Summary</h2>

            <div className="space-y-4 mb-8 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.product_id} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl">
                  <div>
                    <p className="font-bold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-black text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Promo Section */}
            <div className="mb-8 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">Rewards & Promos</p>
              <div className="flex gap-2">
                <input
                  className="flex-grow px-4 py-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-indigo-100 outline-none transition font-black uppercase text-sm"
                  placeholder="Enter Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={couponApplied}
                />
                <button
                  onClick={applyCoupon}
                  disabled={couponLoading || couponApplied}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 disabled:bg-gray-200 disabled:shadow-none"
                >
                  {couponLoading ? '...' : couponApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {couponApplied && (
                <p className="text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1">
                  ✓ Promo Applied Successfully! <button onClick={() => { setCouponApplied(false); setDiscountAmount(0); setCouponCode(''); }} className="underline ml-2">Remove</button>
                </p>
              )}
            </div>

            <div className="space-y-3 mb-8 border-b pb-8 font-bold text-gray-600">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="text-gray-900">₹{getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping Fee</span>
                <span className={shippingCost === 0 ? 'text-gray-300' : 'text-blue-600 font-black'}>
                  {formData.zipcode.length === 6 ? `₹${shippingCost.toFixed(2)}` : 'Waiting for Zip'}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-green-600 animate-in fade-in">
                  <span>Promo Discount</span>
                  <span className="font-black">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-bold">Total Amount</span>
              <span className="text-4xl font-black text-gray-900 tracking-tighter">₹{(getTotal() + shippingCost - discountAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
