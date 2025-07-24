# Feature: Ẩn Messages Link cho Seeker chưa mua gói

## Tổng quan
Feature này ẩn link "Messages" trên header cho các seeker chưa mua gói học bổng. Chỉ khi seeker đã thanh toán thành công 1 trong 2 gói học bổng thì mới có thể nhìn thấy và sử dụng tính năng Messages.

## Thay đổi chính

### 1. UserContext Updates
- **File**: `frontend/src/contexts/UserContext.js`
- **Thay đổi**:
  - Thêm `purchasedPackage` vào user state
  - Thêm function `loadSeekerProfile()` để load thông tin gói đã mua
  - Thêm function `updatePurchasedPackage()` để cập nhật khi thanh toán thành công
  - Auto-load purchased package khi login (cho seeker)

### 2. Header Component Updates  
- **File**: `frontend/src/components/Header.js`
- **Thay đổi**:
  - Conditional rendering cho Messages link
  - Logic: `(user.role !== 'seeker' || user.purchasedPackage)`
  - Áp dụng cho cả desktop và mobile menu

### 3. Messages Page Protection
- **File**: `frontend/src/pages/messages.js`
- **Thay đổi**:
  - Kiểm tra purchased_package khi load page
  - Hiển thị modal yêu cầu mua gói nếu seeker chưa mua
  - Không load contacts nếu chưa có quyền truy cập

### 4. Payment Success Integration
- **File**: `frontend/src/pages/payment-success.js`
- **Thay đổi**:
  - Cập nhật UserContext khi thanh toán thành công
  - Lấy packageId từ localStorage và cập nhật vào context

### 5. User Profile Integration
- **File**: `frontend/src/pages/user-profile.js`
- **Thay đổi**:
  - Sync purchased_package từ API response vào UserContext
  - Đảm bảo consistency giữa profile data và context

### 6. Purchase Required Modal
- **Files**: 
  - `frontend/src/components/PurchaseRequiredModal.js`
  - `frontend/src/css/PurchaseRequiredModal.css`
- **Thay đổi**:
  - Modal component để thông báo yêu cầu mua gói
  - Hiển thị lợi ích và link đến trang payment
  - Responsive design và UX friendly

## Logic Flow

### 1. Khi user login:
```
Login → JWT decode → Set user state → 
If seeker → loadSeekerProfile() → Update purchasedPackage
```

### 2. Khi render Header:
```
Check user.role === 'seeker' → 
If true: Check user.purchasedPackage → 
If exists: Show Messages link
If not exists: Hide Messages link
If not seeker: Always show Messages link
```

### 3. Khi truy cập /messages:
```
Load page → Check auth → 
If seeker AND no purchasedPackage → Show modal → Redirect to home
If seeker AND has purchasedPackage → Load normal
If not seeker → Load normal
```

### 4. Khi thanh toán thành công:
```
Payment success → Call API confirm → 
If success → Update backend → 
Frontend: updatePurchasedPackage() → Header re-renders → Messages link appears
```

## API Dependencies

### Backend APIs sử dụng:
- `POST /api/seeker/profile` - Lấy thông tin seeker bao gồm purchased_package
- `POST /api/payos/payment-success` - Confirm thanh toán và update purchased_package

### Database Fields:
- `seeker_profiles.purchased_package` - Lưu package_id đã mua

## Testing

### Test Cases:
1. **Seeker chưa mua gói**:
   - Messages link bị ẩn ✓
   - Truy cập /messages hiển thị modal ✓
   - Modal có link đến /payment ✓

2. **Seeker đã mua gói**:
   - Messages link hiển thị ✓  
   - Có thể truy cập /messages bình thường ✓
   - Profile page hiển thị gói đã mua ✓

3. **Staff/Admin**:
   - Messages link luôn hiển thị ✓
   - Không bị ảnh hưởng bởi purchased_package ✓

4. **Payment Flow**:
   - Sau khi thanh toán thành công → Messages link xuất hiện ngay ✓
   - UserContext được cập nhật realtime ✓

### Test Commands:
```bash
# Chạy test script
./test-messages-feature.sh

# Kiểm tra database
mysql -u root -p
USE swp391_gr6;
SELECT u.user_id, u.name, sp.purchased_package 
FROM users u 
LEFT JOIN seeker_profiles sp ON u.user_id = sp.seeker_id 
WHERE u.role = 'seeker';
```

## Browser Console Testing

### Debug Commands:
```javascript
// Kiểm tra UserContext state
console.log('User context:', user);
console.log('Purchased package:', user.purchasedPackage);

// Kiểm tra header logic
console.log('Show messages:', user.role !== 'seeker' || user.purchasedPackage);
```

## Compatibility

### Supported Browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Responsive Design:
- Desktop: Full functionality
- Tablet: Drawer menu support
- Mobile: Touch-friendly modal

## Troubleshooting

### Vấn đề thường gặp:

1. **Messages link không ẩn**:
   - Kiểm tra user.role === 'seeker'
   - Kiểm tra user.purchasedPackage có null không
   - Check browser console cho errors

2. **Modal không hiển thị**:
   - Kiểm tra import PurchaseRequiredModal
   - Kiểm tra CSS file được load
   - Check showPurchaseModal state

3. **Purchased package không cập nhật**:
   - Kiểm tra API response từ /seeker/profile
   - Kiểm tra updatePurchasedPackage function
   - Check localStorage pendingPayment

### Debug Steps:
1. Open Developer Tools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls
4. Check Application tab for localStorage
5. Check Elements tab for DOM changes

## Future Enhancements

### Possible improvements:
1. Add loading states cho purchased_package
2. Add error handling cho API failures  
3. Add toast notifications khi package được cập nhật
4. Add package expiration dates
5. Add package upgrade/downgrade options

## Security Considerations

### Client-side checks chỉ cho UX:
- Server-side validation vẫn cần thiết
- JWT token validation
- API endpoint protection
- Database constraints

### Notes:
- Feature này chỉ ẩn UI elements
- Backend APIs vẫn cần implement proper authorization
- Không thay thế server-side security
