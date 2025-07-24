package com.swp391_g6.demo.controller;

import com.swp391_g6.demo.dto.EmailRequest;
import com.swp391_g6.demo.dto.StaffDTO;
import com.swp391_g6.demo.entity.SeekerStaffMapping;
import com.swp391_g6.demo.entity.StaffReview;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.repository.UserRepository;
import com.swp391_g6.demo.service.DashboardService;
import com.swp391_g6.demo.service.StaffService;
import com.swp391_g6.demo.service.UserService;
import com.swp391_g6.demo.repository.SeekerStaffMappingRepository;
import com.swp391_g6.demo.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Objects;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SeekerStaffMappingRepository seekerStaffMappingRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private StaffService staffService;

    @Autowired
    private DashboardService dashboardService;

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

    @PostMapping("/review")
    public ResponseEntity<?> postStaffReview(@RequestBody Map<String, Object> body) {
        String token = (String) body.get("token");
        String staffId = (String) body.get("staffId");
        Integer rating = (Integer) body.get("rating");
        String reviewContent = (String) body.get("reviewContent");
        Boolean isAnonymous = body.get("isAnonymous") != null && (Boolean) body.get("isAnonymous");
        if (token == null || staffId == null || rating == null) {
            return ResponseEntity.badRequest().body("Thiếu thông tin bắt buộc");
        }
        User seeker = userService.getUserById(jwtUtil.getUserIdFromToken(token));
        if (seeker == null || !"seeker".equals(seeker.getRole())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chỉ seeker mới được đánh giá");
        }
        StaffReview review = new StaffReview();
        review.setStaffId(staffId);
        review.setSeekerId(seeker.getUserId());
        review.setRating(rating);
        review.setReviewContent(reviewContent);
        review.setIsAnonymous(isAnonymous != null ? isAnonymous : false);
        staffService.saveStaffReview(review);
        return ResponseEntity.ok("Đánh giá đã được ghi nhận");
    }

    // [GET] /api/staff/public-profile/{staffId} - Public API lấy profile + review
    // staff
    @GetMapping("/public-profile/{staffId}")
    public ResponseEntity<?> getPublicStaffProfile(@PathVariable("staffId") String staffId) {
        // Lấy staff + user info
        User user = userService.getUserById(staffId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Staff not found");
        }
        StaffDTO dto = staffService.findByUser(user);
        // Lấy review (có tên seeker nếu không ẩn danh)
        List<java.util.Map<String, Object>> reviews = dashboardService.getFeedbackWithSeekerName(staffId);
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("profile", dto);
        result.put("reviews", reviews);
        return ResponseEntity.ok(result);
    }

    // [GET] /api/staff/public-list - Public API lấy danh sách staff (có thể filter sau)
    @GetMapping("/public-list")
    public ResponseEntity<?> getPublicStaffList() {
        List<com.swp391_g6.demo.dto.StaffDTO> staffList = staffService.getAllStaffDTOs();
        return ResponseEntity.ok(staffList);
    }

    // [POST] /api/staff/premium-seekers - Lấy danh sách seekers premium
    @PostMapping("/premium-seekers")
    public ResponseEntity<?> getPremiumSeekers(@RequestBody Map<String, String> body) {
        String token = body.get("token");

        // Validate token and extract user
        User user = jwtUtil.extractUserFromToken(token);
        if (user == null || !"staff".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied", "message", "Only staff members can access this resource"));
        }

        try {
            // Lấy danh sách premium seekers với thông tin đầy đủ
            List<SeekerStaffMapping> mappings = seekerStaffMappingRepo.findPremiumSeekersByStaff(user.getUserId());

            // Extract seeker IDs for batch lookup
            List<String> seekerIds = mappings.stream()
                    .map(SeekerStaffMapping::getSeekerId)
                    .toList();

            // Batch fetch users to avoid N+1 query problem
            List<User> seekerUsers = userRepository.findAllById(seekerIds);
            Map<String, User> seekerUserMap = seekerUsers.stream()
                    .collect(Collectors.toMap(User::getUserId, u -> u));

            // Build result with error handling
            List<Map<String, Object>> result = mappings.stream()
                    .map(mapping -> {
                        User seekerUser = seekerUserMap.get(mapping.getSeekerId());
                        if (seekerUser != null) {
                            Map<String, Object> map = new HashMap<>();
                            map.put("seekerId", mapping.getSeekerId());
                            map.put("name", seekerUser.getName() != null ? seekerUser.getName() : "");
                            map.put("email", seekerUser.getEmail() != null ? seekerUser.getEmail() : "");
                            map.put("phone", seekerUser.getPhone() != null ? seekerUser.getPhone() : "");
                            map.put("assignedAt", mapping.getAssignedAt());
                            return map;
                        }
                        return null;
                    })
                    .filter(Objects::nonNull)
                    .toList();

            // SỬA: Trả về array trực tiếp thay vì object wrapper
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            System.err.println("Error retrieving premium seekers: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error", "message",
                            "Failed to retrieve premium seekers: " + e.getMessage()));
        }
    }

}