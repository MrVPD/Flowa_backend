import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Cấu hình
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const OUTPUT_DIR = path.join(__dirname, 'output');

// Tạo thư mục output nếu chưa tồn tại
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Lưu kết quả test
const saveTestResult = (filename, data) => {
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Đã lưu kết quả vào ${filePath}`);
};

// Biến lưu trữ token và dữ liệu
let authToken = '';
let userId = '';
let brandId = '';
let themeId = '';
let productId = '';
let chatId = '';
let contentId = '';

// Test đăng ký người dùng
const testRegister = async () => {
  try {
    console.log('\n--- Test đăng ký người dùng ---');
    
    const userData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'Password123!',
      role: 'brand_manager'
    };
    
    const response = await axios.post(`${API_URL}/users/register`, userData);
    
    console.log('Kết quả:', response.status === 201 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    // Lưu token và userId
    authToken = response.data.token;
    userId = response.data._id;
    
    saveTestResult('register-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test đăng ký:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test đăng nhập
const testLogin = async (email, password) => {
  try {
    console.log('\n--- Test đăng nhập ---');
    
    const loginData = {
      email,
      password
    };
    
    const response = await axios.post(`${API_URL}/users/login`, loginData);
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    // Lưu token và userId
    authToken = response.data.token;
    userId = response.data._id;
    
    saveTestResult('login-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test đăng nhập:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test lấy thông tin người dùng
const testGetUserProfile = async () => {
  try {
    console.log('\n--- Test lấy thông tin người dùng ---');
    
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('user-profile-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test lấy thông tin người dùng:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test cập nhật thông tin người dùng
const testUpdateUserProfile = async () => {
  try {
    console.log('\n--- Test cập nhật thông tin người dùng ---');
    
    const updateData = {
      name: 'Updated Test User'
    };
    
    const response = await axios.put(`${API_URL}/users/profile`, updateData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('update-user-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test cập nhật thông tin người dùng:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test quản lý API key
const testManageApiKeys = async () => {
  try {
    console.log('\n--- Test quản lý API key ---');
    
    const apiKeyData = {
      service: 'openai',
      key: 'sk-test-api-key-12345',
      action: 'add'
    };
    
    const response = await axios.put(`${API_URL}/users/apikeys`, apiKeyData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('manage-apikeys-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test quản lý API key:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Chạy các test xác thực
const runAuthTests = async () => {
  console.log('=== BẮT ĐẦU TEST XÁC THỰC ===');
  
  // Test đăng ký
  const registerResult = await testRegister();
  
  if (!registerResult) {
    // Nếu đăng ký thất bại, thử đăng nhập với tài khoản có sẵn
    await testLogin('test@example.com', 'Password123!');
  }
  
  // Test lấy và cập nhật thông tin người dùng
  if (authToken) {
    await testGetUserProfile();
    await testUpdateUserProfile();
    await testManageApiKeys();
  }
  
  console.log('=== KẾT THÚC TEST XÁC THỰC ===');
};

// Chạy test
runAuthTests();

export { authToken, userId };
