package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.StaffStatistics;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface StaffStatisticsRepository extends JpaRepository<StaffStatistics, String> {

    @Query("SELECT s.averageResponseTimeMinutes FROM StaffStatistics s WHERE s.staffId = :staffId")
    Double getAvgResponseTime(@Param("staffId") String staffId);

}