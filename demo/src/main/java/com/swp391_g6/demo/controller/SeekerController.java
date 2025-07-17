package com.swp391_g6.demo.controller;

import java.util.Map;
import java.util.HashMap;
import java.math.BigDecimal;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;

import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.dto.EmailRequest;
import com.swp391_g6.demo.entity.Seeker;
import com.swp391_g6.demo.service.UserService;
import com.swp391_g6.demo.service.SeekerService;
import com.swp391_g6.demo.util.JwtUtil;
import com.swp391_g6.demo.entity.FavoriteScholarship;
import java.util.List;
import com.swp391_g6.demo.entity.Scholarship;
import com.swp391_g6.demo.repository.ScholarshipRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Collections;

@RestController
@RequestMapping("/api/seeker")
public class SeekerController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private SeekerService seekerService;

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    // [POST] /api/seeker/profile - Lấy thông tin hồ sơ người tìm việc
    @PostMapping("/profile")
    public ResponseEntity<?> getSeekerProfile(HttpServletRequest request, @RequestBody(required = false) Map<String, String> body) {
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bearer token is required");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        // Kiểm tra nếu có seekerId trong body thì lấy thông tin seeker đó
        String targetSeekerId = null;
        if (body != null && body.get("seekerId") != null) {
            targetSeekerId = body.get("seekerId");
        }

        User targetUser = user;
        if (targetSeekerId != null && !targetSeekerId.equals(user.getUserId())) {
            // Nếu có seekerId khác, kiểm tra quyền (chỉ staff mới được xem thông tin seeker khác)
            if (!"staff".equals(user.getRole()) && !"admin".equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
            targetUser = userService.getUserById(targetSeekerId);
            if (targetUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Target user not found");
            }
        }

        // Lấy thông tin seeker profile
        Seeker seeker = seekerService.findByUser(targetUser);
        if (seeker == null) {
            // Nếu chưa có seeker profile, tạo mới
            seekerService.createSeekerProfile(targetUser);
            seeker = seekerService.findByUser(targetUser);
        }

        Map<String, Object> response = new HashMap<>();

        // Thông tin cơ bản từ user
        response.put("user_id", targetUser.getUserId());
        response.put("name", targetUser.getName());
        response.put("email", targetUser.getEmail());
        response.put("phone", targetUser.getPhone());
        response.put("date_of_birth", targetUser.getDateOfBirth());
        response.put("gender", targetUser.getGender());
        response.put("role", targetUser.getRole());

        // Thông tin chi tiết từ seeker
        if (seeker != null) {
            response.put("seeker_id", seeker.getSeekerId());
            response.put("current_education_level", seeker.getCurrentEducationLevel());
            response.put("field_of_study", seeker.getFieldOfStudy());
            response.put("gpa", seeker.getGpa());
            response.put("target_degree", seeker.getTargetDegree());
            response.put("target_countries", seeker.getTargetCountries());
            response.put("preferred_languages", seeker.getPreferredLanguages());
            response.put("financial_need_level", seeker.getFinancialNeedLevel());
            response.put("cv_url", seeker.getCvUrl());
            response.put("bio", seeker.getBio());
            response.put("assigned_staff_id",
                    seeker.getAssignedStaff() != null ? seeker.getAssignedStaff().getUserId() : null);
            
            // Thêm thông tin từ form đăng ký tư vấn
            response.put("study_time", seeker.getStudyTime());
            response.put("city", seeker.getCity());
            response.put("advice_type", seeker.getAdviceType());
            response.put("scholarship_goal", seeker.getScholarshipGoal());
            response.put("major", seeker.getMajor());
            response.put("note", seeker.getNote());
            response.put("receive_promotions", seeker.getReceivePromotions());
            response.put("created_at", seeker.getCreatedAt());
            response.put("updated_at", seeker.getUpdatedAt());
            
            // Debug: In ra console để kiểm tra
            System.out.println("Seeker data being sent:");
            System.out.println("Study time: " + seeker.getStudyTime());
            System.out.println("City: " + seeker.getCity());
            System.out.println("Advice type: " + seeker.getAdviceType());
            System.out.println("Scholarship goal: " + seeker.getScholarshipGoal());
            System.out.println("Major: " + seeker.getMajor());
            System.out.println("Note: " + seeker.getNote());
        }

        return ResponseEntity.ok(response);
    }

    // [POST] /api/seeker/update-profile - Cập nhật hồ sơ người tìm việc
    @PostMapping("/update-seeker-profile")
    public ResponseEntity<?> updateSeekerProfile(@RequestBody Map<String, Object> updates, HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bearer token is required");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        Seeker seeker = seekerService.findByUser(user);
        if (seeker == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seeker profile not found");
        }

        // Allow null for current_education_level
        if (updates.containsKey("current_education_level")) {
            Object edu = updates.get("current_education_level");
            if (edu == null) {
                seeker.setCurrentEducationLevel(null);
            } else {
                try {
                    seeker.setCurrentEducationLevel(Seeker.EducationLevel.valueOf(edu.toString()));
                } catch (Exception e) {
                    seeker.setCurrentEducationLevel(null);
                }
            }
        }

        // Allow null for field_of_study
        if (updates.containsKey("field_of_study")) {
            seeker.setFieldOfStudy((String) updates.get("field_of_study"));
        }

        // Allow null for gpa
        if (updates.containsKey("gpa")) {
            Object gpaObj = updates.get("gpa");
            if (gpaObj == null) {
                seeker.setGpa(null);
            } else {
                try {
                    seeker.setGpa(new BigDecimal(gpaObj.toString()));
                } catch (Exception e) {
                    seeker.setGpa(null);
                }
            }
        }

        // Allow null for target_degree
        if (updates.containsKey("target_degree")) {
            seeker.setTargetDegree((String) updates.get("target_degree"));
        }

        ObjectMapper mapper = new ObjectMapper();
        // Allow null for target_countries
        if (updates.containsKey("target_countries")) {
            Object tc = updates.get("target_countries");
            if (tc == null) {
                seeker.setTargetCountries(null);
            } else {
                try {
                    if (tc instanceof String) {
                        seeker.setTargetCountries((String) tc);
                    } else {
                        seeker.setTargetCountries(mapper.writeValueAsString(tc));
                    }
                } catch (Exception e) {
                    seeker.setTargetCountries(null);
                }
            }
        }

        // Allow null for preferred_languages
        if (updates.containsKey("preferred_languages")) {
            Object pl = updates.get("preferred_languages");
            if (pl == null) {
                seeker.setPreferredLanguages(null);
            } else {
                try {
                    if (pl instanceof String) {
                        seeker.setPreferredLanguages((String) pl);
                    } else {
                        seeker.setPreferredLanguages(mapper.writeValueAsString(pl));
                    }
                } catch (Exception e) {
                    seeker.setPreferredLanguages(null);
                }
            }
        }

        // Allow null for financial_need_level
        if (updates.containsKey("financial_need_level")) {
            Object fnl = updates.get("financial_need_level");
            if (fnl == null) {
                seeker.setFinancialNeedLevel(null);
            } else {
                try {
                    seeker.setFinancialNeedLevel(Seeker.FinancialNeedLevel.valueOf(fnl.toString()));
                } catch (Exception e) {
                    seeker.setFinancialNeedLevel(null);
                }
            }
        }

        // Allow null for cv_url
        if (updates.containsKey("cv_url")) {
            seeker.setCvUrl((String) updates.get("cv_url"));
        }

        // Allow null for bio
        if (updates.containsKey("bio")) {
            seeker.setBio((String) updates.get("bio"));
        }

        seekerService.updateSeekerProfile(seeker);

        return ResponseEntity.status(HttpStatus.OK).body("Hồ sơ người tìm việc đã được cập nhật thành công");
    }

    // [POST] /api/seeker-verification - Update verification status
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendUpdateOtp(@RequestBody EmailRequest request) {
        seekerService.sendUpdateSeekerProfileOtp(request.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body("Mã OTP đã được gửi đến email của bạn");
    }

    // [POST] /api/seeker/verify-otp - Verify update OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyUpdateOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and OTP are required");
        }

        boolean isVerified = seekerService.verifyUpdateSeekerProfileOtp(email, otp);
        if (isVerified) {
            return ResponseEntity.status(HttpStatus.OK).body("OTP verified successfully");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired OTP");
        }
    }

    // [POST] /api/seeker/favorite-scholarships - Lấy danh sách học bổng yêu thích
    // của seeker
    @PostMapping("/favorite-scholarships")
    public ResponseEntity<?> getFavoriteScholarships(
            HttpServletRequest request,
            @RequestBody(required = false) Map<String, String> body) {

        System.out.println("=== GET /favorite-scholarships called ===");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Request method: " + request.getMethod());

        // Get token from Authorization header first (preferred method)
        String token = null;
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else if (body != null && body.get("token") != null) {
            // Fallback to request body if Authorization header is not present
            token = body.get("token");
        }

        System.out.println("Token: " + token);
        if (token == null) {
            System.out.println("Token is null");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Token is required"));
        }

        String email = jwtUtil.extractEmail(token);
        System.out.println("Email: " + email);
        if (email == null) {
            System.out.println("Email is null");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Invalid token"));
        }

        User user = userService.findByEmail(email);
        System.out.println("UserId: " + (user != null ? user.getUserId() : "null"));
        System.out.println("User role: " + (user != null ? user.getRole() : "null"));
        if (user == null) {
            System.out.println("User not found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "User not found"));
        }

        try {
            List<FavoriteScholarship> favorites = seekerService.findFavoriteScholarshipsByUserId(user.getUserId());
            System.out.println("Found " + favorites.size() + " favorites");
            return ResponseEntity.ok(favorites);
        } catch (Exception e) {
            System.out.println("Error getting favorites: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to get favorites: " + e.getMessage()));
        }
    }

    // [POST] /api/seeker/favorite - Thêm học bổng vào yêu thích
    @PostMapping("/favorite")
    public ResponseEntity<?> addFavorite(
            HttpServletRequest request,
            @RequestBody Map<String, String> body) {

        // Get token from Authorization header first (preferred method)
        String token = null;
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else if (body != null && body.get("token") != null) {
            // Fallback to request body if Authorization header is not present
            token = body.get("token");
        }

        String scholarshipId = body.get("scholarshipId");
        System.out.println("Token: " + token);
        System.out.println("ScholarshipId: " + scholarshipId);

        if (token == null || scholarshipId == null || scholarshipId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Token and scholarshipId are required"));
        }

        String email = jwtUtil.extractEmail(token);
        System.out.println("Email: " + email);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Invalid token"));
        }

        User user = userService.findByEmail(email);
        System.out.println("UserId: " + (user != null ? user.getUserId() : "null"));
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "User not found"));
        }

        Scholarship scholarship = scholarshipRepository.findByScholarshipId(scholarshipId);
        if (scholarship == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Scholarship not found"));
        }

        FavoriteScholarship favorite = seekerService.addFavoriteScholarship(user, scholarship, null);
        return ResponseEntity.ok(favorite);
    }

    // [DELETE] /api/seeker/favorite - Bỏ học bổng khỏi yêu thích
    @DeleteMapping("/favorite")
    public ResponseEntity<?> removeFavorite(
            HttpServletRequest request,
            @RequestBody Map<String, String> body) {

        System.out.println("=== DELETE /favorite called ===");
        System.out.println("Request body: " + body);

        // Get token from Authorization header first (preferred method)
        String token = null;
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else if (body != null && body.get("token") != null) {
            // Fallback to request body if Authorization header is not present
            token = body.get("token");
        }

        String scholarshipId = body.get("scholarshipId");
        System.out.println("Token: " + token);
        System.out.println("ScholarshipId: " + scholarshipId);

        if (token == null || scholarshipId == null || scholarshipId.isEmpty()) {
            System.out.println("Missing required parameters");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Token and scholarshipId are required"));
        }

        String email = jwtUtil.extractEmail(token);
        System.out.println("Email: " + email);
        if (email == null) {
            System.out.println("Invalid token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Invalid token"));
        }

        User user = userService.findByEmail(email);
        System.out.println("UserId: " + (user != null ? user.getUserId() : "null"));
        if (user == null) {
            System.out.println("User not found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "User not found"));
        }

        Scholarship scholarship = scholarshipRepository.findByScholarshipId(scholarshipId);
        System.out.println("Scholarship: " + (scholarship != null ? scholarship.getScholarshipId() : "null"));
        if (scholarship == null) {
            System.out.println("Scholarship not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Scholarship not found"));
        }

        try {
            seekerService.removeFavoriteScholarship(user, scholarship);
            System.out.println("Successfully removed favorite");
            return ResponseEntity.ok(Collections.singletonMap("message", "Removed from favorites"));
        } catch (Exception e) {
            System.out.println("Error removing favorite: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to remove favorite: " + e.getMessage()));
        }
    }
}
