'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { orderAPI } from '@/lib/api';

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

  const sendToWebhook = async () => {
    try {
      const response = await fetch(
        "https://workflow-praveen.xyz/webhook-test/5c4ddd6d-fa9f-4bdf-acf6-6b0e286ea903",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Payment successful for order.",
            user: "Praveen",
            source: "NextJS Website"
          }),
        }
      );

      const data = await response.json();
      console.log("Webhook Response:", data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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
            await sendToWebhook();
            clearCart();
            router.push(`/order-confirmation/${orderData.order.id}`);
          } catch (error) {
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
              await sendToWebhook();
              clearCart();
              router.push(`/order-confirmation/${orderData.order.id}`);
            } catch (error) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Delivery Address</h2>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Zip Code</label>
                <input
                  type="text"
                  className="input"
                  value={formData.zipcode}
                  onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card sticky top-4">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b">
              {items.map((item) => (
                <div key={item.product_id} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? 'text-gray-400' : 'text-gray-900 font-medium'}>
                  {formData.zipcode.length === 6 ? `₹${shippingCost.toFixed(2)}` : 'Enter zipcode'}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-black text-gray-900">
              <span>Total</span>
              <span>₹{(getTotal() + shippingCost).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
