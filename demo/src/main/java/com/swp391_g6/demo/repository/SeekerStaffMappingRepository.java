package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.SeekerStaffMapping;
import com.swp391_g6.demo.entity.SeekerStaffMapping.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SeekerStaffMappingRepository extends JpaRepository<SeekerStaffMapping, String> {
    List<SeekerStaffMapping> findByStaffIdAndStatus(String staffId, Status status);

    SeekerStaffMapping findBySeekerId(String seekerId);

    List<SeekerStaffMapping> findByStaffId(String staffId);

    void deleteBySeekerId(String seekerId);

    @Query("SELECT COUNT(s) FROM SeekerStaffMapping s WHERE s.staffId = :staffId AND s.status = 'active'")
    int countActiveSeekersByStaff(@Param("staffId") String staffId);

    @Query("SELECT COUNT(ssm) FROM SeekerStaffMapping ssm " +
            "JOIN Seeker s ON ssm.seekerId = s.seekerId " +
            "WHERE ssm.staffId = :staffId AND s.purchasedPackage = 'premium'")
    int countPremiumSeekersByStaff(@Param("staffId") String staffId);

    @Query("SELECT ssm FROM SeekerStaffMapping ssm " +
            "JOIN Seeker s ON ssm.seekerId = s.seekerId " +
            "WHERE ssm.staffId = :staffId AND s.purchasedPackage = 'premium'")
    List<SeekerStaffMapping> findPremiumSeekersByStaff(@Param("staffId") String staffId);
}