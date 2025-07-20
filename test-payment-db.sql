-- Script để test payment system
-- Chạy script này để kiểm tra các bảng và dữ liệu

USE swp391_gr6;

-- 1. Kiểm tra bảng payment_packages có tồn tại không
SHOW TABLES LIKE 'payment_packages';

-- 2. Kiểm tra bảng payments có tồn tại không  
SHOW TABLES LIKE 'payments';

-- 3. Kiểm tra cấu trúc bảng seeker_profiles có trường purchased_package chưa
DESCRIBE seeker_profiles;

-- 4. Kiểm tra dữ liệu trong payment_packages
SELECT * FROM payment_packages;

-- 5. Kiểm tra dữ liệu trong payments (nếu có)
SELECT * FROM payments ORDER BY created_at DESC LIMIT 5;

-- 6. Kiểm tra seeker_profiles có purchased_package nào chưa
SELECT seeker_id, purchased_package, created_at, updated_at 
FROM seeker_profiles 
WHERE purchased_package IS NOT NULL;

-- 7. Kiểm tra user cụ thể (thay 'USER_ID_HERE' bằng user id thực tế)
-- SELECT u.user_id, u.name, u.email, sp.purchased_package
-- FROM users u 
-- LEFT JOIN seeker_profiles sp ON u.user_id = sp.seeker_id
-- WHERE u.user_id = 'USER_ID_HERE';

-- 8. Tìm tất cả users có purchased_package
SELECT u.user_id, u.name, u.email, sp.purchased_package, sp.updated_at
FROM users u 
INNER JOIN seeker_profiles sp ON u.user_id = sp.seeker_id
WHERE sp.purchased_package IS NOT NULL
ORDER BY sp.updated_at DESC;
