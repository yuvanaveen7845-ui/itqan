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
    <h2>Welcome to Itqan Perfumes!</h2>
    <p>Hi ${name},</p>
    <p>Thank you for registering. Start exploring our premium fragrance collection.</p>
  `,
  orderConfirmation: (orderId: string, total: number) => `
    <h2>Order Confirmed</h2>
    <p>Order ID: ${orderId}</p>
    <p>Total Amount: ₹${total}</p>
    <p>Your order will be processed shortly.</p>
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
    <p>Track your order status in real-time.</p>
  `,
  passwordReset: (resetLink: string) => `
    <h2>Reset Your Password</h2>
    <p><a href="${resetLink}">Click here to reset your password</a></p>
    <p>This link expires in 1 hour.</p>
  `,
};
