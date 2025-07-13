package com.swp391_g6.demo.dto;

import java.sql.Date;

import com.swp391_g6.demo.entity.Scholarship;

public class ScholarshipDTO {
    private String scholarshipId;
    private String title;
    private boolean featured;
    private String fieldsOfStudy;
    private String countries;
    private Date applicationDeadline;
    private String languageRequirements;
    private double amount;
    private String currency;
    private String description;
    private String eligibilityCriteria;
    private String educationLevels;
    private int applicationsCount;
    private int viewsCount;
    private String fundingType;
    private String applicableIntake;
    private OrganizationDTO organization;

    public ScholarshipDTO() {
    }

    public ScholarshipDTO(Scholarship scholarship) {
        this.scholarshipId = scholarship.getScholarshipId();
        this.title = scholarship.getTitle();
        this.featured = scholarship.getFeatured();
        this.fieldsOfStudy = scholarship.getFieldsOfStudy();
        this.countries = scholarship.getCountries();
        this.applicationDeadline = scholarship.getApplicationDeadline();
        this.languageRequirements = scholarship.getLanguageRequirements();
        this.amount = scholarship.getAmount();
        this.currency = scholarship.getCurrency();
        this.description = scholarship.getDescription();
        this.eligibilityCriteria = scholarship.getEligibilityCriteria();
        this.educationLevels = scholarship.getEducationLevels();
        this.applicationsCount = scholarship.getApplicationsCount();
        this.viewsCount = scholarship.getViewsCount();
        this.fundingType = scholarship.getFundingType();
        this.applicableIntake = scholarship.getApplicableIntake();
        this.organization = new OrganizationDTO(scholarship.getOrganization());
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEligibilityCriteria() {
        return eligibilityCriteria;
    }

    public void setEligibilityCriteria(String eligibilityCriteria) {
        this.eligibilityCriteria = eligibilityCriteria;
    }

    public String getEducationLevels() {
        return educationLevels;
    }

    public void setEducationLevels(String educationLevels) {
        this.educationLevels = educationLevels;
    }

    public int getApplicationsCount() {
        return applicationsCount;
    }

    public void setApplicationsCount(int applicationsCount) {
        this.applicationsCount = applicationsCount;
    }

    public int getViewsCount() {
        return viewsCount;
    }

    public void setViewsCount(int viewsCount) {
        this.viewsCount = viewsCount;
    }

    public String getFundingType() {
        return fundingType;
    }

    public void setFundingType(String fundingType) {
        this.fundingType = fundingType;
    }

    public String getApplicableIntake() {
        return applicableIntake;
    }

    public void setApplicableIntake(String applicableIntake) {
        this.applicableIntake = applicableIntake;
    }

    public OrganizationDTO getOrganization() {
        return organization;
    }

    public void setOrganization(OrganizationDTO organization) {
        this.organization = organization;
    }

}
