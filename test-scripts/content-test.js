import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// import { authToken } from './auth-test.js';
import { brandId, productId } from './brand-product-test.js';

// Cấu hình
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGEwNGZmMzNlODkxOWI0ZjAxZTc5NyIsImlhdCI6MTc0NTQ4NzEwMywiZXhwIjoxNzQ4MDc5MTAzfQ.E3wAotO2TQGHq3fIISKsjhsXRwYSmohcQCWTFHKsKHc";

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

// Biến lưu trữ dữ liệu
let themeId = '';
let chatId = '';
let contentId = '';

// Test tạo chủ đề nội dung
const testCreateTheme = async () => {
  try {
    console.log('\n--- Test tạo chủ đề nội dung ---');
    
    if (!brandId) {
      console.log('Không có brandId, bỏ qua test này');
      return null;
    }
    
    const themeData = {
      name: `Test Theme ${Date.now()}`,
      description: 'Chủ đề test cho hệ thống Flowa',
      brandId: brandId,
      category: 'knowledge',
      contentLength: 800,
      tone: 'professional',
      style: 'informative'
    };
    
    const response = await axios.post(`${API_URL}/themes`, themeData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 201 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    // Lưu themeId
    themeId = response.data._id;
    
    saveTestResult('create-theme-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test tạo chủ đề nội dung:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test lấy danh sách chủ đề theo thương hiệu
const testGetThemesByBrand = async () => {
  try {
    console.log('\n--- Test lấy danh sách chủ đề theo thương hiệu ---');
    
    if (!brandId) {
      console.log('Không có brandId, bỏ qua test này');
      return null;
    }
    
    const response = await axios.get(`${API_URL}/themes/brand/${brandId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Số lượng chủ đề:', response.data.length);
    
    // Nếu chưa có themeId và có chủ đề trong danh sách
    if (!themeId && response.data.length > 0) {
      themeId = response.data[0]._id;
      console.log('Đã lấy themeId từ danh sách:', themeId);
    }
    
    saveTestResult('get-themes-by-brand-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test lấy danh sách chủ đề:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test tạo phiên chat AI
const testCreateChat = async () => {
  try {
    console.log('\n--- Test tạo phiên chat AI ---');
    
    if (!brandId) {
      console.log('Không có brandId, bỏ qua test này');
      return null;
    }
    
    const chatData = {
      brandId: brandId,
      title: `Test Chat ${Date.now()}`,
      aiModel: 'openai'
    };
    
    const response = await axios.post(`${API_URL}/chat`, chatData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 201 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    // Lưu chatId
    chatId = response.data._id;
    
    saveTestResult('create-chat-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test tạo phiên chat AI:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test gửi tin nhắn trong chat
const testSendMessage = async () => {
  try {
    console.log('\n--- Test gửi tin nhắn trong chat ---');
    
    if (!chatId) {
      console.log('Không có chatId, bỏ qua test này');
      return null;
    }
    
    const messageData = {
      message: 'Hãy tạo nội dung về sản phẩm của tôi'
    };
    
    const response = await axios.post(`${API_URL}/chat/${chatId}/message`, messageData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('send-message-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test gửi tin nhắn trong chat:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test tạo nội dung tự động
const testGenerateContent = async () => {
  try {
    console.log('\n--- Test tạo nội dung tự động ---');
    
    if (!brandId || !themeId) {
      console.log('Không có brandId hoặc themeId, bỏ qua test này');
      return null;
    }
    
    const contentData = {
      brandId: brandId,
      themeId: themeId,
      socialPlatform: 'facebook',
      count: 2
    };
    
    const response = await axios.post(`${API_URL}/content/generate`, contentData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 201 ? 'Thành công' : 'Thất bại');
    console.log('Số lượng nội dung đã tạo:', response.data.contents ? response.data.contents.length : 0);
    
    // Lưu contentId nếu có
    if (response.data.contents && response.data.contents.length > 0) {
      contentId = response.data.contents[0].id;
      console.log('Đã lưu contentId:', contentId);
    }
    
    saveTestResult('generate-content-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test tạo nội dung tự động:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test tối ưu nội dung cho nền tảng mạng xã hội
const testOptimizeContent = async () => {
  try {
    console.log('\n--- Test tối ưu nội dung cho nền tảng mạng xã hội ---');
    
    if (!contentId) {
      console.log('Không có contentId, bỏ qua test này');
      return null;
    }
    
    const optimizeData = {
      contentId: contentId,
      platform: 'instagram'
    };
    
    const response = await axios.post(`${API_URL}/content/optimize`, optimizeData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('optimize-content-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test tối ưu nội dung:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test phân tích từ khóa
const testAnalyzeKeywords = async () => {
  try {
    console.log('\n--- Test phân tích từ khóa ---');
    
    if (!brandId) {
      console.log('Không có brandId, bỏ qua test này');
      return null;
    }
    
    const response = await axios.get(`${API_URL}/content/keywords?brandId=${brandId}${themeId ? `&themeId=${themeId}` : ''}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('analyze-keywords-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test phân tích từ khóa:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test tạo hình ảnh minh họa
const testGenerateImage = async () => {
  try {
    console.log('\n--- Test tạo hình ảnh minh họa ---');
    
    if (!brandId || !themeId) {
      console.log('Không có brandId hoặc themeId, bỏ qua test này');
      return null;
    }
    
    const imageData = {
      prompt: 'Hình ảnh minh họa cho sản phẩm công nghệ hiện đại',
      brandId: brandId,
      themeId: themeId
    };
    
    const response = await axios.post(`${API_URL}/content/generate-image`, imageData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('generate-image-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test tạo hình ảnh minh họa:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Chạy các test nội dung
const runContentTests = async () => {
  console.log('=== BẮT ĐẦU TEST NỘI DUNG ===');
  
  // Kiểm tra xem có authToken và brandId không
  if (!authToken) {
    console.log('Không có authToken, vui lòng chạy auth-test.js trước');
    return;
  }
  
  if (!brandId) {
    console.log('Không có brandId, vui lòng chạy brand-product-test.js trước');
    return;
  }
  
  // Test chủ đề nội dung
  await testGetThemesByBrand(); // Lấy danh sách để kiểm tra xem đã có chủ đề nào chưa
  
  if (!themeId) {
    await testCreateTheme();
  }
  
  // Test chat và tạo nội dung
  await testCreateChat();
  
  if (chatId) {
    await testSendMessage();
  }
  
  if (themeId) {
    await testGenerateContent();
    
    if (contentId) {
      await testOptimizeContent();
    }
    
    await testAnalyzeKeywords();
    await testGenerateImage();
  }
  
  console.log('=== KẾT THÚC TEST NỘI DUNG ===');
};

// Chạy test
runContentTests();

export { themeId, chatId, contentId };
