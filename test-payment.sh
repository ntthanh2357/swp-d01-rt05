#!/bin/bash

# Script để test chức năng thanh toán
echo "Testing Payment System..."

# 1. Chạy database script để tạo bảng mới
echo "1. Setting up database tables..."
echo "Please run the updated database.sql file to create payment tables."

# 2. Khởi động backend
echo "2. Starting backend..."
cd demo
mvn spring-boot:run &
BACKEND_PID=$!

# Đợi backend khởi động
sleep 30

# 3. Khởi động frontend
echo "3. Starting frontend..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "System started successfully!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Test flow:"
echo "1. Open http://localhost:3000/payment"
echo "2. Login as a seeker"
echo "3. Click 'Thanh toán ngay' on any package"
echo "4. Complete payment on PayOS page"
echo "5. Check seeker profile to see purchased package"
echo ""
echo "To stop:"
echo "kill $BACKEND_PID $FRONTEND_PID"
