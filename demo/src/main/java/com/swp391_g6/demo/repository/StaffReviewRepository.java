package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.StaffReview;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface StaffReviewRepository extends JpaRepository<StaffReview, Long> {

    @Query("SELECT r FROM StaffReview r WHERE r.staffId = :staffId")
    List<StaffReview> getFeedbackByStaff(@Param("staffId") String staffId);

}