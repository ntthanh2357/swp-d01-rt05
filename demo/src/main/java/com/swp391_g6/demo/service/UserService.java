package com.swp391_g6.demo.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.entity.VerificationToken;
import com.swp391_g6.demo.repository.UserRepository;
import com.swp391_g6.demo.repository.VerificationTokenRepository;
import com.swp391_g6.demo.util.EmailUtil;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private EmailUtil emailUtil;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String userId) {
        return userRepository.findByUserId(userId);
    }

    public List<Map<String, Object>> getUserRegistrationStats() {
        List<Object[]> results = userRepository.countUserByCreatedDate();
        List<Map<String, Object>> stats = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("date", row[0]);
            map.put("count", row[1]);
            stats.add(map);
        }
        return stats;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void updateUserProfile(User user) {
        userRepository.save(user);
    }

    public void sendUpdateUserProfileOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        String task = "update-user-profile";

        Optional<VerificationToken> optionalToken = verificationTokenRepository.findByEmailAndTask(email, task);

        VerificationToken token;
        if (optionalToken.isPresent()) {
            token = optionalToken.get();
            token.setOtp_code(otp);
            token.setExpiresAt(Timestamp.valueOf(LocalDateTime.now().plusMinutes(5)));
        } else {
            token = new VerificationToken();
            token.setEmail(email);
            token.setOtp_code(otp);
            token.setTask(task);
            token.setExpiresAt(Timestamp.valueOf(LocalDateTime.now().plusMinutes(5)));
        }

        verificationTokenRepository.save(token);
        emailUtil.sendUpdateProfileEmail(email, otp);
    }

    public boolean verifyUpdateUserProfileOtp(String email, String otp) {
        Optional<VerificationToken> optionalToken = verificationTokenRepository.findByEmailAndTask(email, "update-user-profile");
        if (optionalToken.isEmpty()) {
            return false;
        }

        VerificationToken token = optionalToken.get();
        if (token.getExpiresAt().before(Timestamp.valueOf(LocalDateTime.now()))) {
            return false;
        }

        return token.getOtp_code().equals(otp);
    }

}
