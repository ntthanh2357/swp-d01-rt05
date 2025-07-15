package com.swp391_g6.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swp391_g6.demo.entity.Scholarship;
import com.swp391_g6.demo.entity.Staff;
import com.swp391_g6.demo.repository.StaffRepository;
import com.swp391_g6.demo.service.ScholarshipService;

@RestController
@RequestMapping("/api/admin-dashboard")
public class AdminDashboardController {

    @Autowired
    private ScholarshipService scholarshipService;

    @Autowired
    private StaffRepository staffRepository;

    // Lấy danh sách staff
    @GetMapping("/staff-list")
    public List<Staff> getStaffList() {
        return staffRepository.findAll();
    }

    // Lấy danh sách học bổng theo staff (hoặc tất cả nếu không truyền staffId)
    @PostMapping("/scholarships")
    public List<Scholarship> getScholarships(@RequestBody(required = false) Map<String, Object> body) {
        if (body != null && body.containsKey("staffId") && body.get("staffId") != null && !body.get("staffId").toString().isEmpty()) {
            String staffId = body.get("staffId").toString();
            return (List<Scholarship>) scholarshipService.getScholarshipById(staffId);
        }
        return scholarshipService.getAllScholarships();
    }

    // Thống kê tổng quan cho admin
    @GetMapping("/overview")
    public Map<String, Object> getOverview() {
        Map<String, Object> overview = new HashMap<>();
        overview.put("totalScholarships", scholarshipService.getAllScholarships().size());
        overview.put("totalStaff", staffRepository.count());
        // Có thể bổ sung thêm các thống kê khác
        return overview;
    }
}
