package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StaffRepository extends JpaRepository<Staff, String> {
    Staff findByStaffId(String staffId);
    List<Staff> findByCurrentSeekerCountIsNotNullOrderByCurrentSeekerCountAsc();
}