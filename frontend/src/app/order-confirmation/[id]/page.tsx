'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { orderAPI } from '@/lib/api';

export default function OrderConfirmationPage() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { isInitialized, token } = useAuthStore();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isInitialized || !params.id) return;
      try {
        const { data } = await orderAPI.getById(params.id as string);
        setOrder(data);
      } catch (error: any) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.id, isInitialized, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-premium-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-8">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border border-premium-gold/10 rounded-full" />
            <div className="absolute inset-0 border border-t-premium-gold rounded-full animate-spin" />
          </div>
          <p className="text-[9px] font-black text-premium-gold uppercase tracking-[0.8em] animate-pulse">
            Retrieving Archive...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-premium-black flex items-center justify-center">
        <div className="text-center space-y-6">
          <p className="text-5xl imperial-serif text-white/20">404</p>
          <p className="text-[10px] font-black text-premium-gold/40 uppercase tracking-[0.6em]">Order not found</p>
          <Link href="/products" className="block mt-8 text-[9px] font-black text-premium-gold uppercase tracking-[0.4em] hover:text-white transition-colors">
            Return to Collection →
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { status: 'confirmed', label: 'Confirmed' },
    { status: 'processing', label: 'Processing' },
    { status: 'shipped', label: 'Shipped' },
    { status: 'delivered', label: 'Delivered' },
  ];
  const currentStepIndex = statusSteps.findIndex(s => s.status === order.status);

  return (
    <div className="min-h-screen bg-premium-black">
      {/* Hero */}
      <section className="pt-36 sm:pt-52 pb-16 px-4 sm:px-12 md:px-24 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          {/* Gold checkmark */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 border border-premium-gold/30 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-premium-gold/5" />
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 16L13 23L26 9" stroke="#C5A059" strokeWidth="2" strokeLinecap="square" />
              </svg>
            </div>
          </div>

          <span className="text-premium-gold text-[10px] font-black uppercase tracking-[1rem] block">
            Acquisition Complete
          </span>
          <h1 className="text-5xl sm:text-7xl imperial-serif text-white lowercase">
            Order <span className="gold-luxury-text italic font-normal">Confirmed</span>
          </h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">
            Thank you for your acquisition
          </p>

          {/* Order ID badge */}
          <div className="inline-block mt-4 border border-premium-gold/20 bg-white/[0.03] px-6 py-3">
            <span className="font-mono text-premium-gold text-[11px] tracking-[0.3em]">
              #{(order.display_id || order.id)?.slice(0, 12)?.toUpperCase() || 'N/A'}
            </span>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-premium-gold/[0.03] blur-3xl rounded-full" />
        </div>
      </section>

      <div className="liquid-gold-divider opacity-20" />

      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-16 sm:py-24 space-y-16">

        {/* ── Order Summary Card ── */}
        <div className="border border-premium-gold/20 bg-[#111111] p-8 sm:p-10 space-y-8">
          <div className="flex items-center justify-between pb-6 border-b border-white/5">
            <h2 className="text-[9px] font-black text-premium-gold uppercase tracking-[0.6em]">
              Acquisition Summary
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-premium-gold rounded-full animate-pulse" />
              <span className="text-[8px] font-black text-premium-gold/60 uppercase tracking-[0.3em] capitalize">
                {order.status || 'Confirmed'}
              </span>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 text-[9px] font-black uppercase tracking-[0.3em]">
            <div>
              <p className="text-white/30 mb-1">Order Date</p>
              <p className="text-white/70">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-white/30 mb-1">Delivery Address</p>
              <p className="text-white/70 max-w-[200px] sm:ml-auto">
                {order.address ? `${order.address.city}, ${order.address.state}` : 'On File'}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4 pt-2">
            {order.items?.map((item: any, idx: number) => (
              <div key={item.id || idx} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                <div className="space-y-1">
                  <p className="imperial-serif text-white text-lg lowercase font-normal">
                    {item.name || item.product_id}
                  </p>
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">
                    Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-premium-gold imperial-serif text-lg">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-end pt-4 border-t border-premium-gold/20">
            <span className="text-[9px] font-black text-premium-gold uppercase tracking-[0.5em]">
              Total Investment
            </span>
            <span className="text-3xl sm:text-4xl imperial-serif text-white">
              ₹{order.total_amount?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ── Status Timeline ── */}
        <div className="border border-white/5 bg-white/[0.02] p-8 sm:p-10">
          <h2 className="text-[9px] font-black text-premium-gold uppercase tracking-[0.6em] mb-10">
            Journey Status
          </h2>
          <div className="relative pl-6">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-premium-gold/20" />

            <div className="space-y-8">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step.status} className="relative flex items-center gap-6">
                    {/* Dot */}
                    <div className={`relative z-10 -ml-6 w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'border-premium-gold bg-premium-gold'
                        : 'border-white/20 bg-premium-black'
                    }`}>
                      {isCurrent && (
                        <div className="w-1.5 h-1.5 bg-premium-black" />
                      )}
                    </div>

                    <div className="flex items-center justify-between flex-1">
                      <span className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${
                        isCurrent ? 'text-premium-gold' : isCompleted ? 'text-white/60' : 'text-white/20'
                      }`}>
                        {step.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[8px] font-black text-premium-gold/50 uppercase tracking-[0.3em]">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── What's Next ── */}
        <div className="space-y-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
          {[
            'Order confirmation email dispatched',
            'Shipping updates will be sent via email',
            'Estimated delivery: 5–7 business days',
          ].map((note, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-1 h-1 bg-premium-gold/40 flex-shrink-0" />
              <span>{note}</span>
            </div>
          ))}
        </div>

        {/* ── CTAs ── */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/orders"
            className="flex-1 py-5 border border-premium-gold/30 text-premium-gold text-[9px] font-black uppercase tracking-[0.5em] text-center hover:bg-premium-gold hover:text-premium-black transition-all duration-500 signature-shimmer"
          >
            Track Order
          </Link>
          <Link
            href="/products"
            className="flex-1 py-5 bg-premium-gold text-premium-black text-[9px] font-black uppercase tracking-[0.5em] text-center hover:bg-white transition-all duration-500 signature-shimmer"
          >
            Shop Again
          </Link>
        </div>
      </div>
    </div>
  );
}
