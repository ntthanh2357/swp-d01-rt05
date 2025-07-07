package com.swp391_g6.demo.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.swp391_g6.demo.entity.Seeker;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.entity.VerificationToken;
import com.swp391_g6.demo.repository.SeekerRepository;
import com.swp391_g6.demo.repository.VerificationTokenRepository;
import com.swp391_g6.demo.util.EmailUtil;

@Service
public class SeekerService {

    @Autowired 
    private SeekerRepository seekerRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private EmailUtil emailUtil;

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
        Optional<VerificationToken> optionalToken = verificationTokenRepository.findByEmailAndTask(email, "update-seeker-profile");
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
