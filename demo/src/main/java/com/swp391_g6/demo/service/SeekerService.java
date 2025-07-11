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
}
