package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.RoadmapStepDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapStepDetailRepository extends JpaRepository<RoadmapStepDetail, Long> {

    /**
     * Lấy tất cả steps chi tiết của một seeker và stage
     */
    List<RoadmapStepDetail> findBySeekerIdAndStageNumberOrderByStepIndex(String seekerId, Integer stageNumber);

    /**
     * Lấy step chi tiết cụ thể
     */
    RoadmapStepDetail findBySeekerIdAndStageNumberAndStepIndex(String seekerId, Integer stageNumber, Integer stepIndex);

    /**
     * Đếm số steps đã completed trong một stage
     */
    @Query("SELECT COUNT(r) FROM RoadmapStepDetail r WHERE r.seekerId = :seekerId AND r.stageNumber = :stageNumber AND r.status = 'completed'")
    Long countCompletedStepsInStage(@Param("seekerId") String seekerId, @Param("stageNumber") Integer stageNumber);

    /**
     * Đếm tổng số steps trong một stage
     */
    @Query("SELECT COUNT(r) FROM RoadmapStepDetail r WHERE r.seekerId = :seekerId AND r.stageNumber = :stageNumber")
    Long countTotalStepsInStage(@Param("seekerId") String seekerId, @Param("stageNumber") Integer stageNumber);

    /**
     * Kiểm tra xem tất cả steps trong stage đã completed chưa
     */
    @Query("SELECT CASE WHEN COUNT(r) = 0 THEN true ELSE false END FROM RoadmapStepDetail r WHERE r.seekerId = :seekerId AND r.stageNumber = :stageNumber AND r.status != 'completed'")
    Boolean isStageCompleted(@Param("seekerId") String seekerId, @Param("stageNumber") Integer stageNumber);

    /**
     * Xóa tất cả steps của seeker
     */
    void deleteBySeekerId(String seekerId);
}