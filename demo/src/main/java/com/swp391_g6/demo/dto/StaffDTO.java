package com.swp391_g6.demo.dto;

import java.sql.Date;
import java.text.SimpleDateFormat;

import com.swp391_g6.demo.entity.Staff;
import com.swp391_g6.demo.entity.User;

public class StaffDTO {
    private String staffId;
    private String educationLevel;
    private Integer experienceYears;
    private String specialization;
    private Integer totalReviews;
    private Double rating;
    private Integer currentSeekerCount;
    private String role;

    // Thông tin từ User
    private String name;
    private String email;
    private String phone;
    private Date dateOfBirth;
    private String gender;
    private String dateOfBirthString; // Thêm trường mới để xử lý chuỗi ngày tháng

    public StaffDTO() {
    }

    public StaffDTO(Staff staff, User user) {
        this.staffId = staff.getStaffId();
        this.educationLevel = staff.getEducationLevel();
        this.experienceYears = staff.getExperienceYears();
        this.specialization = staff.getSpecialization();
        this.totalReviews = staff.getTotalReviews();
        this.rating = staff.getRating();
        this.currentSeekerCount = staff.getCurrentSeekerCount();

        // User entity
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.dateOfBirth = user.getDateOfBirth();
        this.gender = user.getGender();
        this.role = user.getRole();
        // sử dụng SimpleDateFormat để định dạng ngày tháng
        if (user.getDateOfBirth() != null) {
            this.dateOfBirthString = new SimpleDateFormat("yyyy-MM-dd").format(user.getDateOfBirth());
        }
    }

    // Getters and Setters
    public String getStaffId() {
        return staffId;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }

    public String getEducationLevel() {
        return educationLevel;
    }

    public void setEducationLevel(String educationLevel) {
        this.educationLevel = educationLevel;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Integer getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Integer totalReviews) {
        this.totalReviews = totalReviews;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getCurrentSeekerCount() {
        return currentSeekerCount;
    }

    public void setCurrentSeekerCount(Integer currentSeekerCount) {
        this.currentSeekerCount = currentSeekerCount;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDateOfBirthString() {
        return dateOfBirthString;
    }

    public void setDateOfBirthString(String dateOfBirthString) {
        this.dateOfBirthString = dateOfBirthString;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}