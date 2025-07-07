package com.swp391_g6.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "staff_profiles")
public class Staff {

    @Id
    @Column(name = "staff_id", length = 15, nullable = false)
    private String staffId;

    @Column(name = "education_level")
    private String educationLevel;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "specialization")
    private String specialization;

    @Column(name = "total_reviews")
    private Integer totalReviews;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "created_by", length = 15)
    private String createdBy;

    @Column(name = "current_seeker_count")
    private Integer currentSeekerCount;

    // Getters and setters

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

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Integer getCurrentSeekerCount() {
        return currentSeekerCount;
    }

    public void setCurrentSeekerCount(Integer currentSeekerCount) {
        this.currentSeekerCount = currentSeekerCount;
    }

}