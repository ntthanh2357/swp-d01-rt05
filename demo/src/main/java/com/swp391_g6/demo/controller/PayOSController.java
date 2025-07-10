package com.swp391_g6.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.ItemData;
import vn.payos.type.PaymentData;
import vn.payos.type.PaymentLinkData;

import java.util.HashMap;
import java.util.Map;

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

    private PayOS payOS;

    // Initialize PayOS after properties are loaded
    private PayOS getPayOS() {
        if (payOS == null) {
            payOS = new PayOS(clientId, apiKey, checksumKey);
        }
        return payOS;
    }

    @PostMapping("/create-payment-link")
    public ResponseEntity<?> createPaymentLink(@RequestBody PaymentRequest request) {
        try {
            // Generate unique order code using current timestamp
            Long orderCode = System.currentTimeMillis() / 1000;
            
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

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("checkoutUrl", result.getCheckoutUrl());
            response.put("orderCode", orderCode);

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

    // DTO class for payment requests
    public static class PaymentRequest {
        private int amount;
        private String description;

        public PaymentRequest() {}

        public PaymentRequest(int amount, String description) {
            this.amount = amount;
            this.description = description;
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
    }
}
