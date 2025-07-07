package com.swp391_g6.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swp391_g6.demo.entity.VerificationToken;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    Optional<VerificationToken> findByEmail(String email);

    Optional<VerificationToken> findByEmailAndTask(String email, String task);

}