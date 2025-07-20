package com.swp391_g6.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "seeker_profiles")
public class Seeker {

    @Id
    @Column(name = "seeker_id", length = 15)
    private String seekerId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "seeker_id", referencedColumnName = "user_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_education_level")
    private EducationLevel currentEducationLevel;

    @Column(name = "field_of_study", length = 200)
    private String fieldOfStudy;

    @Column(name = "gpa", precision = 4, scale = 2)
    private BigDecimal gpa;

    @Column(name = "target_degree", length = 200)
    private String targetDegree;

    @Column(name = "target_countries", columnDefinition = "json")
    private String targetCountries; // Store as JSON string

    @Column(name = "preferred_languages", columnDefinition = "json")
    private String preferredLanguages; // Store as JSON string

    @Enumerated(EnumType.STRING)
    @Column(name = "financial_need_level")
    private FinancialNeedLevel financialNeedLevel;

    @Column(name = "cv_url", length = 500)
    private String cvUrl;

    @Column(name = "bio", columnDefinition = "text")
    private String bio;

    @Column(name = "study_time", length = 50)
    private String studyTime;

    @Column(name = "city", length = 200)
    private String city;

    @Column(name = "advice_type", length = 100)
    private String adviceType;

    @Column(name = "scholarship_goal", columnDefinition = "text")
    private String scholarshipGoal;

    @Column(name = "major", length = 200)
    private String major;

    @Column(name = "note", columnDefinition = "text")
    private String note;

    @Column(name = "receive_promotions")
    private Boolean receivePromotions;

    @Column(name = "purchased_package", length = 20)
    private String purchasedPackage;

    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;

    @Column(name = "updated_at")
    private java.sql.Timestamp updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_staff_id", referencedColumnName = "user_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private User assignedStaff;

    // Enum for education level
    public enum EducationLevel {
        high_school, undergraduate, graduate, postgraduate
    }

    // Enum for financial need level
    public enum FinancialNeedLevel {
        low, medium, high
    }

    // Getters and setters

    public String getSeekerId() {
        return seekerId;
    }

    public void setSeekerId(String seekerId) {
        this.seekerId = seekerId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public EducationLevel getCurrentEducationLevel() {
        return currentEducationLevel;
    }

    public void setCurrentEducationLevel(EducationLevel currentEducationLevel) {
        this.currentEducationLevel = currentEducationLevel;
    }

    public String getFieldOfStudy() {
        return fieldOfStudy;
    }

    public void setFieldOfStudy(String fieldOfStudy) {
        this.fieldOfStudy = fieldOfStudy;
    }

    public BigDecimal getGpa() {
        return gpa;
    }

    public void setGpa(BigDecimal gpa) {
        this.gpa = gpa;
    }

    public String getTargetDegree() {
        return targetDegree;
    }

    public void setTargetDegree(String targetDegree) {
        this.targetDegree = targetDegree;
    }

    public String getTargetCountries() {
        return targetCountries;
    }

    public void setTargetCountries(String targetCountries) {
        this.targetCountries = targetCountries;
    }

    public String getPreferredLanguages() {
        return preferredLanguages;
    }

    public void setPreferredLanguages(String preferredLanguages) {
        this.preferredLanguages = preferredLanguages;
    }

    public FinancialNeedLevel getFinancialNeedLevel() {
        return financialNeedLevel;
    }

    public void setFinancialNeedLevel(FinancialNeedLevel financialNeedLevel) {
        this.financialNeedLevel = financialNeedLevel;
    }

    public String getCvUrl() {
        return cvUrl;
    }

    public void setCvUrl(String cvUrl) {
        this.cvUrl = cvUrl;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public User getAssignedStaff() {
        return assignedStaff;
    }

    public void setAssignedStaff(User assignedStaff) {
        this.assignedStaff = assignedStaff;
    }

    // Getters and setters for new fields
    public String getStudyTime() {
        return studyTime;
    }

    public void setStudyTime(String studyTime) {
        this.studyTime = studyTime;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAdviceType() {
        return adviceType;
    }

    public void setAdviceType(String adviceType) {
        this.adviceType = adviceType;
    }

    public String getScholarshipGoal() {
        return scholarshipGoal;
    }

    public void setScholarshipGoal(String scholarshipGoal) {
        this.scholarshipGoal = scholarshipGoal;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Boolean getReceivePromotions() {
        return receivePromotions;
    }

    public void setReceivePromotions(Boolean receivePromotions) {
        this.receivePromotions = receivePromotions;
    }

    public String getPurchasedPackage() {
        return purchasedPackage;
    }

    public void setPurchasedPackage(String purchasedPackage) {
        this.purchasedPackage = purchasedPackage;
    }

    public java.sql.Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.sql.Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public java.sql.Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(java.sql.Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}