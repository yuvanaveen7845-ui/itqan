import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string, cc?: string) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      cc,
      subject,
      html,
    });
    console.log(`✓ Email sent to ${to}`);
  } catch (error) {
    console.error('✗ Email sending failed:', error);
    // Don't throw error to prevent crashing requests if SMTP is not configured
  }
};

export const emailTemplates = {
  welcome: (name: string) => `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#FAF9F6;">
      <h2 style="color:#C5A059;letter-spacing:0.2em;">Welcome to Itqan Perfumes</h2>
      <p>Hi ${name},</p>
      <p>Thank you for joining us. Explore our premium fragrance collection at <a href="https://itqan-sigma-sand.vercel.app" style="color:#C5A059;">itqan.com</a>.</p>
    </div>
  `,
  orderConfirmation: (orderId: string, total: number, customerName: string = 'Valued Customer') => `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#FAF9F6;">
      <h2 style="color:#C5A059;letter-spacing:0.1em;">Order Confirmed</h2>
      <p>Dear ${customerName},</p>
      <p>Your order has been confirmed and is being prepared.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;">
        <tr><td style="padding:8px;color:#666;">Order ID</td><td style="padding:8px;font-weight:bold;">${orderId}</td></tr>
        <tr><td style="padding:8px;color:#666;">Total Paid</td><td style="padding:8px;font-weight:bold;color:#C5A059;">₹${Number(total).toLocaleString()}</td></tr>
      </table>
      <p style="color:#888;font-size:13px;">We will notify you once your order is shipped. Thank you for choosing Itqan Perfumes.</p>
    </div>
  `,
  shopOwnerNotification: (orderId: string, customerEmail: string, customerName: string, total: number, items: any[]) => `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;border-left:4px solid #C5A059;">
      <h2 style="color:#1a1a1a;">💰 New Order Received</h2>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;background:#FAF9F6;padding:16px;border-radius:8px;">
        <tr><td style="padding:8px;color:#666;width:140px;">Order ID</td><td style="padding:8px;font-weight:bold;">${orderId}</td></tr>
        <tr><td style="padding:8px;color:#666;">Customer</td><td style="padding:8px;">${customerName}</td></tr>
        <tr><td style="padding:8px;color:#666;">Email</td><td style="padding:8px;">${customerEmail}</td></tr>
        <tr><td style="padding:8px;color:#666;">Amount Paid</td><td style="padding:8px;font-weight:bold;color:#C5A059;font-size:18px;">₹${Number(total).toLocaleString()}</td></tr>
      </table>
      <h3 style="color:#1a1a1a;">Items Ordered</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${(items || []).map((item: any) => `
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:8px;">${item.products?.name || 'Product'}</td>
            <td style="padding:8px;text-align:center;">×${item.quantity}</td>
            <td style="padding:8px;text-align:right;font-weight:bold;">₹${Number(item.price * item.quantity).toLocaleString()}</td>
          </tr>
        `).join('')}
      </table>
      <p style="margin-top:24px;color:#888;font-size:12px;">Log in to the admin panel to update order status.</p>
    </div>
  `,
  paymentReceipt: (orderId: string, amount: number, date: string) => `
    <h2>Payment Receipt</h2>
    <p>Order ID: ${orderId}</p>
    <p>Amount: ₹${amount}</p>
    <p>Date: ${date}</p>
  `,
  shippingNotification: (orderId: string, trackingId: string) => `
    <h2>Your Order is Shipped</h2>
    <p>Order ID: ${orderId}</p>
    <p>Tracking ID: ${trackingId}</p>
  `,
  passwordReset: (resetLink: string) => `
    <h2>Reset Your Password</h2>
    <p><a href="${resetLink}">Click here to reset your password</a></p>
    <p>This link expires in 1 hour.</p>
  `,
};

