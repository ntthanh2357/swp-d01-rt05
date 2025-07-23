package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.ConsultationRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationRoadmapRepository extends JpaRepository<ConsultationRoadmap, Long> {

    /**
     * Lấy tất cả steps của một seeker, sắp xếp theo step number
     */
    List<ConsultationRoadmap> findBySeekerIdOrderByStepNumber(String seekerId);

    /**
     * Lấy roadmap theo seeker và status
     */
    List<ConsultationRoadmap> findBySeekerIdAndStepStatus(String seekerId, String stepStatus);

    /**
     * Kiểm tra xem seeker đã có roadmap chưa
     */
    boolean existsBySeekerId(String seekerId);

    /**
     * Lấy step hiện tại (step đầu tiên chưa completed)
     */
    @Query("SELECT r FROM ConsultationRoadmap r WHERE r.seekerId = :seekerId AND r.stepStatus != 'completed' ORDER BY r.stepNumber ASC")
    List<ConsultationRoadmap> findCurrentStep(@Param("seekerId") String seekerId);

    /**
     * Đếm số steps đã hoàn thành
     */
    @Query("SELECT COUNT(r) FROM ConsultationRoadmap r WHERE r.seekerId = :seekerId AND r.stepStatus = 'completed'")
    Long countCompletedSteps(@Param("seekerId") String seekerId);

    /**
     * Lấy step theo seeker và step number
     */
    ConsultationRoadmap findBySeekerIdAndStepNumber(String seekerId, Integer stepNumber);
}