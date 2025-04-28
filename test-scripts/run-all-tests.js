import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execPromise = promisify(exec);

// Cấu hình
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Danh sách các script test
const testScripts = [
  'auth-test.js',
  'brand-product-test.js',
  'content-test.js',
  'analytics-integration-test.js'
];

// Hàm chạy một script
const runScript = async (scriptName) => {
  console.log(`\n======= ĐANG CHẠY ${scriptName} =======\n`);
  
  try {
    const { stdout, stderr } = await execPromise(`node ${path.join(__dirname, scriptName)}`);
    
    if (stderr) {
      console.error(`Lỗi khi chạy ${scriptName}:`, stderr);
    }
    
    console.log(stdout);
    console.log(`\n======= HOÀN THÀNH ${scriptName} =======\n`);
    
    return true;
  } catch (error) {
    console.error(`Lỗi khi chạy ${scriptName}:`, error.message);
    return false;
  }
};

// Hàm chạy tất cả các script theo thứ tự
const runAllTests = async () => {
  console.log('=== BẮT ĐẦU CHẠY TẤT CẢ CÁC TEST ===');
  
  for (const script of testScripts) {
    const success = await runScript(script);
    
    if (!success) {
      console.error(`Test ${script} thất bại, dừng quá trình test.`);
      break;
    }
  }
  
  console.log('=== KẾT THÚC CHẠY TẤT CẢ CÁC TEST ===');
};

// Chạy tất cả các test
runAllTests();
