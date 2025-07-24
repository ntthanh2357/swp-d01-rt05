package com.swp391_g6.demo.controller;

import com.swp391_g6.demo.entity.Notification;
import com.swp391_g6.demo.service.NotificationService;
import com.swp391_g6.demo.socket.ChatSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ChatSocketHandler chatSocketHandler;

    // Gửi thông báo
    @PostMapping("/send")
    public Map<String, Object> sendNotification(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String title = body.get("title");
        String content = body.get("content");
        String type = body.get("type");
        notificationService.sendNotification(userId, title, content, type);
        // Gửi realtime qua WebSocket
        chatSocketHandler.sendNotification(userId, title, content);
        return Map.of("success", true);
    }

    // Lấy danh sách thông báo của user
    @GetMapping("/list/{userId}")
    public List<Notification> getNotifications(@PathVariable String userId) {
        return notificationService.getNotifications(userId);
    }

    // Đếm số thông báo chưa đọc
    @GetMapping("/unread-count/{userId}")
    public Map<String, Long> countUnread(@PathVariable String userId) {
        Long count = notificationService.countUnread(userId);
        return Map.of("unread", count);
    }

    // Đánh dấu đã đọc
    @PostMapping("/read/{notificationId}")
    public Map<String, Object> markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return Map.of("success", true);
    }
}