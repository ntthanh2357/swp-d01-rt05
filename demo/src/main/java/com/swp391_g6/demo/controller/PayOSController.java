package com.swp391_g6.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.ItemData;
import vn.payos.type.PaymentData;
import vn.payos.type.PaymentLinkData;

import com.swp391_g6.demo.entity.Payment;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.service.PaymentService;
import com.swp391_g6.demo.service.UserService;
import com.swp391_g6.demo.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payos")
@CrossOrigin(origins = "http://localhost:3000")
public class PayOSController {

    @Value("${payos.client-id}")
    private String clientId;

    @Value("${payos.api-key}")
    private String apiKey;

    @Value("${payos.checksum-key}")
    private String checksumKey;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private PayOS payOS;

    // Initialize PayOS after properties are loaded
    private PayOS getPayOS() {
        if (payOS == null) {
            payOS = new PayOS(clientId, apiKey, checksumKey);
        }
        return payOS;
    }

    @PostMapping("/create-payment-link")
    public ResponseEntity<?> createPaymentLink(@RequestBody PaymentRequest request, HttpServletRequest httpRequest) {
        try {
            // Get user from token
            final String authHeader = httpRequest.getHeader("Authorization");
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

            // Generate unique order code using current timestamp
            Long orderCode = System.currentTimeMillis() / 1000;
            
            // Create payment record in database first
            Payment payment = paymentService.createPayment(user, request.getPackageId(), orderCode, request.getAmount(), request.getDescription());
            
            // Create item data
            ItemData itemData = ItemData.builder()
                    .name(request.getDescription())
                    .quantity(1)
                    .price(request.getAmount())
                    .build();

            // Create payment data
            PaymentData paymentData = PaymentData.builder()
                    .orderCode(orderCode)
                    .amount(request.getAmount())
                    .description(request.getDescription())
                    .returnUrl("http://localhost:3000/payment-success?orderCode=" + orderCode + "&status=PAID")
                    .cancelUrl("http://localhost:3000/payment-cancel")
                    .item(itemData)
                    .build();

            // Create payment link using PayOS SDK
            CheckoutResponseData result = getPayOS().createPaymentLink(paymentData);
            
            // Update payment record with checkout URL
            paymentService.updatePaymentUrls(payment.getPaymentId(), result.getCheckoutUrl());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("checkoutUrl", result.getCheckoutUrl());
            response.put("orderCode", orderCode);
            response.put("paymentId", payment.getPaymentId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể tạo link thanh toán: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @GetMapping("/payment-info/{orderCode}")
    public ResponseEntity<?> getPaymentInfo(@PathVariable Long orderCode) {
        try {
            // Get payment information using PayOS SDK
            PaymentLinkData paymentInfo = getPayOS().getPaymentLinkInformation(orderCode);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("paymentInfo", paymentInfo);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể lấy thông tin thanh toán: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @PostMapping("/confirm-webhook")
    public ResponseEntity<?> confirmWebhook(@RequestBody Map<String, Object> webhookData) {
        try {
            // Verify webhook signature and process payment confirmation
            // You can add webhook signature verification here
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Webhook processed successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Webhook processing failed: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @PostMapping("/payment-success")
    public ResponseEntity<?> handlePaymentSuccess(@RequestBody Map<String, Object> request) {
        try {
            Long orderCode = Long.valueOf(request.get("orderCode").toString());
            String status = request.get("status").toString();
            
            if ("PAID".equals(status)) {
                // Mark payment as successful and update seeker profile
                paymentService.markPaymentAsSuccessful(orderCode);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Payment processed successfully");
                
                return ResponseEntity.ok(response);
            } else {
                paymentService.markPaymentAsFailed(orderCode);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Payment failed");
                
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error processing payment: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    // DTO class for payment requests
    public static class PaymentRequest {
        private int amount;
        private String description;
        private String packageId;

        public PaymentRequest() {}

        public PaymentRequest(int amount, String description, String packageId) {
            this.amount = amount;
            this.description = description;
            this.packageId = packageId;
        }

        public int getAmount() {
            return amount;
        }

        public void setAmount(int amount) {
            this.amount = amount;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getPackageId() {
            return packageId;
        }

        public void setPackageId(String packageId) {
            this.packageId = packageId;
        }
    }
}
