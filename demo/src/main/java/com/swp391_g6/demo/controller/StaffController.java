package com.swp391_g6.demo.controller;

import com.swp391_g6.demo.dto.EmailRequest;
import com.swp391_g6.demo.dto.StaffDTO;
import com.swp391_g6.demo.entity.Staff;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.service.StaffService;
import com.swp391_g6.demo.service.UserService;
import com.swp391_g6.demo.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private StaffService staffService;

    @PostMapping("/profile")
    public ResponseEntity<?> getStaffProfile(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is required");
        }

        String userId = jwtUtil.getUserIdFromToken(token);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        User user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        StaffDTO dto = staffService.findByUser(user);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/update-staff-profile")
    public ResponseEntity<?> updateStaffProfile(@RequestBody Map<String, Object> updates) {
        String token = (String) updates.get("token");
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is required");
        }

        String userId = jwtUtil.getUserIdFromToken(token);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        User user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        StaffDTO staff = staffService.findByUser(user);
        if (staff == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Staff profile not found");
        }

        // Cập nhật thông tin từ request
        if (updates.containsKey("name")) {
            staff.setName((String) updates.get("name"));
        }
        if (updates.containsKey("phone")) {
            staff.setPhone((String) updates.get("phone"));
        }
        if (updates.containsKey("date_of_birth")) {
            staff.setDateOfBirthString((String) updates.get("date_of_birth")); 
        }
        if (updates.containsKey("gender")) {
            staff.setGender((String) updates.get("gender"));
        }
        if (updates.containsKey("email")) {
            staff.setEmail((String) updates.get("email"));
        }
        if (updates.containsKey("education_level")) {
            staff.setEducationLevel((String) updates.get("education_level"));
        }
        if (updates.containsKey("experience_years")) {
            Object exp = updates.get("experience_years");
            if (exp instanceof Number) {
                staff.setExperienceYears(((Number) exp).intValue());
            }
        }
        if (updates.containsKey("specialization")) {
            staff.setSpecialization((String) updates.get("specialization"));
        }

        staffService.updateStaffProfile(staff);
        return ResponseEntity.ok("Hồ sơ nhân viên đã được cập nhật thành công");
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendUpdateOtp(@RequestBody EmailRequest request) {
        staffService.sendUpdateStaffProfileOtp(request.getEmail());
        return ResponseEntity.ok("Mã OTP đã được gửi đến email của bạn");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyUpdateOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        System.out.println("[OTP-STAFF] Controller: /staff/verify-otp called, email=" + email + ", otp=" + otp);
        if (email == null || otp == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email và OTP là bắt buộc");
        }
        boolean verified = staffService.verifyUpdateStaffProfileOtp(email, otp);
        return verified
                ? ResponseEntity.ok("OTP đã được xác minh thành công")
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("OTP không hợp lệ hoặc đã hết hạn");
    }
}