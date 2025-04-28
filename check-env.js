// Script kiểm tra cấu hình .env
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env file
dotenv.config();

console.log('===== KIỂM TRA BIẾN MÔI TRƯỜNG =====');

// Kiểm tra có tồn tại .env file không
if (fs.existsSync(path.resolve(process.cwd(), '.env'))) {
  console.log('✅ Tìm thấy file .env');
  
  // Đọc nội dung file .env
  const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf8');
  const envLines = envContent.split('\n').filter(line => line.trim() !== '');
  
  console.log(`📝 File .env có ${envLines.length} dòng cấu hình`);
} else {
  console.error('❌ KHÔNG tìm thấy file .env! Vui lòng tạo file .env từ .env.example');
}

// Kiểm tra các biến môi trường quan trọng
const requiredVars = [
  { key: 'PORT', default: '5000' },
  { key: 'MONGODB_URI', description: 'Đường dẫn kết nối MongoDB' },
  { key: 'JWT_SECRET', description: 'Mã bảo mật để tạo JWT token' },
  { key: 'NODE_ENV', default: 'development' },
  { key: 'GOOGLE_CLIENT_ID', description: 'Client ID xác thực Google' },
  { key: 'EMAIL_HOST', default: 'smtp.gmail.com' },
  { key: 'EMAIL_PORT', default: '587' },
  { key: 'EMAIL_SECURE', default: 'false' },
  { key: 'EMAIL_USER', description: 'Email dùng để gửi thông báo' },
  { key: 'EMAIL_PASS', description: 'App Password cho email' },
  { key: 'EMAIL_FROM', description: 'Email "From" header' },
  { key: 'FRONTEND_URL', default: 'http://localhost:3000' }
];

console.log('\n----- Kiểm tra các biến môi trường quan trọng -----');

let missingVars = 0;
for (const v of requiredVars) {
  const value = process.env[v.key];
  
  if (!value) {
    console.error(`❌ ${v.key}: KHÔNG tìm thấy!${v.description ? ' - ' + v.description : ''}${v.default ? ' (mặc định: ' + v.default + ')' : ''}`);
    missingVars++;
  } else {
    // Chỉ hiển thị một phần giá trị nếu là secret
    const isSecret = v.key.includes('SECRET') || v.key.includes('PASS') || v.key.includes('URI');
    const displayValue = isSecret ? '******' : value;
    console.log(`✅ ${v.key}: ${displayValue}`);
  }
}

console.log('\n===== KẾT QUẢ KIỂM TRA =====');
if (missingVars > 0) {
  console.error(`❌ Phát hiện ${missingVars} biến môi trường bị thiếu. Vui lòng cập nhật file .env!`);
} else {
  console.log('✅ Tất cả các biến môi trường đã được cấu hình!');
}

// Kiểm tra App Password
if (process.env.EMAIL_PASS && process.env.EMAIL_PASS.includes(' ')) {
  console.error('❌ EMAIL_PASS chứa khoảng trắng - App Password không được có khoảng trắng!');
}

// Kiểm tra JWT_SECRET
if (process.env.JWT_SECRET && (process.env.JWT_SECRET.length < 10 || /^(your|my|test)/.test(process.env.JWT_SECRET))) {
  console.warn('⚠️ JWT_SECRET có vẻ quá đơn giản hoặc là giá trị mặc định. Nên sử dụng một chuỗi ngẫu nhiên phức tạp!');
}

// Kiểm tra GOOGLE_CLIENT_ID format
if (process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID.endsWith('.apps.googleusercontent.com')) {
  console.warn('⚠️ GOOGLE_CLIENT_ID không đúng format (phải kết thúc bằng .apps.googleusercontent.com)');
}

console.log('\nHoàn tất kiểm tra. Chạy "npm run dev" để khởi động server.'); 