package com.swp391_g6.demo.controller;

import com.swp391_g6.demo.entity.ConsultationRoadmap;
import com.swp391_g6.demo.entity.Seeker;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.service.ConsultationRoadmapService;
import com.swp391_g6.demo.service.SeekerService;
import com.swp391_g6.demo.repository.UserRepository;
import com.swp391_g6.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/consultation-roadmap")
public class ConsultationRoadmapController {

    @Autowired
    private ConsultationRoadmapService roadmapService;

    @Autowired
    private SeekerService seekerService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Lấy roadmap của seeker hiện tại
     */
    @GetMapping
    public ResponseEntity<?> getCurrentUserRoadmap(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            User user = jwtUtil.extractUserFromToken(token);

            if (user == null || !"seeker".equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied"));
            }

            Seeker seeker = seekerService.findBySeekerId(user.getUserId());
            if (seeker == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Seeker profile not found"));
            }

            // Lấy hoặc tạo roadmap
            List<ConsultationRoadmap> roadmap = roadmapService.getRoadmapBySeeker(seeker.getSeekerId());
            if (roadmap.isEmpty()) {
                roadmap = roadmapService.createDefaultRoadmap(seeker);
                // Bắt đầu roadmap với step đầu tiên
                roadmapService.startRoadmap(seeker.getSeekerId());
                roadmap = roadmapService.getRoadmapBySeeker(seeker.getSeekerId());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("roadmap", roadmap);
            response.put("progress", roadmapService.getRoadmapProgress(seeker.getSeekerId()));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("[ERROR] getCurrentUserRoadmap: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }

    /**
     * Lấy roadmap của seeker cụ thể (cho staff)
     */
    @GetMapping("/{seekerId}")
    public ResponseEntity<?> getSeekerRoadmap(@PathVariable String seekerId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            System.out.println("[DEBUG] getSeekerRoadmap called with seekerId: " + seekerId);

            String token = authHeader.replace("Bearer ", "");
            User user = jwtUtil.extractUserFromToken(token);

            if (user == null || !"staff".equals(user.getRole())) {
                System.out.println("[DEBUG] Access denied - user: " + user + ", role: "
                        + (user != null ? user.getRole() : "null"));
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only staff can view other users' roadmaps"));
            }

            // SỬA: Kiểm tra seeker tồn tại bằng cách tìm User trước
            Optional<User> seekerUserOpt = userRepository.findById(seekerId);
            if (seekerUserOpt.isEmpty()) {
                System.out.println("[DEBUG] User not found for seekerId: " + seekerId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found", "seekerId", seekerId));
            }

            User seekerUser = seekerUserOpt.get();
            if (!"seeker".equals(seekerUser.getRole())) {
                System.out.println("[DEBUG] User is not a seeker: " + seekerUser.getRole());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "User is not a seeker", "role", seekerUser.getRole()));
            }

            // Tìm Seeker profile
            Seeker seeker = seekerService.findBySeekerId(seekerId);
            if (seeker == null) {
                System.out.println("[DEBUG] Seeker profile not found for seekerId: " + seekerId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Seeker profile not found", "seekerId", seekerId));
            }

            System.out.println("[DEBUG] Found seeker: " + seeker.getSeekerId());

            List<ConsultationRoadmap> roadmap = roadmapService.getRoadmapBySeeker(seekerId);
            Map<String, Object> progress = roadmapService.getRoadmapProgress(seekerId);

            System.out.println("[DEBUG] Roadmap size: " + roadmap.size());
            System.out.println("[DEBUG] Progress: " + progress);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("seekerInfo", Map.of(
                    "seekerId", seeker.getSeekerId(),
                    "fullName", seekerUser.getName() != null ? seekerUser.getName() : "Chưa cập nhật",
                    "email", seekerUser.getEmail() != null ? seekerUser.getEmail() : "",
                    "phoneNumber", seekerUser.getPhone() != null ? seekerUser.getPhone() : ""));
            response.put("roadmap", roadmap);
            response.put("progress", progress);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("[ERROR] getSeekerRoadmap: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }

    /**
     * Cập nhật trạng thái step (cho cả seeker và staff)
     */
    @PutMapping("/step")
    public ResponseEntity<?> updateStepStatus(@RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            User user = jwtUtil.extractUserFromToken(token);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied"));
            }

            String seekerId = (String) request.get("seekerId");
            Integer stepNumber = (Integer) request.get("stepNumber");
            String status = (String) request.get("status");
            String notes = (String) request.get("notes");

            // Validate input
            if (stepNumber == null || status == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Missing required fields: stepNumber, status"));
            }

            // SỬA: Logic khác nhau cho seeker và staff
            if ("seeker".equals(user.getRole())) {
                // Seeker chỉ có thể update cho chính mình và chỉ có thể đánh dấu completed
                seekerId = user.getUserId();
                if (!"completed".equals(status)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Seeker can only mark steps as completed"));
                }
            } else if ("staff".equals(user.getRole())) {
                // Staff có thể update cho seeker được assign và có thể thay đổi status
                if (seekerId == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Missing required field: seekerId"));
                }
                // TODO: Validate staff có quyền update cho seeker này không
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Invalid user role"));
            }

            // Validate status
            if (!List.of("pending", "in_progress", "completed").contains(status)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid status. Must be: pending, in_progress, completed"));
            }

            // Validate step number (1-4)
            if (stepNumber < 1 || stepNumber > 4) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid step number. Must be between 1 and 4"));
            }

            ConsultationRoadmap updated = roadmapService.updateStepStatus(seekerId, stepNumber, status, notes);

            if (updated != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Step updated successfully");
                response.put("step", updated);
                response.put("progress", roadmapService.getRoadmapProgress(seekerId));

                // SỬA: Thêm thông tin để frontend biết ai đã update
                response.put("updatedBy", user.getRole());
                response.put("updatedByUserId", user.getUserId());

                // TODO: Gửi thông báo cho staff khi seeker hoàn thành bước
                if ("seeker".equals(user.getRole()) && "completed".equals(status)) {
                    // Tìm staff được assign cho seeker này
                    try {
                        Seeker seeker = seekerService.findBySeekerId(seekerId);
                        if (seeker != null && seeker.getAssignedStaff() != null) {
                            String staffId = seeker.getAssignedStaff().getUserId();

                            // TODO: Implement notification service
                            System.out.println("[NOTIFICATION] Seeker " + seekerId + " completed step " + stepNumber +
                                    " - should notify staff " + staffId);

                            // Placeholder for future notification implementation
                            // notificationService.notifyStaffAboutStepCompletion(staffId, seekerId,
                            // stepNumber, updated.getStepTitle());

                            response.put("notificationSent", true);
                            response.put("notifiedStaffId", staffId);
                        }
                    } catch (Exception e) {
                        System.err.println("[ERROR] Failed to send notification: " + e.getMessage());
                        response.put("notificationSent", false);
                    }
                }

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Step not found"));
            }

        } catch (Exception e) {
            System.err.println("[ERROR] updateStepStatus: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }

    @GetMapping("/stage/{stageNumber}/details")
    public ResponseEntity<?> getStageDetails(@PathVariable Integer stageNumber,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            User user = jwtUtil.extractUserFromToken(token);

            if (user == null || !"seeker".equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied"));
            }

            // Validate stage number (1-4)
            if (stageNumber < 1 || stageNumber > 4) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid stage number. Must be between 1 and 4"));
            }

            List<Map<String, Object>> stageDetails = roadmapService.getDetailedSteps(stageNumber);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stageNumber", stageNumber);
            response.put("stageDetails", stageDetails);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("[ERROR] getStageDetails: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }

    @GetMapping("/staff/stage/{stageNumber}/details")
    public ResponseEntity<?> getStageDetailsForStaff(@PathVariable Integer stageNumber,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            User user = jwtUtil.extractUserFromToken(token);

            if (user == null || !"staff".equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only staff can access this endpoint"));
            }

            // Validate stage number (1-4)
            if (stageNumber < 1 || stageNumber > 4) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid stage number. Must be between 1 and 4"));
            }

            List<Map<String, Object>> stageDetails = roadmapService.getDetailedSteps(stageNumber);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stageNumber", stageNumber);
            response.put("stageDetails", stageDetails);
            response.put("userRole", "staff");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("[ERROR] getStageDetailsForStaff: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }

    /**
     * Khởi tạo roadmap cho seeker (staff only)
     */
    @PostMapping("/create/{seekerId}")
    public ResponseEntity<?> createRoadmapForSeeker(@PathVariable String seekerId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            User user = jwtUtil.extractUserFromToken(token);

            if (user == null || !"staff".equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only staff can create roadmap"));
            }

            Seeker seeker = seekerService.findBySeekerId(seekerId);
            if (seeker == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Seeker not found"));
            }

            // Kiểm tra đã có roadmap chưa
            if (roadmapService.hasRoadmap(seekerId)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Roadmap already exists for this seeker"));
            }

            List<ConsultationRoadmap> roadmap = roadmapService.createDefaultRoadmap(seeker);
            roadmapService.startRoadmap(seekerId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Roadmap created successfully");
            response.put("roadmap", roadmap);
            response.put("progress", roadmapService.getRoadmapProgress(seekerId));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("[ERROR] createRoadmapForSeeker: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }

    /**
     * Xóa roadmap của seeker (staff only)
     */
    @DeleteMapping("/{seekerId}")
    public ResponseEntity<?> deleteRoadmap(@PathVariable String seekerId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            User user = jwtUtil.extractUserFromToken(token);

            if (user == null || !"staff".equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only staff can delete roadmap"));
            }

            if (!roadmapService.hasRoadmap(seekerId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Roadmap not found"));
            }

            roadmapService.deleteRoadmapBySeeker(seekerId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Roadmap deleted successfully"));

        } catch (Exception e) {
            System.err.println("[ERROR] deleteRoadmap: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }

    /**
     * Lấy tiến độ roadmap của seeker hiện tại
     */
    @GetMapping("/progress")
    public ResponseEntity<?> getCurrentUserProgress(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            User user = jwtUtil.extractUserFromToken(token);

            if (user == null || !"seeker".equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied"));
            }

            Seeker seeker = seekerService.findBySeekerId(user.getUserId());
            if (seeker == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Seeker profile not found"));
            }

            Map<String, Object> progress = roadmapService.getRoadmapProgress(seeker.getSeekerId());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("progress", progress);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("[ERROR] getCurrentUserProgress: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }

    /**
     * SỬA: Cập nhật trạng thái step chi tiết
     */
    @PutMapping("/step-detail")
    public ResponseEntity<?> updateStepDetailStatus(@RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            User user = jwtUtil.extractUserFromToken(token);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied"));
            }

            String seekerId = (String) request.get("seekerId");
            Integer stageNumber = (Integer) request.get("stageNumber");
            Integer stepIndex = (Integer) request.get("stepIndex");
            String status = (String) request.get("status");
            String notes = (String) request.get("notes");

            // Validate input
            if (stageNumber == null || stepIndex == null || status == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Missing required fields: stageNumber, stepIndex, status"));
            }

            // Logic khác nhau cho seeker và staff
            if ("seeker".equals(user.getRole())) {
                // Seeker chỉ có thể update cho chính mình và chỉ có thể đánh dấu completed
                seekerId = user.getUserId();
                if (!"completed".equals(status)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Seeker can only mark steps as completed"));
                }
            } else if ("staff".equals(user.getRole())) {
                // Staff có thể update cho seeker được assign và có thể thay đổi status
                if (seekerId == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Missing required field: seekerId"));
                }
                // TODO: Validate staff có quyền update cho seeker này không
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Invalid user role"));
            }

            // Validate status
            if (!List.of("pending", "in_progress", "completed").contains(status)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid status. Must be: pending, in_progress, completed"));
            }

            // Validate stage và step numbers
            if (stageNumber < 1 || stageNumber > 4) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid stage number. Must be between 1 and 4"));
            }

            if (stepIndex < 1 || stepIndex > 3) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid step index. Must be between 1 and 3"));
            }

            // SỬA: Gọi method mới để update step detail
            com.swp391_g6.demo.entity.RoadmapStepDetail updated = roadmapService.updateStepDetailStatus(
                    seekerId, stageNumber, stepIndex, status, notes);

            if (updated != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Step detail updated successfully");
                response.put("stepDetail", updated);
                response.put("progress", roadmapService.getRoadmapProgress(seekerId));

                // Thêm thông tin để frontend biết ai đã update
                response.put("updatedBy", user.getRole());
                response.put("updatedByUserId", user.getUserId());

                // TODO: Gửi thông báo cho staff khi seeker hoàn thành bước
                if ("seeker".equals(user.getRole()) && "completed".equals(status)) {
                    try {
                        Seeker seeker = seekerService.findBySeekerId(seekerId);
                        if (seeker != null && seeker.getAssignedStaff() != null) {
                            String staffId = seeker.getAssignedStaff().getUserId();

                            // TODO: Implement notification service
                            System.out.println("[NOTIFICATION] Seeker " + seekerId + " completed step " +
                                    stageNumber + "." + stepIndex + " - should notify staff " + staffId);

                            response.put("notificationSent", true);
                            response.put("notifiedStaffId", staffId);
                        }
                    } catch (Exception e) {
                        System.err.println("[ERROR] Failed to send notification: " + e.getMessage());
                        response.put("notificationSent", false);
                    }
                }

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Step detail not found"));
            }

        } catch (Exception e) {
            System.err.println("[ERROR] updateStepDetailStatus: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }

    /**
     * SỬA: Lấy chi tiết stage cho seeker cụ thể
     */
    @GetMapping("/{seekerId}/stage/{stageNumber}/details")
    public ResponseEntity<?> getSeekerStageDetails(@PathVariable String seekerId, @PathVariable Integer stageNumber,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            User user = jwtUtil.extractUserFromToken(token);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied"));
            }

            // Kiểm tra quyền truy cập
            if ("seeker".equals(user.getRole())) {
                if (!user.getUserId().equals(seekerId)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(Map.of("error", "Can only access your own roadmap"));
                }
            } else if (!"staff".equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied"));
            }

            // Validate stage number (1-4)
            if (stageNumber < 1 || stageNumber > 4) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid stage number. Must be between 1 and 4"));
            }

            // SỬA: Lấy chi tiết từ database thay vì hardcode
            List<Map<String, Object>> stageDetails = roadmapService.getDetailedSteps(seekerId, stageNumber);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stageNumber", stageNumber);
            response.put("seekerId", seekerId);
            response.put("stageDetails", stageDetails);
            response.put("userRole", user.getRole());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("[ERROR] getSeekerStageDetails: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }
}