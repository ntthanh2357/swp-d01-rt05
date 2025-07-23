package com.swp391_g6.demo.service;

import com.swp391_g6.demo.entity.ConsultationRoadmap;
import com.swp391_g6.demo.entity.RoadmapStepDetail;
import com.swp391_g6.demo.entity.Seeker;
import com.swp391_g6.demo.repository.ConsultationRoadmapRepository;
import com.swp391_g6.demo.repository.RoadmapStepDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ConsultationRoadmapService {

    @Autowired
    private ConsultationRoadmapRepository roadmapRepository;

    @Autowired
    private RoadmapStepDetailRepository stepDetailRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Tạo roadmap với 4 giai đoạn cố định cho seeker
     */
    @Transactional
    public List<ConsultationRoadmap> createDefaultRoadmap(Seeker seeker) {
        String seekerId = seeker.getSeekerId();

        // Kiểm tra xem đã có roadmap chưa
        if (roadmapRepository.existsBySeekerId(seekerId)) {
            return roadmapRepository.findBySeekerIdOrderByStepNumber(seekerId);
        }

        List<ConsultationRoadmap> roadmapSteps = new ArrayList<>();

        // Giai đoạn 1: Định hướng & Lập kế hoạch
        roadmapSteps.add(new ConsultationRoadmap(seekerId, 1,
                "Giai đoạn 1: Định hướng & Lập kế hoạch",
                "• Đánh giá năng lực cá nhân và tài chính\n" +
                        "• Nghiên cứu và chọn học bổng phù hợp\n" +
                        "• Xác định trường target và timeline cụ thể",
                14));

        // Giai đoạn 2: Chuẩn bị hồ sơ cá nhân
        roadmapSteps.add(new ConsultationRoadmap(seekerId, 2,
                "Giai đoạn 2: Chuẩn bị hồ sơ cá nhân",
                "• Chuẩn bị chứng chỉ ngôn ngữ (IELTS/TOEFL)\n" +
                        "• Làm hồ sơ cá nhân (CV, SOP, thư giới thiệu)\n" +
                        "• Chuẩn bị các giấy tờ học tập và chứng chỉ",
                30));

        // Giai đoạn 3: Nộp hồ sơ học bổng & trường
        roadmapSteps.add(new ConsultationRoadmap(seekerId, 3,
                "Giai đoạn 3: Nộp hồ sơ học bổng & trường",
                "• Nộp hồ sơ theo deadline\n" +
                        "• Theo dõi tiến trình xét duyệt\n" +
                        "• Chuẩn bị cho phỏng vấn (nếu có)",
                21));

        // Giai đoạn 4: Nhận kết quả & hoàn thiện thủ tục
        roadmapSteps.add(new ConsultationRoadmap(seekerId, 4,
                "Giai đoạn 4: Nhận kết quả & hoàn thiện thủ tục",
                "• Nhận thông báo kết quả\n" +
                        "• Làm thủ tục visa và xuất cảnh\n" +
                        "• Chuẩn bị khởi hành và thích nghi môi trường mới",
                28));

        // Lưu tất cả stages
        List<ConsultationRoadmap> savedSteps = roadmapRepository.saveAll(roadmapSteps);

        // THÊM: Tạo các steps chi tiết cho từng stage
        createDetailedStepsForAllStages(seekerId);

        return savedSteps;
    }

    /**
     * THÊM: Tạo các steps chi tiết cho tất cả stages
     */
    @Transactional
    private void createDetailedStepsForAllStages(String seekerId) {
        List<RoadmapStepDetail> allDetailSteps = new ArrayList<>();

        // Stage 1 details
        allDetailSteps.add(new RoadmapStepDetail(seekerId, 1, 1,
                "Đánh giá năng lực cá nhân và tài chính",
                "Đánh giá điểm số học tập, khả năng tài chính và mục tiêu cá nhân", 5));
        allDetailSteps.add(new RoadmapStepDetail(seekerId, 1, 2,
                "Nghiên cứu và chọn học bổng phù hợp",
                "Tìm hiểu các học bổng phù hợp với ngành học và điều kiện", 5));
        allDetailSteps.add(new RoadmapStepDetail(seekerId, 1, 3,
                "Xác định trường target và timeline cụ thể",
                "Lập danh sách trường mục tiêu và lịch trình chi tiết", 4));

        // Stage 2 details
        allDetailSteps.add(new RoadmapStepDetail(seekerId, 2, 1,
                "Chuẩn bị chứng chỉ ngôn ngữ (IELTS/TOEFL)",
                "Ôn luyện và thi chứng chỉ ngôn ngữ theo yêu cầu", 12));
        allDetailSteps.add(new RoadmapStepDetail(seekerId, 2, 2,
                "Làm hồ sơ cá nhân (CV, SOP, thư giới thiệu)",
                "Soạn thảo CV, thư động lực và xin thư giới thiệu", 14));
        allDetailSteps.add(new RoadmapStepDetail(seekerId, 2, 3,
                "Chuẩn bị các giấy tờ học tập và chứng chỉ",
                "Thu thập bằng cấp, bảng điểm và các chứng chỉ khác", 4));

        // Stage 3 details
        allDetailSteps.add(new RoadmapStepDetail(seekerId, 3, 1,
                "Nộp hồ sơ theo deadline",
                "Nộp hồ sơ đúng thời hạn cho từng trường và học bổng", 7));
        allDetailSteps.add(new RoadmapStepDetail(seekerId, 3, 2,
                "Theo dõi tiến trình xét duyệt",
                "Kiểm tra email và portal để cập nhật tình trạng hồ sơ", 7));
        allDetailSteps.add(new RoadmapStepDetail(seekerId, 3, 3,
                "Chuẩn bị cho phỏng vấn (nếu có)",
                "Luyện tập phỏng vấn và chuẩn bị câu trả lời", 7));

        // Stage 4 details
        allDetailSteps.add(new RoadmapStepDetail(seekerId, 4, 1,
                "Nhận thông báo kết quả",
                "Nhận và xem xét các kết quả học bổng và nhập học", 3));
        allDetailSteps.add(new RoadmapStepDetail(seekerId, 4, 2,
                "Làm thủ tục visa và xuất cảnh",
                "Chuẩn bị hồ sơ visa và hoàn thành thủ tục pháp lý", 21));
        allDetailSteps.add(new RoadmapStepDetail(seekerId, 4, 3,
                "Chuẩn bị khởi hành và thích nghi môi trường mới",
                "Sắp xếp chỗ ở, hành lý và chuẩn bị tâm lý", 4));

        stepDetailRepository.saveAll(allDetailSteps);
    }

    /**
     * SỬA: Cập nhật trạng thái của một step chi tiết cụ thể
     */
    @Transactional
    public RoadmapStepDetail updateStepDetailStatus(String seekerId, Integer stageNumber,
            Integer stepIndex, String status, String notes) {
        System.out.println("[DEBUG] updateStepDetailStatus - seekerId: " + seekerId +
                ", stageNumber: " + stageNumber + ", stepIndex: " + stepIndex + ", status: " + status);

        RoadmapStepDetail stepDetail = stepDetailRepository.findBySeekerIdAndStageNumberAndStepIndex(
                seekerId, stageNumber, stepIndex);

        if (stepDetail != null) {
            String oldStatus = stepDetail.getStatus();
            stepDetail.setStatus(status);
            stepDetail.setNotes(notes);

            if ("completed".equals(status)) {
                stepDetail.setCompletedAt(LocalDateTime.now());
            }

            RoadmapStepDetail saved = stepDetailRepository.save(stepDetail);
            System.out.println("[DEBUG] Step detail updated - old status: " + oldStatus + ", new status: "
                    + status);

            // Kiểm tra và cập nhật trạng thái stage nếu tất cả steps đã completed
            checkAndUpdateStageStatus(seekerId, stageNumber);

            return saved;
        } else {
            System.err.println("[ERROR] Step detail not found - seekerId: " + seekerId +
                    ", stageNumber: " + stageNumber + ", stepIndex: " + stepIndex);
        }
        return null;
    }

    /**
     * THÊM: Kiểm tra và cập nhật trạng thái stage
     */
    @Transactional
    private void checkAndUpdateStageStatus(String seekerId, Integer stageNumber) {
        Boolean isStageCompleted = stepDetailRepository.isStageCompleted(seekerId, stageNumber);

        if (Boolean.TRUE.equals(isStageCompleted)) {
            // Tất cả steps trong stage đã completed, cập nhật stage status
            ConsultationRoadmap stage = roadmapRepository.findBySeekerIdAndStepNumber(seekerId,
                    stageNumber);
            if (stage != null && !"completed".equals(stage.getStepStatus())) {
                stage.setStepStatus("completed");
                stage.setCompletedAt(LocalDateTime.now());
                roadmapRepository.save(stage);

                System.out.println("[DEBUG] Stage " + stageNumber + " marked as completed");

                // Tự động start stage tiếp theo nếu có
                ConsultationRoadmap nextStage = roadmapRepository.findBySeekerIdAndStepNumber(seekerId,
                        stageNumber + 1);
                if (nextStage != null && "pending".equals(nextStage.getStepStatus())) {
                    nextStage.setStepStatus("in_progress");
                    roadmapRepository.save(nextStage);

                    // Set step đầu tiên của stage tiếp theo thành in_progress
                    RoadmapStepDetail firstStepNextStage = stepDetailRepository
                            .findBySeekerIdAndStageNumberAndStepIndex(
                                    seekerId, stageNumber + 1, 1);
                    if (firstStepNextStage != null
                            && "pending".equals(firstStepNextStage.getStatus())) {
                        firstStepNextStage.setStatus("in_progress");
                        stepDetailRepository.save(firstStepNextStage);
                    }

                    System.out.println("[DEBUG] Auto-started next stage: " + (stageNumber + 1));
                }
            }
        }
    }

    /**
     * SỬA: Lấy các bước chi tiết của từng giai đoạn từ database
     */
    public List<Map<String, Object>> getDetailedSteps(String seekerId, int stageNumber) {
        List<RoadmapStepDetail> stepDetails = stepDetailRepository.findBySeekerIdAndStageNumberOrderByStepIndex(
                seekerId, stageNumber);

        List<Map<String, Object>> steps = new ArrayList<>();
        for (RoadmapStepDetail detail : stepDetails) {
            Map<String, Object> step = new HashMap<>();
            step.put("stepIndex", detail.getStepIndex());
            step.put("title", detail.getStepTitle());
            step.put("description", detail.getStepDescription());
            step.put("estimatedDuration", detail.getEstimatedDurationDays());
            step.put("status", detail.getStatus());
            step.put("completedAt", detail.getCompletedAt());
            step.put("notes", detail.getNotes());
            steps.add(step);
        }

        return steps;
    }

    /**
     * SỬA: Lấy các bước chi tiết template (cho staff khi chưa có seeker cụ thể)
     */
    public List<Map<String, Object>> getDetailedSteps(int stageNumber) {
        List<Map<String, Object>> steps = new ArrayList<>();

        switch (stageNumber) {
            case 1: // Giai đoạn 1: Định hướng & Lập kế hoạch
                steps.add(createStep(1, "Đánh giá năng lực cá nhân và tài chính",
                        "Đánh giá điểm số học tập, khả năng tài chính và mục tiêu cá nhân", 5));
                steps.add(createStep(2, "Nghiên cứu và chọn học bổng phù hợp",
                        "Tìm hiểu các học bổng phù hợp với ngành học và điều kiện", 5));
                steps.add(createStep(3, "Xác định trường target và timeline cụ thể",
                        "Lập danh sách trường mục tiêu và lịch trình chi tiết", 4));
                break;

            case 2: // Giai đoạn 2: Chuẩn bị hồ sơ cá nhân
                steps.add(createStep(1, "Chuẩn bị chứng chỉ ngôn ngữ (IELTS/TOEFL)",
                        "Ôn luyện và thi chứng chỉ ngôn ngữ theo yêu cầu", 12));
                steps.add(createStep(2, "Làm hồ sơ cá nhân (CV, SOP, thư giới thiệu)",
                        "Soạn thảo CV, thư động lực và xin thư giới thiệu", 14));
                steps.add(createStep(3, "Chuẩn bị các giấy tờ học tập và chứng chỉ",
                        "Thu thập bằng cấp, bảng điểm và các chứng chỉ khác", 4));
                break;

            case 3: // Giai đoạn 3: Nộp hồ sơ học bổng & trường
                steps.add(createStep(1, "Nộp hồ sơ theo deadline",
                        "Nộp hồ sơ đúng thời hạn cho từng trường và học bổng", 7));
                steps.add(createStep(2, "Theo dõi tiến trình xét duyệt",
                        "Kiểm tra email và portal để cập nhật tình trạng hồ sơ", 7));
                steps.add(createStep(3, "Chuẩn bị cho phỏng vấn (nếu có)",
                        "Luyện tập phỏng vấn và chuẩn bị câu trả lời", 7));
                break;

            case 4: // Giai đoạn 4: Nhận kết quả & hoàn thiện thủ tục
                steps.add(createStep(1, "Nhận thông báo kết quả",
                        "Nhận và xem xét các kết quả học bổng và nhập học", 3));
                steps.add(createStep(2, "Làm thủ tục visa và xuất cảnh",
                        "Chuẩn bị hồ sơ visa và hoàn thành thủ tục pháp lý", 21));
                steps.add(createStep(3, "Chuẩn bị khởi hành và thích nghi môi trường mới",
                        "Sắp xếp chỗ ở, hành lý và chuẩn bị tâm lý", 4));
                break;
        }

        return steps;
    }

    private Map<String, Object> createStep(int stepIndex, String title, String description, int duration) {
        Map<String, Object> step = new HashMap<>();
        step.put("stepIndex", stepIndex);
        step.put("title", title);
        step.put("description", description);
        step.put("estimatedDuration", duration);
        step.put("status", "pending"); // Default status
        return step;
    }

    /**
     * Lấy roadmap của seeker
     */
    public List<ConsultationRoadmap> getRoadmapBySeeker(String seekerId) {
        return roadmapRepository.findBySeekerIdOrderByStepNumber(seekerId);
    }

    /**
     * LEGACY: Cập nhật trạng thái step (giữ lại cho backward compatibility)
     */
    @Transactional
    public ConsultationRoadmap updateStepStatus(String seekerId, Integer stepNumber,
            String status, String notes) {
        System.out.println("[DEBUG] updateStepStatus (legacy) called - seekerId: " + seekerId +
                ", stepNumber: " + stepNumber + ", status: " + status);

        ConsultationRoadmap roadmap = roadmapRepository.findBySeekerIdAndStepNumber(seekerId, stepNumber);
        if (roadmap != null) {
            String oldStatus = roadmap.getStepStatus();
            roadmap.setStepStatus(status);
            roadmap.setNotes(notes);

            if ("completed".equals(status)) {
                roadmap.setCompletedAt(LocalDateTime.now());

                // Tự động chuyển step tiếp theo sang "in_progress" nếu có
                ConsultationRoadmap nextStep = roadmapRepository.findBySeekerIdAndStepNumber(seekerId,
                        stepNumber + 1);
                if (nextStep != null && "pending".equals(nextStep.getStepStatus())) {
                    nextStep.setStepStatus("in_progress");
                    roadmapRepository.save(nextStep);
                    System.out.println("[DEBUG] Auto-started next step: " + (stepNumber + 1));
                }
            }

            ConsultationRoadmap saved = roadmapRepository.save(roadmap);
            System.out.println("[DEBUG] Step updated successfully - old status: " + oldStatus +
                    ", new status: " + status);
            return saved;
        } else {
            System.err.println("[ERROR] Step not found - seekerId: " + seekerId + ", stepNumber: "
                    + stepNumber);
        }
        return null;
    }

    /**
     * Lấy thống kê tiến độ
     */
    public Map<String, Object> getRoadmapProgress(String seekerId) {
        List<ConsultationRoadmap> allSteps = roadmapRepository.findBySeekerIdOrderByStepNumber(seekerId);
        Long completedCount = roadmapRepository.countCompletedSteps(seekerId);

        Map<String, Object> progress = new HashMap<>();
        progress.put("totalSteps", allSteps.size());
        progress.put("completedSteps", completedCount);
        progress.put("progressPercentage", allSteps.size() > 0 ? (completedCount * 100 / allSteps.size()) : 0);

        // Tìm step hiện tại
        List<ConsultationRoadmap> currentSteps = roadmapRepository.findCurrentStep(seekerId);
        if (!currentSteps.isEmpty()) {
            progress.put("currentStep", currentSteps.get(0));
        }

        return progress;
    }

    /**
     * Khởi tạo step đầu tiên là "in_progress"
     */
    @Transactional
    public void startRoadmap(String seekerId) {
        ConsultationRoadmap firstStep = roadmapRepository.findBySeekerIdAndStepNumber(seekerId, 1);
        if (firstStep != null && "pending".equals(firstStep.getStepStatus())) {
            firstStep.setStepStatus("in_progress");
            roadmapRepository.save(firstStep);
        }

        // THÊM: Khởi tạo step detail đầu tiên
        RoadmapStepDetail firstStepDetail = stepDetailRepository.findBySeekerIdAndStageNumberAndStepIndex(
                seekerId, 1,
                1);
        if (firstStepDetail != null && "pending".equals(firstStepDetail.getStatus())) {
            firstStepDetail.setStatus("in_progress");
            stepDetailRepository.save(firstStepDetail);
        }
    }

    /**
     * Xóa roadmap của seeker
     */
    @Transactional
    public void deleteRoadmapBySeeker(String seekerId) {
        List<ConsultationRoadmap> roadmaps = roadmapRepository.findBySeekerIdOrderByStepNumber(seekerId);
        roadmapRepository.deleteAll(roadmaps);

        // THÊM: Xóa luôn step details
        stepDetailRepository.deleteBySeekerId(seekerId);
    }

    /**
     * Kiểm tra xem seeker có roadmap chưa
     */
    public boolean hasRoadmap(String seekerId) {
        return roadmapRepository.existsBySeekerId(seekerId);
    }
}