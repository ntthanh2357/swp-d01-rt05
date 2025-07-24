package com.swp391_g6.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.util.JwtUtil;
import com.swp391_g6.demo.service.DashboardService;
import com.swp391_g6.demo.repository.SeekerRepository;
import com.swp391_g6.demo.repository.SeekerStaffMappingRepository;
import com.swp391_g6.demo.entity.Seeker;
import com.swp391_g6.demo.dto.SeekerDTO;

import java.util.*;

@RestController
@RequestMapping("/api/staff-dashboard")
public class StaffDashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private SeekerRepository seekerRepository;

    @Autowired
    private SeekerStaffMappingRepository seekerStaffMappingRepo;

    // Tổng quan số liệu
    @PostMapping("/overview")
    public ResponseEntity<?> postOverview(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        User user = jwtUtil.extractUserFromToken(token);
        if (user == null || user.getRole() == null || !user.getRole().equals("staff")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        try {
            String staffId = user.getUserId();
            Map<String, Object> overview = dashboardService.getOverview(staffId);
            return ResponseEntity.ok(overview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching overview data");
        }
    }

    // Biểu đồ hoạt động
    @PostMapping("/activity-chart")
    public ResponseEntity<?> postActivityChart(@RequestBody Map<String, Object> body) {
        String token = (String) body.get("token");
        User user = jwtUtil.extractUserFromToken(token);
        if (user == null || user.getRole() == null || !user.getRole().equals("staff")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        try {
            String staffId = user.getUserId();
            String period = (String) body.get("period");
            Map<String, Object> chartData = dashboardService.getActivityChart(staffId, period);
            return ResponseEntity.ok(chartData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching activity chart data");
        }
    }

    // Đánh giá từ người dùng
    @PostMapping("/feedback")
    public ResponseEntity<?> postFeedback(@RequestBody Map<String, Object> body) {
        String token = (String) body.get("token");
        User user = jwtUtil.extractUserFromToken(token);
        if (user == null || user.getRole() == null || !user.getRole().equals("staff")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        try {
            String staffId = user.getUserId();
            // Sử dụng method mới trả về cả tên seeker
            var feedback = dashboardService.getFeedbackWithSeekerName(staffId);
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching feedback");
        }
    }

    @PostMapping("/active-seekers")
    public ResponseEntity<?> getActiveSeekers(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        User user = jwtUtil.extractUserFromToken(token);
        if (user == null || user.getRole() == null || !user.getRole().equals("staff")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        List<Map<String, Object>> seekers = dashboardService.getActiveSeekersForStaff(user.getUserId());
        return ResponseEntity.ok(seekers);
    }

    @GetMapping("/seeker/{userId}")
    public ResponseEntity<?> getSeekerDetail(@PathVariable String userId) {
        Seeker seeker = seekerRepository.findById(userId).orElse(null);
        if (seeker != null && seeker.getUser() != null) {
            User user = seeker.getUser();
            SeekerDTO dto = new SeekerDTO();
            dto.setUserId(user.getUserId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setPhone(user.getPhone());
            dto.setGender(user.getGender());
            dto.setBio(seeker.getBio());
            dto.setCurrentEducationLevel(
                    seeker.getCurrentEducationLevel() != null ? seeker.getCurrentEducationLevel().name() : null);
            dto.setCity(seeker.getCity());
            dto.setGpa(seeker.getGpa());
            dto.setMajor(seeker.getMajor());
            dto.setNote(seeker.getNote());
            dto.setAdviceType(seeker.getAdviceType());
            dto.setTargetCountries(seeker.getTargetCountries());
            dto.setPreferredLanguages(seeker.getPreferredLanguages());
            dto.setScholarshipGoal(seeker.getScholarshipGoal());
            dto.setStudyTime(seeker.getStudyTime());
            dto.setContactZaloFacebook(seeker.getContactZaloFacebook());
            dto.setReceivePromotions(seeker.getReceivePromotions());
            dto.setSeekerId(seeker.getSeekerId());
            dto.setAssignedStaffId(seeker.getAssignedStaff() != null ? seeker.getAssignedStaff().getUserId() : null);
            dto.setCreatedAt(seeker.getCreatedAt());
            dto.setUpdatedAt(seeker.getUpdatedAt());
            // ... set các trường khác nếu cần
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seeker not found");
        }
    }

    // THÊM: API để lấy seekers premium cho lộ trình tư vấn
    @GetMapping("/premium-seekers")
    public ResponseEntity<?> getPremiumSeekers(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            User user = jwtUtil.extractUserFromToken(token);

            if (user == null || !"staff".equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied", "message",
                                "Only staff members can access this resource"));
            }

            // Lấy danh sách premium seekers với thông tin đầy đủ
            List<com.swp391_g6.demo.entity.SeekerStaffMapping> mappings = seekerStaffMappingRepo
                    .findPremiumSeekersByStaff(user.getUserId());
            List<Map<String, Object>> result = new ArrayList<>();

            for (com.swp391_g6.demo.entity.SeekerStaffMapping mapping : mappings) {
                Optional<com.swp391_g6.demo.entity.User> seekerUserOpt = seekerRepository.findById(mapping.getSeekerId())
                        .map(Seeker::getUser);
                if (seekerUserOpt.isPresent()) {
                    com.swp391_g6.demo.entity.User seekerUser = seekerUserOpt.get();
                    Map<String, Object> seekerData = new HashMap<>();
                    seekerData.put("seekerId", mapping.getSeekerId());
                    seekerData.put("name", seekerUser.getName());
                    seekerData.put("email", seekerUser.getEmail());
                    seekerData.put("phone", seekerUser.getPhone());
                    seekerData.put("assignedAt", mapping.getAssignedAt());
                    result.add(seekerData);
                }
            }

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error", "message", "Failed to retrieve premium seekers"));
        }
    }
}