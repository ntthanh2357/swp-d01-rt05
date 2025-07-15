package com.swp391_g6.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.swp391_g6.demo.dto.ConsultationRequestDTO;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.entity.Seeker;
import com.swp391_g6.demo.service.UserService;
import com.swp391_g6.demo.service.SeekerService;
import com.swp391_g6.demo.util.JwtUtil;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/consultation")
public class ConsultationController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private SeekerService seekerService;

    @PostMapping("/register")
    public ResponseEntity<?> registerConsultation(@RequestBody ConsultationRequestDTO request) {
        try {
            // Validate token
            String token = request.getToken();
            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Token is required"));
            }

            String email = jwtUtil.extractEmail(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid token"));
            }

            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not found"));
            }

            // Validate required fields
            if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Full name is required"));
            }

            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Email is required"));
            }

            if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Phone is required"));
            }

            // Đăng ký tư vấn
            Seeker seeker = seekerService.registerConsultation(request, user);

            // Tạo response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đăng ký tư vấn thành công!");
            response.put("seeker_id", seeker.getSeekerId());
            response.put("assigned_staff_id", seeker.getAssignedStaff() != null ? 
                    seeker.getAssignedStaff().getUserId() : null);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getConsultationProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Bearer token is required"));
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid token"));
            }

            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not found"));
            }

            Seeker seeker = seekerService.findByUser(user);
            if (seeker == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Consultation profile not found"));
            }

            // Tạo response với thông tin đầy đủ
            Map<String, Object> response = new HashMap<>();
            response.put("seeker_id", seeker.getSeekerId());
            response.put("full_name", user.getName());
            response.put("email", user.getEmail());
            response.put("phone", user.getPhone());
            response.put("study_time", seeker.getStudyTime());
            response.put("city", seeker.getCity());
            response.put("education_level", seeker.getCurrentEducationLevel());
            response.put("advice_type", seeker.getAdviceType());
            response.put("scholarship_goal", seeker.getScholarshipGoal());
            response.put("major", seeker.getMajor());
            response.put("note", seeker.getNote());
            response.put("contact_zalo_facebook", seeker.getContactZaloFacebook());
            response.put("receive_promotions", seeker.getReceivePromotions());
            response.put("assigned_staff_id", seeker.getAssignedStaff() != null ? 
                    seeker.getAssignedStaff().getUserId() : null);
            response.put("created_at", seeker.getCreatedAt());
            response.put("updated_at", seeker.getUpdatedAt());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }
} 