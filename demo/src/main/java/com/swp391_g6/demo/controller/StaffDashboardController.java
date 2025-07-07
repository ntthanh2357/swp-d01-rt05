package com.swp391_g6.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.swp391_g6.demo.entity.StaffReview;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.util.JwtUtil;
import com.swp391_g6.demo.service.DashboardService;

import java.util.*;


@RestController
@RequestMapping("/api/staff-dashboard")
public class StaffDashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private JwtUtil jwtUtil;

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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching overview data");
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching activity chart data");
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
            List<StaffReview> feedback = dashboardService.getFeedback(staffId);
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching feedback");
        }
    }
}