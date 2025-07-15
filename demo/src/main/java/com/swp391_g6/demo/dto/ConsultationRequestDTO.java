package com.swp391_g6.demo.dto;

public class ConsultationRequestDTO {
    private String fullName;
    private String email;
    private String phone;
    private String country;
    private String studyTime;
    private String city;
    private String educationLevel;
    private String adviceType;
    private String scholarshipGoal;
    private String major;
    private String note;
    private Boolean contactZaloFacebook;
    private Boolean receivePromotions;
    private String token;

    // Constructors
    public ConsultationRequestDTO() {}

    public ConsultationRequestDTO(String fullName, String email, String phone, String country, 
                                 String studyTime, String city, String educationLevel, 
                                 String adviceType, String scholarshipGoal, String major, 
                                 String note, Boolean contactZaloFacebook, Boolean receivePromotions) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.country = country;
        this.studyTime = studyTime;
        this.city = city;
        this.educationLevel = educationLevel;
        this.adviceType = adviceType;
        this.scholarshipGoal = scholarshipGoal;
        this.major = major;
        this.note = note;
        this.contactZaloFacebook = contactZaloFacebook;
        this.receivePromotions = receivePromotions;
    }

    // Getters and Setters
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

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

    public String getEducationLevel() {
        return educationLevel;
    }

    public void setEducationLevel(String educationLevel) {
        this.educationLevel = educationLevel;
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

    public Boolean getContactZaloFacebook() {
        return contactZaloFacebook;
    }

    public void setContactZaloFacebook(Boolean contactZaloFacebook) {
        this.contactZaloFacebook = contactZaloFacebook;
    }

    public Boolean getReceivePromotions() {
        return receivePromotions;
    }

    public void setReceivePromotions(Boolean receivePromotions) {
        this.receivePromotions = receivePromotions;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
} 