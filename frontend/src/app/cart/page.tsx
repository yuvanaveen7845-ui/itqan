'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { orderAPI } from '@/lib/api';
import { FiTrash2, FiTruck } from 'react-icons/fi';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
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
    } catch (error: any) {
      setEstimateError(error.response?.data?.error || 'Failed to estimate delivery');
    } finally {
      setEstimating(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-gray-600 mb-6">Your cart is empty</p>
        <Link href="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="col-span-2">
          <div className="card">
            {items.map((item) => (
              <div key={item.product_id} className="flex justify-between items-center py-4 border-b last:border-b-0">
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="btn btn-secondary w-8 h-8 p-0"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="btn btn-secondary w-8 h-8 p-0"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-bold w-24 text-right">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4 pb-4 border-b">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>₹{getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-sm">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between mb-6 text-xl font-black">
              <span>Subtotal</span>
              <span>₹{getTotal().toFixed(2)}</span>
            </div>

            <Link href="/checkout" className="btn btn-primary w-full text-center block mb-2">
              Proceed to Checkout
            </Link>

            <button
              onClick={() => clearCart()}
              className="btn btn-secondary w-full"
            >
              Clear Cart
            </button>

            <div className="mt-8 border-t pt-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <FiTruck className="text-blue-600" />
                Delivery Estimation
              </h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                />
                <button
                  className="bg-gray-900 text-white px-4 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                  onClick={checkDelivery}
                  disabled={estimating || pincode.length !== 6}
                >
                  {estimating ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> : 'Check'}
                </button>
              </div>

              {estimateError && <p className="text-red-500 text-xs font-bold mt-1">{estimateError}</p>}

              {deliveryEstimate && !estimateError && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-green-800">Delivery Available</span>
                    <span className="bg-green-600 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded">{deliveryEstimate.zone.split(' ')[0]} {deliveryEstimate.zone.split(' ')[1]}</span>
                  </div>
                  <p className="text-green-700 font-medium whitespace-pre-line">{deliveryEstimate.message}</p>
                  <p className="text-green-600 text-xs mt-1">Free shipping via Standard Courier</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
