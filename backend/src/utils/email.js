// backend/src/utils/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || ""
  }
});

async function sendResetEmail(to, name, resetUrl) {
  const html = `
    <p>Hi ${name || "Admin"},</p>
    <p>Click the link below to reset your password. This link expires in 1 hour.</p>
    <p><a href="${resetUrl}">Reset Password</a></p>
    <p>If you didn't request this, ignore this email.</p>
  `;

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || "no-reply@example.com",
    to,
    subject: "Admin Password Reset",
    html
  });

  return info;
}

module.exports = { sendResetEmail };
