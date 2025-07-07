package com.swp391_g6.demo.entity;

import java.sql.Date;
import java.sql.Timestamp;

import jakarta.persistence.*;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "scholarships")
public class Scholarship {

    @Id
    @Column(name = "scholarship_id", length = 15, nullable = false)
    private String scholarshipId;

    @Column(name = "title", length = 255)
    private String title;

    @Lob
    @Column(name = "description", columnDefinition = "longtext")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", referencedColumnName = "organization_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Organization organization;

    @Column(name = "category_id", length = 15, nullable = false)
    private String categoryId;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "currency", length = 255)
    private String currency;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "application_deadline")
    private Date applicationDeadline;

    @Column(name = "eligibility_criteria", length = 255)
    private String eligibilityCriteria;

    @Column(name = "countries", length = 255)
    private String countries;

    @Column(name = "education_levels", columnDefinition = "json")
    private String educationLevels;

    @Column(name = "fields_of_study", columnDefinition = "json")
    private String fieldsOfStudy;

    @Column(name = "language_requirements", columnDefinition = "json")
    private String languageRequirements;

    public enum Status {
        draft, active, inactive, expired
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "enum('draft','active','inactive','expired') default 'draft'")
    private Status status = Status.draft;

    @Column(name = "views_count")
    @ColumnDefault("0")
    private Integer viewsCount = 0;

    @Column(name = "applications_count")
    @ColumnDefault("0")
    private Integer applicationsCount = 0;

    @Column(name = "featured")
    @ColumnDefault("0")
    private Boolean featured = false;

    @Column(name = "created_by", length = 15, nullable = false)
    private String createdBy;

    @Column(name = "approved_by", length = 15)
    private String approvedBy;

    @Column(name = "approved_at")
    private Timestamp approvedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    public Scholarship() {
    }

    // Constructor đầy đủ các trường
    public Scholarship(String scholarshipId, String title, String description, Organization organization,
            String categoryId, Double amount, String currency, Integer duration, Date applicationDeadline,
            String eligibilityCriteria, String countries, String educationLevels,
            String fieldsOfStudy, String languageRequirements, Status status,
            Integer viewsCount, Integer applicationsCount, Boolean featured, String createdBy,
            String approvedBy, Timestamp approvedAt, Timestamp createdAt, Timestamp updatedAt) {
        this.scholarshipId = scholarshipId;
        this.title = title;
        this.description = description;
        this.organization = organization;
        this.categoryId = categoryId;
        this.amount = amount;
        this.currency = currency;
        this.duration = duration;
        this.applicationDeadline = applicationDeadline;
        this.eligibilityCriteria = eligibilityCriteria;
        this.countries = countries;
        this.educationLevels = educationLevels;
        this.fieldsOfStudy = fieldsOfStudy;
        this.languageRequirements = languageRequirements;
        this.status = status != null ? status : Status.draft;
        this.viewsCount = viewsCount != null ? viewsCount : 0;
        this.applicationsCount = applicationsCount != null ? applicationsCount : 0;
        this.featured = featured != null ? featured : false;
        this.createdBy = createdBy;
        this.approvedBy = approvedBy;
        this.approvedAt = approvedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters và setters cho tất cả các trường

    public String getScholarshipId() {
        return scholarshipId;
    }

    public void setScholarshipId(String scholarshipId) {
        this.scholarshipId = scholarshipId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Date getApplicationDeadline() {
        return applicationDeadline;
    }

    public void setApplicationDeadline(Date applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }

    public String getEligibilityCriteria() {
        return eligibilityCriteria;
    }

    public void setEligibilityCriteria(String eligibilityCriteria) {
        this.eligibilityCriteria = eligibilityCriteria;
    }

    public String getCountries() {
        return countries;
    }

    public void setCountries(String countries) {
        this.countries = countries;
    }

    public String getEducationLevels() {
        return educationLevels;
    }

    public void setEducationLevels(String educationLevels) {
        this.educationLevels = educationLevels;
    }

    public String getFieldsOfStudy() {
        return fieldsOfStudy;
    }

    public void setFieldsOfStudy(String fieldsOfStudy) {
        this.fieldsOfStudy = fieldsOfStudy;
    }

    public String getLanguageRequirements() {
        return languageRequirements;
    }

    public void setLanguageRequirements(String languageRequirements) {
        this.languageRequirements = languageRequirements;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status != null ? status : Status.draft;
    }

    public Integer getViewsCount() {
        return viewsCount;
    }

    public void setViewsCount(Integer viewsCount) {
        this.viewsCount = viewsCount != null ? viewsCount : 0;
    }

    public Integer getApplicationsCount() {
        return applicationsCount;
    }

    public void setApplicationsCount(Integer applicationsCount) {
        this.applicationsCount = applicationsCount != null ? applicationsCount : 0;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured != null ? featured : false;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }

    public Timestamp getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(Timestamp approvedAt) {
        this.approvedAt = approvedAt;
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

}