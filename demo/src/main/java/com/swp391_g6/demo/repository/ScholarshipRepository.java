package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.Scholarship;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ScholarshipRepository extends JpaRepository<Scholarship, String> {

    @Query("SELECT s FROM Scholarship s WHERE s.applicationDeadline >= CURRENT_DATE")
    List<Scholarship> findActiveScholarships();

    @Query("SELECT COUNT(s) FROM Scholarship s WHERE s.createdAt >= CURRENT_DATE")
    int countNewScholarships();

}