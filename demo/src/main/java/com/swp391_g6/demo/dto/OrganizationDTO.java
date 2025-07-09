package com.swp391_g6.demo.dto;

import com.swp391_g6.demo.entity.Organization;
import java.sql.Timestamp;

public class OrganizationDTO {
    private String organizationId;
    private Integer avgCostLiving;
    private String country;
    private Timestamp createdAt;
    private String description;
    private Boolean isVerified;
    private String logoUrl;
    private String name;
    private Integer numberStudent;
    private String organizationType;
    private Timestamp updatedAt;
    private String websiteUrl;
    private Integer worldRank;

    public OrganizationDTO() {
    }

    public OrganizationDTO(Organization org) {
        this.organizationId = org.getOrganizationId();
        this.avgCostLiving = org.getAvgCostLiving();
        this.country = org.getCountry();
        this.createdAt = org.getCreatedAt();
        this.description = org.getDescription();
        this.isVerified = org.getIsVerified();
        this.logoUrl = org.getLogoUrl();
        this.name = org.getName();
        this.numberStudent = org.getNumberStudent();
        this.organizationType = org.getOrganizationType() != null ? org.getOrganizationType().toString() : null;
        this.updatedAt = org.getUpdatedAt();
        this.websiteUrl = org.getWebsiteUrl();
        this.worldRank = org.getWorldRank();
    }

    // Helper methods for frontend
    public String getFormattedCountry() {
        return country != null ? country : "Không rõ";
    }

    public String getFormattedWorldRank() {
        return worldRank != null ? worldRank.toString() : "Không rõ";
    }

    public String getFormattedNumberStudent() {
        return numberStudent != null ? numberStudent.toString() : "Không rõ";
    }

    public String getFormattedAvgCostLiving() {
        return avgCostLiving != null ? avgCostLiving + " USD/năm" : "Không rõ";
    }

    public String getFormattedOrganizationType() {
        return organizationType != null ? organizationType : "Không rõ";
    }

    public String getFormattedIsVerified() {
        return isVerified != null && isVerified ? "Đã xác thực" : "Chưa xác thực";
    }

    public String getFormattedCreatedAt() {
        return createdAt != null ? createdAt.toString() : "Không rõ";
    }

    public String getFormattedUpdatedAt() {
        return updatedAt != null ? updatedAt.toString() : "Không rõ";
    }

    public String getFormattedDescription() {
        return description != null ? description : "Không có mô tả";
    }

    public String getFormattedLogoUrl() {
        return logoUrl != null ? logoUrl : "/images/logo.png";
    }

    public String getFormattedWebsiteUrl() {
        return websiteUrl != null ? websiteUrl : "Không rõ";
    }

    // Getters and setters
    public String getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public Integer getAvgCostLiving() {
        return avgCostLiving;
    }

    public void setAvgCostLiving(Integer avgCostLiving) {
        this.avgCostLiving = avgCostLiving;
    }

    public String getCountry() {
        return country != null ? country : "";
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getNumberStudent() {
        return numberStudent;
    }

    public void setNumberStudent(Integer numberStudent) {
        this.numberStudent = numberStudent;
    }

    public String getOrganizationType() {
        return organizationType;
    }

    public void setOrganizationType(String organizationType) {
        this.organizationType = organizationType;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public Integer getWorldRank() {
        return worldRank;
    }

    public void setWorldRank(Integer worldRank) {
        this.worldRank = worldRank;
    }
}
