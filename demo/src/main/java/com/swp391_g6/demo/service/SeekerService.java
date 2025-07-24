package com.swp391_g6.demo.service;

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
        seeker.setCity(request.getCity());
        seeker.setAdviceType(request.getAdviceType());
        seeker.setScholarshipGoal(request.getScholarshipGoal());
        seeker.setMajor(request.getMajor());
        seeker.setNote(request.getNote());
        seeker.setReceivePromotions(request.getReceivePromotions());
        seeker.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        seeker.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

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

        // Map target countries
        if (request.getCountry() != null) {
            seeker.setTargetCountries("[\"" + request.getCountry() + "\"]");
        }

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
            // Kiểm tra xem seeker đã có mapping chưa
            SeekerStaffMapping existingMapping = seekerStaffMappingRepository.findBySeekerId(seeker.getSeekerId());
            if (existingMapping != null) {
                System.out.println("Seeker " + seeker.getSeekerId() + " already has staff assigned: "
                        + existingMapping.getStaffId());
                return;
            }

            // Lấy danh sách tất cả staff
            List<User> staffList = userRepository.findByRole("staff");
            if (staffList.isEmpty()) {
                System.out.println("No staff available for assignment");
                return;
            }

            // Logic phân công: tìm staff có ít seeker nhất
            User selectedStaff = null;
            int minSeekers = Integer.MAX_VALUE;

            for (User staff : staffList) {
                int currentSeekers = seekerStaffMappingRepository.countActiveSeekersByStaff(staff.getUserId());
                if (currentSeekers < minSeekers) {
                    minSeekers = currentSeekers;
                    selectedStaff = staff;
                }
            }

            if (selectedStaff != null) {
                // Tạo mapping mới
                SeekerStaffMapping mapping = new SeekerStaffMapping();
                mapping.setSeekerId(seeker.getSeekerId());
                mapping.setStaffId(selectedStaff.getUserId());
                mapping.setAssignedAt(new Timestamp(System.currentTimeMillis()));
                mapping.setStatus(SeekerStaffMapping.Status.active);

                // Lưu mapping
                seekerStaffMappingRepository.save(mapping);

                // Cập nhật assignedStaff cho seeker
                seeker.setAssignedStaff(selectedStaff);
                seekerRepository.save(seeker);

                System.out.println("Successfully assigned staff " + selectedStaff.getUserId() +
                        " to seeker " + seeker.getSeekerId());
            } else {
                System.out.println("Failed to assign staff to seeker " + seeker.getSeekerId());
            }

        } catch (Exception e) {
            System.out.println("Error assigning staff to seeker: " + e.getMessage());
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
