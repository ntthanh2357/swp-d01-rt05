package com.swp391_g6.demo.service;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.swp391_g6.demo.repository.UserRepository;
import com.swp391_g6.demo.repository.VerificationTokenRepository;
import com.swp391_g6.demo.util.EmailUtil;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.entity.VerificationToken;
import com.swp391_g6.demo.service.StaffService;

@Service
public class AuthService {

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private EmailUtil emailUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private IdGeneratorService idGeneratorService;

    @Autowired
    private StaffService staffService;

    public void sendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        String task = "register";

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
        emailUtil.sendOtpEmail(email, otp);
    }

    public boolean verifyOtp(String email, String otp, String task) {
        Optional<VerificationToken> optionalToken = verificationTokenRepository.findByEmailAndTask(email, task);
        if (optionalToken.isEmpty())
            return false;

        VerificationToken token = optionalToken.get();
        if (token.getExpiresAt().before(Timestamp.valueOf(LocalDateTime.now())))
            return false;

        return token.getOtp_code().equals(otp);
    }

    public void createUser(String name, String email, Date date_of_birth, String phone, String gender,
            String password) {
        String user_id = idGeneratorService.generateId("USER", false, 10);
        String password_hash = passwordEncoder.encode(password);
        User user = new User();
        user.setUserId(user_id);
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(password_hash);
        user.setRole("seeker");
        user.setPhone(phone);
        user.setDateOfBirth(date_of_birth);
        user.setGender(gender);
        Timestamp now = Timestamp.from(java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Bangkok")).toInstant());
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        userRepository.save(user);
    }

    public void createStaff(String email, String password) {
        String user_id = idGeneratorService.generateId("USER", false, 10);
        String password_hash = passwordEncoder.encode(password);
        User user = new User();
        user.setUserId(user_id);
        user.setEmail(email);
        user.setPasswordHash(password_hash);
        user.setRole("staff");
        Timestamp now = Timestamp.from(java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Bangkok")).toInstant());
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        userRepository.save(user);
        // Tạo staff profile liên kết
        staffService.createStaffProfile(user);
    }

    public void createAdmin(String email, String password) {
        String user_id = idGeneratorService.generateId("USER", false, 10);
        String password_hash = passwordEncoder.encode(password);
        User user = new User();
        user.setUserId(user_id);
        user.setEmail(email);
        user.setPasswordHash(password_hash);
        user.setRole("admin");
        Timestamp now = Timestamp.from(java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Bangkok")).toInstant());
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email);
        System.out.println("User isBanned status: " + (user != null ? user.isBanned() : "user not found")); // Debug log
        
        if (user != null && passwordEncoder.matches(password, user.getPasswordHash())) {
            // Kiểm tra isBanned trước khi cho đăng nhập
            if (user.isBanned()) {
                System.out.println("User is banned: " + email); // Debug log
                throw new RuntimeException("Tài khoản của bạn đã bị khóa.");
            }
            return user;
        }
        return null;
    }

    public void sendResetPasswordEmail(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        String task = "reset_password";

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
        emailUtil.sendOtpEmail(email, otp);
    }

    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            String password_hash = passwordEncoder.encode(newPassword);
            user.setPasswordHash(password_hash);
            Timestamp now = Timestamp
                    .from(java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Bangkok")).toInstant());
            user.setUpdatedAt(now);
            userRepository.save(user);
        }
    }

    public int changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return 0;
        }
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            return 1;
        }
        if (passwordEncoder.matches(newPassword, user.getPasswordHash())) {
            return 3;
        }

        String password_hash = passwordEncoder.encode(newPassword);
        user.setPasswordHash(password_hash);
        Timestamp now = Timestamp
                .from(java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Bangkok")).toInstant());
        user.setUpdatedAt(now);
        userRepository.save(user);
        return 2;
    }

}
