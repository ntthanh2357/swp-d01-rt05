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

import java.util.*;

@Service
public class DashboardService {

    @Autowired
    private SeekerStaffMappingRepository seekerStaffMappingRepo;

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

    // Đánh giá từ người dùng
    public List<StaffReview> getFeedback(String staffId) {
        return staffReviewRepo.getFeedbackByStaff(staffId);
    }
}