# Hướng dẫn Debug Chức năng Thanh toán

## Bước 1: Kiểm tra Database
Chạy file `test-payment-db.sql` để kiểm tra:
```sql
-- Mở MySQL Workbench hoặc command line và chạy:
source test-payment-db.sql;
```

## Bước 2: Kiểm tra Backend Logs
1. Khởi động backend:
```bash
cd demo
mvn spring-boot:run
```

2. Theo dõi console logs để xem:
- Payment được tạo thành công chưa
- Payment success được gọi chưa
- Seeker profile được cập nhật chưa

## Bước 3: Test API trực tiếp

### Test tạo payment:
```bash
curl -X POST http://localhost:8080/api/payos/create-payment-link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 10000,
    "description": "GÓI HỖ TRỢ ĐƠN GIẢN",
    "packageId": "basic"
  }'
```

### Test payment success:
```bash
curl -X POST http://localhost:8080/api/payos/payment-success \
  -H "Content-Type: application/json" \
  -d '{
    "orderCode": "YOUR_ORDER_CODE",
    "status": "PAID"
  }'
```

### Test debug user data:
```bash
curl http://localhost:8080/api/payment/debug/USER_ID_HERE
```

### Test get profile:
```bash
curl -X POST http://localhost:8080/api/seeker/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Bước 4: Test Frontend
1. Mở browser console (F12)
2. Đi đến trang profile
3. Kiểm tra console logs để xem:
   - Profile data có được load không
   - `purchased_package` có giá trị không

## Bước 5: Manual Test Flow
1. Đăng nhập với tài khoản seeker
2. Đi đến `/payment`
3. Nhấn "Thanh toán ngay"
4. Theo dõi backend logs
5. Hoàn thành thanh toán trên PayOS (hoặc fake success)
6. Kiểm tra trang profile

## Các lỗi thường gặp:

### 1. Purchased package không hiển thị
- Kiểm tra database có trường `purchased_package` chưa
- Kiểm tra backend logs xem có lỗi update không
- Kiểm tra frontend console logs

### 2. Payment không được tạo
- Kiểm tra token authorization
- Kiểm tra backend logs có lỗi gì không

### 3. Payment success không hoạt động
- Kiểm tra PayOS return URL có đúng không
- Kiểm tra orderCode có được truyền đúng không

## Debug Commands:

### Check database tables:
```sql
SHOW TABLES LIKE '%payment%';
DESCRIBE seeker_profiles;
```

### Check recent payments:
```sql
SELECT * FROM payments ORDER BY created_at DESC LIMIT 5;
```

### Check seeker with purchased package:
```sql
SELECT u.name, sp.purchased_package, sp.updated_at 
FROM users u 
JOIN seeker_profiles sp ON u.user_id = sp.seeker_id 
WHERE sp.purchased_package IS NOT NULL;
```
