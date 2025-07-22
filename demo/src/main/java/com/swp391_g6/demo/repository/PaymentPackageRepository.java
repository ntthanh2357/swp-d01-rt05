package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.PaymentPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentPackageRepository extends JpaRepository<PaymentPackage, String> {
    
}
