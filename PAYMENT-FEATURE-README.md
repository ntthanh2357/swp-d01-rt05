# Chức năng Thanh toán và Lưu trữ Gói dịch vụ

## Tổng quan
Hệ thống đã được cập nhật để hỗ trợ lưu trữ thông tin gói thanh toán khi người dùng nhấn "thanh toán ngay" và tự động cập nhật vào profile của seeker khi thanh toán thành công.

## Các thay đổi chính

### 1. Database Schema
- **Bảng `payment_packages`**: Lưu trữ thông tin các gói dịch vụ
- **Bảng `payments`**: Lưu trữ lịch sử thanh toán
- **Cập nhật `seeker_profiles`**: Thêm trường `purchased_package` để lưu gói đã mua

### 2. Backend (Spring Boot)
#### Entities mới:
- `PaymentPackage.java`: Entity cho gói thanh toán
- `Payment.java`: Entity cho giao dịch thanh toán

#### Repositories mới:
- `PaymentPackageRepository.java`
- `PaymentRepository.java`

#### Services mới:
- `PaymentService.java`: Xử lý logic thanh toán

#### Controllers:
- **Cập nhật `PayOSController.java`**: 
  - Tích hợp với PaymentService
  - Lưu thông tin thanh toán khi tạo payment link
  - Endpoint `/payment-success` để xử lý thanh toán thành công
- **Mới `PaymentController.java`**: API lấy lịch sử thanh toán

#### Cập nhật Seeker:
- Thêm trường `purchasedPackage` vào `Seeker.java`
- Cập nhật `SeekerController.java` để trả về thông tin gói đã mua

### 3. Frontend (React)
#### Cập nhật `payment.js`:
- Tích hợp với UserContext để lấy token
- Gửi `packageId` và token khi tạo payment link
- Lưu thông tin thanh toán vào localStorage

#### Cập nhật `payment-success.js`:
- Gọi API để xác nhận thanh toán thành công
- Hiển thị trạng thái xử lý thanh toán

## Luồng hoạt động

### 1. Khi người dùng nhấn "Thanh toán ngay":
1. Frontend gửi request có `packageId`, `amount`, `description` và `Authorization token`
2. Backend tạo record trong bảng `payments` với status `PENDING`
3. Backend tạo PayOS payment link và cập nhật `checkout_url`
4. Frontend redirect đến PayOS hosted page

### 2. Khi thanh toán thành công:
1. PayOS redirect về `/payment-success?orderCode=xxx&status=PAID`
2. Frontend gọi API `/api/payos/payment-success` để xác nhận
3. Backend cập nhật payment status thành `PAID`
4. Backend tự động cập nhật `purchased_package` trong seeker profile
5. Frontend hiển thị thông báo thành công

### 3. Khi xem profile:
1. API `/api/seeker/profile` trả về thông tin `purchased_package`
2. Frontend có thể hiển thị gói dịch vụ đã mua

## Cách test

### 1. Setup Database:
```sql
-- Chạy script SQL mới để tạo bảng payments và payment_packages
-- Script đã được thêm vào cuối file database.sql
```

### 2. Chạy ứng dụng:
```bash
# Backend
cd demo
mvn spring-boot:run

# Frontend
cd frontend
npm start
```

### 3. Test flow:
1. Mở `http://localhost:3000/payment`
2. Đăng nhập với tài khoản seeker
3. Nhấn "Thanh toán ngay" trên một gói dịch vụ
4. Hoàn thành thanh toán trên trang PayOS (có thể test với card test)
5. Kiểm tra profile seeker để xem gói đã được cập nhật

### 4. Kiểm tra Database:
```sql
-- Xem payments
SELECT * FROM payments;

-- Xem seeker profile với purchased package
SELECT sp.seeker_id, u.name, sp.purchased_package 
FROM seeker_profiles sp 
JOIN users u ON sp.seeker_id = u.user_id 
WHERE sp.purchased_package IS NOT NULL;
```

## API Endpoints mới

### PayOS Controller:
- `POST /api/payos/create-payment-link`: Cập nhật để lưu payment record
- `POST /api/payos/payment-success`: Xử lý thanh toán thành công

### Payment Controller:
- `GET /api/payment/history`: Lấy lịch sử thanh toán của user

## Ghi chú kỹ thuật

### Security:
- Tất cả API payment đều yêu cầu JWT token
- Chỉ user có thể xem lịch sử thanh toán của chính mình

### Error Handling:
- Xử lý các trường hợp lỗi: token không hợp lệ, payment thất bại, etc.
- Logging chi tiết để debug

### Performance:
- Sử dụng lazy loading cho relationships
- Index trên order_code và user_id

## Troubleshooting

### Lỗi thường gặp:
1. **Token không hợp lệ**: Đảm bảo user đã đăng nhập
2. **Payment không được cập nhật**: Kiểm tra log backend để xem có lỗi database không
3. **Seeker profile không có purchased_package**: Đảm bảo đã chạy migration database

### Logs quan trọng:
- Backend sẽ log khi payment được tạo và cập nhật
- Frontend console log trong payment-success page
