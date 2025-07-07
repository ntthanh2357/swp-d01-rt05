package com.swp391_g6.demo.controller;

import com.swp391_g6.demo.service.OrganizationService;
import com.swp391_g6.demo.service.ScholarshipService;
import com.swp391_g6.demo.entity.Scholarship;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.dto.ScholarshipDTO;
import com.swp391_g6.demo.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/scholarships")
public class ScholarshipController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OrganizationService organizationService;

    @Autowired
    private ScholarshipService scholarshipService;

    // [POST] /api/scholarships/get-active - Get active scholarships
    @PostMapping("/get-active")
    public ResponseEntity<?> getActiveScholarships() {
        List<Scholarship> scholarships = scholarshipService.getActiveScholarships();
        List<ScholarshipDTO> dtos = scholarships.stream()
                .map(ScholarshipDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // [POST] /api/scholarships/get-all - Get all scholarships
    @PostMapping("/get-all")
    public ResponseEntity<?> getAllScholarships() {
        List<Scholarship> scholarships = scholarshipService.getAllScholarships();
        List<ScholarshipDTO> dtos = scholarships.stream()
                .map(ScholarshipDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // [POST] /api/scholarships/add - Add a new scholarship
    @PostMapping("/add")
    public ResponseEntity<?> addScholarship(@RequestBody Map<String, String> body) {
        System.out.println("Received request to add scholarship: " + body);
        String token = body.get("token");
        if (token == null || token.isEmpty()) {
            System.out.println("Token is required for user management");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is required");
        }

        User user = jwtUtil.extractUserFromToken(token);
        if (user == null || !user.getRole().equals("admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        try {
            String title = body.get("title");
            System.out.println("Title: " + title);
            String description = body.get("description");
            System.out.println("Description: " + description);
            String organizationName = body.get("organizationName");
            try {
                organizationService.getOrganizationByName(organizationName);
            } catch (Exception ex) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Không tìm thấy tổ chức với tên: " + organizationName);
            }
            System.out.println("Organization Name: " + organizationName);
            String categoryId = body.get("categoryId");
            System.out.println("Category ID: " + categoryId);
            Double amount = Double.valueOf(body.get("amount"));
            System.out.println("Amount: " + amount);
            String currency = body.get("currency");
            System.out.println("Currency: " + currency);
            Integer duration = Integer.valueOf(body.get("duration"));
            System.out.println("Duration: " + duration);
            String deadlineStr = body.get("applicationDeadline");
            System.out.println("Application Deadline: " + deadlineStr);
            Date applicationDeadline = null;
            if (deadlineStr != null && !deadlineStr.trim().isEmpty()) {
                try {
                    applicationDeadline = Date.valueOf(deadlineStr);
                } catch (IllegalArgumentException ex) {
                    System.out.println("Invalid date format for applicationDeadline: " + deadlineStr);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Ngày hạn nộp không đúng định dạng yyyy-MM-dd");
                }
            }
            System.out.println("Parsed applicationDeadline: " + applicationDeadline);
            String eligibilityCriteria = body.get("eligibilityCriteria");
            System.out.println("Eligibility Criteria: " + eligibilityCriteria);
            String countries = body.get("countries");
            System.out.println("Countries: " + countries);
            String educationLevels = body.get("educationLevels");
            System.out.println("Education Levels: " + educationLevels);
            String fieldsOfStudy = body.get("fieldsOfStudy");
            System.out.println("Fields of Study: " + fieldsOfStudy);
            String createdBy = user.getUserId();
            System.out.println("Creating scholarship with ID: " + createdBy);

            scholarshipService.addScholarship(title, description, organizationName, categoryId, amount, currency,
                    duration, applicationDeadline, eligibilityCriteria, countries, educationLevels, fieldsOfStudy,
                    createdBy);
            return ResponseEntity.ok("Scholarship added successfully");
        } catch (Exception e) {
            System.out.println("Error adding scholarship: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding scholarship: " + e.getMessage());
        }
    }

    // [POST] /api/scholarships/update - Update an existing scholarship
    @PostMapping("/update")
    public ResponseEntity<?> updateScholarship(@RequestBody Map<String, Object> body) {
        String token = (String) body.get("token");
        String email = jwtUtil.extractEmail(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        Scholarship scholarship = scholarshipService.getScholarshipById((String) body.get("scholarshipId"));
        if (scholarship == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Scholarship not found");
        }

        try {
            Object deadlineObj = body.get("applicationDeadline");
            if (deadlineObj != null) {
                String deadlineStr = deadlineObj.toString();
                Date deadlineDate = Date.valueOf(deadlineStr);
                scholarship.setApplicationDeadline(deadlineDate);
            }

            scholarshipService.updateScholarship(scholarship);
            return ResponseEntity.ok("Scholarship updated successfully");
        } catch (Exception e) {
            System.out.println("Error updating scholarship: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating scholarship: " + e.getMessage());
        }
    }

    // [POST] /api/scholarships/delete - Delete a scholarship
    @PostMapping("/delete")
    public ResponseEntity<?> deleteScholarship(String scholarshipId) {
        scholarshipService.deleteScholarship(scholarshipId);
        return ResponseEntity.ok("Scholarship deleted successfully");
    }

    // [POST] /api/scholarships/count-new - Count new scholarships
    @PostMapping("/count-new")
    public ResponseEntity<?> countNewScholarships() {
        int count = scholarshipService.countNewScholarships();
        return ResponseEntity.ok(count);
    }

}