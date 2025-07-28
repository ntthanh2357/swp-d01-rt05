package com.swp391_g6.demo.dto;

import java.util.List;

public class ConsultationRequestDTO {
    private String fullName;
    private String email;
    private String phone;
    private List<String> country;
    private String studyTime;
    private List<String> city;
    private String educationLevel;
    private String adviceType;
    private String scholarshipGoal;
    private String major;
    private String note;
    private Boolean receivePromotions;
    private String token;

    // Constructors
    public ConsultationRequestDTO() {}

    public ConsultationRequestDTO(String fullName, String email, String phone, List<String> country, 
                                String studyTime, List<String> city, String educationLevel, 
                                String adviceType, String scholarshipGoal, String major, 
                                String note, Boolean receivePromotions, String token) {
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
        this.receivePromotions = receivePromotions;
        this.token = token;
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

    public List<String> getCountry() {
        return country;
    }

    public void setCountry(List<String> country) {
        this.country = country;
    }

    public String getStudyTime() {
        return studyTime;
    }

    public void setStudyTime(String studyTime) {
        this.studyTime = studyTime;
    }

    public List<String> getCity() {
        return city;
    }

    public void setCity(List<String> city) {
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