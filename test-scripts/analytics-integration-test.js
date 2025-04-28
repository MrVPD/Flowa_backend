import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authToken } from './auth-test.js';
import { brandId } from './brand-product-test.js';

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

// Test thống kê hiệu suất tạo nội dung
const testGetContentStats = async () => {
  try {
    console.log('\n--- Test thống kê hiệu suất tạo nội dung ---');
    
    let url = `${API_URL}/analytics/content-stats`;
    if (brandId) {
      url += `?brandId=${brandId}`;
    }
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('content-stats-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test thống kê hiệu suất tạo nội dung:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test báo cáo hiệu suất mạng xã hội
const testGetSocialPerformance = async () => {
  try {
    console.log('\n--- Test báo cáo hiệu suất mạng xã hội ---');
    
    let url = `${API_URL}/analytics/social-performance`;
    if (brandId) {
      url += `?brandId=${brandId}`;
    }
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('social-performance-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test báo cáo hiệu suất mạng xã hội:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test phân tích nội dung
const testGetContentAnalysis = async () => {
  try {
    console.log('\n--- Test phân tích nội dung ---');
    
    let url = `${API_URL}/analytics/content-analysis`;
    if (brandId) {
      url += `?brandId=${brandId}`;
    }
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('content-analysis-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test phân tích nội dung:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test đề xuất cải thiện
const testGetImprovementSuggestions = async () => {
  try {
    console.log('\n--- Test đề xuất cải thiện ---');
    
    let url = `${API_URL}/analytics/improvement-suggestions`;
    if (brandId) {
      url += `?brandId=${brandId}`;
    }
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('improvement-suggestions-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test đề xuất cải thiện:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test quản lý API key
const testManageApiKeys = async () => {
  try {
    console.log('\n--- Test quản lý API key ---');
    
    const apiKeyData = {
      service: 'openai',
      key: 'sk-test-api-key-' + Date.now(),
      action: 'add'
    };
    
    const response = await axios.post(`${API_URL}/integrations/api-keys`, apiKeyData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('manage-api-keys-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test quản lý API key:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test thiết lập tham số AI
const testSetAiParameters = async () => {
  try {
    console.log('\n--- Test thiết lập tham số AI ---');
    
    const parametersData = {
      service: 'openai',
      parameters: {
        temperature: 0.8,
        maxTokens: 2000,
        frequencyPenalty: 0.5,
        presencePenalty: 0.5
      }
    };
    
    const response = await axios.post(`${API_URL}/integrations/ai-parameters`, parametersData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('set-ai-parameters-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test thiết lập tham số AI:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test theo dõi sử dụng API
const testGetApiUsage = async () => {
  try {
    console.log('\n--- Test theo dõi sử dụng API ---');
    
    const response = await axios.get(`${API_URL}/integrations/api-usage`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('api-usage-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test theo dõi sử dụng API:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test lấy tài liệu API công khai
const testGetApiDocumentation = async () => {
  try {
    console.log('\n--- Test lấy tài liệu API công khai ---');
    
    const response = await axios.get(`${API_URL}/integrations/public-api/documentation`);
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('api-documentation-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test lấy tài liệu API công khai:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test lấy cài đặt chung
const testGetGeneralSettings = async () => {
  try {
    console.log('\n--- Test lấy cài đặt chung ---');
    
    const response = await axios.get(`${API_URL}/settings/general`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('general-settings-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test lấy cài đặt chung:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test cập nhật cài đặt chung
const testUpdateGeneralSettings = async () => {
  try {
    console.log('\n--- Test cập nhật cài đặt chung ---');
    
    const settingsData = {
      language: 'vi',
      timezone: 'Asia/Ho_Chi_Minh',
      emailNotifications: true,
      theme: 'dark'
    };
    
    const response = await axios.put(`${API_URL}/settings/general`, settingsData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('update-general-settings-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test cập nhật cài đặt chung:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Chạy các test phân tích và tích hợp
const runAnalyticsIntegrationTests = async () => {
  console.log('=== BẮT ĐẦU TEST PHÂN TÍCH VÀ TÍCH HỢP ===');
  
  // Kiểm tra xem có authToken không
  if (!authToken) {
    console.log('Không có authToken, vui lòng chạy auth-test.js trước');
    return;
  }
  
  // Test phân tích
  await testGetContentStats();
  await testGetSocialPerformance();
  await testGetContentAnalysis();
  await testGetImprovementSuggestions();
  
  // Test tích hợp
  await testManageApiKeys();
  await testSetAiParameters();
  await testGetApiUsage();
  await testGetApiDocumentation();
  
  // Test cài đặt
  await testGetGeneralSettings();
  await testUpdateGeneralSettings();
  
  console.log('=== KẾT THÚC TEST PHÂN TÍCH VÀ TÍCH HỢP ===');
};

// Chạy test
runAnalyticsIntegrationTests();
