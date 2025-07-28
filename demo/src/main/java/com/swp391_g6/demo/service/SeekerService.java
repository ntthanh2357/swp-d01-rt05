package com.swp391_g6.demo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.swp391_g6.demo.entity.Seeker;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.entity.VerificationToken;
import com.swp391_g6.demo.entity.FavoriteScholarship;
import com.swp391_g6.demo.repository.SeekerRepository;
import com.swp391_g6.demo.repository.VerificationTokenRepository;
import com.swp391_g6.demo.repository.FavoriteScholarshipRepository;
import com.swp391_g6.demo.util.EmailUtil;

import java.util.Arrays;

import com.swp391_g6.demo.entity.Scholarship;
import com.swp391_g6.demo.dto.ConsultationRequestDTO;
import com.swp391_g6.demo.entity.SeekerStaffMapping;
import com.swp391_g6.demo.repository.SeekerStaffMappingRepository;
import com.swp391_g6.demo.repository.UserRepository;

@Service
public class SeekerService {

    @Autowired
    private SeekerRepository seekerRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private EmailUtil emailUtil;

    @Autowired
    private FavoriteScholarshipRepository favoriteScholarshipRepository;

    @Autowired
    private SeekerStaffMappingRepository seekerStaffMappingRepository;

    @Autowired
    private UserRepository userRepository;

    public void createSeekerProfile(User user) {
        if (seekerRepository.findByUser(user) == null) {
            Seeker seeker = new Seeker();
            seeker.setUser(user);
            seekerRepository.save(seeker);
        }
    }

    public Seeker findByUser(User user) {
        return seekerRepository.findByUser(user);
    }

    public Seeker findBySeekerId(String seekerId) {
        return seekerRepository.findByUser_UserId(seekerId);
    }

    public void updateSeekerProfile(Seeker seeker) {
        seekerRepository.save(seeker);
    }

    public void sendUpdateSeekerProfileOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        String task = "update-seeker-profile";

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

    public boolean verifyUpdateSeekerProfileOtp(String email, String otp) {
        Optional<VerificationToken> optionalToken = verificationTokenRepository.findByEmailAndTask(email,
                "update-seeker-profile");
        if (optionalToken.isEmpty()) {
            return false;
        }

        VerificationToken token = optionalToken.get();
        if (token.getExpiresAt().before(Timestamp.valueOf(LocalDateTime.now()))) {
            return false;
        }

        return token.getOtp_code().equals(otp);
    }

    public List<FavoriteScholarship> findFavoriteScholarshipsByUserId(String userId) {
        return favoriteScholarshipRepository.findByUserId(userId);
    }

    public FavoriteScholarship addFavoriteScholarship(User user, Scholarship scholarship, String notes) {
        FavoriteScholarship existing = favoriteScholarshipRepository
                .findByUserIdAndScholarshipId(user.getUserId(), scholarship.getScholarshipId());
        if (existing != null)
            return existing;
        FavoriteScholarship favorite = new FavoriteScholarship();
        favorite.setUser(user);
        favorite.setScholarship(scholarship);
        favorite.setNotes(notes);
        favorite.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        return favoriteScholarshipRepository.save(favorite);
    }

    public void removeFavoriteScholarship(User user, Scholarship scholarship) {
        System.out.println(
                "Removing favorite for user: " + user.getUserId() + ", scholarship: " + scholarship.getScholarshipId());
        try {
            // Tìm favorite record trước
            FavoriteScholarship favorite = favoriteScholarshipRepository.findByUserIdAndScholarshipId(
                    user.getUserId(), scholarship.getScholarshipId());

            if (favorite == null) {
                System.out.println("No favorite found to delete");
                return;
            }

            System.out.println("Found favorite to delete: " + favorite.getFavoriteId());

            // Xóa record
            favoriteScholarshipRepository.delete(favorite);
            System.out.println("Successfully deleted favorite");

        } catch (Exception e) {
            System.out.println("Error deleting favorite: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Autowired
    private ObjectMapper objectMapper;

    // Phương thức đăng ký tư vấn
    public Seeker registerConsultation(ConsultationRequestDTO request, User user) {
        // Tìm hoặc tạo seeker profile
        Seeker seeker = seekerRepository.findByUser(user);
        if (seeker == null) {
            seeker = new Seeker();
            seeker.setUser(user);
        }

        // Cập nhật thông tin từ form
        seeker.setStudyTime(request.getStudyTime());
        seeker.setAdviceType(request.getAdviceType());
        seeker.setScholarshipGoal(request.getScholarshipGoal());
        seeker.setMajor(request.getMajor());
        seeker.setNote(request.getNote());
        seeker.setReceivePromotions(request.getReceivePromotions());
        seeker.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        seeker.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        // Xử lý danh sách thành phố và quốc gia
        try {
            if (request.getCity() != null) {
                seeker.setCity(objectMapper.writeValueAsString(request.getCity()));
            }
            if (request.getCountry() != null) {
                seeker.setTargetCountries(objectMapper.writeValueAsString(request.getCountry()));
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Fallback: chuyển thành chuỗi phân cách bằng dấu phẩy
            if (request.getCity() != null) {
                seeker.setCity(String.join(",", request.getCity()));
            }
            if (request.getCountry() != null) {
                seeker.setTargetCountries(String.join(",", request.getCountry()));
            }
        }

        // Map education level
        if (request.getEducationLevel() != null) {
            switch (request.getEducationLevel()) {
                case "Cao đẳng":
                    seeker.setCurrentEducationLevel(Seeker.EducationLevel.undergraduate);
                    break;
                case "Đại học":
                    seeker.setCurrentEducationLevel(Seeker.EducationLevel.undergraduate);
                    break;
                case "Thạc sĩ":
                    seeker.setCurrentEducationLevel(Seeker.EducationLevel.graduate);
                    break;
                case "Tiến sĩ":
                    seeker.setCurrentEducationLevel(Seeker.EducationLevel.postgraduate);
                    break;
                default:
                    seeker.setCurrentEducationLevel(Seeker.EducationLevel.undergraduate);
            }
        }

        // Map field of study
        seeker.setFieldOfStudy(request.getMajor());

        // Lưu seeker profile
        seeker = seekerRepository.save(seeker);

        // Tự động phân công staff (nếu chưa có)
        if (seeker.getAssignedStaff() == null) {
            assignStaffToSeeker(seeker);
        }

        return seeker;
    }

    // Phương thức phân công staff cho seeker
    private void assignStaffToSeeker(Seeker seeker) {
    try {
        // 1. Kiểm tra trùng phân công
        if (seeker.getAssignedStaff() != null) {
            System.out.println("[SKIP] Seeker " + seeker.getSeekerId() 
                + " đã có staff: " + seeker.getAssignedStaff().getUserId());
            return;
        }

        // 2. Lấy danh sách staff online
        List<User> availableStaff = userRepository.findOnlineStaffs();

        // 3. Nếu không có staff online, lấy 2 staff mặc định
        if (availableStaff.isEmpty()) {
            availableStaff = userRepository.findDefaultStaffs();
            
            // Check thêm nếu 2 staff mặc định không tồn tại
            if (availableStaff.isEmpty()) {
                throw new IllegalStateException("Không tìm thấy staff mặc định (USER0000000002/USER0000000004)");
            }
        }

        // 4. Chọn ngẫu nhiên
        User assignedStaff = availableStaff.get(new Random().nextInt(availableStaff.size()));

        // 5. Tạo mapping
        SeekerStaffMapping mapping = new SeekerStaffMapping();
        mapping.setSeekerId(seeker.getSeekerId());
        mapping.setStaffId(assignedStaff.getUserId());
        mapping.setAssignedAt(new Timestamp(System.currentTimeMillis()));
        mapping.setStatus(SeekerStaffMapping.Status.active);

        // 6. Lưu dữ liệu
        seekerStaffMappingRepository.save(mapping);
        seeker.setAssignedStaff(assignedStaff);
        seekerRepository.save(seeker);

        System.out.println("[SUCCESS] Đã phân công staff " + assignedStaff.getUserId() 
            + " (" + assignedStaff.getName() + ") cho seeker " + seeker.getSeekerId());

    } catch (Exception e) {
        System.err.println("[ERROR] Lỗi phân công staff: " + e.getMessage());
        e.printStackTrace();
    }
}

    // Phương thức lấy danh sách seeker được phân công cho một staff
    public List<SeekerStaffMapping> getSeekersByStaff(String staffId) {
        return seekerStaffMappingRepository.findByStaffIdAndStatus(staffId, SeekerStaffMapping.Status.active);
    }

    // Phương thức lấy thông tin mapping của một seeker
    public SeekerStaffMapping getMappingBySeeker(String seekerId) {
        return seekerStaffMappingRepository.findBySeekerId(seekerId);
    }

    // Phương thức đếm số seeker active của một staff
    public int countActiveSeekersByStaff(String staffId) {
        return seekerStaffMappingRepository.countActiveSeekersByStaff(staffId);
    }
}
