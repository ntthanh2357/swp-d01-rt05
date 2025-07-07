// file: src/main/java/com/swp391_g6/demo/service/ZaloPayService.java

package com.swp391_g6.demo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swp391_g6.demo.util.HmacUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class ZaloPayService {

    @Value("${zalopay.app_id}")
    private String appId;

    @Value("${zalopay.key1}")
    private String key1;

    @Value("${zalopay.key2}")
    private String key2;

    @Value("${zalopay.endpoint.create_order}")
    private String createOrderUrl;

    @Value("${zalopay.callback_url}")
    private String callbackUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> createOrder(int amount, String description) throws Exception {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyMMdd");
        String appTransId = dateFormat.format(new Date()) + "_" + System.currentTimeMillis();

        Map<String, Object> orderRequest = new HashMap<>();
        orderRequest.put("app_id", appId);
        orderRequest.put("app_trans_id", appTransId);
        orderRequest.put("app_user", "user123");
        orderRequest.put("app_time", System.currentTimeMillis());
        orderRequest.put("amount", amount);
        orderRequest.put("item", "[]");
        orderRequest.put("description", description);
        orderRequest.put("embed_data", "{\"redirecturl\": \"http://localhost:3000/payment-success\"}");
        orderRequest.put("bank_code", "");
        orderRequest.put("callback_url", callbackUrl);

        String data = appId + "|" + appTransId + "|" + "user123" + "|" + amount + "|" + orderRequest.get("app_time") + "|" + orderRequest.get("embed_data") + "|" + "[]";
        String mac = HmacUtil.HmacSHA256(key1, data);
        orderRequest.put("mac", mac);
        
        // --- CẢI TIẾN: Thêm header và sử dụng HttpEntity ---
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(orderRequest, headers);

        // Gửi yêu cầu và nhận phản hồi
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(createOrderUrl, entity, String.class);
        // ----------------------------------------------------

        Map<String, Object> responseMap = objectMapper.readValue(responseEntity.getBody(), Map.class);

        // Kiểm tra mã trả về từ ZaloPay
        if (!Objects.equals(responseMap.get("return_code"), 1)) {
            throw new RuntimeException("Tạo đơn hàng ZaloPay thất bại: " + responseMap.get("return_message"));
        }

        // Thêm app_trans_id vào response để frontend có thể sử dụng
        responseMap.put("app_trans_id", appTransId);
        return responseMap;
    }

    public boolean verifyCallback(String dataStr, String requestMac) {
        String mac = HmacUtil.HmacSHA256(key2, dataStr);
        return mac.equals(requestMac);
    }
}