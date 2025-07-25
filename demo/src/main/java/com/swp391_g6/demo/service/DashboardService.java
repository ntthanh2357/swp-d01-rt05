package com.swp391_g6.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.swp391_g6.demo.repository.SeekerStaffMappingRepository;
import com.swp391_g6.demo.entity.StaffReview;
import com.swp391_g6.demo.repository.CounselingCaseRepository;
import com.swp391_g6.demo.repository.ScholarshipRepository;
import com.swp391_g6.demo.repository.StaffStatisticsRepository;
import com.swp391_g6.demo.repository.StaffReviewRepository;
import com.swp391_g6.demo.repository.UserRepository;
import com.swp391_g6.demo.entity.SeekerStaffMapping;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.entity.StaffStatistics;

import java.util.*;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.Cacheable;

@Service
public class DashboardService {

    @Autowired
    private SeekerStaffMappingRepository seekerStaffMappingRepo;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CounselingCaseRepository counselingCaseRepo;

    @Autowired
    private ScholarshipRepository scholarshipRepo;

    @Autowired
    private StaffStatisticsRepository staffStatisticsRepo;

    @Autowired
    private StaffReviewRepository staffReviewRepo;

    // Tổng quan số liệu
    public Map<String, Object> getOverview(String staffId) {
        Map<String, Object> result = new HashMap<>();
        result.put("activeSeekers", seekerStaffMappingRepo.countActiveSeekersByStaff(staffId));

        // SỬA: Đảm bảo lấy đúng số premium seekers
        try {
            int premiumCount = seekerStaffMappingRepo.countPremiumSeekersByStaff(staffId);
            result.put("premiumSeekers", premiumCount);
        } catch (Exception e) {
            result.put("premiumSeekers", 0);
        }

        // Lấy pendingCases từ staff_statistics
        StaffStatistics latestStats = staffStatisticsRepo.findTopByStaffIdOrderByStatisticDateDesc(staffId);
        int pendingCases = 0;
        if (latestStats != null) {
            int handled = latestStats.getCasesHandled() != null ? latestStats.getCasesHandled() : 0;
            int resolved = latestStats.getCasesResolved() != null ? latestStats.getCasesResolved() : 0;
            pendingCases = handled - resolved;
            if (pendingCases < 0)
                pendingCases = 0;
        }
        result.put("pendingCases", pendingCases);
        result.put("newScholarships", scholarshipRepo.countNewScholarships());
        result.put("completedChats", counselingCaseRepo.countCompletedChatsByStaff(staffId));
        result.put("avgResponseTime", staffStatisticsRepo.getAvgResponseTime(staffId));
        return result;
    }

    // Biểu đồ hoạt động (dùng staff_statistics, có cache)
    @Cacheable(value = "staffActivityChart", key = "#staffId + '_' + #period")
    public Map<String, Object> getActivityChart(String staffId, String period) {
        // Lấy dữ liệu từ staff_statistics
        var stats = staffStatisticsRepo.findByStaffIdOrderByStatisticDateAsc(staffId);
        List<String> labels = stats.stream()
                .map(s -> s.getStatisticDate().toString())
                .collect(Collectors.toList());
        List<Integer> casesHandled = stats.stream()
                .map(s -> s.getCasesHandled() != null ? s.getCasesHandled() : 0)
                .collect(Collectors.toList());
        // Có thể bổ sung thêm các trường khác nếu muốn
        Map<String, Object> result = new HashMap<>();
        result.put("labels", labels);
        result.put("data", casesHandled);
        return result;
    }

    // Đánh giá từ người dùng (có tên seeker)
    public List<Map<String, Object>> getFeedbackWithSeekerName(String staffId) {
        List<StaffReview> reviews = staffReviewRepo.getFeedbackByStaff(staffId);
        Map<String, String> seekerIdToName = new HashMap<>();
        List<String> seekerIds = reviews.stream()
                .filter(r -> r.getSeekerId() != null)
                .map(StaffReview::getSeekerId)
                .distinct()
                .collect(Collectors.toList());
        if (!seekerIds.isEmpty()) {
            List<User> seekers = userRepository.findByUserIdIn(seekerIds);
            for (User u : seekers) {
                seekerIdToName.put(u.getUserId(), u.getName());
            }
        }
        List<Map<String, Object>> result = new ArrayList<>();
        for (StaffReview r : reviews) {
            Map<String, Object> map = new HashMap<>();
            map.put("seekerId", r.getSeekerId());
            map.put("seekerName", seekerIdToName.getOrDefault(r.getSeekerId(), r.getSeekerId()));
            map.put("isAnonymous", r.getIsAnonymous());
            map.put("rating", r.getRating());
            map.put("reviewContent", r.getReviewContent());
            map.put("createdAt", r.getCreatedAt());
            result.add(map);
        }
        return result;
    }

    public List<Map<String, Object>> getActiveSeekersForStaff(String staffId) {
        List<SeekerStaffMapping> mappings = seekerStaffMappingRepo.findByStaffIdAndStatus(
                staffId, SeekerStaffMapping.Status.active);
        List<String> seekerIds = mappings.stream().map(SeekerStaffMapping::getSeekerId).toList();
        if (seekerIds.isEmpty())
            return List.of();
        List<User> users = userRepository.findByUserIdIn(seekerIds);
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("user_id", u.getUserId());
            map.put("name", u.getName());
            map.put("email", u.getEmail());
            map.put("phone", u.getPhone());
            // Có thể bổ sung thêm các trường khác nếu muốn
            result.add(map);
        }
        return result;
    }
}