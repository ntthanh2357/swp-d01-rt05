#!/bin/bash

# Test script để kiểm tra chức năng ẩn/hiện Messages link
echo "=== Test Payment và Messages Feature ==="
echo ""

echo "1. Khởi động backend và frontend (nếu chưa chạy):"
echo "   Backend: cd demo && mvn spring-boot:run"
echo "   Frontend: cd frontend && npm start"
echo ""

echo "2. Test Steps:"
echo "   a. Đăng nhập với tài khoản seeker chưa mua gói"
echo "   b. Kiểm tra Header - Messages link sẽ bị ẩn"
echo "   c. Cố gắng truy cập /messages - sẽ hiển thị modal yêu cầu mua gói"
echo "   d. Thực hiện thanh toán gói"
echo "   e. Kiểm tra Messages link xuất hiện sau khi thanh toán"
echo ""

echo "3. Test Database để kiểm tra purchased_package:"
echo "   MySQL Query:"
echo "   SELECT u.user_id, u.name, u.email, sp.purchased_package"
echo "   FROM users u"
echo "   LEFT JOIN seeker_profiles sp ON u.user_id = sp.seeker_id"
echo "   WHERE u.role = 'seeker';"
echo ""

echo "4. Test Console Logs:"
echo "   - Mở Developer Tools (F12)"
echo "   - Kiểm tra Console tab để xem purchased_package logs"
echo "   - Đi đến /profile để xem profile data"
echo ""

echo "5. Expected Behavior:"
echo "   - Seeker chưa mua gói: Messages link ẩn"
echo "   - Seeker đã mua gói: Messages link hiện"
echo "   - Admin/Staff: Messages link luôn hiện"
echo "   - Modal xuất hiện khi seeker chưa mua gói truy cập /messages"
echo ""

echo "=== End Test Instructions ==="
