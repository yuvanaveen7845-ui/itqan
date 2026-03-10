'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { orderAPI } from '@/lib/api';
import { FiCheckCircle, FiTruck, FiPackage } from 'react-icons/fi';

export default function OrderConfirmationPage() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await orderAPI.getById(params.id as string);
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!order) return <div className="text-center py-12">Order not found</div>;

  const statusSteps = [
    { status: 'confirmed', label: 'Order Confirmed', icon: FiCheckCircle },
    { status: 'processing', label: 'Processing', icon: FiPackage },
    { status: 'shipped', label: 'Shipped', icon: FiTruck },
    { status: 'delivered', label: 'Delivered', icon: FiCheckCircle },
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.status === order.status);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Success Message */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <FiCheckCircle size={64} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your purchase</p>
      </div>

      {/* Order Details */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="space-y-3 pb-4 border-b">
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID</span>
            <span className="font-mono font-bold">{(order.display_id || order.id)?.slice(0, 12) || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order Date</span>
            <span className="font-bold">{new Date(order.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount</span>
            <span className="font-bold text-lg">₹{order.total_amount}</span>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-4">
          <h3 className="font-bold mb-3">Items</h3>
          {order.items?.map((item: any) => (
            <div key={item.id} className="flex justify-between py-2 border-b last:border-b-0">
              <span>{item.product_id}</span>
              <span>Qty: {item.quantity}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Status Timeline */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-6">Order Status</h2>
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.status} className="flex items-center gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <p className={`font-bold ${isCurrent ? 'text-blue-600' : ''}`}>
                    {step.label}
                  </p>
                  {isCurrent && <p className="text-sm text-gray-600">Current status</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Steps */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4">What's Next?</h2>
        <ul className="space-y-2 text-gray-600">
          <li>✓ Order confirmation email sent to your email</li>
          <li>✓ You'll receive shipping updates via email</li>
          <li>✓ Track your order using the order ID</li>
          <li>✓ Estimated delivery: 5-7 business days</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link href="/products" className="btn btn-secondary flex-1 text-center">
          Continue Shopping
        </Link>
        <Link href="/profile" className="btn btn-primary flex-1 text-center">
          View All Orders
        </Link>
      </div>
    </div>
  );
}
