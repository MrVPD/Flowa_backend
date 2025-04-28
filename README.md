# FLOWA - TỰ ĐỘNG TẠO NỘI DUNG AI CHO TẤT CẢ MẠNG XÃ HỘI

## Giới thiệu

Flowa là một nền tảng tự động hóa tạo nội dung AI cho tất cả các mạng xã hội. Backend này cung cấp các API cần thiết để hỗ trợ việc tạo, quản lý và phân phối nội dung tự động trên nhiều nền tảng mạng xã hội khác nhau.

## Tính năng chính

- **Quản lý người dùng**: Đăng ký, đăng nhập và quản lý thông tin cá nhân
- **Quản lý thương hiệu**: Tạo và quản lý các thương hiệu khác nhau
- **Quản lý chủ đề và sản phẩm**: Tổ chức nội dung theo chủ đề và sản phẩm
- **Tạo nội dung AI**: Tạo nội dung bằng các mô hình AI tiên tiến
- **Tích hợp mạng xã hội**: Kết nối và đăng tải nội dung lên nhiều nền tảng mạng xã hội
- **Phân tích dữ liệu**: Theo dõi hiệu suất của nội dung và chiến dịch
- **Quản lý API keys**: Quản lý kết nối với các dịch vụ bên thứ ba
- **Tùy chỉnh cài đặt**: Cá nhân hóa trải nghiệm người dùng

## Cài đặt

### Yêu cầu hệ thống

- Node.js (phiên bản 14 trở lên)
- MongoDB
- NPM hoặc Yarn

### Các bước cài đặt

1. Clone repository về máy
```bash
git clone [repository-url]
cd flowa-taf-backend
```

2. Cài đặt các gói phụ thuộc
```bash
npm install
```

3. Tạo file .env tại thư mục gốc với các biến môi trường sau
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Khởi động server
```bash
# Chế độ phát triển
npm run dev

# Chế độ sản phẩm
npm start
```

## Cấu trúc dự án

```
src/
├── config/         # Cấu hình ứng dụng và kết nối cơ sở dữ liệu
├── controllers/    # Xử lý logic nghiệp vụ
├── middleware/     # Middleware xác thực và xử lý lỗi
├── models/         # Mô hình dữ liệu MongoDB
├── routes/         # Định nghĩa API endpoints
├── utils/          # Tiện ích và hàm hỗ trợ
└── server.js       # Điểm khởi đầu ứng dụng
```

## API Endpoints

- **Users**: `/api/users` - Đăng ký, đăng nhập và quản lý người dùng
- **Brands**: `/api/brands` - Quản lý thương hiệu
- **Themes**: `/api/themes` - Quản lý chủ đề
- **Products**: `/api/products` - Quản lý sản phẩm
- **Chat**: `/api/chat` - Giao tiếp với AI
- **Content**: `/api/content` - Tạo và quản lý nội dung
- **Social Media**: `/api/social` - Tích hợp mạng xã hội
- **Analytics**: `/api/analytics` - Phân tích dữ liệu
- **Integrations**: `/api/integrations` - Tích hợp dịch vụ bên thứ ba
- **Settings**: `/api/settings` - Quản lý cài đặt

## Công nghệ sử dụng

- **Express**: Framework để xây dựng REST API
- **MongoDB**: Cơ sở dữ liệu NoSQL
- **JWT**: Xác thực và phân quyền
- **Bcrypt**: Mã hóa mật khẩu
- **Axios**: Gọi API từ các dịch vụ bên ngoài
- **Multer**: Xử lý tải lên tệp

## Bảo mật

Backend được thiết kế với nhiều lớp bảo mật:
- Xác thực JWT
- Mã hóa mật khẩu
- Middleware bảo vệ route
- Phân quyền user/admin

## Đóng góp

Chúng tôi luôn hoan nghênh đóng góp từ cộng đồng. Nếu bạn muốn đóng góp, vui lòng:

1. Fork dự án
2. Tạo nhánh tính năng mới (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'Add some amazing feature'`)
4. Push lên nhánh (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## Giấy phép

Dự án này được cấp phép theo giấy phép ISC - xem tệp LICENSE để biết chi tiết.

## Liên hệ

Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với nhóm phát triển. 