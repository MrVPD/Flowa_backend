import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authToken, userId } from './auth-test.js';

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

// Biến lưu trữ dữ liệu
let brandId = '';
let themeId = '';
let productId = '';

// Test tạo thương hiệu
const testCreateBrand = async () => {
  try {
    console.log('\n--- Test tạo thương hiệu ---');
    
    const brandData = {
      name: `Test Brand ${Date.now()}`,
      description: 'Thương hiệu test cho hệ thống Flowa',
      tone: 'professional',
      keywords: ['test', 'brand', 'flowa'],
      hashtags: ['#TestBrand', '#Flowa', '#AIContent'],
      contentRules: 'Luôn sử dụng giọng điệu chuyên nghiệp và thân thiện'
    };
    
    const response = await axios.post(`${API_URL}/brands`, brandData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 201 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    // Lưu brandId
    brandId = response.data._id;
    
    saveTestResult('create-brand-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test tạo thương hiệu:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test lấy danh sách thương hiệu
const testGetBrands = async () => {
  try {
    console.log('\n--- Test lấy danh sách thương hiệu ---');
    
    const response = await axios.get(`${API_URL}/brands`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Số lượng thương hiệu:', response.data.length);
    
    // Nếu chưa có brandId và có thương hiệu trong danh sách
    if (!brandId && response.data.length > 0) {
      brandId = response.data[0]._id;
      console.log('Đã lấy brandId từ danh sách:', brandId);
    }
    
    saveTestResult('get-brands-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test lấy danh sách thương hiệu:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test lấy thông tin thương hiệu theo ID
const testGetBrandById = async () => {
  try {
    console.log('\n--- Test lấy thông tin thương hiệu theo ID ---');
    
    if (!brandId) {
      console.log('Không có brandId, bỏ qua test này');
      return null;
    }
    
    const response = await axios.get(`${API_URL}/brands/${brandId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('get-brand-by-id-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test lấy thông tin thương hiệu:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test cập nhật thương hiệu
const testUpdateBrand = async () => {
  try {
    console.log('\n--- Test cập nhật thương hiệu ---');
    
    if (!brandId) {
      console.log('Không có brandId, bỏ qua test này');
      return null;
    }
    
    const updateData = {
      description: `Thương hiệu test đã cập nhật - ${new Date().toISOString()}`,
      tone: 'friendly',
      keywords: ['updated', 'test', 'brand', 'flowa'],
    };
    
    const response = await axios.put(`${API_URL}/brands/${brandId}`, updateData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('update-brand-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test cập nhật thương hiệu:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test tạo sản phẩm
const testCreateProduct = async () => {
  try {
    console.log('\n--- Test tạo sản phẩm ---');
    
    if (!brandId) {
      console.log('Không có brandId, bỏ qua test này');
      return null;
    }
    
    const productData = {
      name: `Test Product ${Date.now()}`,
      description: 'Sản phẩm test cho hệ thống Flowa',
      brandId: brandId,
      features: ['Tính năng 1', 'Tính năng 2', 'Tính năng 3'],
      benefits: ['Lợi ích 1', 'Lợi ích 2'],
      targetAudience: 'Người dùng quan tâm đến nội dung AI'
    };
    
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 201 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    // Lưu productId
    productId = response.data._id;
    
    saveTestResult('create-product-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test tạo sản phẩm:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test lấy danh sách sản phẩm theo thương hiệu
const testGetProductsByBrand = async () => {
  try {
    console.log('\n--- Test lấy danh sách sản phẩm theo thương hiệu ---');
    
    if (!brandId) {
      console.log('Không có brandId, bỏ qua test này');
      return null;
    }
    
    const response = await axios.get(`${API_URL}/products/brand/${brandId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Số lượng sản phẩm:', response.data.length);
    
    // Nếu chưa có productId và có sản phẩm trong danh sách
    if (!productId && response.data.length > 0) {
      productId = response.data[0]._id;
      console.log('Đã lấy productId từ danh sách:', productId);
    }
    
    saveTestResult('get-products-by-brand-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test lấy danh sách sản phẩm:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test lấy thông tin sản phẩm theo ID
const testGetProductById = async () => {
  try {
    console.log('\n--- Test lấy thông tin sản phẩm theo ID ---');
    
    if (!productId) {
      console.log('Không có productId, bỏ qua test này');
      return null;
    }
    
    const response = await axios.get(`${API_URL}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('get-product-by-id-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test lấy thông tin sản phẩm:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test cập nhật sản phẩm
const testUpdateProduct = async () => {
  try {
    console.log('\n--- Test cập nhật sản phẩm ---');
    
    if (!productId) {
      console.log('Không có productId, bỏ qua test này');
      return null;
    }
    
    const updateData = {
      description: `Sản phẩm test đã cập nhật - ${new Date().toISOString()}`,
      features: ['Tính năng mới 1', 'Tính năng mới 2', 'Tính năng mới 3'],
      benefits: ['Lợi ích mới 1', 'Lợi ích mới 2'],
    };
    
    const response = await axios.put(`${API_URL}/products/${productId}`, updateData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Kết quả:', response.status === 200 ? 'Thành công' : 'Thất bại');
    console.log('Dữ liệu:', response.data);
    
    saveTestResult('update-product-result.json', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi test cập nhật sản phẩm:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Chạy các test thương hiệu và sản phẩm
const runBrandProductTests = async () => {
  console.log('=== BẮT ĐẦU TEST THƯƠNG HIỆU VÀ SẢN PHẨM ===');
  
  // Kiểm tra xem có authToken không
  if (!authToken) {
    console.log('Không có authToken, vui lòng chạy auth-test.js trước');
    return;
  }
  
  // Test thương hiệu
  await testGetBrands(); // Lấy danh sách để kiểm tra xem đã có thương hiệu nào chưa
  
  if (!brandId) {
    await testCreateBrand();
  }
  
  if (brandId) {
    await testGetBrandById();
    await testUpdateBrand();
  }
  
  // Test sản phẩm
  if (brandId) {
    await testGetProductsByBrand(); // Lấy danh sách để kiểm tra xem đã có sản phẩm nào chưa
    
    if (!productId) {
      await testCreateProduct();
    }
    
    if (productId) {
      await testGetProductById();
      await testUpdateProduct();
    }
  }
  
  console.log('=== KẾT THÚC TEST THƯƠNG HIỆU VÀ SẢN PHẨM ===');
};

// Chạy test
runBrandProductTests();

export { brandId, productId };
