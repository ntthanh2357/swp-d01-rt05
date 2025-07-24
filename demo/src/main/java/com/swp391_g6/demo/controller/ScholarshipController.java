package com.swp391_g6.demo.controller;

import com.swp391_g6.demo.service.OrganizationService;
import com.swp391_g6.demo.service.ScholarshipService;
import com.swp391_g6.demo.service.ScholarshipScarper;
import com.swp391_g6.demo.entity.Scholarship;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.dto.ScholarshipDTO;
import com.swp391_g6.demo.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.Date;
import java.util.HashMap;
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

    @Autowired
    private ScholarshipScarper scholarshipScarper;

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

    // [GET] /api/scholarships/{id} - Get scholarship by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getScholarshipById(@PathVariable String id) {
        Scholarship scholarship = scholarshipService.getScholarshipById(id);
        if (scholarship == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Scholarship not found");
        }
        return ResponseEntity.ok(new ScholarshipDTO(scholarship));
    }

    // [POST] /api/scholarships/scrape - Admin dùng scraper để lấy và lưu học bổng tự động
    @PostMapping("/scrape")
    public ResponseEntity<?> scrapeAndSaveScholarships(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is required");
        }
        User user = jwtUtil.extractUserFromToken(token);
        if (user == null || !"admin".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token or not admin");
        }
        try {
            // Lấy danh sách học bổng từ scraper
            List<Scholarship> scraped = scholarshipScarper.scrape();
            // Lưu vào DB
            for (Scholarship s : scraped) {
                scholarshipService.addScholarship(
                    s.getTitle(), s.getDescription(), s.getOrganizationName(), s.getCategoryId(),
                    s.getAmount(), s.getCurrency(), s.getDuration(), s.getApplicationDeadline(),
                    s.getEligibilityCriteria(), s.getCountries(), s.getEducationLevels(),
                    s.getFieldsOfStudy(), user.getUserId()
                );
            }
            return ResponseEntity.ok("Đã lấy và lưu " + scraped.size() + " học bổng thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi scrape học bổng: " + e.getMessage());
        }
    }

    @PostMapping("/scrape-and-save")
    public Map<String, Object> scrapeAndSave(@RequestBody Map<String, String> body) {
        String url = body.get("url");
        String token = body.get("token");
        Map<String, Object> result = new HashMap<>();

        User user = jwtUtil.extractUserFromToken(token);
        if (user == null || !"admin".equals(user.getRole())) {
            result.put("error", "Access denied");
            return result;
        }

        try {
            Scholarship scholarship = scholarshipScarper.scrapeFromUrl(url);
            scholarship.setCreatedBy(user.getUserId());
            Scholarship saved = scholarshipService.addScholarship(
                scholarship.getTitle(),
                scholarship.getDescription(),
                scholarship.getOrganization() != null ? scholarship.getOrganization().getName() : null,
                scholarship.getCategoryId(),
                scholarship.getAmount(),
                scholarship.getCurrency(),
                scholarship.getDuration(),
                scholarship.getApplicationDeadline(),
                scholarship.getEligibilityCriteria(),
                scholarship.getCountries(),
                scholarship.getEducationLevels(),
                scholarship.getFieldsOfStudy(),
                scholarship.getCreatedBy()
            );
            result.put("scholarship", saved);
            result.put("success", true);
        } catch (IOException e) {
            result.put("error", "Failed to fetch or parse the page.");
        }
        return result;
    }

}