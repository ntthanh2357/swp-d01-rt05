package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.CounselingCase;

import java.util.Map;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface CounselingCaseRepository extends JpaRepository<CounselingCase, String> {

    @Query("SELECT COUNT(c) FROM CounselingCase c WHERE c.staffId = :staffId AND c.status = 'pending'")
    int countPendingCasesByStaff(@Param("staffId") String staffId);

    @Query("SELECT COUNT(c) FROM CounselingCase c WHERE c.staffId = :staffId AND c.status IN ('resolved', 'closed')")
    int countCompletedChatsByStaff(@Param("staffId") String staffId);

    @Query("SELECT COUNT(c) FROM CounselingCase c WHERE c.staffId = :staffId AND c.status = 'open'")
    int countActiveCasesByStaff(@Param("staffId") String staffId);

    @Query("SELECT COUNT(c) FROM CounselingCase c WHERE c.staffId = :staffId AND c.status = 'in_progress'")
    int countInProgressCasesByStaff(@Param("staffId") String staffId);

    @Query("SELECT COUNT(c) FROM CounselingCase c WHERE c.staffId = :staffId AND c.status = 'resolved'")
    int countResolvedCasesByStaff(@Param("staffId") String staffId);

    @Query(value = "SELECT " +
            "   DATE_FORMAT(c.created_at, " +
            "       CASE WHEN :period = 'week' THEN '%Y-%u' " +
            "            WHEN :period = 'month' THEN '%Y-%m' " +
            "            ELSE '%Y-%m-%d' END) AS label, " +
            "   COUNT(*) AS data " +
            "FROM counseling_case c " +
            "WHERE c.staff_id = :staffId " +
            "GROUP BY label " +
            "ORDER BY label", nativeQuery = true)
    Map<String, Object> getActivityChartData(@Param("staffId") String staffId,
            @Param("period") String period);

}