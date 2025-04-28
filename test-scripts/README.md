# Scripts Test cho Flowa Backend

Bộ scripts này được tạo ra để test các chức năng của backend Flowa. Các scripts sử dụng Axios để gửi các request HTTP đến API và kiểm tra kết quả trả về.

## Cấu trúc thư mục

```
test-scripts/
├── auth-test.js             - Test xác thực và quản lý người dùng
├── brand-product-test.js    - Test quản lý thương hiệu và sản phẩm
├── content-test.js          - Test tạo nội dung và chủ đề
├── analytics-integration-test.js - Test phân tích và tích hợp API
├── run-all-tests.js         - Script chạy tất cả các test
└── output/                  - Thư mục chứa kết quả test
```

## Cài đặt

1. Cài đặt các dependency:

```bash
npm install axios dotenv
```

2. Tạo file `.env` trong thư mục `test-scripts` với nội dung:

```
API_URL=http://localhost:5000/api
```

## Chạy test

### Chạy từng test riêng lẻ

```bash
node auth-test.js
node brand-product-test.js
node content-test.js
node analytics-integration-test.js
```

### Chạy tất cả các test

```bash
node run-all-tests.js
```

## Các chức năng được test

### 1. Xác thực và quản lý người dùng (auth-test.js)
- Đăng ký người dùng mới
- Đăng nhập
- Lấy thông tin người dùng
- Cập nhật thông tin người dùng
- Quản lý API key

### 2. Quản lý thương hiệu và sản phẩm (brand-product-test.js)
- Tạo thương hiệu mới
- Lấy danh sách thương hiệu
- Lấy thông tin chi tiết thương hiệu
- Cập nhật thương hiệu
- Tạo sản phẩm mới
- Lấy danh sách sản phẩm theo thương hiệu
- Lấy thông tin chi tiết sản phẩm
- Cập nhật sản phẩm

### 3. Tạo nội dung và chủ đề (content-test.js)
- Tạo chủ đề nội dung mới
- Lấy danh sách chủ đề theo thương hiệu
- Tạo phiên chat AI
- Gửi tin nhắn trong chat
- Tạo nội dung tự động
- Tối ưu nội dung cho nền tảng mạng xã hội
- Phân tích từ khóa
- Tạo hình ảnh minh họa

### 4. Phân tích và tích hợp API (analytics-integration-test.js)
- Thống kê hiệu suất tạo nội dung
- Báo cáo hiệu suất mạng xã hội
- Phân tích nội dung
- Đề xuất cải thiện
- Quản lý API key
- Thiết lập tham số AI
- Theo dõi sử dụng API
- Lấy tài liệu API công khai
- Lấy và cập nhật cài đặt chung

## Kết quả test

Kết quả của mỗi test sẽ được lưu trong thư mục `output/` dưới dạng file JSON. Các file này chứa dữ liệu trả về từ API và có thể được sử dụng để phân tích hoặc debug.

## Lưu ý

- Các test phụ thuộc vào nhau, vì vậy nên chạy theo thứ tự: auth-test.js -> brand-product-test.js -> content-test.js -> analytics-integration-test.js
- Nếu một test thất bại, các test tiếp theo có thể sẽ không chạy được
- Đảm bảo server backend đang chạy trước khi thực hiện test
