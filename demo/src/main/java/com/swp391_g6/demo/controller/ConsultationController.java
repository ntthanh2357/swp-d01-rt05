package com.swp391_g6.demo.controller;

import com.swp391_g6.demo.dto.ConsultationRequestDTO;
import com.swp391_g6.demo.entity.SeekerStaffMapping;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.service.SeekerStaffMappingService;
import com.swp391_g6.demo.service.UserService;
import com.swp391_g6.demo.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    private SeekerStaffMappingService mappingService;

    @PostMapping("/register")
    public ResponseEntity<?> registerConsultation(@RequestBody ConsultationRequestDTO request) {
        try {
            // Validate token
            String token = request.getToken();
            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is required");
            }

            String userId = jwtUtil.getUserIdFromToken(token);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            // Kiểm tra user có tồn tại và có role seeker không
            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            if (!"seeker".equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only seekers can register for consultation");
            }

            // Kiểm tra xem seeker đã có mapping chưa
            if (mappingService.hasExistingMapping(userId)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Seeker already has a staff assigned");
            }

            // Random mapping với staff
            SeekerStaffMapping mapping = mappingService.randomAssignStaffToSeeker(userId);
            
            if (mapping == null) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("No staff available at the moment");
            }

            // Tạo response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đăng ký tư vấn thành công!");
            response.put("seekerId", userId);
            response.put("assignedStaffId", mapping.getStaffId());
            response.put("assignedAt", mapping.getAssignedAt());
            response.put("status", mapping.getStatus());
            
            // Thêm thông tin consultation 
            Map<String, Object> details = new HashMap<>();
            details.put("fullName", request.getFullName());
            details.put("email", request.getEmail());
            details.put("phone", request.getPhone());
            details.put("country", request.getCountry());
            details.put("studyTime", request.getStudyTime());
            details.put("city", request.getCity());
            details.put("educationLevel", request.getEducationLevel());
            details.put("adviceType", request.getAdviceType());
            details.put("scholarshipGoal", request.getScholarshipGoal());
            details.put("major", request.getMajor());
            details.put("note", request.getNote());
            response.put("consultationDetails", details);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Lỗi khi đăng ký tư vấn: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/status/{seekerId}")
    public ResponseEntity<?> getConsultationStatus(@PathVariable String seekerId) {
        try {
            SeekerStaffMapping mapping = mappingService.getMappingBySeeker(seekerId);
            
            if (mapping == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No consultation found for this seeker");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("seekerId", mapping.getSeekerId());
            response.put("staffId", mapping.getStaffId());
            response.put("assignedAt", mapping.getAssignedAt());
            response.put("status", mapping.getStatus());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Lỗi khi lấy trạng thái tư vấn: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
} 