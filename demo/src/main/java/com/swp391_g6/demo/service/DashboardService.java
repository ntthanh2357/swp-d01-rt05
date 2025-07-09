package com.swp391_g6.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.swp391_g6.demo.repository.SeekerStaffMappingRepository;
import com.swp391_g6.demo.repository.MessageRepository;
import com.swp391_g6.demo.entity.StaffReview;
import com.swp391_g6.demo.repository.CounselingCaseRepository;
import com.swp391_g6.demo.repository.ScholarshipRepository;
import com.swp391_g6.demo.repository.StaffStatisticsRepository;
import com.swp391_g6.demo.repository.StaffReviewRepository;
import com.swp391_g6.demo.repository.UserRepository;
import com.swp391_g6.demo.entity.SeekerStaffMapping;
import com.swp391_g6.demo.entity.User;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private SeekerStaffMappingRepository seekerStaffMappingRepo;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepo;

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
        result.put("unreadMessages", messageRepo.countUnreadMessagesByStaff(staffId));
        result.put("pendingCases", counselingCaseRepo.countPendingCasesByStaff(staffId));
        result.put("newScholarships", scholarshipRepo.countNewScholarships());
        result.put("completedChats", counselingCaseRepo.countCompletedChatsByStaff(staffId));
        result.put("avgResponseTime", staffStatisticsRepo.getAvgResponseTime(staffId));
        return result;
    }

    // Biểu đồ hoạt động
    public Map<String, Object> getActivityChart(String staffId, String period) {
        // Trả về dữ liệu dạng {labels: [...], data: [...]}
        return counselingCaseRepo.getActivityChartData(staffId, period);
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

    public List<User> getActiveSeekersForStaff(String staffId) {
        List<SeekerStaffMapping> mappings = seekerStaffMappingRepo.findByStaffIdAndStatus(
            staffId, SeekerStaffMapping.Status.active
        );
        List<String> seekerIds = mappings.stream().map(SeekerStaffMapping::getSeekerId).toList();
        if (seekerIds.isEmpty()) return List.of();
        return userRepository.findByUserIdIn(seekerIds);
    }
}