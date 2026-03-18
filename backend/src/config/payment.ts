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
      return { id: `mock_order_${orderId}`, amount, currency: 'INR' };
    }
    const payload = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: orderId,
      notes: { orderId, env: process.env.NODE_ENV },
    };
    console.log('[RAZORPAY] Creating order with payload:', JSON.stringify(payload, null, 2));
    
    const order = await razorpay.orders.create(payload);
    console.log('[RAZORPAY] Success! Order ID:', order.id);
    return order;
  } catch (error: any) {
    console.error('[RAZORPAY] Order creation failed. Error details:', {
      message: error.message,
      description: error.description,
      code: error.code,
      metadata: error.metadata,
      env: process.env.NODE_ENV,
      key_prefix: (process.env.RAZORPAY_KEY_ID || '').substring(0, 8)
    });
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
