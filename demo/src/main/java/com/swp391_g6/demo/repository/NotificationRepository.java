package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    Long countByUserIdAndIsReadFalse(String userId);
}