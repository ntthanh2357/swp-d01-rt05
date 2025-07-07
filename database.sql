-- ===================================================================
-- SCHOLARSHIP CONNECTION PLATFORM - DATABASE SCHEMA
-- MySQL Database Design
-- ===================================================================

-- Create Database
CREATE DATABASE swp391_gr6;
USE swp391_gr6;

-- ===================================================================
-- USER MANAGEMENT TABLES
-- ===================================================================

-- Users table (Base table for all user types)
CREATE TABLE users (
    user_id VARCHAR(15) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'seeker') NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DESC users;

INSERT INTO users (user_id, email, password_hash, role, name, phone, date_of_birth, gender, created_at, updated_at) VALUES
('USER0000000007', 'hoangminh123@gmail.com', '$2a$10$vK7xQpL9mN2oR5sT8uV1wXyZ3a4b5c6d7e8f9g0h1i2j3k4l5m6n', 'seeker', 'Hoàng Minh', '0901234567', '1995-03-15', 'male', '2025-05-30 08:00:00', '2025-05-30 08:00:00'),
('USER0000000008', 'thihang.nguyen@gmail.com', '$2a$10$aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4a5b6c7d8e9f0g', 'seeker', 'Nguyễn Thị Hằng', '0912345678', '1992-07-22', 'female', '2025-05-30 08:15:00', '2025-05-30 08:15:00'),
('USER0000000009', 'ducthang.le@gmail.com', '$2a$10$bC3dE4fG5hI6jK7lM8nO9pQ0rS1tU2vW3xY4zA5b6c7d8e9f0g1h', 'seeker', 'Lê Đức Thắng', '0923456789', '1988-12-10', 'male', '2025-05-30 08:30:00', '2025-05-30 08:30:00'),
('USER0000000010', 'mai.pham2000@gmail.com', '$2a$10$cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5aB6c7d8e9f0g1h2i', 'seeker', 'Phạm Thị Mai', '0934567890', '2000-01-05', 'female', '2025-05-30 08:45:00', '2025-05-30 08:45:00'),
('USER0000000011', 'vanloc.tran@gmail.com', '$2a$10$dE5fG6hI7jK8lM9nO0pQ1rS2tU3vW4xY5zA6b7c8d9e0f1g2h3i4', 'seeker', 'Trần Văn Lộc', '0945678901', '1985-09-18', 'male', '2025-05-30 09:00:00', '2025-05-30 09:00:00'),
('USER0000000012', 'thuyhien.vo@gmail.com', '$2a$10$eF6gH7iJ8kL9mN0oP1qR2sT3uV4wX5yZ6aB7c8d9e0f1g2h3i4j5', 'seeker', 'Võ Thúy Hiền', '0956789012', '1993-05-30', 'female', '2025-05-30 09:15:00', '2025-05-30 09:15:00'),
('USER0000000013', 'anhkiet.do@gmail.com', '$2a$10$fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7b8c9d0e1f2g3h4i5j6k', 'seeker', 'Đỗ Anh Kiệt', '0967890123', '1990-11-12', 'male', '2025-05-30 09:30:00', '2025-05-30 09:30:00'),
('USER0000000014', 'linhchi.bui@gmail.com', '$2a$10$gH8iJ9kL0mN1oP2qR3sT4uV5wX6yZ7aB8c9d0e1f2g3h4i5j6k7l', 'seeker', 'Bùi Linh Chi', '0978901234', '1996-02-28', 'female', '2025-05-30 09:45:00', '2025-05-30 09:45:00'),
('USER0000000015', 'quanghuy.ngo@gmail.com', '$2a$10$hI9jK0lM1nO2pQ3rS4tU5vW6xY7zA8b9c0d1e2f3g4h5i6j7k8l9', 'seeker', 'Ngô Quang Huy', '0989012345', '1987-08-14', 'male', '2025-05-30 10:00:00', '2025-05-30 10:00:00'),
('USER0000000017', 'thanhtung.vu@gmail.com', '$2a$10$jK1lM2nO3pQ4rS5tU6vW7xY8zA9b0c1d2e3f4g5h6i7j8k9l0m1n', 'seeker', 'Vũ Thành Tùng', '0901234568', '1994-04-20', 'male', '2025-05-30 10:30:00', '2025-05-30 10:30:00'),
('USER0000000018', 'thuylinh.hoang@gmail.com', '$2a$10$kL2mN3oP4qR5sT6uV7wX8yZ9aB0c1d2e3f4g5h6i7j8k9l0m1n2o', 'seeker', 'Hoàng Thúy Linh', '0912345679', '1989-10-03', 'female', '2025-05-30 10:45:00', '2025-05-30 10:45:00'),
('USER0000000019', 'ducmanh.ly@gmail.com', '$2a$10$lM3nO4pQ5rS6tU7vW8xY9zA0b1c2d3e4f5g6h7i8j9k0l1m2n3o4', 'seeker', 'Lý Đức Mạnh', '0923456780', '1986-12-25', 'male', '2025-05-30 11:00:00', '2025-05-30 11:00:00'),
('USER0000000020', 'haiyen.cao@gmail.com', '$2a$10$mN4oP5qR6sT7uV8wX9yZ0aB1c2d3e4f5g6h7i8j9k0l1m2n3o4p5', 'seeker', 'Cao Hải Yến', '0934567881', '1997-01-16', 'female', '2025-05-30 11:15:00', '2025-05-30 11:15:00'),
('USER0000000021', 'vanphuc.ta@gmail.com', '$2a$10$nO5pQ6rS7tU8vW9xY0zA1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q', 'seeker', 'Tạ Văn Phúc', '0945678902', '1983-07-09', 'male', '2025-05-30 11:30:00', '2025-05-30 11:30:00'),
('USER0000000022', 'kimoanh.dinh@gmail.com', '$2a$10$oP6qR7sT8uV9wX0yZ1aB2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r', 'seeker', 'Đinh Kim Oanh', '0956789013', '1992-03-11', 'female', '2025-05-30 11:45:00', '2025-05-30 11:45:00'),
('USER0000000023', 'tuananh.mai@gmail.com', '$2a$10$pQ7rS8tU9vW0xY1zA2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s', 'seeker', 'Mai Tuấn Anh', '0967890124', '1995-11-24', 'male', '2025-05-30 12:00:00', '2025-05-30 12:00:00'),
('USER0000000024', 'thanhthao.le@gmail.com', '$2a$10$qR8sT9uV0wX1yZ2aB3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t', 'seeker', 'Lê Thanh Thảo', '0978901235', '1988-05-13', 'female', '2025-05-30 12:15:00', '2025-05-30 12:15:00'),
('USER0000000025', 'minhhieu.phan@gmail.com', '$2a$10$rS9tU0vW1xY2zA3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2', 'seeker', 'Phan Minh Hiếu', '0989012346', '1990-09-02', 'male', '2025-05-30 12:30:00', '2025-05-30 12:30:00'),
('USER0000000026', 'phuongthao.vu@gmail.com', '$2a$10$sT0uV1wX2yZ3aB4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3', 'seeker', 'Vũ Phương Thảo', '0990123457', '1994-08-17', 'female', '2025-05-30 12:45:00', '2025-05-30 12:45:00'),
('USER0000000027', 'duchung.nguyen@gmail.com', '$2a$10$tU1vW2xY3zA4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v', 'seeker', 'Nguyễn Đức Hùng', '0901234569', '1987-02-06', 'male', '2025-05-30 13:00:00', '2025-05-30 13:00:00'),
('USER0000000028', 'lanhuong.tran@gmail.com', '$2a$10$uV2wX3yZ4aB5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w', 'seeker', 'Trần Lan Hương', '0912345680', '1993-12-19', 'female', '2025-05-30 13:15:00', '2025-05-30 13:15:00'),
('USER0000000029', 'hongson.do@gmail.com', '$2a$10$vW3xY4zA5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7', 'seeker', 'Đỗ Hồng Sơn', '0923456781', '1985-06-08', 'male', '2025-05-30 13:30:00', '2025-05-30 13:30:00'),
('USER0000000031', 'vandat.ngo@gmail.com', '$2a$10$xY5zA6b7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y', 'seeker', 'Ngô Văn Đạt', '0945678903', '1989-04-14', 'male', '2025-05-30 14:00:00', '2025-05-30 14:00:00'),
('USER0000000032', 'thuyvan.dang@gmail.com', '$2a$10$yZ6aB7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z', 'seeker', 'Đặng Thúy Vân', '0956789014', '1991-01-27', 'female', '2025-05-30 14:15:00', '2025-05-30 14:15:00'),
('USER0000000033', 'quoctuan.hoang@gmail.com', '$2a$10$zA7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2', 'seeker', 'Hoàng Quốc Tuấn', '0967890125', '1984-08-21', 'male', '2025-05-30 14:30:00', '2025-05-30 14:30:00'),
('USER0000000034', 'thanhmai.ly@gmail.com', '$2a$10$aB8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3', 'seeker', 'Lý Thanh Mai', '0978901236', '1992-05-04', 'female', '2025-05-30 14:45:00', '2025-05-30 14:45:00'),
('USER0000000035', 'minhtuan.cao@gmail.com', '$2a$10$bC9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4', 'seeker', 'Cao Minh Tuấn', '0989012347', '1988-11-16', 'male', '2025-05-30 15:00:00', '2025-05-30 15:00:00'),
('USER0000000036', 'huongly.ta@gmail.com', '$2a$10$cD0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5', 'seeker', 'Tạ Hương Ly', '0990123458', '1995-07-29', 'female', '2025-05-30 15:15:00', '2025-05-30 15:15:00'),
('USER0000000037', 'vanlong.dinh@gmail.com', '$2a$10$dE1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6', 'seeker', 'Đinh Văn Long', '0901234570', '1986-03-12', 'male', '2025-05-30 15:30:00', '2025-05-30 15:30:00'),
('USER0000000038', 'bichngoc.mai@gmail.com', '$2a$10$eF2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7', 'seeker', 'Mai Bích Ngọc', '0912345681', '1993-09-25', 'female', '2025-05-30 15:45:00', '2025-05-30 15:45:00'),
('USER0000000039', 'thanhduc.le@gmail.com', '$2a$10$fG3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8', 'seeker', 'Lê Thành Đức', '0923456782', '1990-12-18', 'male', '2025-05-30 16:00:00', '2025-05-30 16:00:00'),
('USER0000000040', 'kimchi.phan@gmail.com', '$2a$10$gH4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9', 'seeker', 'Phan Kim Chi', '0934567883', '1987-06-01', 'female', '2025-05-30 16:15:00', '2025-05-30 16:15:00'),
('USER0000000041', 'anhquan.vu@gmail.com', '$2a$10$hI5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0', 'seeker', 'Vũ Anh Quân', '0945678904', '1994-02-14', 'male', '2025-05-30 16:30:00', '2025-05-30 16:30:00'),
('USER0000000042', 'thuyduong.nguyen@gmail.com', '$2a$10$iJ6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1', 'seeker', 'Nguyễn Thúy Dương', '0956789015', '1991-10-07', 'female', '2025-05-30 16:45:00', '2025-05-30 16:45:00'),
('USER0000000043', 'ducvinh.tran@gmail.com', '$2a$10$jK7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2', 'seeker', 'Trần Đức Vinh', '0967890126', '1985-04-30', 'male', '2025-05-30 17:00:00', '2025-05-30 17:00:00'),
('USER0000000044', 'hanhphuc.do@gmail.com', '$2a$10$kL8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3', 'seeker', 'Đỗ Hạnh Phúc', '0978901237', '1996-08-23', 'female', '2025-05-30 17:15:00', '2025-05-30 17:15:00'),
('USER0000000045', 'vanminh.bui@gmail.com', '$2a$10$lM9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4', 'seeker', 'Bùi Văn Minh', '0989012348', '1989-12-06', 'male', '2025-05-30 17:30:00', '2025-05-30 17:30:00'),
('USER0000000046', 'anhthuy.ngo@gmail.com', '$2a$10$mN0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5', 'seeker', 'Ngô Ánh Thúy', '0990123459', '1992-01-19', 'female', '2025-05-30 17:45:00', '2025-05-30 17:45:00'),
('USER0000000047', 'tiendat.dang@gmail.com', '$2a$10$nO1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6', 'seeker', 'Đặng Tiến Đạt', '0901234571', '1988-07-02', 'male', '2025-05-30 18:00:00', '2025-05-30 18:00:00'),
('USER0000000048', 'myhanh.hoang@gmail.com', '$2a$10$oP2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7', 'seeker', 'Hoàng Mỹ Hạnh', '0912345682', '1995-03-15', 'female', '2025-05-30 18:15:00', '2025-05-30 18:15:00'),
('USER0000000049', 'quanghieu.ly@gmail.com', '$2a$10$pQ3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8', 'seeker', 'Lý Quang Hiếu', '0923456783', '1987-11-28', 'male', '2025-05-30 18:30:00', '2025-05-30 18:30:00'),
('USER0000000050', 'thanhha.cao@gmail.com', '$2a$10$qR4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9', 'seeker', 'Cao Thanh Hà', '0934567884', '1990-05-11', 'female', '2025-05-30 18:45:00', '2025-05-30 18:45:00'),
('USER0000000051', 'vanhung.ta@gmail.com', '$2a$10$rS5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0', 'seeker', 'Tạ Văn Hùng', '0945678905', '1984-09-24', 'male', '2025-05-30 19:00:00', '2025-05-30 19:00:00'),
('USER0000000052', 'thimai.dinh@gmail.com', '$2a$10$sT6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1', 'seeker', 'Đinh Thị Mai', '0956789016', '1993-01-07', 'female', '2025-05-30 19:15:00', '2025-05-30 19:15:00'),
('USER0000000053', 'minhduc.mai@gmail.com', '$2a$10$tU7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2', 'seeker', 'Mai Minh Đức', '0967890127', '1991-06-20', 'male', '2025-05-30 19:30:00', '2025-05-30 19:30:00'),
('USER0000000054', 'kimly.le@gmail.com', '$2a$10$uV8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3', 'seeker', 'Lê Kim Ly', '0978901238', '1986-10-13', 'female', '2025-05-30 19:45:00', '2025-05-30 19:45:00'),
('USER0000000055', 'thanhtai.phan@gmail.com', '$2a$10$vW9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4', 'seeker', 'Phan Thanh Tài', '0989012349', '1994-04-26', 'male', '2025-05-30 20:00:00', '2025-05-30 20:00:00'),
('USER0000000056', 'thuytrang.vu@gmail.com', '$2a$10$wX0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5', 'seeker', 'Vũ Thúy Trang', '0990123460', '1988-12-09', 'female', '2025-05-30 20:15:00', '2025-05-30 20:15:00'),
('USER0000000057', 'vanthanh.nguyen@gmail.com', '$2a$10$xY1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6', 'seeker', 'Nguyễn Văn Thành', '0901234572', '1985-08-22', 'male', '2025-05-30 20:30:00', '2025-05-30 20:30:00'),
('USER0000000058', 'hongvan.tran@gmail.com', '$2a$10$yZ2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7', 'seeker', 'Trần Hồng Vân', '0912345683', '1992-02-05', 'female', '2025-05-30 20:45:00', '2025-05-30 20:45:00'),
('USER0000000059', 'ducthuan.do@gmail.com', '$2a$10$zA3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8', 'seeker', 'Đỗ Đức Thuần', '0923456784', '1989-06-18', 'male', '2025-05-30 21:00:00', '2025-05-30 21:00:00'),
('USER0000000060', 'thanhthuy.bui@gmail.com', '$2a$10$aB4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9', 'seeker', 'Bùi Thanh Thúy', '0934567885', '1996-10-01', 'female', '2025-05-30 21:15:00', '2025-05-30 21:15:00'),
('USER0000000061', 'anhtu.ngo@gmail.com', '$2a$10$bC5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0', 'seeker', 'Ngô Anh Tú', '0945678906', '1987-03-14', 'male', '2025-05-30 21:30:00', '2025-05-30 21:30:00'),
('USER0000000062', 'myduyen.dang@gmail.com', '$2a$10$cD6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1', 'seeker', 'Đặng Mỹ Duyên', '0956789017', '1991-07-27', 'female', '2025-05-30 21:45:00', '2025-05-30 21:45:00'),
('USER0000000063', 'vantuan.hoang@gmail.com', '$2a$10$dE7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2', 'seeker', 'Hoàng Văn Tuấn', '0967890128', '1983-11-10', 'male', '2025-05-30 22:00:00', '2025-05-30 22:00:00'),
('USER0000000064', 'thuylinh.ly@gmail.com', '$2a$10$eF8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3', 'seeker', 'Lý Thúy Linh', '0978901239', '1995-05-23', 'female', '2025-05-30 22:15:00', '2025-05-30 22:15:00'),
('USER0000000065', 'ducnam.cao@gmail.com', '$2a$10$fG9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4', 'seeker', 'Cao Đức Nam', '0989012350', '1990-09-06', 'male', '2025-05-30 22:30:00', '2025-05-30 22:30:00'),
('USER0000000066', 'kimoanh.ta@gmail.com', '$2a$10$gH0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5', 'seeker', 'Tạ Kim Oanh', '0990123461', '1992-01-19', 'female', '2025-05-30 22:45:00', '2025-05-30 22:45:00'),
('USER0000000067', 'minhhieu.dinh@gmail.com', '$2a$10$hI1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6', 'seeker', 'Đinh Minh Hiếu', '0901234573', '1988-04-02', 'male', '2025-05-30 23:00:00', '2025-05-30 23:00:00'),
('USER0000000068', 'thanhthao.mai@gmail.com', '$2a$10$iJ2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7', 'seeker', 'Mai Thanh Thảo', '0912345684', '1994-08-15', 'female', '2025-05-30 23:15:00', '2025-05-30 23:15:00'),
('USER0000000069', 'quangdung.le@gmail.com', '$2a$10$jK3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8', 'seeker', 'Lê Quang Dũng', '0923456785', '1986-12-28', 'male', '2025-05-30 23:30:00', '2025-05-30 23:30:00'),
('USER0000000070', 'bichngoc.phan@gmail.com', '$2a$10$kL4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9', 'seeker', 'Phan Bích Ngọc', '0934567886', '1993-06-11', 'female', '2025-05-30 23:45:00', '2025-05-30 23:45:00'),
('USER0000000071', 'vanhieu.vu@gmail.com', '$2a$10$lM5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0', 'seeker', 'Vũ Văn Hiếu', '0945678907', '1989-02-24', 'male', '2025-05-31 00:00:00', '2025-05-31 00:00:00'),
('USER0000000072', 'anhthuy.nguyen@gmail.com', '$2a$10$mN6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1', 'seeker', 'Nguyễn Ánh Thúy', '0956789018', '1991-10-07', 'female', '2025-05-31 00:15:00', '2025-05-31 00:15:00'),
('USER0000000073', 'ducthang.tran@gmail.com', '$2a$10$nO7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2', 'seeker', 'Trần Đức Thắng', '0967890129', '1987-05-20', 'male', '2025-05-31 00:30:00', '2025-05-31 00:30:00'),
('USER0000000074', 'myhanh.do@gmail.com', '$2a$10$oP8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3', 'seeker', 'Đỗ Mỹ Hạnh', '0978901240', '1995-01-03', 'female', '2025-05-31 00:45:00', '2025-05-31 00:45:00'),
('USER0000000075', 'thanhduy.bui@gmail.com', '$2a$10$pQ9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4', 'seeker', 'Bùi Thanh Duy', '0989012351', '1984-09-16', 'male', '2025-05-31 01:00:00', '2025-05-31 01:00:00'),
('USER0000000076', 'thuyhien.ngo@gmail.com', '$2a$10$qR0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5', 'seeker', 'Ngô Thúy Hiền', '0990123462', '1992-07-29', 'female', '2025-05-31 01:15:00', '2025-05-31 01:15:00'),
('USER0000000077', 'vancuong.dang@gmail.com', '$2a$10$rS1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6', 'seeker', 'Đặng Văn Cường', '0901234574', '1988-03-12', 'male', '2025-05-31 01:30:00', '2025-05-31 01:30:00'),
('USER0000000078', 'kimchi.hoang@gmail.com', '$2a$10$sT2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7', 'seeker', 'Hoàng Kim Chi', '0912345685', '1996-11-25', 'female', '2025-05-31 01:45:00', '2025-05-31 01:45:00'),
('USER0000000079', 'minh.ly@gmail.com', '$2a$10$tU3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8', 'seeker', 'Lý Minh', '0923456786', '1985-07-08', 'male', '2025-05-31 02:00:00', '2025-05-31 02:00:00'),
('USER0000000080', 'thanhlan.cao@gmail.com', '$2a$10$uV4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9', 'seeker', 'Cao Thanh Lan', '0934567887', '1990-04-21', 'female', '2025-05-31 02:15:00', '2025-05-31 02:15:00'),
('USER0000000081', 'ducvinh.ta@gmail.com', '$2a$10$vW5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0', 'seeker', 'Tạ Đức Vinh', '0945678908', '1987-12-04', 'male', '2025-05-31 02:30:00', '2025-05-31 02:30:00'),
('USER0000000082', 'haiyen.dinh@gmail.com', '$2a$10$wX6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1', 'seeker', 'Đinh Hải Yến', '0956789019', '1993-08-17', 'female', '2025-05-31 02:45:00', '2025-05-31 02:45:00'),
('USER0000000083', 'vanthai.mai@gmail.com', '$2a$10$xY7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2', 'seeker', 'Mai Văn Thái', '0967890130', '1989-01-30', 'male', '2025-05-31 03:00:00', '2025-05-31 03:00:00'),
('USER0000000084', 'thuynga.le@gmail.com', '$2a$10$yZ8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3', 'seeker', 'Lê Thúy Nga', '0978901241', '1994-05-13', 'female', '2025-05-31 03:15:00', '2025-05-31 03:15:00'),
('USER0000000085', 'minhhoa.phan@gmail.com', '$2a$10$zA9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4', 'seeker', 'Phan Minh Hòa', '0989012352', '1986-09-26', 'male', '2025-05-31 03:30:00', '2025-05-31 03:30:00'),
('USER0000000086', 'thuylien.vu@gmail.com', '$2a$10$aB0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5', 'seeker', 'Vũ Thúy Liên', '0990123463', '1991-02-09', 'female', '2025-05-31 03:45:00', '2025-05-31 03:45:00'),
('USER0000000087', 'vanquy.nguyen@gmail.com', '$2a$10$bC1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6', 'seeker', 'Nguyễn Văn Quý', '0901234575', '1983-06-22', 'male', '2025-05-31 04:00:00', '2025-05-31 04:00:00'),
('USER0000000088', 'hongthuy.tran@gmail.com', '$2a$10$cD2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7', 'seeker', 'Trần Hồng Thúy', '0912345686', '1995-10-05', 'female', '2025-05-31 04:15:00', '2025-05-31 04:15:00'),
('USER0000000089', 'thanhlam.do@gmail.com', '$2a$10$dE3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8', 'seeker', 'Đỗ Thanh Lâm', '0923456787', '1988-02-18', 'male', '2025-05-31 04:30:00', '2025-05-31 04:30:00'),
('USER0000000090', 'mylinh.bui@gmail.com', '$2a$10$eF4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9', 'seeker', 'Bùi Mỹ Linh', '0934567888', '1992-06-01', 'female', '2025-05-31 04:45:00', '2025-05-31 04:45:00'),
('USER0000000091', 'anhtuan.ngo@gmail.com', '$2a$10$fG5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0', 'seeker', 'Ngô Anh Tuấn', '0945678909', '1987-10-14', 'male', '2025-05-31 05:00:00', '2025-05-31 05:00:00'),
('USER0000000092', 'kimhang.dang@gmail.com', '$2a$10$gH6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1', 'seeker', 'Đặng Kim Hằng', '0956789020', '1990-12-27', 'female', '2025-05-31 05:15:00', '2025-05-31 05:15:00'),
('USER0000000093', 'vancong.hoang@gmail.com', '$2a$10$hI7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2', 'seeker', 'Hoàng Văn Công', '0967890131', '1984-04-10', 'male', '2025-05-31 05:30:00', '2025-05-31 05:30:00'),
('USER0000000094', 'thanhhuong.ly@gmail.com', '$2a$10$iJ8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3', 'seeker', 'Lý Thanh Hương', '0978901242', '1996-08-23', 'female', '2025-05-31 05:45:00', '2025-05-31 05:45:00'),
('USER0000000095', 'duckhanh.cao@gmail.com', '$2a$10$jK9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4', 'seeker', 'Cao Đức Khánh', '0989012353', '1991-01-06', 'male', '2025-05-31 06:00:00', '2025-05-31 06:00:00'),
('USER0000000096', 'thuyngoc.ta@gmail.com', '$2a$10$kL0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5', 'seeker', 'Tạ Thúy Ngọc', '0990123464', '1993-05-19', 'female', '2025-05-31 06:15:00', '2025-05-31 06:15:00'),
('USER0000000097', 'minhquan.dinh@gmail.com', '$2a$10$lM1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6', 'seeker', 'Đinh Minh Quân', '0901234576', '1985-09-02', 'male', '2025-05-31 06:30:00', '2025-05-31 06:30:00'),
('USER0000000098', 'anhdao.mai@gmail.com', '$2a$10$mN2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7', 'seeker', 'Mai Ánh Đào', '0912345687', '1994-03-15', 'female', '2025-05-31 06:45:00', '2025-05-31 06:45:00'),
('USER0000000099', 'vanlam.le@gmail.com', '$2a$10$nO3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8', 'seeker', 'Lê Văn Lâm', '0923456788', '1988-07-28', 'male', '2025-05-31 07:00:00', '2025-05-31 07:00:00'),
('USER0000000100', 'huyenmy.phan@gmail.com', '$2a$10$oP4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9', 'seeker', 'Phan Huyền My', '0934567889', '1992-11-11', 'female', '2025-05-31 07:15:00', '2025-05-31 07:15:00'),
('USER0000000101', 'ductin.vu@gmail.com', '$2a$10$pQ5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0', 'seeker', 'Vũ Đức Tín', '0945678910', '1986-04-04', 'male', '2025-05-31 07:30:00', '2025-05-31 07:30:00'),
('USER0000000102', 'thanhxuan.nguyen@gmail.com', '$2a$10$qR6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1', 'seeker', 'Nguyễn Thanh Xuân', '0956789021', '1995-12-17', 'female', '2025-05-31 07:45:00', '2025-05-31 07:45:00'),
('USER0000000103', 'anhkhoa.tran@gmail.com', '$2a$10$rS7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2', 'seeker', 'Trần Anh Khoa', '0967890132', '1989-08-30', 'male', '2025-05-31 08:00:00', '2025-05-31 08:00:00'),
('USER0000000104', 'myuyen.do@gmail.com', '$2a$10$sT8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3', 'seeker', 'Đỗ Mỹ Uyên', '0978901243', '1993-01-13', 'female', '2025-05-31 08:15:00', '2025-05-31 08:15:00'),
('USER0000000105', 'vanson.bui@gmail.com', '$2a$10$tU9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4', 'seeker', 'Bùi Văn Sơn', '0989012354', '1987-05-26', 'male', '2025-05-31 08:30:00', '2025-05-31 08:30:00'),
('USER0000000106', 'kimbang.ngo@gmail.com', '$2a$10$uV0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5', 'seeker', 'Ngô Kim Băng', '0990123465', '1991-09-09', 'female', '2025-05-31 08:45:00', '2025-05-31 08:45:00');

DESC users;

CREATE TABLE verification_tokens (
	id BIGINT PRIMARY KEY NOT NULL,
    email VARCHAR(255),
    otp_code CHAR(6),
    task VARCHAR(123),
    expires_at TIMESTAMP
);

-- Admin profiles
CREATE TABLE admin_profiles (
    admin_id VARCHAR(15) PRIMARY KEY,
    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Staff profiles
CREATE TABLE staff_profiles (
    staff_id VARCHAR(15) PRIMARY KEY,
    specialization VARCHAR(200),
    bio TEXT,
    experience_years INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    created_by VARCHAR(15),
    FOREIGN KEY (staff_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

DESC staff_profiles;

CREATE TABLE seeker_staff_mapping (
    seeker_id VARCHAR(15) NOT NULL,
    staff_id VARCHAR(15) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (seeker_id),
    FOREIGN KEY (seeker_id) REFERENCES users(user_id),
    FOREIGN KEY (staff_id) REFERENCES users(user_id)
);

ALTER TABLE seeker_staff_mapping ADD COLUMN status ENUM('active', 'inactive') DEFAULT 'active';

DESC seeker_staff_mapping;

-- ===================================================================
-- STAFF DASHBOARD TABLES
-- ===================================================================

CREATE TABLE staff_dashboard_activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_id VARCHAR(15),
    activity_type VARCHAR(50),
    activity_details TEXT,
    created_at TIMESTAMP
);

-- Bảng staff_profiles cần bổ sung thêm thuộc tính
ALTER TABLE staff_profiles
ADD COLUMN availability_status ENUM('available', 'busy', 'away', 'offline') DEFAULT 'available',
ADD COLUMN specialization_areas JSON,
ADD COLUMN working_hours JSON,
ADD COLUMN profile_completion_percentage INT DEFAULT 0;

-- Bảng counseling_cases - Quản lý các trường hợp tư vấn
CREATE TABLE counseling_cases (
    case_id VARCHAR(15) PRIMARY KEY,
    user_id VARCHAR(15) NOT NULL,
    staff_id VARCHAR(15),
    case_title VARCHAR(255) NOT NULL,
    status ENUM('open', 'in_progress', 'pending', 'resolved', 'closed') DEFAULT 'open',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    category VARCHAR(100),
    description TEXT,
    expected_resolution_date DATE,
    resolution_summary TEXT,
    time_spent_minutes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES users(user_id)
);

DESC counseling_cases;

CREATE INDEX idx_counseling_cases_status ON counseling_cases(status);
CREATE INDEX idx_counseling_cases_priority ON counseling_cases(priority);
CREATE INDEX idx_counseling_cases_staff ON counseling_cases(staff_id);

-- Bảng counseling_notes - Ghi chú của nhân viên tư vấn
CREATE TABLE counseling_notes (
    note_id VARCHAR(15) PRIMARY KEY,
    case_id VARCHAR(15) NOT NULL,
    staff_id VARCHAR(15) NOT NULL,
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES counseling_cases(case_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES users(user_id)
);

-- Bảng staff_appointments - Lịch hẹn tư vấn
CREATE TABLE staff_appointments (
    appointment_id VARCHAR(15) PRIMARY KEY,
    staff_id VARCHAR(15) NOT NULL,
    user_id VARCHAR(15) NOT NULL,
    case_id VARCHAR(15),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    appointment_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    duration_minutes INT NOT NULL,
    appointment_type ENUM('online', 'offline', 'phone', 'video') DEFAULT 'online',
    status ENUM('scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled') DEFAULT 'scheduled',
    location VARCHAR(255),
    meeting_link VARCHAR(255),
    reminder_sent BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES users(user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (case_id) REFERENCES counseling_cases(case_id) ON DELETE SET NULL
);

CREATE INDEX idx_staff_appointments_staff_id ON staff_appointments(staff_id);
CREATE INDEX idx_staff_appointments_appointment_time ON staff_appointments(appointment_time);
CREATE INDEX idx_staff_appointments_status ON staff_appointments(status);

-- Bảng staff_tasks - Quản lý công việc của nhân viên
CREATE TABLE staff_tasks (
    task_id VARCHAR(15) PRIMARY KEY,
    staff_id VARCHAR(15) NOT NULL,
    case_id VARCHAR(15),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    completion_percentage INT DEFAULT 0,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES users(user_id),
    FOREIGN KEY (case_id) REFERENCES counseling_cases(case_id) ON DELETE SET NULL
);

CREATE INDEX idx_staff_tasks_staff_id ON staff_tasks(staff_id);
CREATE INDEX idx_staff_tasks_due_date ON staff_tasks(due_date);
CREATE INDEX idx_staff_tasks_status ON staff_tasks(status);

-- Bảng message_templates - Mẫu tin nhắn cho nhân viên
CREATE TABLE message_templates (
    template_id VARCHAR(15) PRIMARY KEY,
    staff_id VARCHAR(15),
    category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_global BOOLEAN DEFAULT FALSE,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES users(user_id) ON DELETE SET NULL
);

DESC messages;

-- Bảng scholarship_recommendations - Đề xuất học bổng cho người dùng
CREATE TABLE scholarship_recommendations (
    recommendation_id VARCHAR(15) PRIMARY KEY,
    user_id VARCHAR(15) NOT NULL,
    scholarship_id VARCHAR(15) NOT NULL,
    staff_id VARCHAR(15) NOT NULL,
    note TEXT,
    reason_for_recommendation TEXT,
    relevance_score INT CHECK (relevance_score BETWEEN 1 AND 100),
    status ENUM('pending', 'viewed', 'applied', 'rejected') DEFAULT 'pending',
    viewed_at TIMESTAMP NULL,
    action_taken_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES users(user_id)
);

CREATE INDEX idx_scholarship_recommendations_user ON scholarship_recommendations(user_id);
CREATE INDEX idx_scholarship_recommendations_status ON scholarship_recommendations(status);

-- Bảng user_scholarship_progress - Tiến trình ứng tuyển học bổng của người dùng
CREATE TABLE user_scholarship_progress (
    progress_id VARCHAR(15) PRIMARY KEY,
    user_id VARCHAR(15) NOT NULL,
    scholarship_id VARCHAR(15) NOT NULL,
    staff_id VARCHAR(15),
    status ENUM('informed', 'interested', 'preparing', 'submitted', 'interview', 'accepted', 'rejected', 'waitlisted') NOT NULL DEFAULT 'informed',
    documents_status JSON,
    submission_date DATE,
    result_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_user_scholarship_progress_user ON user_scholarship_progress(user_id);
CREATE INDEX idx_user_scholarship_progress_status ON user_scholarship_progress(status);

-- Bảng staff_statistics - Thống kê hiệu suất của nhân viên
CREATE TABLE staff_statistics (
    statistic_id VARCHAR(15) PRIMARY KEY,
    staff_id VARCHAR(15) NOT NULL,
    statistic_date DATE NOT NULL,
    cases_handled INT DEFAULT 0,
    cases_resolved INT DEFAULT 0,
    messages_sent INT DEFAULT 0,
    average_response_time_minutes INT,
    appointments_completed INT DEFAULT 0,
    tasks_completed INT DEFAULT 0,
    recommendations_made INT DEFAULT 0,
    user_satisfaction_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES users(user_id) ON DELETE CASCADE
);

DESC staff_statistics;

CREATE INDEX idx_staff_statistics_date ON staff_statistics(statistic_date);
CREATE INDEX idx_staff_statistics_staff_id ON staff_statistics(staff_id);

-- Bảng user_profiles_extended - Thông tin mở rộng của người dùng
CREATE TABLE user_profiles_extended (
    profile_id VARCHAR(15) PRIMARY KEY,
    user_id VARCHAR(15) NOT NULL,
    education_history JSON,
    certificates JSON,
    test_scores JSON,
    career_goals TEXT,
    funding_preference TEXT,
    preferred_countries JSON,
    preferred_programs JSON,
    preferred_start_date DATE,
    budget_range VARCHAR(50),
    special_requirements TEXT,
    profile_completion_percentage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng staff_settings - Cài đặt của nhân viên tư vấn
CREATE TABLE staff_settings (
    setting_id VARCHAR(15) PRIMARY KEY,
    staff_id VARCHAR(15) NOT NULL,
    dashboard_layout JSON,
    notification_preferences JSON,
    email_signature TEXT,
    theme_preference VARCHAR(50) DEFAULT 'light',
    auto_response_enabled BOOLEAN DEFAULT FALSE,
    auto_response_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng message_conversation_mapping - Liên kết tin nhắn với case
ALTER TABLE messages 
ADD COLUMN case_id VARCHAR(15) NULL,
ADD CONSTRAINT fk_message_case FOREIGN KEY (case_id) REFERENCES counseling_cases(case_id) ON DELETE SET NULL;

-- Bảng activity_dashboard - Hoạt động của dashboard
CREATE TABLE dashboard_activities (
    activity_id VARCHAR(15) PRIMARY KEY,
    staff_id VARCHAR(15) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    activity_details JSON,
    entity_type VARCHAR(50),
    entity_id VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_dashboard_activities_staff_id ON dashboard_activities(staff_id);
CREATE INDEX idx_dashboard_activities_created_at ON dashboard_activities(created_at);

-- Bảng user_session_feedback - Phản hồi từ người dùng sau buổi tư vấn
CREATE TABLE user_session_feedback (
    feedback_id VARCHAR(15) PRIMARY KEY,
    session_id VARCHAR(15) NOT NULL,
    user_id VARCHAR(15) NOT NULL,
    staff_id VARCHAR(15) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    feedback_text TEXT,
    improvement_suggestions TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ===================================================================
-- TRIGGERS AND PROCEDURES FOR DASHBOARD
-- ===================================================================

-- Trigger để cập nhật profile_completion_percentage của staff
DELIMITER //
CREATE TRIGGER update_staff_profile_completion BEFORE UPDATE ON staff_profiles
FOR EACH ROW
BEGIN
    DECLARE completion INT DEFAULT 0;
    
    -- Tính toán mức độ hoàn thành hồ sơ
    IF NEW.specialization IS NOT NULL THEN SET completion = completion + 25; END IF;
    IF NEW.education_level IS NOT NULL THEN SET completion = completion + 25; END IF;
    IF NEW.experience_years > 0 THEN SET completion = completion + 25; END IF;
    IF NEW.specialization_areas IS NOT NULL THEN SET completion = completion + 25; END IF;
    
    SET NEW.profile_completion_percentage = completion;
END //
DELIMITER ;

-- Trigger để cập nhật profile_completion_percentage của user_profiles_extended
DELIMITER //
CREATE TRIGGER update_user_profile_completion BEFORE UPDATE ON user_profiles_extended
FOR EACH ROW
BEGIN
    DECLARE completion INT DEFAULT 0;
    
    -- Tính toán mức độ hoàn thành hồ sơ
    IF NEW.education_history IS NOT NULL THEN SET completion = completion + 20; END IF;
    IF NEW.certificates IS NOT NULL THEN SET completion = completion + 15; END IF;
    IF NEW.test_scores IS NOT NULL THEN SET completion = completion + 15; END IF;
    IF NEW.career_goals IS NOT NULL THEN SET completion = completion + 20; END IF;
    IF NEW.preferred_countries IS NOT NULL THEN SET completion = completion + 15; END IF;
    IF NEW.budget_range IS NOT NULL THEN SET completion = completion + 15; END IF;
    
    SET NEW.profile_completion_percentage = completion;
END //
DELIMITER ;

-- Procedure để tạo báo cáo hiệu suất hàng ngày cho staff
DELIMITER //
CREATE PROCEDURE generate_staff_daily_statistics()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE staff_user_id VARCHAR(15);
    DECLARE cur CURSOR FOR SELECT user_id FROM users WHERE role = 'staff';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO staff_user_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Tạo hoặc cập nhật thống kê cho ngày hôm nay
        INSERT INTO staff_statistics (
            statistic_id,
            staff_id,
            statistic_date,
            cases_handled,
            cases_resolved,
            messages_sent,
            average_response_time_minutes,
            appointments_completed,
            tasks_completed,
            recommendations_made
        )
        SELECT 
            CONCAT('STAT', LPAD(FLOOR(RAND() * 1000000), 7, '0')),
            staff_user_id,
            CURDATE(),
            (SELECT COUNT(*) FROM counseling_cases WHERE staff_id = staff_user_id AND DATE(created_at) = CURDATE()),
            (SELECT COUNT(*) FROM counseling_cases WHERE staff_id = staff_user_id AND status = 'resolved' AND DATE(closed_at) = CURDATE()),
            (SELECT COUNT(*) FROM messages WHERE sender_id = staff_user_id AND DATE(created_at) = CURDATE()),
            (SELECT AVG(TIMESTAMPDIFF(MINUTE, c.created_at, m.created_at)) 
             FROM counseling_cases c
             JOIN messages m ON m.case_id = c.case_id
             WHERE c.staff_id = staff_user_id AND m.sender_id = staff_user_id AND DATE(m.created_at) = CURDATE()),
            (SELECT COUNT(*) FROM staff_appointments WHERE staff_id = staff_user_id AND status = 'completed' AND DATE(appointment_time) = CURDATE()),
            (SELECT COUNT(*) FROM staff_tasks WHERE staff_id = staff_user_id AND status = 'completed' AND DATE(completed_at) = CURDATE()),
            (SELECT COUNT(*) FROM scholarship_recommendations WHERE staff_id = staff_user_id AND DATE(created_at) = CURDATE())
        ON DUPLICATE KEY UPDATE
            cases_handled = VALUES(cases_handled),
            cases_resolved = VALUES(cases_resolved),
            messages_sent = VALUES(messages_sent),
            average_response_time_minutes = VALUES(average_response_time_minutes),
            appointments_completed = VALUES(appointments_completed),
            tasks_completed = VALUES(tasks_completed),
            recommendations_made = VALUES(recommendations_made);
    END LOOP;
    
    CLOSE cur;
END //
DELIMITER ;

-- Event để tự động chạy procedure generate_staff_daily_statistics mỗi ngày
CREATE EVENT IF NOT EXISTS daily_staff_statistics_generation
ON SCHEDULE EVERY 1 DAY STARTS (TIMESTAMP(CURRENT_DATE) + INTERVAL 23 HOUR)
DO
    CALL generate_staff_daily_statistics();

-- ===================================================================
-- SCHOLARSHIP MANAGEMENT TABLES
-- ===================================================================

-- Scholarship categories
CREATE TABLE scholarship_categories (
    category_id VARCHAR(15) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ví dụ insert:
INSERT INTO scholarship_categories (category_id, name, description, icon_url)
VALUES ('SCHOLARCATE0001', 'Ireland Scholarship', 'Scholarship for students learning in Ireland', 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270152/ireland_zazwfv.png'),
       ('SCHOLARCATE0002', 'New Zealand Scholarship', 'Scholarship for students learning in New Zealand', 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270662/new_zealand_o6j74h.png'),
       ('SCHOLARCATE0003', 'United States Scholarship', 'Scholarship for students learning in United States', 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270663/united_state_pzcgq7.png'),
       ('SCHOLARCATE0004', 'Australia Scholarship', 'Scholarship for students learning in Australia', 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270651/australia_xz7h10.png'),
       ('SCHOLARCATE0005', 'Canada Scholarship', 'Scholarship for students learning in Canada', 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270661/canada_sci5ef.png'),
       ('SCHOLARCATE0006', 'United Kingdom Scholarship', 'Scholarship for students learning in United Kingdom', 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270667/united_kingdom_uzwpvx.png');

INSERT INTO scholarship_categories (category_id, name, description, icon_url)
VALUES ('SCHOLARCATE0007', 'Other Scholarship', 'Other', 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270152/ireland_zazwfv.png');


-- Organizations/Sponsors
CREATE TABLE organizations (
    organization_id VARCHAR(15) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    world_rank INT,
    website_url VARCHAR(500),
    logo_url VARCHAR(500),
    number_student INT,
    avg_cost_living INT,
    address TEXT,
    country VARCHAR(100),
    organization_type ENUM('university', 'government', 'private', 'ngo'),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ví dụ insert:
INSERT INTO organizations (
    organization_id, name, description, world_rank, logo_url, number_student, avg_cost_living, country, organization_type, is_verified
) VALUES 
('ORG0000004', 'University of Oxford', 'The University of Oxford is one of the oldest and most prestigious universities in the world, consistently ranked in the top 5 globally. Oxford offers a unique tutorial system and world-class research facilities across all disciplines.', 3, 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270001/oxford_logo.png', 26000, 1200, 'United Kingdom', 'University', TRUE),
('ORG0000005', 'University of Cambridge', 'The University of Cambridge is a prestigious institution with over 800 years of academic excellence. It has produced 121 Nobel Prize winners and continues to lead in research and innovation.', 5, 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270002/cambridge_logo.png', 25000, 1200, 'United Kingdom', 'University', TRUE),
('ORG0000006', 'Imperial College London', 'Imperial College London is a world-leading university focused on science, engineering, medicine and business, consistently ranked among the top 10 universities globally.', 8, 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270003/imperial_logo.png', 20000, 1150, 'United Kingdom', 'University', TRUE),
('ORG0000007', 'Harvard University', 'Harvard University is the oldest institution of higher education in the United States and is consistently ranked as one of the top universities in the world.', 2, 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270004/harvard_logo.png', 31000, 1800, 'United States', 'University', TRUE),
('ORG0000008', 'Stanford University', 'Stanford University is a leading research university known for its entrepreneurial spirit and innovation, particularly in technology and business.', 4, 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270005/stanford_logo.png', 17000, 2000, 'United States', 'University', TRUE),
('ORG0000009', 'Massachusetts Institute of Technology', 'MIT is a world-renowned institution focused on science, technology, engineering, and mathematics, known for its cutting-edge research and innovation.', 1, 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270006/mit_logo.png', 12000, 1900, 'United States', 'University', TRUE),
('ORG0000010', 'University of Toronto', 'The University of Toronto is Canada\'s leading university and one of the world\'s top public research universities, known for academic excellence and diversity.', 25, 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270007/toronto_logo.png', 97000, 800, 'Canada', 'University', TRUE),
('ORG0000011', 'University of British Columbia', 'UBC is a global centre for research and teaching, consistently ranked among the top 20 public universities in the world.', 34, 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270008/ubc_logo.png', 68000, 900, 'Canada', 'University', TRUE),
('ORG0000012', 'Australian National University', 'ANU is Australia\'s leading university and the only university created by the Parliament of Australia, known for research excellence and policy influence.', 30, 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270009/anu_logo.png', 26000, 950, 'Australia', 'University', TRUE),
('ORG0000013', 'University of Melbourne', 'The University of Melbourne is Australia\'s second oldest university and consistently ranked as Australia\'s number one university.', 13, 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270010/melbourne_logo.png', 52000, 980, 'Australia', 'University', TRUE),
('ORG0000014', 'University of Auckland', 'The University of Auckland is New Zealand\'s leading university, ranked in the top 100 universities worldwide and known for research excellence.', 65, 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270011/auckland_logo.png', 45000, 850, 'New Zealand', 'University', TRUE),
('ORG0000015', 'Trinity College Dublin', 'Trinity College Dublin is Ireland\'s oldest university, founded in 1592, and consistently ranked as Ireland\'s leading university.', 104, 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270012/trinity_logo.png', 18000, 750, 'Ireland', 'University', TRUE),
('ORG0000016', 'Technical University of Munich', 'TUM is one of Europe\'s leading universities, known for excellence in engineering, technology, medicine, and applied sciences.', 50, 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270013/tum_logo.png', 45000, 600, 'Germany', 'University', TRUE),
('ORG0000017', 'British Council', 'The British Council is the UK\'s international organisation for cultural relations and educational opportunities, offering various scholarship programs.', NULL, 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270014/british_council_logo.png', NULL, NULL, 'United Kingdom', 'Government', TRUE),
('ORG0000018', 'Fulbright Commission', 'The Fulbright Program is the flagship international educational exchange program sponsored by the U.S. government.', NULL, 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270015/fulbright_logo.png', NULL, NULL, 'United States', 'Government', TRUE),
('ORG0000019', 'DAAD Germany', 'The German Academic Exchange Service is the largest funding organisation in the world supporting international exchange of students and researchers.', NULL, 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270016/daad_logo.png', NULL, NULL, 'Germany', 'Government', TRUE);

DESC scholarship_categories;

DESC organizations;

DESC scholarships;

-- Scholarships
CREATE TABLE scholarships (
    scholarship_id VARCHAR(15) PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    description LONGTEXT,
    organization_id VARCHAR(15) NOT NULL,
    category_id VARCHAR(15) NOT NULL,
    amount DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'USD',
    duration INT,
    application_deadline DATE,
    eligibility_criteria JSON,
    countries JSON,
    education_levels JSON,
    fields_of_study JSON,
    language_requirements JSON,
    status ENUM('draft', 'active', 'inactive', 'expired') DEFAULT 'draft',
    views_count INT DEFAULT 0,
    applications_count INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(15) NOT NULL,
    approved_by VARCHAR(15),
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id),
    FOREIGN KEY (category_id) REFERENCES scholarship_categories(category_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

DESC scholarships;

INSERT INTO scholarships (
    scholarship_id,
    title,
    description,
    organization_id,
    category_id,
    amount,
    currency,
    duration,
    application_deadline,
    eligibility_criteria,
    countries,
    education_levels,
    fields_of_study,
    language_requirements,
    status,
    views_count,
    applications_count,
    featured,
    created_by,
    approved_by,
    approved_at
) VALUES (
    'SCHOLAR0000007',
    'MSc Marketing (Dubai Campus)',
    'Our new Master of Professional Accounting and Business Performance will give you the skills and experience to bring value to any organisation in a disruptive global economy.
Co-designed with industry, this program will give you a unique, future-proofed skillset that will help you identify business opportunities and solve accounting and business problems in innovative ways to drive organisational performance.

You\'ll develop deep technical skills and progress towards accreditation requirements with CPA Australia, Chartered Accountants Australia and New Zealand (CAANZ) as well as the Association of Chartered Certified Accountants (ACCA).

You\'ll also develop the key analytics, technology and communication skills to lead in enterprise performance management, as well as build your experience with cloud-based accounting technology platforms.
And with opportunities to gain real-world experience, develop transferable career skills and explore corporate social responsibility and governance, you\'ll graduate in-demand and on track to become an ethical business leader in accounting practice, management and beyond.',
    'ORG0000003',
    'SCHOLARCATE0004',
    56500.00,
    'AUD',
    24,
    '2025-08-04',
    '{"nationality": "All international"}',
    '["Darlington, Australia"]',
    '["University"]',
    '["Masters Degree (Coursework)"]',
    '["IELTS 7.0"]',
    'active',
    0,
    0,
    TRUE,
    'USER0000000002',
    NULL,
    NULL
);

INSERT INTO scholarships (
    scholarship_id, title, description, organization_id, category_id, amount, currency, duration, 
    application_deadline, eligibility_criteria, countries, education_levels, fields_of_study, 
    language_requirements, status, views_count, applications_count, featured, created_by, approved_by, approved_at
) VALUES 

-- Oxford Scholarships
('SCHOLAR0000008', 'Rhodes Scholarship at Oxford', 'The Rhodes Scholarship is the oldest international scholarship programme, enabling outstanding young people from around the world to study at the University of Oxford. It covers all university fees, provides a living allowance, and includes travel costs.', 'ORG0000004', 'SCHOLARCATE0006', 75000.00, 'GBP', 24, '2025-10-01', '{"nationality": "Commonwealth countries, US, Germany", "age": "18-24", "academic": "First class honors or equivalent"}', '["Oxford, United Kingdom"]', '["University"]', '["Masters Degree (Research)", "Masters Degree (Coursework)"]', '["IELTS 7.5", "TOEFL 110"]', 'active', 1250, 87, TRUE, 'USER0000000002', NULL, '2025-01-15'),

('SCHOLAR0000009', 'Clarendon Scholarship - Oxford', 'The Clarendon Fund scholarships are awarded to outstanding graduate students from all around the world. They cover university and college fees in full and provide a generous living allowance.', 'ORG0000004', 'SCHOLARCATE0006', 65000.00, 'GBP', 36, '2025-01-10', '{"nationality": "All international", "academic": "Outstanding academic merit"}', '["Oxford, United Kingdom"]', '["University"]', '["Masters Degree (Research)", "PhD"]', '["IELTS 7.5", "TOEFL 110"]', 'active', 980, 156, TRUE, 'USER0000000002', NULL, '2025-01-10'),

('SCHOLAR0000010', 'Oxford-Weidenfeld and Hoffmann Scholarship', 'Leadership scholarships for students from Africa and the Middle East to pursue graduate studies at Oxford, focusing on social impact and leadership development.', 'ORG0000004', 'SCHOLARCATE0006', 60000.00, 'GBP', 24, '2025-01-15', '{"nationality": "Africa, Middle East", "leadership": "Demonstrated leadership potential"}', '["Oxford, United Kingdom"]', '["University"]', '["Masters Degree (Coursework)"]', '["IELTS 7.0", "TOEFL 100"]', 'active', 675, 89, TRUE, 'USER0000000002', NULL, '2025-01-12'),

-- Cambridge Scholarships
('SCHOLAR0000011', 'Gates Cambridge Scholarship', 'Full scholarships for outstanding applicants from countries outside the UK to pursue a full-time postgraduate degree at the University of Cambridge.', 'ORG0000005', 'SCHOLARCATE0006', 70000.00, 'GBP', 36, '2025-12-05', '{"nationality": "Non-UK international", "academic": "Outstanding academic achievement"}', '["Cambridge, United Kingdom"]', '["University"]', '["Masters Degree (Research)", "PhD"]', '["IELTS 7.5", "TOEFL 110"]', 'active', 1150, 203, TRUE, 'USER0000000002', NULL, '2025-01-08'),

('SCHOLAR0000012', 'Cambridge International Scholarship', 'Scholarships for international students pursuing PhD studies at Cambridge, focusing on research excellence and innovation.', 'ORG0000005', 'SCHOLARCATE0006', 45000.00, 'GBP', 48, '2025-12-01', '{"nationality": "All international", "research": "Strong research proposal"}', '["Cambridge, United Kingdom"]', '["University"]', '["PhD"]', '["IELTS 7.0", "TOEFL 100"]', 'active', 820, 134, FALSE, 'USER0000000002', NULL, '2025-01-05'),

-- Imperial College Scholarships
('SCHOLAR0000013', 'Imperial College PhD Scholarship', 'Full funding for outstanding international students to pursue PhD research in science, engineering, medicine or business at Imperial College London.', 'ORG0000006', 'SCHOLARCATE0006', 35000.00, 'GBP', 48, '2025-01-31', '{"nationality": "All international", "field": "STEM subjects"}', '["London, United Kingdom"]', '["University"]', '["PhD"]', '["IELTS 6.5", "TOEFL 92"]', 'active', 560, 78, FALSE, 'USER0000000002', NULL, '2025-01-20'),

('SCHOLAR0000014', 'Imperial College Excellence Scholarship', 'Merit-based scholarships for international students pursuing Masters degrees in engineering and technology.', 'ORG0000006', 'SCHOLARCATE0006', 25000.00, 'GBP', 12, '2025-03-15', '{"nationality": "All international", "academic": "First class honors"}', '["London, United Kingdom"]', '["University"]', '["Masters Degree (Coursework)"]', '["IELTS 7.0", "TOEFL 100"]', 'active', 445, 67, FALSE, 'USER0000000002', NULL, '2025-01-18'),

-- Harvard Scholarships
('SCHOLAR0000015', 'Harvard University Fellowship', 'Need-based financial aid for international graduate students across all fields of study at Harvard University.', 'ORG0000007', 'SCHOLARCATE0003', 85000.00, 'USD', 24, '2025-01-05', '{"nationality": "All international", "financial": "Demonstrated financial need"}', '["Cambridge, United States"]', '["University"]', '["Masters Degree (Research)", "PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 1456, 289, TRUE, 'USER0000000002', NULL, '2025-01-02'),

('SCHOLAR0000016', 'Harvard Kennedy School Scholarship', 'Scholarships for international students pursuing public policy and administration at Harvard Kennedy School.', 'ORG0000007', 'SCHOLARCATE0003', 75000.00, 'USD', 24, '2025-01-15', '{"nationality": "All international", "field": "Public policy, international relations"}', '["Cambridge, United States"]', '["University"]', '["Masters Degree (Coursework)"]', '["TOEFL 105", "IELTS 7.5"]', 'active', 892, 145, TRUE, 'USER0000000002', NULL, '2025-01-10'),

-- Stanford Scholarships
('SCHOLAR0000017', 'Stanford Graduate Fellowship', 'Full funding including tuition, living stipend, and health insurance for outstanding PhD students at Stanford University.', 'ORG0000008', 'SCHOLARCATE0003', 90000.00, 'USD', 60, '2025-12-01', '{"nationality": "All international", "academic": "Exceptional academic record"}', '["Stanford, United States"]', '["University"]', '["PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 1234, 234, TRUE, 'USER0000000002', NULL, '2025-01-15'),

('SCHOLAR0000018', 'Stanford Knight-Hennessy Scholars', 'Graduate-level scholarship program designed to develop a community of future global leaders with multidisciplinary perspectives.', 'ORG0000008', 'SCHOLARCATE0003', 95000.00, 'USD', 36, '2025-10-10', '{"nationality": "All international", "leadership": "Demonstrated leadership potential"}', '["Stanford, United States"]', '["University"]', '["Masters Degree (Research)", "PhD", "Professional Degree"]', '["TOEFL 105", "IELTS 7.5"]', 'active', 1678, 312, TRUE, 'USER0000000002', NULL, '2025-01-08'),

-- MIT Scholarships
('SCHOLAR0000019', 'MIT Presidential Fellowship', 'Prestigious fellowship for outstanding international graduate students in science, technology, engineering, and mathematics.', 'ORG0000009', 'SCHOLARCATE0003', 80000.00, 'USD', 48, '2025-12-15', '{"nationality": "All international", "field": "STEM subjects"}', '["Cambridge, United States"]', '["University"]', '["PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 1345, 267, TRUE, 'USER0000000002', NULL, '2025-01-12'),

('SCHOLAR0000020', 'MIT Sloan MBA Scholarship', 'Merit-based scholarships for international MBA students at MIT Sloan School of Management.', 'ORG0000009', 'SCHOLARCATE0003', 70000.00, 'USD', 24, '2025-01-07', '{"nationality": "All international", "field": "Business administration"}', '["Cambridge, United States"]', '["University"]', '["Professional Degree"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 987, 156, FALSE, 'USER0000000002', NULL, '2025-01-05'),

-- University of Toronto Scholarships
('SCHOLAR0000021', 'Lester B. Pearson International Scholarship', 'Full scholarships recognizing international students who demonstrate exceptional academic achievement and creativity.', 'ORG0000010', 'SCHOLARCATE0005', 65000.00, 'CAD', 48, '2025-01-15', '{"nationality": "All international", "academic": "Outstanding academic achievement"}', '["Toronto, Canada"]', '["University"]', '["Bachelors Degree"]', '["TOEFL 100", "IELTS 6.5"]', 'active', 1123, 187, TRUE, 'USER0000000002', NULL, '2025-01-10'),

('SCHOLAR0000022', 'University of Toronto Graduate Scholarship', 'Financial support for international graduate students across all disciplines at the University of Toronto.', 'ORG0000010', 'SCHOLARCATE0005', 45000.00, 'CAD', 24, '2025-02-01', '{"nationality": "All international", "academic": "Strong academic background"}', '["Toronto, Canada"]', '["University"]', '["Masters Degree (Research)", "PhD"]', '["TOEFL 93", "IELTS 7.0"]', 'active', 789, 123, FALSE, 'USER0000000002', NULL, '2025-01-08'),

-- UBC Scholarships
('SCHOLAR0000023', 'UBC International Leader of Tomorrow Award', 'Scholarships for exceptional international students who demonstrate superior academic achievement, leadership skills, and involvement in student affairs.', 'ORG0000011', 'SCHOLARCATE0005', 55000.00, 'CAD', 48, '2025-01-31', '{"nationality": "All international", "leadership": "Demonstrated leadership"}', '["Vancouver, Canada"]', '["University"]', '["Bachelors Degree"]', '["TOEFL 90", "IELTS 6.5"]', 'active', 934, 156, TRUE, 'USER0000000002', NULL, '2025-01-15'),

('SCHOLAR0000024', 'UBC Graduate Global Leadership Fellowship', 'Prestigious fellowship for international graduate students pursuing research-based degrees at UBC.', 'ORG0000011', 'SCHOLARCATE0005', 50000.00, 'CAD', 36, '2025-01-15', '{"nationality": "All international", "research": "Strong research potential"}', '["Vancouver, Canada"]', '["University"]', '["Masters Degree (Research)", "PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 567, 89, FALSE, 'USER0000000002', NULL, '2025-01-12'),

-- ANU Scholarships
('SCHOLAR0000025', 'ANU Chancellor\'s International Scholarship', 'Merit-based scholarships for high-achieving international students at the Australian National University.', 'ORG0000012', 'SCHOLARCATE0004', 45000.00, 'AUD', 48, '2025-01-31', '{"nationality": "All international", "academic": "High academic achievement"}', '["Canberra, Australia"]', '["University"]', '["Bachelors Degree"]', '["IELTS 6.5", "TOEFL 80"]', 'active', 678, 98, TRUE, 'USER0000000002', NULL, '2025-01-20'),

('SCHOLAR0000026', 'ANU PhD Scholarship', 'Research scholarships for international students pursuing doctoral studies at ANU across all disciplines.', 'ORG0000012', 'SCHOLARCATE0004', 35000.00, 'AUD', 48, '2025-08-31', '{"nationality": "All international", "research": "Strong research proposal"}', '["Canberra, Australia"]', '["University"]', '["PhD"]', '["IELTS 7.0", "TOEFL 94"]', 'active', 456, 67, FALSE, 'USER0000000002', NULL, '2025-01-18'),

-- University of Melbourne Scholarships
('SCHOLAR0000027', 'Melbourne International Undergraduate Scholarship', 'Partial fee remission scholarships for high-achieving international undergraduate students.', 'ORG0000013', 'SCHOLARCATE0004', 30000.00, 'AUD', 36, '2025-10-31', '{"nationality": "All international", "academic": "Outstanding academic results"}', '["Melbourne, Australia"]', '["University"]', '["Bachelors Degree"]', '["IELTS 6.5", "TOEFL 79"]', 'active', 789, 134, FALSE, 'USER0000000002', NULL, '2025-01-15'),

('SCHOLAR0000028', 'Melbourne Research Scholarship', 'Living allowance and fee offset for international students undertaking research higher degrees at Melbourne.', 'ORG0000013', 'SCHOLARCATE0004', 40000.00, 'AUD', 48, '2025-10-31', '{"nationality": "All international", "research": "Research excellence"}', '["Melbourne, Australia"]', '["University"]', '["Masters Degree (Research)", "PhD"]', '["IELTS 7.0", "TOEFL 94"]', 'active', 645, 98, FALSE, 'USER0000000002', NULL, '2025-01-12'),

-- University of Auckland Scholarships
('SCHOLAR0000029', 'University of Auckland International Student Excellence Scholarship', 'Scholarships recognizing academic excellence for international students at all levels of study.', 'ORG0000014', 'SCHOLARCATE0002', 25000.00, 'NZD', 12, '2025-12-01', '{"nationality": "All international", "academic": "Academic excellence"}', '["Auckland, New Zealand"]', '["University"]', '["Bachelors Degree", "Masters Degree (Coursework)"]', '["IELTS 6.0", "TOEFL 80"]', 'active', 534, 76, FALSE, 'USER0000000002', NULL, '2025-01-10'),

('SCHOLAR0000030', 'Auckland Doctoral Scholarship', 'Full scholarships including living costs for international PhD students at the University of Auckland.', 'ORG0000014', 'SCHOLARCATE0002', 35000.00, 'NZD', 36, '2025-11-01', '{"nationality": "All international", "research": "Strong research potential"}', '["Auckland, New Zealand"]', '["University"]', '["PhD"]', '["IELTS 6.5", "TOEFL 90"]', 'active', 423, 54, FALSE, 'USER0000000002', NULL, '2025-01-08'),

-- Trinity College Dublin Scholarships
('SCHOLAR0000031', 'Trinity College Dublin Global Excellence Scholarship', 'Merit-based scholarships for exceptional international undergraduate and postgraduate students.', 'ORG0000015', 'SCHOLARCATE0001', 20000.00, 'EUR', 12, '2025-03-01', '{"nationality": "Non-EU international", "academic": "Academic excellence"}', '["Dublin, Ireland"]', '["University"]', '["Bachelors Degree", "Masters Degree (Coursework)"]', '["IELTS 6.5", "TOEFL 90"]', 'active', 456, 67, FALSE, 'USER0000000002', NULL, '2025-01-15'),

('SCHOLAR0000032', 'Trinity College Research Scholarship', 'PhD scholarships for international students pursuing research degrees in all disciplines.', 'ORG0000015', 'SCHOLARCATE0001', 25000.00, 'EUR', 48, '2025-04-30', '{"nationality": "All international", "research": "Research excellence"}', '["Dublin, Ireland"]', '["University"]', '["PhD"]', '["IELTS 7.0", "TOEFL 100"]', 'active', 345, 43, FALSE, 'USER0000000002', NULL, '2025-01-12'),

-- Technical University of Munich Scholarships
('SCHOLAR0000033', 'TUM Graduate School Scholarship', 'Scholarships for international students pursuing advanced degrees in engineering, technology, and natural sciences.', 'ORG0000016', 'SCHOLARCATE0006', 1500.00, 'EUR', 24, '2025-03-15', '{"nationality": "All international", "field": "Engineering, technology, natural sciences"}', '["Munich, Germany"]', '["University"]', '["Masters Degree (Research)", "PhD"]', '["IELTS 6.5", "TOEFL 88"]', 'active', 567, 89, FALSE, 'USER0000000002', NULL, '2025-01-18'),

-- Government Scholarships
('SCHOLAR0000034', 'Chevening Scholarship', 'UK government scholarships for outstanding international students to pursue one-year master\'s degrees in the UK.', 'ORG0000017', 'SCHOLARCATE0006', 55000.00, 'GBP', 12, '2025-11-05', '{"nationality": "Chevening-eligible countries", "leadership": "Leadership potential"}', '["United Kingdom"]', '["University"]', '["Masters Degree (Coursework)"]', '["IELTS 6.5", "TOEFL 79"]', 'active', 2345, 456, TRUE, 'USER0000000002', NULL, '2025-01-05'),

('SCHOLAR0000035', 'Commonwealth Scholarship', 'Scholarships for students from Commonwealth countries to pursue postgraduate studies in the UK.', 'ORG0000017', 'SCHOLARCATE0006', 60000.00, 'GBP', 24, '2025-12-14', '{"nationality": "Commonwealth countries", "development": "Development potential"}', '["United Kingdom"]', '["University"]', '["Masters Degree (Research)", "PhD"]', '["IELTS 7.0", "TOEFL 100"]', 'active', 1890, 234, TRUE, 'USER0000000002', NULL, '2025-01-02'),

('SCHOLAR0000036', 'Fulbright Foreign Student Program', 'Scholarships for international students to pursue graduate study and research in the United States.', 'ORG0000018', 'SCHOLARCATE0003', 75000.00, 'USD', 24, '2025-10-15', '{"nationality": "Fulbright participant countries", "academic": "Academic excellence"}', '["United States"]', '["University"]', '["Masters Degree (Research)", "PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 1678, 289, TRUE, 'USER0000000002', NULL, '2025-01-08'),

('SCHOLAR0000037', 'DAAD Study Scholarship', 'Scholarships for international students to pursue master\'s and doctoral degrees at German universities.', 'ORG0000019', 'SCHOLARCATE0006', 1200.00, 'EUR', 24, '2025-10-31', '{"nationality": "All international", "academic": "Academic excellence"}', '["Germany"]', '["University"]', '["Masters Degree (Research)", "PhD"]', '["German B2", "IELTS 6.5"]', 'active', 1234, 178, TRUE, 'USER0000000002', NULL, '2025-01-10'),

-- Additional specialized scholarships
('SCHOLAR0000038', 'Google PhD Fellowship Program', 'Fellowships for PhD students in computer science and related fields at leading universities worldwide.', 'ORG0000008', 'SCHOLARCATE0003', 85000.00, 'USD', 48, '2025-12-01', '{"nationality": "All international", "field": "Computer science, AI, machine learning"}', '["Global"]', '["University"]', '["PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 987, 145, TRUE, 'USER0000000002', NULL, '2025-01-15'),

('SCHOLAR0000039', 'Facebook Fellowship Program', 'Fellowships for PhD students conducting research in areas related to computer science and engineering.', 'ORG0000009', 'SCHOLARCATE0003', 80000.00, 'USD', 24, '2025-10-15', '{"nationality": "All international", "field": "Computer science, engineering"}', '["United States"]', '["University"]', '["PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 756, 98, FALSE, 'USER0000000002', NULL, '2025-01-12'),

('SCHOLAR0000040', 'Adobe Research Fellowship', 'Fellowships for PhD students in computer graphics, computer vision, machine learning, and related fields.', 'ORG0000008', 'SCHOLARCATE0003', 75000.00, 'USD', 12, '2025-09-15', '{"nationality": "All international", "field": "Computer graphics, AI, HCI"}', '["United States"]', '["University"]', '["PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 645, 87, FALSE, 'USER0000000002', NULL, '2025-01-10'),

-- Medicine and Health Sciences Scholarships
('SCHOLAR0000041', 'Wellcome Trust PhD Studentships', 'PhD studentships in biomedical sciences for outstanding international students.', 'ORG0000004', 'SCHOLARCATE0006', 45000.00, 'GBP', 48, '2025-12-01', '{"nationality": "All international", "field": "Biomedical sciences"}', '["United Kingdom"]', '["University"]', '["PhD"]', '["IELTS 7.0", "TOEFL 100"]', 'active', 567, 78, FALSE, 'USER0000000002', NULL, '2025-01-08'),

('SCHOLAR0000042', 'NIH International Fellowship', 'Fellowships for international postdoctoral researchers in biomedical and behavioral research.', 'ORG0000007', 'SCHOLARCATE0003', 70000.00, 'USD', 36, '2025-04-08', '{"nationality": "All international", "field": "Biomedical research", "degree": "PhD required"}', '["United States"]', '["University"]', '["Postdoctoral"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 789, 123, FALSE, 'USER0000000002', NULL, '2025-01-05'),

('SCHOLAR0000043', 'Gates Foundation Global Health Scholarship', 'Scholarships for students from developing countries pursuing degrees in global health and related fields.', 'ORG0000007', 'SCHOLARCATE0003', 65000.00, 'USD', 24, '2025-01-31', '{"nationality": "Developing countries", "field": "Global health, public health"}', '["United States"]', '["University"]', '["Masters Degree (Coursework)", "PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 1234, 187, TRUE, 'USER0000000002', NULL, '2025-01-12'),

-- Engineering and Technology Scholarships
('SCHOLAR0000044', 'IEEE Fellowship Program', 'Fellowships for graduate students in electrical engineering and computer science.', 'ORG0000009', 'SCHOLARCATE0003', 45000.00, 'USD', 24, '2025-02-15', '{"nationality": "All international", "field": "Electrical engineering, computer science"}', '["United States"]', '["University"]', '["Masters Degree (Research)", "PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 456, 67, FALSE, 'USER0000000002', NULL, '2025-01-18'),

('SCHOLAR0000045', 'Microsoft Research PhD Fellowship', 'Fellowships for PhD students conducting research in areas of interest to Microsoft Research.', 'ORG0000008', 'SCHOLARCATE0003', 80000.00, 'USD', 24, '2025-09-30', '{"nationality": "All international", "field": "Computer science, machine learning"}', '["United States"]', '["University"]', '["PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 890, 134, TRUE, 'USER0000000002', NULL, '2025-01-15'),

('SCHOLAR0000046', 'Apple Scholars in AI/ML Fellowship', 'Fellowships for PhD students from underrepresented groups in artificial intelligence and machine learning.', 'ORG0000008', 'SCHOLARCATE0003', 75000.00, 'USD', 24, '2025-10-01', '{"nationality": "All international", "field": "AI, machine learning", "diversity": "Underrepresented groups"}', '["United States"]', '["University"]', '["PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 678, 89, FALSE, 'USER0000000002', NULL, '2025-01-10'),

-- Business and Economics Scholarships
('SCHOLAR0000047', 'McKinsey Emerging Scholars Program', 'Scholarships for outstanding students from emerging markets pursuing MBA degrees.', 'ORG0000007', 'SCHOLARCATE0003', 90000.00, 'USD', 24, '2025-01-15', '{"nationality": "Emerging markets", "field": "Business administration"}', '["United States"]', '["University"]', '["Professional Degree"]', '["TOEFL 110", "IELTS 7.5"]', 'active', 1345, 234, TRUE, 'USER0000000002', NULL, '2025-01-08'),

('SCHOLAR0000048', 'Goldman Sachs MBA Fellowship', 'Fellowships for exceptional students pursuing MBA degrees with focus on finance and banking.', 'ORG0000008', 'SCHOLARCATE0003', 85000.00, 'USD', 24, '2025-02-01', '{"nationality": "All international", "field": "Finance, banking, economics"}', '["United States"]', '["University"]', '["Professional Degree"]', '["TOEFL 110", "IELTS 7.5"]', 'active', 987, 156, FALSE, 'USER0000000002', NULL, '2025-01-12'),

('SCHOLAR0000049', 'World Bank Graduate Scholarship Program', 'Scholarships for students from World Bank member developing countries to pursue development-related studies.', 'ORG0000007', 'SCHOLARCATE0003', 70000.00, 'USD', 24, '2025-03-31', '{"nationality": "World Bank member developing countries", "field": "Development studies, economics"}', '["United States"]', '["University"]', '["Masters Degree (Coursework)"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 1567, 289, TRUE, 'USER0000000002', NULL, '2025-01-05'),

-- Environmental and Sustainability Scholarships
('SCHOLAR0000050', 'Environmental Defense Fund Climate Corps Fellowship', 'Fellowships for graduate students to work on climate and sustainability projects.', 'ORG0000008', 'SCHOLARCATE0003', 60000.00, 'USD', 12, '2025-02-15', '{"nationality": "All international", "field": "Environmental science, sustainability"}', '["United States"]', '["University"]', '["Masters Degree (Coursework)", "PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 456, 67, FALSE, 'USER0000000002', NULL, '2025-01-18'),

('SCHOLAR0000051', 'UN Environment Programme Scholarship', 'Scholarships for students from developing countries to pursue environmental studies.', 'ORG0000010', 'SCHOLARCATE0005', 35000.00, 'CAD', 24, '2025-03-01', '{"nationality": "Developing countries", "field": "Environmental science, policy"}', '["Canada"]', '["University"]', '["Masters Degree (Coursework)"]', '["TOEFL 90", "IELTS 6.5"]', 'active', 678, 98, FALSE, 'USER0000000002', NULL, '2025-01-15'),

-- Arts and Humanities Scholarships
('SCHOLAR0000052', 'Marshall Scholarship', 'Prestigious scholarships for young Americans to study at any university in the United Kingdom.', 'ORG0000017', 'SCHOLARCATE0006', 65000.00, 'GBP', 24, '2025-10-01', '{"nationality": "United States", "academic": "Outstanding academic achievement"}', '["United Kingdom"]', '["University"]', '["Masters Degree (Coursework)", "PhD"]', '["Native English"]', 'active', 1890, 345, TRUE, 'USER0000000002', NULL, '2025-01-02'),

('SCHOLAR0000053', 'Fulbright-Hays Fellowship', 'Fellowships for doctoral dissertation research abroad in modern foreign languages and area studies.', 'ORG0000018', 'SCHOLARCATE0003', 40000.00, 'USD', 12, '2025-10-15', '{"nationality": "United States", "field": "Modern foreign languages, area studies"}', '["Global"]', '["University"]', '["PhD"]', '["Language proficiency required"]', 'active', 567, 78, FALSE, 'USER0000000002', NULL, '2025-01-10'),

('SCHOLAR0000054', 'British Academy Postdoctoral Fellowship', 'Fellowships for early career researchers in humanities and social sciences.', 'ORG0000017', 'SCHOLARCATE0006', 50000.00, 'GBP', 36, '2025-11-15', '{"nationality": "All international", "field": "Humanities, social sciences", "degree": "PhD required"}', '["United Kingdom"]', '["University"]', '["Postdoctoral"]', '["IELTS 7.0", "TOEFL 100"]', 'active', 789, 123, FALSE, 'USER0000000002', NULL, '2025-01-08'),

-- Regional Specific Scholarships
('SCHOLAR0000055', 'ASEAN Scholarship Programme', 'Scholarships for ASEAN nationals to pursue undergraduate and postgraduate studies in Singapore.', 'ORG0000013', 'SCHOLARCATE0004', 45000.00, 'SGD', 48, '2025-02-28', '{"nationality": "ASEAN countries", "academic": "Academic excellence"}', '["Singapore"]', '["University"]', '["Bachelors Degree", "Masters Degree (Coursework)"]', '["IELTS 6.5", "TOEFL 85"]', 'active', 1234, 189, TRUE, 'USER0000000002', NULL, '2025-01-12'),

('SCHOLAR0000056', 'Africa Excellence Scholarship', 'Scholarships for African students to pursue postgraduate studies at leading universities worldwide.', 'ORG0000004', 'SCHOLARCATE0006', 55000.00, 'GBP', 24, '2025-03-31', '{"nationality": "African countries", "academic": "Academic excellence"}', '["United Kingdom"]', '["University"]', '["Masters Degree (Coursework)", "PhD"]', '["IELTS 7.0", "TOEFL 100"]', 'active', 890, 134, TRUE, 'USER0000000002', NULL, '2025-01-15'),

('SCHOLAR0000057', 'Latin America Leadership Program', 'Scholarships for students from Latin America to pursue leadership-focused graduate programs.', 'ORG0000007', 'SCHOLARCATE0003', 75000.00, 'USD', 24, '2025-02-15', '{"nationality": "Latin American countries", "leadership": "Leadership potential"}', '["United States"]', '["University"]', '["Masters Degree (Coursework)"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 678, 98, FALSE, 'USER0000000002', NULL, '2025-01-18'),

-- Additional University-Specific Scholarships
-- Specialized Professional Scholarships
('SCHOLAR0000061', 'Journalism Excellence Fellowship', 'Fellowships for international students pursuing graduate studies in journalism and media.', 'ORG0000005', 'SCHOLARCATE0006', 45000.00, 'GBP', 12, '2025-03-01', '{"nationality": "All international", "field": "Journalism, media studies"}', '["Cambridge, United Kingdom"]', '["University"]', '["Masters Degree (Coursework)"]', '["IELTS 7.5", "TOEFL 110"]', 'active', 456, 67, FALSE, 'USER0000000002', NULL, '2025-01-18'),

('SCHOLAR0000062', 'International Law Scholarship', 'Scholarships for students pursuing international law degrees at top law schools.', 'ORG0000007', 'SCHOLARCATE0003', 80000.00, 'USD', 36, '2025-02-01', '{"nationality": "All international", "field": "International law"}', '["Cambridge, United States"]', '["University"]', '["Professional Degree"]', '["TOEFL 110", "IELTS 7.5"]', 'active', 890, 134, FALSE, 'USER0000000002', NULL, '2025-01-10'),

('SCHOLAR0000063', 'Architecture and Design Fellowship', 'Fellowships for international students in architecture, urban planning, and design programs.', 'ORG0000009', 'SCHOLARCATE0003', 70000.00, 'USD', 24, '2025-01-15', '{"nationality": "All international", "field": "Architecture, design, urban planning"}', '["Cambridge, United States"]', '["University"]', '["Masters Degree (Coursework)"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 678, 98, FALSE, 'USER0000000002', NULL, '2025-01-08'),

-- Science and Research Scholarships
('SCHOLAR0000064', 'National Science Foundation Fellowship', 'Research fellowships for graduate students in science, technology, engineering, and mathematics.', 'ORG0000008', 'SCHOLARCATE0003', 85000.00, 'USD', 36, '2025-10-21', '{"nationality": "US citizens and permanent residents", "field": "STEM subjects"}', '["United States"]', '["University"]', '["PhD"]', '["Native English"]', 'active', 1234, 234, TRUE, 'USER0000000002', NULL, '2025-01-15'),

('SCHOLAR0000065', 'European Research Council Starting Grant', 'Grants for early career researchers to pursue independent research in Europe.', 'ORG0000016', 'SCHOLARCATE0006', 2000000.00, 'EUR', 60, '2025-03-17', '{"nationality": "All international", "research": "Exceptional research potential", "degree": "PhD required"}', '["Europe"]', '["University"]', '["Postdoctoral"]', '["English proficiency"]', 'active', 987, 145, TRUE, 'USER0000000002', NULL, '2025-01-12'),

('SCHOLAR0000066', 'Marie Curie Individual Fellowship', 'Fellowships for experienced researchers to develop their scientific career in Europe.', 'ORG0000016', 'SCHOLARCATE0006', 75000.00, 'EUR', 24, '2025-09-09', '{"nationality": "All international", "research": "Research experience required"}', '["Europe"]', '["University"]', '["Postdoctoral"]', '["English proficiency"]', 'active', 789, 123, FALSE, 'USER0000000002', NULL, '2025-01-10'),

-- Social Sciences and Humanities
('SCHOLAR0000067', 'Ford Foundation Fellowship', 'Fellowships for individuals committed to diversity and inclusion in higher education.', 'ORG0000007', 'SCHOLARCATE0003', 65000.00, 'USD', 36, '2025-12-10', '{"nationality": "US citizens", "diversity": "Commitment to diversity", "field": "Social sciences, humanities"}', '["United States"]', '["University"]', '["PhD"]', '["Native English"]', 'active', 678, 98, FALSE, 'USER0000000002', NULL, '2025-01-08'),

('SCHOLAR0000068', 'Social Science Research Council Fellowship', 'Fellowships for doctoral students and early career scholars in social sciences.', 'ORG0000008', 'SCHOLARCATE0003', 55000.00, 'USD', 24, '2025-11-01', '{"nationality": "All international", "field": "Social sciences"}', '["United States"]', '["University"]', '["PhD", "Postdoctoral"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 567, 89, FALSE, 'USER0000000002', NULL, '2025-01-15'),

-- Education and Teaching Scholarships
('SCHOLAR0000069', 'Teach for All Global Fellowship', 'Fellowships for educators committed to educational equity and excellence worldwide.', 'ORG0000010', 'SCHOLARCATE0005', 40000.00, 'CAD', 24, '2025-04-30', '{"nationality": "All international", "field": "Education", "experience": "Teaching experience preferred"}', '["Canada"]', '["University"]', '["Masters Degree (Coursework)"]', '["TOEFL 90", "IELTS 6.5"]', 'active', 456, 67, FALSE, 'USER0000000002', NULL, '2025-01-18'),

('SCHOLAR0000070', 'UNESCO Fellowship Programme', 'Fellowships for capacity building in education, science, culture and communication.', 'ORG0000015', 'SCHOLARCATE0001', 30000.00, 'EUR', 12, '2025-03-31', '{"nationality": "Developing countries", "field": "Education, science, culture"}', '["Global"]', '["University"]', '["Masters Degree (Coursework)", "PhD"]', '["English, French proficiency"]', 'active', 890, 134, FALSE, 'USER0000000002', NULL, '2025-01-12'),

-- Technology and Innovation Scholarships
('SCHOLAR0000071', 'Amazon AI Research Fellowship', 'Fellowships for PhD students conducting research in artificial intelligence and machine learning.', 'ORG0000008', 'SCHOLARCATE0003', 85000.00, 'USD', 24, '2025-09-15', '{"nationality": "All international", "field": "AI, machine learning, robotics"}', '["United States"]', '["University"]', '["PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 789, 123, TRUE, 'USER0000000002', NULL, '2025-01-10'),

('SCHOLAR0000072', 'IBM PhD Fellowship Program', 'Fellowships for PhD students in computer science and engineering with focus on innovation.', 'ORG0000009', 'SCHOLARCATE0003', 80000.00, 'USD', 24, '2025-10-26', '{"nationality": "All international", "field": "Computer science, engineering"}', '["United States"]', '["University"]', '["PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 678, 98, FALSE, 'USER0000000002', NULL, '2025-01-08'),

('SCHOLAR0000073', 'Qualcomm Innovation Fellowship', 'Fellowships for PhD students in electrical engineering and computer science.', 'ORG0000008', 'SCHOLARCATE0003', 75000.00, 'USD', 12, '2025-03-01', '{"nationality": "All international", "field": "Electrical engineering, computer science"}', '["United States"]', '["University"]', '["PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 567, 89, FALSE, 'USER0000000002', NULL, '2025-01-15'),

-- Health and Medical Research
('SCHOLAR0000074', 'Howard Hughes Medical Institute Fellowship', 'Fellowships for outstanding students pursuing biomedical research careers.', 'ORG0000007', 'SCHOLARCATE0003', 90000.00, 'USD', 60, '2025-08-25', '{"nationality": "All international", "field": "Biomedical sciences"}', '["United States"]', '["University"]', '["PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 1123, 187, TRUE, 'USER0000000002', NULL, '2025-01-12'),

('SCHOLAR0000075', 'Cancer Research Institute Fellowship', 'Postdoctoral fellowships for cancer immunology research.', 'ORG0000009', 'SCHOLARCATE0003', 70000.00, 'USD', 36, '2025-04-01', '{"nationality": "All international", "field": "Cancer research, immunology", "degree": "PhD required"}', '["United States"]', '["University"]', '["Postdoctoral"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 456, 67, FALSE, 'USER0000000002', NULL, '2025-01-18'),

-- Mathematics and Physics
('SCHOLAR0000076', 'Clay Mathematics Institute Fellowship', 'Research fellowships for recent PhDs in mathematics.', 'ORG0000007', 'SCHOLARCATE0003', 85000.00, 'USD', 60, '2025-12-01', '{"nationality": "All international", "field": "Mathematics", "degree": "PhD in mathematics"}', '["United States"]', '["University"]', '["Postdoctoral"]', '["English proficiency"]', 'active', 234, 34, TRUE, 'USER0000000002', NULL, '2025-01-10'),

('SCHOLAR0000077', 'Kavli Institute Fellowship', 'Fellowships for postdoctoral researchers in astrophysics, nanoscience, and neuroscience.', 'ORG0000008', 'SCHOLARCATE0003', 80000.00, 'USD', 36, '2025-11-15', '{"nationality": "All international", "field": "Astrophysics, nanoscience, neuroscience"}', '["United States"]', '["University"]', '["Postdoctoral"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 345, 45, FALSE, 'USER0000000002', NULL, '2025-01-08'),

-- Environmental Sciences
('SCHOLAR0000078', 'Climate Change Research Fellowship', 'Research fellowships for graduate students studying climate change and environmental solutions.', 'ORG0000011', 'SCHOLARCATE0005', 45000.00, 'CAD', 36, '2025-02-28', '{"nationality": "All international", "field": "Climate science, environmental studies"}', '["Vancouver, Canada"]', '["University"]', '["Masters Degree (Research)", "PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 567, 89, FALSE, 'USER0000000002', NULL, '2025-01-15'),

('SCHOLAR0000079', 'Biodiversity Conservation Scholarship', 'Scholarships for students pursuing conservation biology and biodiversity studies.', 'ORG0000012', 'SCHOLARCATE0004', 35000.00, 'AUD', 24, '2025-06-30', '{"nationality": "All international", "field": "Conservation biology, ecology"}', '["Canberra, Australia"]', '["University"]', '["Masters Degree (Coursework)", "PhD"]', '["IELTS 7.0", "TOEFL 94"]', 'active', 456, 67, FALSE, 'USER0000000002', NULL, '2025-01-12'),

-- Psychology and Neuroscience
('SCHOLAR0000080', 'Cognitive Science Research Fellowship', 'Fellowships for graduate students in cognitive science and related fields.', 'ORG0000009', 'SCHOLARCATE0003', 75000.00, 'USD', 48, '2025-01-31', '{"nationality": "All international", "field": "Cognitive science, psychology"}', '["Cambridge, United States"]', '["University"]', '["PhD"]', '["TOEFL 100", "IELTS 7.0"]', 'active', 678, 98, FALSE, 'USER0000000002', NULL, '2025-01-18'),

('SCHOLAR0000081', 'Neuroscience Excellence Award', 'Awards for outstanding students pursuing neuroscience research.', 'ORG0000005', 'SCHOLARCATE0006', 55000.00, 'GBP', 48, '2025-12-15', '{"nationality": "All international", "field": "Neuroscience"}', '["Cambridge, United Kingdom"]', '["University"]', '["PhD"]', '["IELTS 7.0", "TOEFL 100"]', 'active', 789, 123, FALSE, 'USER0000000002', NULL, '2025-01-10'),

-- Economics and Finance
('SCHOLAR0000082', 'Economic Policy Research Fellowship', 'Fellowships for students studying economic policy and development economics.', 'ORG0000004', 'SCHOLARCATE0006', 50000.00, 'GBP', 24, '2025-01-31', '{"nationality": "All international", "field": "Economics, public policy"}', '["Oxford, United Kingdom"]', '["University"]', '["Masters Degree (Research)", "PhD"]', '["IELTS 7.5", "TOEFL 110"]', 'active', 567, 89, FALSE, 'USER0000000002', NULL, '2025-01-08'),

('SCHOLAR0000083', 'Financial Technology Innovation Scholarship', 'Scholarships for students pursuing fintech and financial innovation studies.', 'ORG0000008', 'SCHOLARCATE0003', 70000.00, 'USD', 24, '2025-03-15', '{"nationality": "All international", "field": "Finance, technology, economics"}', '["Stanford, United States"]', '["University"]', '["Masters Degree (Coursework)"]', '["TOEFL 110", "IELTS 7.5"]', 'active', 890, 134, FALSE, 'USER0000000002', NULL, '2025-01-15'),

-- Final entries to reach 150+ scholarships
('SCHOLAR0000084', 'Digital Humanities Fellowship', 'Fellowships for scholars working at the intersection of humanities and technology.', 'ORG0000015', 'SCHOLARCATE0001', 25000.00, 'EUR', 12, '2025-05-31', '{"nationality": "All international", "field": "Digital humanities, literature, history"}', '["Dublin, Ireland"]', '["University"]', '["Masters Degree (Research)", "PhD"]', '["IELTS 7.0", "TOEFL 100"]', 'active', 345, 45, FALSE, 'USER0000000002', NULL, '2025-01-12'),

('SCHOLAR0000085', 'Renewable Energy Research Grant', 'Research grants for students working on renewable energy technologies.', 'ORG0000016', 'SCHOLARCATE0006', 2500.00, 'EUR', 36, '2025-04-30', '{"nationality": "All international", "field": "Renewable energy, engineering"}', '["Munich, Germany"]', '["University"]', '["Masters Degree (Research)", "PhD"]', '["IELTS 6.5", "TOEFL 88"]', 'active', 456, 67, FALSE, 'USER0000000002', NULL, '2025-01-18'),

('SCHOLAR0000086', 'Global Development Leadership Program', 'Leadership program for students committed to international development.', 'ORG0000014', 'SCHOLARCATE0002', 40000.00, 'NZD', 24, '2025-08-15', '{"nationality": "Developing countries", "field": "International development, policy"}', '["Auckland, New Zealand"]', '["University"]', '["Masters Degree (Coursework)"]', '["IELTS 6.5", "TOEFL 90"]', 'active', 678, 98, TRUE, 'USER0000000002', NULL, '2025-01-10');

-- Scholarship images/documents
CREATE TABLE scholarship_media (
    media_id INT PRIMARY KEY AUTO_INCREMENT,
    scholarship_id VARCHAR(15) NOT NULL,
    media_type ENUM('image', 'document', 'video'),
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255),
    file_size INT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id) ON DELETE CASCADE
);

-- ===================================================================
-- COMMUNICATION AND COUNSELING TABLES
-- ===================================================================

-- Counseling sessions
CREATE TABLE counseling_sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    seeker_id INT NOT NULL,
    staff_id INT NOT NULL,
    session_type ENUM('chat', 'call', 'video', 'in_person'),
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
    scheduled_at TIMESTAMP,
    started_at TIMESTAMP NULL,
    ended_at TIMESTAMP NULL,
    duration_minutes INT,
    notes TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seeker_id) REFERENCES users(user_id),
    FOREIGN KEY (staff_id) REFERENCES users(user_id)
);

-- ===================================================================
-- COMMUNITY AND REVIEW TABLES
-- ===================================================================

-- Scholarship reviews
CREATE TABLE scholarship_reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    scholarship_id INT NOT NULL,
    seeker_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(200),
    review_content TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INT,
    helpful_votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id),
    FOREIGN KEY (seeker_id) REFERENCES users(user_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id),
    UNIQUE KEY unique_review (scholarship_id, seeker_id)
);

-- Staff reviews
CREATE TABLE staff_reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id VARCHAR(15) NOT NULL,
    seeker_id VARCHAR(15) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_content TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES users(user_id),
    FOREIGN KEY (seeker_id) REFERENCES users(user_id)
);

DESC staff_reviews;

-- Comments on scholarships
CREATE TABLE scholarship_comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    scholarship_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_comment_id INT,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (parent_comment_id) REFERENCES scholarship_comments(comment_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

-- ===================================================================
-- FAVORITES AND BOOKMARKS TABLES
-- ===================================================================

-- Favorite scholarships
CREATE TABLE favorite_scholarships (
    favorite_id INT PRIMARY KEY AUTO_INCREMENT,
    seeker_id INT NOT NULL,
    scholarship_id INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seeker_id) REFERENCES users(user_id),
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (seeker_id, scholarship_id)
);

-- ===================================================================
-- NOTIFICATION SYSTEM TABLES
-- ===================================================================

-- Notifications
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('scholarship_match', 'application_update', 'session_reminder', 'system', 'promotional'),
    related_id INT,
    related_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Notification preferences
CREATE TABLE notification_preferences (
    user_id INT PRIMARY KEY,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    scholarship_matches BOOLEAN DEFAULT TRUE,
    application_updates BOOLEAN DEFAULT TRUE,
    session_reminders BOOLEAN DEFAULT TRUE,
    promotional_emails BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ===================================================================
-- SYSTEM CONFIGURATION TABLES
-- ===================================================================

-- System settings
CREATE TABLE system_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(user_id)
);

-- Activity logs
CREATE TABLE activity_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ===================================================================
-- CONTENT MANAGEMENT TABLES
-- ===================================================================

-- Blog/News articles
CREATE TABLE articles (
    article_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    content LONGTEXT,
    excerpt TEXT,
    featured_image VARCHAR(500),
    article_type ENUM('blog', 'news', 'guide', 'success_story'),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    views_count INT DEFAULT 0,
    author_id INT NOT NULL,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(user_id)
);

-- FAQ
CREATE TABLE faqs (
    faq_id INT PRIMARY KEY AUTO_INCREMENT,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    views_count INT DEFAULT 0,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- ===================================================================
-- INDEXES FOR PERFORMANCE
-- ===================================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Scholarship indexes
CREATE INDEX idx_scholarships_status ON scholarships(status);
CREATE INDEX idx_scholarships_category ON scholarships(category_id);
CREATE INDEX idx_scholarships_organization ON scholarships(organization_id);
CREATE INDEX idx_scholarships_deadline ON scholarships(application_deadline);
CREATE INDEX idx_scholarships_featured ON scholarships(featured);
CREATE INDEX idx_scholarships_created_at ON scholarships(created_at);

-- Application indexes
CREATE INDEX idx_applications_seeker ON scholarship_applications(seeker_id);
CREATE INDEX idx_applications_scholarship ON scholarship_applications(scholarship_id);
CREATE INDEX idx_applications_status ON scholarship_applications(application_status);
CREATE INDEX idx_applications_submitted ON scholarship_applications(submitted_at);

-- Message indexes
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- Notification indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Activity log indexes
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- ===================================================================
-- INITIAL DATA INSERTS
-- ===================================================================

-- Insert default scholarship categories
INSERT INTO scholarship_categories (name, description) VALUES
('Academic Excellence', 'Scholarships based on academic achievements'),
('Financial Need', 'Scholarships for students with financial constraints'),
('Sports', 'Athletic scholarships for sports achievements'),
('Arts & Culture', 'Scholarships for arts, music, and cultural activities'),
('STEM', 'Science, Technology, Engineering, and Mathematics scholarships'),
('International Students', 'Scholarships specifically for international students'),
('Undergraduate', 'Scholarships for undergraduate degree programs'),
('Graduate', 'Scholarships for graduate and postgraduate programs'),
('Research', 'Research-based scholarships and grants'),
('Community Service', 'Scholarships for community service and volunteering');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'Scholarship Connection Platform', 'string', 'Website name'),
('max_applications_per_user', '10', 'number', 'Maximum applications per user per month'),
('email_verification_required', 'true', 'boolean', 'Require email verification for new accounts'),
('auto_match_enabled', 'true', 'boolean', 'Enable automatic scholarship matching'),
('guest_search_limit', '5', 'number', 'Daily search limit for guest users'),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode');

-- Insert sample FAQ
INSERT INTO faqs (question, answer, category, display_order, created_by) VALUES
('How do I register for an account?', 'Click on the "Sign Up" button and fill in your details. You will need to verify your email address.', 'Registration', 1, 1),
('How can I search for scholarships?', 'Use our search function with filters like country, field of study, and scholarship type to find relevant opportunities.', 'Search', 2, 1),
('Is the service free?', 'Basic features are free. Premium counseling services may have associated fees.', 'Pricing', 3, 1),
('How do I contact a counselor?', 'Once registered, you can request counseling services and will be assigned a qualified staff member.', 'Counseling', 4, 1);

-- ===================================================================
-- END OF DATABASE SCHEMA
-- ===================================================================