package com.swp391_g6.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.swp391_g6.demo.entity.User;

public interface UserRepository extends JpaRepository<User, String> {
    
   @Query("SELECT u FROM User u WHERE u.role = 'staff' AND u.statusOnline = true")
    List<User> findOnlineStaffs();

    @Query("SELECT u FROM User u WHERE u.userId IN ('USER0000000002', 'USER0000000004') AND u.role = 'staff'")
    List<User> findDefaultStaffs();

    User findByUserId(String userId);

    User findByEmail(String email);

    List<User> findByRole(String role);

    @Query(value = "SELECT DATE(created_at) as date, COUNT(*) as count FROM users GROUP BY DATE(created_at) ORDER BY date ASC", nativeQuery = true)
    List<Object[]> countUserByCreatedDate();

    List<User> findByUserIdIn(List<String> userIds);
}
