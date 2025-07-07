package com.swp391_g6.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.swp391_g6.demo.entity.User;

public interface UserRepository extends JpaRepository<User, String> {

    User findByUserId(String userId);

    User findByEmail(String email);

    List<User> findByRole(String role);

    @Query(value = "SELECT DATE(created_at) as date, COUNT(*) as count FROM users GROUP BY DATE(created_at) ORDER BY date ASC", nativeQuery = true)
    List<Object[]> countUserByCreatedDate();

}
