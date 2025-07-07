package com.swp391_g6.demo.controller;

import java.util.Map;
import java.util.List;
import java.sql.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.service.UserService;
import com.swp391_g6.demo.util.JwtUtil;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    // [POST] /api/users/user-manage - Quản lý người dùng
    @PostMapping("/user-manage")
    public ResponseEntity<?> userManage(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is required");
        }

        User user = jwtUtil.extractUserFromToken(token);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        } else if (user.getRole() == null || !user.getRole().equals("admin")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching users");
        }
    }

    // [POST] /api/users/send-otp - Gửi mã OTP cập nhật thông tin người dùng
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendUpdateUserProfileOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        userService.sendUpdateUserProfileOtp(email);
        return ResponseEntity.ok("OTP sent successfully");
    }

    // [POST] /api/users/verify-otp - Xác thực mã OTP cập nhật thông tin người dùng
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyUpdateUserProfileOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");
        if (email == null || email.isEmpty() || otp == null || otp.isEmpty()) {
            return ResponseEntity.badRequest().body("Email and OTP are required");
        }

        boolean isValid = userService.verifyUpdateUserProfileOtp(email, otp);
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP");
        }
        return ResponseEntity.ok("OTP verified successfully");
    }

    // [POST] /api/users/update-user-profile - Cập nhật thông tin người dùng
    @PostMapping("/update-user-profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody Map<String, Object> body) {
        String token = (String) body.get("token");
        String email = jwtUtil.extractEmail(token); // Lấy email từ token
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        User user = userService.findByEmail(email); // Lấy user từ DB
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        try {
            user.setName((String) body.get("name"));
            user.setEmail((String) body.get("email"));
            user.setPhone((String) body.get("phone"));
            user.setDateOfBirth(Date.valueOf((String) body.get("date_of_birth")));
            user.setGender((String) body.get("gender"));

            userService.updateUserProfile(user);
            return ResponseEntity.status(HttpStatus.OK).body("Profile updated successfully");
        } catch (Exception e) {
            System.err.println("Error updating user profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating profile");
        }
    }

    // [POST] /api/users/registration-stats - Thống kê đăng ký người dùng
    @PostMapping("/registration-stats")
    public ResponseEntity<?> getRegistrationStats(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        User user = jwtUtil.extractUserFromToken(token);
        if (user == null || user.getRole() == null || !user.getRole().equals("admin")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        try {
            List<Map<String, Object>> stats = userService.getUserRegistrationStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching stats");
        }
    }

}
