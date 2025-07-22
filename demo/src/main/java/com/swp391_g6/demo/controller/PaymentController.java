package com.swp391_g6.demo.controller;

import com.swp391_g6.demo.entity.Payment;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.service.PaymentService;
import com.swp391_g6.demo.service.UserService;
import com.swp391_g6.demo.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory(HttpServletRequest request) {
        try {
            // Get user from token
            final String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Bearer token is required");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            if (email == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Invalid token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            User user = userService.findByEmail(email);
            if (user == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            // Get payment history
            List<Payment> payments = paymentService.getUserPaymentHistory(user.getUserId());
            
            // Convert to response format
            List<Map<String, Object>> paymentHistory = payments.stream().map(payment -> {
                Map<String, Object> paymentMap = new HashMap<>();
                paymentMap.put("paymentId", payment.getPaymentId());
                paymentMap.put("packageId", payment.getPackageId());
                paymentMap.put("orderCode", payment.getOrderCode());
                paymentMap.put("amount", payment.getAmount());
                paymentMap.put("description", payment.getDescription());
                paymentMap.put("status", payment.getStatus().toString());
                paymentMap.put("paymentMethod", payment.getPaymentMethod());
                paymentMap.put("createdAt", payment.getCreatedAt());
                paymentMap.put("paidAt", payment.getPaidAt());
                return paymentMap;
            }).collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("payments", paymentHistory);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching payment history: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    // Test endpoint để debug dữ liệu
    @GetMapping("/debug/{userId}")
    public ResponseEntity<?> debugUserData(@PathVariable String userId) {
        try {
            Map<String, Object> debugInfo = new HashMap<>();
            
            // Check user exists
            User user = userService.getUserById(userId);
            if (user == null) {
                debugInfo.put("user", "NOT FOUND");
            } else {
                debugInfo.put("user", Map.of(
                    "id", user.getUserId(),
                    "name", user.getName(),
                    "email", user.getEmail()
                ));
            }
            
            // Check payments
            List<Payment> payments = paymentService.getUserPaymentHistory(userId);
            debugInfo.put("payments_count", payments.size());
            debugInfo.put("payments", payments.stream().map(p -> Map.of(
                "id", p.getPaymentId(),
                "orderCode", p.getOrderCode(),
                "packageId", p.getPackageId(),
                "status", p.getStatus().toString(),
                "createdAt", p.getCreatedAt() != null ? p.getCreatedAt().toString() : "null"
            )).collect(Collectors.toList()));
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("debug", debugInfo);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Debug error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
