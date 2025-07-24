package com.swp391_g6.demo.service;

import com.swp391_g6.demo.entity.Notification;
import com.swp391_g6.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepo;

    public void sendNotification(String userId, String title, String content, String type) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setContent(content);
        notification.setType(type);
        notificationRepo.save(notification);
    }

    public List<Notification> getNotifications(String userId) {
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Long countUnread(String userId) {
        return notificationRepo.countByUserIdAndIsReadFalse(userId);
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepo.findById(notificationId).orElse(null);
        if (notification != null) {
            notification.setIsRead(true);
            notificationRepo.save(notification);
        }
    }
}