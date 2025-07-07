package com.swp391_g6.demo.controller;

import com.swp391_g6.demo.dto.ChatDTO;
import com.swp391_g6.demo.service.ChatService;
import com.swp391_g6.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    // Get conversation between two users
    @PostMapping("/conversation")
    public ResponseEntity<?> getConversation(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String otherUserId = request.get("otherUserId");
        
        if (token == null || otherUserId == null) {
            return ResponseEntity.badRequest().body("Token and otherUserId are required");
        }
        
        String currentUserId = jwtUtil.getUserIdFromToken(token);
        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
        
        List<ChatDTO> conversation = chatService.getConversation(currentUserId, otherUserId);
        return ResponseEntity.ok(conversation);
    }
    
    // Get all contacts/conversations
    @PostMapping("/contacts")
    public ResponseEntity<?> getContacts(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        
        if (token == null) {
            return ResponseEntity.badRequest().body("Token is required");
        }
        
        String currentUserId = jwtUtil.getUserIdFromToken(token);
        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
        
        List<Map<String, Object>> contacts = chatService.getContactList(currentUserId);
        return ResponseEntity.ok(contacts);
    }
    
    // Get unread message count
    @PostMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        
        if (token == null) {
            return ResponseEntity.badRequest().body("Token is required");
        }
        
        String currentUserId = jwtUtil.getUserIdFromToken(token);
        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
        
        long unreadCount = chatService.countUnreadMessages(currentUserId);
        Map<String, Object> response = new HashMap<>();
        response.put("unreadCount", unreadCount);
        return ResponseEntity.ok(response);
    }

    // Get default conversation prompts
    @GetMapping("/prompts")
    public ResponseEntity<?> getPrompts() {
        Map<String, Object> response = new HashMap<>();
        
        List<Map<String, String>> prompts = List.of(
            Map.of(
                "id", "1",
                "text", "Tôi muốn tìm hiểu về các học bổng ở Úc"
            ),
            Map.of(
                "id", "2",
                "text", "Tôi cần tư vấn về quy trình nộp hồ sơ xin học bổng"
            ),
            Map.of(
                "id", "3",
                "text", "Các gói hỗ trợ làm đơn xin học bổng có những gì?"
            ),
            Map.of(
                "id", "4",
                "text", "Chi phí cho các gói hỗ trợ là bao nhiêu?"
            )
        );
        
        response.put("prompts", prompts);
        return ResponseEntity.ok(response);
    }
    
    // Mark messages as read
    @PostMapping("/mark-read")
    public ResponseEntity<?> markAsRead(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String otherUserId = request.get("otherUserId");
        
        if (token == null || otherUserId == null) {
            return ResponseEntity.badRequest().body("Token and otherUserId are required");
        }
        
        String currentUserId = jwtUtil.getUserIdFromToken(token);
        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
        
        chatService.markAsRead(otherUserId, currentUserId);
        return ResponseEntity.ok().build();
    }
}