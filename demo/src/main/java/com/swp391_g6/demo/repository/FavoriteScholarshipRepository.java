package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.FavoriteScholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FavoriteScholarshipRepository extends JpaRepository<FavoriteScholarship, Integer> {
    @Query("SELECT f FROM FavoriteScholarship f WHERE f.user.userId = :userId")
    List<FavoriteScholarship> findByUserId(@Param("userId") String userId);

    @Query("SELECT f FROM FavoriteScholarship f WHERE f.user.userId = :userId AND f.scholarship.scholarshipId = :scholarshipId")
    FavoriteScholarship findByUserIdAndScholarshipId(@Param("userId") String userId,
            @Param("scholarshipId") String scholarshipId);

    @Query("DELETE FROM FavoriteScholarship f WHERE f.user.userId = :userId AND f.scholarship.scholarshipId = :scholarshipId")
    int deleteByUserIdAndScholarshipId(@Param("userId") String userId, @Param("scholarshipId") String scholarshipId);
}