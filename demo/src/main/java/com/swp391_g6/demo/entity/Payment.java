package com.swp391_g6.demo.entity;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "payments")
public class Payment {
    
    @Id
    @Column(name = "payment_id", length = 50)
    private String paymentId;
    
    @Column(name = "user_id", length = 15, nullable = false)
    private String userId;
    
    @Column(name = "package_id", length = 20, nullable = false)
    private String packageId;
    
    @Column(name = "order_code", nullable = false, unique = true)
    private Long orderCode;
    
    @Column(name = "amount", nullable = false)
    private Integer amount;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "payment_method", length = 50)
    private String paymentMethod = "PayOS";
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PaymentStatus status = PaymentStatus.PENDING;
    
    @Column(name = "payment_url", columnDefinition = "TEXT")
    private String paymentUrl;
    
    @Column(name = "checkout_url", columnDefinition = "TEXT")
    private String checkoutUrl;
    
    @Column(name = "paid_at")
    private Timestamp paidAt;
    
    @Column(name = "created_at")
    private Timestamp createdAt;
    
    @Column(name = "updated_at")
    private Timestamp updatedAt;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", referencedColumnName = "package_id", insertable = false, updatable = false)
    private PaymentPackage paymentPackage;
    
    public enum PaymentStatus {
        PENDING, PAID, CANCELLED, FAILED
    }
    
    // Constructors
    public Payment() {}
    
    public Payment(String paymentId, String userId, String packageId, Long orderCode, Integer amount, String description) {
        this.paymentId = paymentId;
        this.userId = userId;
        this.packageId = packageId;
        this.orderCode = orderCode;
        this.amount = amount;
        this.description = description;
        this.createdAt = new Timestamp(System.currentTimeMillis());
        this.updatedAt = new Timestamp(System.currentTimeMillis());
    }
    
    // Getters and Setters
    public String getPaymentId() {
        return paymentId;
    }
    
    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getPackageId() {
        return packageId;
    }
    
    public void setPackageId(String packageId) {
        this.packageId = packageId;
    }
    
    public Long getOrderCode() {
        return orderCode;
    }
    
    public void setOrderCode(Long orderCode) {
        this.orderCode = orderCode;
    }
    
    public Integer getAmount() {
        return amount;
    }
    
    public void setAmount(Integer amount) {
        this.amount = amount;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public PaymentStatus getStatus() {
        return status;
    }
    
    public void setStatus(PaymentStatus status) {
        this.status = status;
    }
    
    public String getPaymentUrl() {
        return paymentUrl;
    }
    
    public void setPaymentUrl(String paymentUrl) {
        this.paymentUrl = paymentUrl;
    }
    
    public String getCheckoutUrl() {
        return checkoutUrl;
    }
    
    public void setCheckoutUrl(String checkoutUrl) {
        this.checkoutUrl = checkoutUrl;
    }
    
    public Timestamp getPaidAt() {
        return paidAt;
    }
    
    public void setPaidAt(Timestamp paidAt) {
        this.paidAt = paidAt;
    }
    
    public Timestamp getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
    
    public Timestamp getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public PaymentPackage getPaymentPackage() {
        return paymentPackage;
    }
    
    public void setPaymentPackage(PaymentPackage paymentPackage) {
        this.paymentPackage = paymentPackage;
    }
}
