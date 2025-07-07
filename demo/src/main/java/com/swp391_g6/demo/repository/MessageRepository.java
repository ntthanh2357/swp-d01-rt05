package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.Messages;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Messages, Long> {

    @Query("SELECT COUNT(m) FROM Messages m WHERE m.receiverId = :staffId AND m.isRead = false")
    int countUnreadMessagesByStaff(@Param("staffId") String staffId);
    
}