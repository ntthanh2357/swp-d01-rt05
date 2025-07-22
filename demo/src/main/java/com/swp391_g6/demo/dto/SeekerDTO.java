package com.swp391_g6.demo.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class SeekerDTO {
    // Thông tin từ User
    private String userId;
    private String name;
    private String email;
    private String phone;
    private String gender;

    // Thông tin từ Seeker (seeker_profiles)
    private String bio;
    private String currentEducationLevel;
    private String city;
    private BigDecimal gpa;
    private String major;
    private String note;
    private String adviceType;
    private String targetCountries;
    private String preferredLanguages;
    private String scholarshipGoal;
    private String studyTime;
    private Boolean contactZaloFacebook;
    private Boolean receivePromotions;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String seekerId;
    private String assignedStaffId;

    // Getter & Setter
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getCurrentEducationLevel() { return currentEducationLevel; }
    public void setCurrentEducationLevel(String currentEducationLevel) { this.currentEducationLevel = currentEducationLevel; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public BigDecimal getGpa() { return gpa; }
    public void setGpa(BigDecimal gpa) { this.gpa = gpa; }
    public String getMajor() { return major; }
    public void setMajor(String major) { this.major = major; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public String getAdviceType() { return adviceType; }
    public void setAdviceType(String adviceType) { this.adviceType = adviceType; }
    public String getTargetCountries() { return targetCountries; }
    public void setTargetCountries(String targetCountries) { this.targetCountries = targetCountries; }
    public String getPreferredLanguages() { return preferredLanguages; }
    public void setPreferredLanguages(String preferredLanguages) { this.preferredLanguages = preferredLanguages; }
    public String getScholarshipGoal() { return scholarshipGoal; }
    public void setScholarshipGoal(String scholarshipGoal) { this.scholarshipGoal = scholarshipGoal; }
    public String getStudyTime() { return studyTime; }
    public void setStudyTime(String studyTime) { this.studyTime = studyTime; }
    public Boolean getContactZaloFacebook() { return contactZaloFacebook; }
    public void setContactZaloFacebook(Boolean contactZaloFacebook) { this.contactZaloFacebook = contactZaloFacebook; }
    public Boolean getReceivePromotions() { return receivePromotions; }
    public void setReceivePromotions(Boolean receivePromotions) { this.receivePromotions = receivePromotions; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }
    public String getSeekerId() { return seekerId; }
    public void setSeekerId(String seekerId) { this.seekerId = seekerId; }
    public String getAssignedStaffId() { return assignedStaffId; }
    public void setAssignedStaffId(String assignedStaffId) { this.assignedStaffId = assignedStaffId; }
} 