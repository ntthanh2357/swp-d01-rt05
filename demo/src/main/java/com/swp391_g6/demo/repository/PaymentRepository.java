package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    
    Optional<Payment> findByOrderCode(Long orderCode);
    
    List<Payment> findByUserIdOrderByCreatedAtDesc(String userId);
    
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
}
