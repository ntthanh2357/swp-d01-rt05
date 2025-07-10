# PayOS-Hosted Page Integration Guide

## Overview
Tôi đã chỉnh sửa dự án của bạn để sử dụng PayOS-Hosted Page theo đúng hướng dẫn. Thay vì sử dụng embedded checkout, bây giờ khách hàng sẽ được chuyển hướng đến trang thanh toán của PayOS.

## Thay đổi được thực hiện

### 1. Backend (Spring Boot)

#### 1.1 Thêm dependency PayOS vào `demo/pom.xml`:
```xml
<!-- PayOS Dependencies -->
<dependency>
    <groupId>com.github.payOSHQ</groupId>
    <artifactId>payos-java</artifactId>
    <version>1.0.0</version>
</dependency>
```

#### 1.2 Tạo PayOSController mới:
- File: `demo/src/main/java/com/swp391_g6/demo/controller/PayOSController.java`
- Endpoints:
  - `POST /api/payos/create-payment-link` - Tạo link thanh toán
  - `GET /api/payos/payment-info/{orderCode}` - Lấy thông tin thanh toán
  - `POST /api/payos/confirm-webhook` - Xử lý webhook từ PayOS

#### 1.3 Configuration trong `application.properties`:
```properties
# PayOS đã có sẵn
payos.client-id=45489869-c0a7-493d-a7ed-361492efae9a
payos.api-key=7bd7da70-4a04-494b-a444-cd538847ec47
payos.checksum-key=b787b5f4bd83fbf7d5067202bf22d11a730de7b14b164465c95d7052d6a17235
```

### 2. Frontend (React)

#### 2.1 Chỉnh sửa `frontend/src/pages/payment.js`:
- Xóa bỏ `usePayOS` embedded checkout
- Chuyển sang sử dụng `window.location.href` để redirect đến PayOS hosted page
- Sử dụng proxy để gọi API backend

#### 2.2 Tạo trang thành công và hủy thanh toán:
- `frontend/src/pages/payment-success.js` - Trang thanh toán thành công
- `frontend/src/pages/payment-cancel.js` - Trang hủy thanh toán

#### 2.3 Thêm routes mới vào `App.js`:
```jsx
<Route path="/payment-success" element={<PaymentSuccess />} />
<Route path="/payment-cancel" element={<PaymentCancel />} />
```

#### 2.4 Thêm proxy vào `package.json`:
```json
"proxy": "http://localhost:8080"
```

## Cách chạy dự án

### 1. Chạy Backend:
```bash
cd demo
./mvnw spring-boot:run
```

### 2. Chạy Frontend:
```bash
cd frontend
npm start
```

### 3. Hoặc chạy cả hai cùng lúc:
```bash
cd frontend
npm run dev
```

## Flow thanh toán mới

1. **Khách hàng chọn gói** trên trang `/payment`
2. **Frontend gửi request** đến backend tạo payment link
3. **Backend tạo payment link** qua PayOS API và trả về checkout URL
4. **Frontend redirect** khách hàng đến PayOS hosted page
5. **Khách hàng thanh toán** trên trang PayOS
6. **PayOS redirect** về:
   - `/payment-success?orderCode=xxx&status=PAID` nếu thành công
   - `/payment-cancel` nếu hủy

## Return URLs được cấu hình:
- **Success**: `http://localhost:3000/payment-success`
- **Cancel**: `http://localhost:3000/payment-cancel`

## Testing

1. Truy cập `http://localhost:3000/payment`
2. Chọn một gói thanh toán
3. Nhấn "Thanh toán"
4. Sẽ được chuyển hướng đến trang PayOS
5. Có thể test thanh toán hoặc hủy để xem flow hoạt động

## Lưu ý quan trọng

1. **PayOS credentials**: Hiện tại sử dụng test credentials, cần thay đổi khi deploy production
2. **URLs**: Return URLs hiện đang hard-code là localhost, cần thay đổi khi deploy
3. **Webhook**: Endpoint `/api/payos/confirm-webhook` đã sẵn sàng để nhận webhook từ PayOS
4. **Security**: Cần implement signature verification cho webhook trong production

## Dependencies có thể cần cài thêm

Nếu gặp lỗi build, có thể cần cài thêm:
```bash
# Frontend
cd frontend
npm install

# Backend - rebuild nếu cần
cd demo
./mvnw clean install
```

Dự án của bạn bây giờ đã hoàn toàn tuân theo PayOS-Hosted Page pattern như yêu cầu!
