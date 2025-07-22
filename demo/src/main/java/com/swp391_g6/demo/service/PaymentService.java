package com.swp391_g6.demo.service;

import com.swp391_g6.demo.entity.Payment;
import com.swp391_g6.demo.entity.PaymentPackage;
import com.swp391_g6.demo.entity.Seeker;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.repository.PaymentRepository;
import com.swp391_g6.demo.repository.PaymentPackageRepository;
import com.swp391_g6.demo.repository.SeekerRepository;
import com.swp391_g6.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private PaymentPackageRepository paymentPackageRepository;
    
    @Autowired
    private SeekerRepository seekerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Payment createPayment(User user, String packageId, Long orderCode, Integer amount, String description) {
        String paymentId = "PAY_" + UUID.randomUUID().toString().replace("-", "").substring(0, 20);
        
        Payment payment = new Payment(paymentId, user.getUserId(), packageId, orderCode, amount, description);
        return paymentRepository.save(payment);
    }
    
    public void updatePaymentUrls(String paymentId, String checkoutUrl) {
        Optional<Payment> optionalPayment = paymentRepository.findById(paymentId);
        if (optionalPayment.isPresent()) {
            Payment payment = optionalPayment.get();
            payment.setCheckoutUrl(checkoutUrl);
            payment.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            paymentRepository.save(payment);
        }
    }
    
    public void markPaymentAsSuccessful(Long orderCode) {
        System.out.println("=== PROCESSING PAYMENT SUCCESS ===");
        System.out.println("Order Code: " + orderCode);
        
        Optional<Payment> optionalPayment = paymentRepository.findByOrderCode(orderCode);
        if (optionalPayment.isPresent()) {
            Payment payment = optionalPayment.get();
            System.out.println("Found payment: " + payment.getPaymentId());
            System.out.println("User ID: " + payment.getUserId());
            System.out.println("Package ID: " + payment.getPackageId());
            
            payment.setStatus(Payment.PaymentStatus.PAID);
            payment.setPaidAt(new Timestamp(System.currentTimeMillis()));
            payment.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            paymentRepository.save(payment);
            System.out.println("Payment status updated to PAID");
            
            // Update seeker profile with purchased package
            updateSeekerPurchasedPackage(payment.getUserId(), payment.getPackageId());
        } else {
            System.out.println("Payment not found for order code: " + orderCode);
        }
        System.out.println("=== END PROCESSING PAYMENT SUCCESS ===");
    }
    
    public void markPaymentAsFailed(Long orderCode) {
        Optional<Payment> optionalPayment = paymentRepository.findByOrderCode(orderCode);
        if (optionalPayment.isPresent()) {
            Payment payment = optionalPayment.get();
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            paymentRepository.save(payment);
        }
    }
    
    public void markPaymentAsCancelled(Long orderCode) {
        Optional<Payment> optionalPayment = paymentRepository.findByOrderCode(orderCode);
        if (optionalPayment.isPresent()) {
            Payment payment = optionalPayment.get();
            payment.setStatus(Payment.PaymentStatus.CANCELLED);
            payment.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            paymentRepository.save(payment);
        }
    }
    
    private void updateSeekerPurchasedPackage(String userId, String packageId) {
        try {
            // Find user first, then find seeker profile by user
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                System.out.println("User not found: " + userId);
                return;
            }
            
            Seeker seeker = seekerRepository.findByUser(user);
            if (seeker != null) {
                seeker.setPurchasedPackage(packageId);
                seeker.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
                seekerRepository.save(seeker);
                System.out.println("Successfully updated seeker " + userId + " with purchased package: " + packageId);
            } else {
                System.out.println("Seeker profile not found for user: " + userId);
                // Tạo seeker profile mới nếu chưa có
                seeker = new Seeker();
                seeker.setUser(user);
                seeker.setSeekerId(userId);
                seeker.setPurchasedPackage(packageId);
                seeker.setCreatedAt(new Timestamp(System.currentTimeMillis()));
                seeker.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
                seekerRepository.save(seeker);
                System.out.println("Created new seeker profile for user " + userId + " with purchased package: " + packageId);
            }
        } catch (Exception e) {
            System.err.println("Error updating seeker purchased package: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public Optional<Payment> findByOrderCode(Long orderCode) {
        return paymentRepository.findByOrderCode(orderCode);
    }
    
    public List<Payment> getUserPaymentHistory(String userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<PaymentPackage> getAllActivePackages() {
        return paymentPackageRepository.findAll();
    }
    
    public Optional<PaymentPackage> getPackageById(String packageId) {
        return paymentPackageRepository.findById(packageId);
    }
}
