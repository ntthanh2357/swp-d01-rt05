// file: src/main/java/com/swp391_g6/demo/controller/ZaloPayController.java

package com.swp391_g6.demo.controller;

import com.swp391_g6.demo.service.ZaloPayService; // <-- Trỏ đến lớp ZaloPayService của bạn
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/zalopay")
@CrossOrigin(origins = "http://localhost:3000")
public class ZaloPayController {

    @Autowired
    private ZaloPayService zaloPayService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderRequest) {
        try {
            Integer amount = (Integer) orderRequest.get("amount");
            String description = (String) orderRequest.get("description");

            Map<String, Object> result = zaloPayService.createOrder(amount, description);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            // Log lỗi chi tiết hơn
            System.err.println("Có lỗi xảy ra khi tạo đơn hàng ZaloPay: " + e.getMessage());
            e.printStackTrace(); 
            // Trả về thông báo lỗi cụ thể cho frontend
            return ResponseEntity.badRequest().body(Map.of("message", "Lỗi: " + e.getMessage()));
        }
    }

    @PostMapping("/callback")
    public ResponseEntity<?> handleCallback(@RequestBody String jsonStr) {
        try {
            // ZaloPay khuyến nghị nhận callback dưới dạng raw string
            // sau đó mới xử lý để đảm bảo tính toàn vẹn của 'data' và 'mac'
            // Tuy nhiên, logic xử lý callback ở đây vẫn giữ nguyên
            // Để đơn giản, ta vẫn tạm nhận Map, nhưng thực tế nên cẩn thận hơn
            // với jsonStr và tự parse
            
            // Ví dụ log raw string
            System.out.println("Callback raw data: " + jsonStr);

            // Giả sử Spring tự parse jsonStr thành Map<String, Object>
            // Đoạn này cần kiểm tra kỹ với thực tế ZaloPay gửi về
            @SuppressWarnings("unchecked")
            Map<String, Object> callbackData = new com.fasterxml.jackson.databind.ObjectMapper().readValue(jsonStr, Map.class);
            
            String dataStr = (String) callbackData.get("data");
            String mac = (String) callbackData.get("mac");

            boolean isValid = zaloPayService.verifyCallback(dataStr, mac);

            if (isValid) {
                System.out.println("Callback hợp lệ. Cập nhật trạng thái đơn hàng thành công.");
                return ResponseEntity.ok(Map.of("return_code", 1, "return_message", "success"));
            } else {
                System.out.println("Callback không hợp lệ.");
                return ResponseEntity.ok(Map.of("return_code", -1, "return_message", "mac not equal"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("return_code", -1, "return_message", e.getMessage()));
        }
    }
}