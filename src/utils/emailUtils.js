import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
// Generate a random verification token
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Configure email transporter
const createTransporter = () => {
  // Debug để tìm lỗi
  console.log('Email Configuration:', {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || 'missing_email_user',
      pass: process.env.EMAIL_PASS ? 'password_set' : 'missing_password',
    },
    from: process.env.EMAIL_FROM || 'missing_email_from'
  });

  // Check for required configuration
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('EMAIL_USER or EMAIL_PASS not set in environment variables!');
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email verification
export const sendVerificationEmail = async (user, verificationToken) => {
  try {
    const transporter = createTransporter();
    
    // Generate verification URL (frontend route)
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
    
    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Flowa App" <noreply@flowaapp.com>',
      to: user.email,
      subject: 'Xác nhận địa chỉ email của bạn',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4f46e5; text-align: center;">Flowa</h2>
          <h3 style="text-align: center;">Xác nhận địa chỉ email</h3>
          <p>Xin chào ${user.name},</p>
          <p>Cảm ơn bạn đã đăng ký tài khoản Flowa. Vui lòng xác nhận địa chỉ email của bạn bằng cách nhấp vào nút bên dưới:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Xác nhận email</a>
          </div>
          <p>Hoặc sao chép và dán liên kết này vào trình duyệt của bạn:</p>
          <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
          <p>Liên kết này sẽ hết hạn sau 24 giờ.</p>
          <p>Nếu bạn không yêu cầu xác nhận này, vui lòng bỏ qua email này.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">© ${new Date().getFullYear()} Flowa. Tất cả các quyền được bảo lưu.</p>
        </div>
      `,
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send verification code
export const sendVerificationCode = async (email, verificationCode) => {
  try {
    const transporter = createTransporter();
    
    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Flowa App" <noreply@flowaapp.com>',
      to: email,
      subject: 'Mã xác nhận đăng ký tài khoản',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4f46e5; text-align: center;">Flowa</h2>
          <h3 style="text-align: center;">Mã xác nhận đăng ký</h3>
          <p>Mã xác nhận của bạn là:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 32px; letter-spacing: 5px; font-weight: bold; background-color: #f3f4f6; padding: 15px; border-radius: 4px;">${verificationCode}</div>
          </div>
          <p>Mã này sẽ hết hạn sau 10 phút.</p>
          <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">© ${new Date().getFullYear()} Flowa. Tất cả các quyền được bảo lưu.</p>
        </div>
      `,
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification code sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
}; 