package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.FavoriteScholarship;
import com.swp391_g6.demo.entity.Seeker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FavoriteScholarshipRepository extends JpaRepository<FavoriteScholarship, Integer> {
    @Query("SELECT f FROM FavoriteScholarship f WHERE f.seeker.seekerId = :seekerId")
    List<FavoriteScholarship> findBySeekerId(@Param("seekerId") String seekerId);

    @Query("SELECT f FROM FavoriteScholarship f WHERE f.seeker.seekerId = :seekerId AND f.scholarship.scholarshipId = :scholarshipId")
    FavoriteScholarship findBySeekerIdAndScholarshipId(@Param("seekerId") String seekerId,
            @Param("scholarshipId") String scholarshipId);

    void deleteBySeeker_SeekerIdAndScholarship_ScholarshipId(String seekerId, String scholarshipId);
}