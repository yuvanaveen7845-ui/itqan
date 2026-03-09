'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { FiTrash2 } from 'react-icons/fi';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

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
                <span>Subtotal</span>
                <span>₹{getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{(getTotal() * 0.18).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between mb-6 text-lg font-bold">
              <span>Total</span>
              <span>₹{(getTotal() * 1.18).toFixed(2)}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}
