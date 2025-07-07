package com.swp391_g6.demo.dto;

import java.sql.Date;

import com.swp391_g6.demo.entity.Scholarship;

public class ScholarshipDTO {
    private String scholarshipId;
    private String title;
    private String organizationName;
    private Integer organizationWorldRank;
    private boolean featured;
    private String fieldsOfStudy;
    private String countries;
    private Date applicationDeadline;
    private String languageRequirements;
    private double amount;
    private String currency;
    
    public ScholarshipDTO() {
    }

    public ScholarshipDTO(Scholarship scholarship) {
        this.scholarshipId = scholarship.getScholarshipId();
        this.title = scholarship.getTitle();
        this.organizationName = scholarship.getOrganization().getName();
        this.organizationWorldRank = scholarship.getOrganization().getWorldRank();
        this.featured = scholarship.getFeatured();
        this.fieldsOfStudy = scholarship.getFieldsOfStudy();
        this.countries = scholarship.getCountries();
        this.applicationDeadline = scholarship.getApplicationDeadline();
        this.languageRequirements = scholarship.getLanguageRequirements();
        this.amount = scholarship.getAmount();
        this.currency = scholarship.getCurrency();
    }

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

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public Integer getOrganizationWorldRank() {
        return organizationWorldRank;
    }

    public void setOrganizationWorldRank(Integer organizationWorldRank) {
        this.organizationWorldRank = organizationWorldRank;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public String getFieldsOfStudy() {
        return fieldsOfStudy;
    }

    public void setFieldsOfStudy(String fieldsOfStudy) {
        this.fieldsOfStudy = fieldsOfStudy;
    }

    public String getCountries() {
        return countries;
    }

    public void setCountries(String countries) {
        this.countries = countries;
    }

    public Date getApplicationDeadline() {
        return applicationDeadline;
    }

    public void setApplicationDeadline(Date applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }

    public String getLanguageRequirements() {
        return languageRequirements;
    }

    public void setLanguageRequirements(String languageRequirements) {
        this.languageRequirements = languageRequirements;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

}
