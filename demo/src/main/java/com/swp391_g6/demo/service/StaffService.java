package com.swp391_g6.demo.service;

import com.swp391_g6.demo.dto.StaffDTO;
import com.swp391_g6.demo.entity.Staff;
import com.swp391_g6.demo.entity.StaffReview;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.entity.VerificationToken;
import com.swp391_g6.demo.repository.StaffRepository;
import com.swp391_g6.demo.repository.StaffReviewRepository;
import com.swp391_g6.demo.repository.UserRepository;
import com.swp391_g6.demo.repository.VerificationTokenRepository;
import com.swp391_g6.demo.util.EmailUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private EmailUtil emailUtil;

    @Autowired
    private StaffReviewRepository staffReviewRepository;

    public StaffDTO findByUser(User user) {
        Staff staff = staffRepository.findByStaffId(user.getUserId());
        if (staff == null) {
            throw new RuntimeException("Staff profile not found");
        }
        StaffDTO dto = new StaffDTO(staff, user);

        // Lấy danh sách review cho staff này
        List<StaffReview> reviews = staffReviewRepository.findByStaffId(user.getUserId());
        int totalReviews = reviews.size();
        double avgRating = totalReviews > 0
                ? reviews.stream().mapToInt(StaffReview::getRating).average().orElse(0)
                : 0;

        dto.setTotalReviews(totalReviews);
        dto.setRating(avgRating);

        return dto;
    }

    public void sendUpdateStaffProfileOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(1000000));
        String task = "update-staff-profile";

        VerificationToken token = verificationTokenRepository
                .findByEmailAndTask(email, task)
                .orElse(new VerificationToken());

        token.setEmail(email);
        token.setTask(task);
        token.setOtp_code(otp);
        token.setExpiresAt(new Timestamp(System.currentTimeMillis() + 5 * 60 * 1000)); // 5 phút

        verificationTokenRepository.save(token);
        emailUtil.sendUpdateProfileEmail(email, otp);
    }

    public boolean verifyUpdateStaffProfileOtp(String email, String otp) {
        Optional<VerificationToken> optionalToken = verificationTokenRepository.findByEmailAndTask(email,
                "update-staff-profile");

        return optionalToken
                .filter(token -> token.getOtp_code().equals(otp) &&
                        token.getExpiresAt().getTime() > System.currentTimeMillis())
                .isPresent();
    }

    @Transactional
    public void updateStaffProfile(StaffDTO dto) {
        // 1. Cập nhật User
        Optional<User> userOptional = userRepository.findById(dto.getStaffId());
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found for update"));

        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        user.setGender(dto.getGender());
        user.setEmail(dto.getEmail());

        try {
            if (dto.getDateOfBirthString() != null && !dto.getDateOfBirthString().isEmpty()) {
                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                java.util.Date utilDate = format.parse(dto.getDateOfBirthString());
                // Chuyển đổi từ java.util.Date sang java.sql.Date
                java.sql.Date sqlDate = new java.sql.Date(utilDate.getTime());
                user.setDateOfBirth(sqlDate);
            }
        } catch (ParseException e) {
            throw new RuntimeException("Invalid date format, expected yyyy-MM-dd", e);
        }

        userRepository.save(user);

        // 2. Cập nhật Staff
        Staff staff = staffRepository.findByStaffId(dto.getStaffId());
        if (staff == null) {
            throw new RuntimeException("Staff not found");
        }

        staff.setEducationLevel(dto.getEducationLevel());
        staff.setExperienceYears(dto.getExperienceYears());
        staff.setSpecialization(dto.getSpecialization());

        staffRepository.save(staff);
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public List<StaffDTO> getAllStaffDTOs() {
        List<Staff> staffList = staffRepository.findAll();
        List<StaffDTO> result = new java.util.ArrayList<>();
        for (Staff staff : staffList) {
            User user = userRepository.findByUserId(staff.getStaffId());
            StaffDTO dto = new StaffDTO(staff, user);
            // Lấy danh sách review cho staff này
            List<StaffReview> reviews = staffReviewRepository.findByStaffId(staff.getStaffId());
            int totalReviews = reviews.size();
            double avgRating = totalReviews > 0
                    ? reviews.stream().mapToInt(StaffReview::getRating).average().orElse(0)
                    : 0;
            dto.setTotalReviews(totalReviews);
            dto.setRating(avgRating);
            result.add(dto);
        }
        return result;
    }

    public void saveStaffReview(StaffReview review) {
        staffReviewRepository.save(review);
    }

    public void createStaffProfile(User user) {
        if (user == null || !"staff".equals(user.getRole())) {
            throw new RuntimeException("User must have role 'staff' to create staff profile");
        }
        if (staffRepository.findByStaffId(user.getUserId()) == null) {
            Staff staff = new Staff();
            staff.setUser(user);
            staffRepository.save(staff);
        }
    }
}