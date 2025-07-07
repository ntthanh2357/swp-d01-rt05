package com.swp391_g6.demo.controller;

import java.util.Map;
import java.util.HashMap;
import java.math.BigDecimal;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.dto.EmailRequest;
import com.swp391_g6.demo.entity.Seeker;
import com.swp391_g6.demo.service.UserService;
import com.swp391_g6.demo.service.SeekerService;
import com.swp391_g6.demo.util.JwtUtil;

@RestController
@RequestMapping("/api/seeker")
public class SeekerController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private SeekerService seekerService;

    // [POST] /api/seeker/profile - Lấy thông tin hồ sơ người tìm việc
    @PostMapping("/profile")
    public ResponseEntity<?> getSeekerProfile(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is required");
        }

        String email = jwtUtil.extractEmail(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        Map<String, Object> response = new HashMap<>();

        response.put("user_id", user.getUserId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone());
        response.put("date_of_birth", user.getDateOfBirth());
        response.put("gender", user.getGender());
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }

    // [POST] /api/seeker/update-profile - Cập nhật hồ sơ người tìm việc
    @PostMapping("/update-seeker-profile")
    public ResponseEntity<?> updateSeekerProfile(@RequestBody Map<String, Object> updates) {
        String token = (String) updates.get("token");
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is required");
        }

        String email = jwtUtil.extractEmail(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        Seeker seeker = seekerService.findByUser(user);
        if (seeker == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seeker profile not found");
        }

        // Allow null for current_education_level
        if (updates.containsKey("current_education_level")) {
            Object edu = updates.get("current_education_level");
            if (edu == null) {
                seeker.setCurrentEducationLevel(null);
            } else {
                try {
                    seeker.setCurrentEducationLevel(Seeker.EducationLevel.valueOf(edu.toString()));
                } catch (Exception e) {
                    seeker.setCurrentEducationLevel(null);
                }
            }
        }

        // Allow null for field_of_study
        if (updates.containsKey("field_of_study")) {
            seeker.setFieldOfStudy((String) updates.get("field_of_study"));
        }

        // Allow null for gpa
        if (updates.containsKey("gpa")) {
            Object gpaObj = updates.get("gpa");
            if (gpaObj == null) {
                seeker.setGpa(null);
            } else {
                try {
                    seeker.setGpa(new BigDecimal(gpaObj.toString()));
                } catch (Exception e) {
                    seeker.setGpa(null);
                }
            }
        }

        // Allow null for target_degree
        if (updates.containsKey("target_degree")) {
            seeker.setTargetDegree((String) updates.get("target_degree"));
        }

        ObjectMapper mapper = new ObjectMapper();
        // Allow null for target_countries
        if (updates.containsKey("target_countries")) {
            Object tc = updates.get("target_countries");
            if (tc == null) {
                seeker.setTargetCountries(null);
            } else {
                try {
                    if (tc instanceof String) {
                        seeker.setTargetCountries((String) tc);
                    } else {
                        seeker.setTargetCountries(mapper.writeValueAsString(tc));
                    }
                } catch (Exception e) {
                    seeker.setTargetCountries(null);
                }
            }
        }

        // Allow null for preferred_languages
        if (updates.containsKey("preferred_languages")) {
            Object pl = updates.get("preferred_languages");
            if (pl == null) {
                seeker.setPreferredLanguages(null);
            } else {
                try {
                    if (pl instanceof String) {
                        seeker.setPreferredLanguages((String) pl);
                    } else {
                        seeker.setPreferredLanguages(mapper.writeValueAsString(pl));
                    }
                } catch (Exception e) {
                    seeker.setPreferredLanguages(null);
                }
            }
        }

        // Allow null for financial_need_level
        if (updates.containsKey("financial_need_level")) {
            Object fnl = updates.get("financial_need_level");
            if (fnl == null) {
                seeker.setFinancialNeedLevel(null);
            } else {
                try {
                    seeker.setFinancialNeedLevel(Seeker.FinancialNeedLevel.valueOf(fnl.toString()));
                } catch (Exception e) {
                    seeker.setFinancialNeedLevel(null);
                }
            }
        }

        // Allow null for cv_url
        if (updates.containsKey("cv_url")) {
            seeker.setCvUrl((String) updates.get("cv_url"));
        }

        // Allow null for bio
        if (updates.containsKey("bio")) {
            seeker.setBio((String) updates.get("bio"));
        }

        seekerService.updateSeekerProfile(seeker);

        return ResponseEntity.status(HttpStatus.OK).body("Hồ sơ người tìm việc đã được cập nhật thành công");
    }

    // [POST] /api/seeker-verification - Update verification status
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendUpdateOtp(@RequestBody EmailRequest request) {
        seekerService.sendUpdateSeekerProfileOtp(request.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body("Mã OTP đã được gửi đến email của bạn");
    }

    // [POST] /api/seeker/verify-otp - Verify update OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyUpdateOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and OTP are required");
        }

        boolean isVerified = seekerService.verifyUpdateSeekerProfileOtp(email, otp);
        if (isVerified) {
            return ResponseEntity.status(HttpStatus.OK).body("OTP verified successfully");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired OTP");
        }
    }
}
