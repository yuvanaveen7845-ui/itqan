import Razorpay from 'razorpay';

let razorpay: any = null;

try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
  });
} catch (error) {
  console.log('⚠️  Razorpay not initialized - using placeholder keys');
}

export { razorpay };

export const createRazorpayOrder = async (amount: number, orderId: string) => {
  try {
    if (!razorpay) {
      console.log('⚠️  Razorpay not available - returning mock order');
      return { id: `order_${orderId}`, amount, currency: 'INR' };
    }
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: orderId,
      notes: { orderId },
    });
    return order;
  } catch (error) {
    console.error('✗ Razorpay order creation failed:', error);
    // If we're using mock DB or development environment, return a mock order to prevent 500 error
    if (process.env.SUPABASE_URL?.includes('placeholder') || process.env.NODE_ENV === 'development') {
      console.log('⚠️  Returning mock order due to Razorpay error in development mode.');
      return { id: `mock_order_${orderId}_${Date.now()}`, amount, currency: 'INR' };
    }
    throw error;
  }
};

export const verifyPaymentSignature = (
  razorpayOrderId: string,
  paymentId: string,
  signature: string
): boolean => {
  const crypto = require('crypto');
  const body = razorpayOrderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
};
