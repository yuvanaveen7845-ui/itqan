import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export interface OrderEmailData {
  name: string;
  email: string;
  address: string;
  phone: string;
  product: string;
  display_id?: string;
}

export async function sendOrderEmails(order: OrderEmailData) {
  const orderId = order.display_id || "ORD" + Math.floor(Math.random() * 1000000);

  const { name, email, address, phone, product } = order;

  // 📩 Customer Email
  const customerMessage = `
    <h2>Order Confirmed 🌸</h2>
    <p>Hi ${name},</p>
    <p>Your order has been successfully placed!</p>
    <hr/>
    <p><b>Order ID:</b> ${orderId}</p>
    <p><b>Product:</b> ${product}</p>
    <p><b>Address:</b> ${address}</p>
    <p><b>Mobile:</b> ${phone}</p>
    <br/>
    <p>Thank you for shopping with us 💖</p>
  `;

  // 📩 Owner/Admin Email
  const adminMessage = `
    <h2>🛒 New Order Received</h2>
    <hr/>
    <p><b>Order ID:</b> ${orderId}</p>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Product:</b> ${product}</p>
    <p><b>Address:</b> ${address}</p>
    <p><b>Mobile:</b> ${phone}</p>
  `;

  try {
    // ✅ Send to Customer
    await transporter.sendMail({
      from: '"Perfume Store 🌸" <' + process.env.SMTP_USER + '>',
      to: email,
      subject: "Your Order is Confirmed ✅",
      html: customerMessage
    });

    // ✅ Send to YOU (Owner)
    const ownerEmail = process.env.OWNER_EMAIL || "kit28.24bad188@gmail.com";
    await transporter.sendMail({
      from: '"Perfume Store 🌸" <' + process.env.SMTP_USER + '>',
      to: ownerEmail,
      subject: "🛒 New Order Received",
      html: adminMessage
    });

    console.log("✅ Emails sent successfully");
  } catch (error) {
    console.log("❌ Error sending email:", error);
  }
}

export default sendOrderEmails;
