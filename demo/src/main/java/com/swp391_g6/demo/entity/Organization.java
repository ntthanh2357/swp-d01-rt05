package com.swp391_g6.demo.entity;

import java.sql.Timestamp;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "organizations")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Organization {

    @Id
    @Column(name = "organization_id", length = 15, nullable = false)
    private String organizationId;

    @Column(name = "name", length = 200, nullable = false)
    private String name;

    @Lob
    @Column(name = "description", columnDefinition = "longtext")
    private String description;

    @Column(name = "world_rank")
    private Integer worldRank;

    @Column(name = "website_url", length = 500)
    private String websiteUrl;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "number_student")
    private Integer numberStudent;

    @Column(name = "avg_cost_living")
    private Integer avgCostLiving;

    @Column(name = "country", length = 100)
    private String country;

    public enum OrganizationType {
        university, government, ngo
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "organization_type", columnDefinition = "enum('university','government','ngo')")
    private OrganizationType organizationType;

    @Column(name = "is_verified")
    @ColumnDefault("0")
    private Boolean isVerified = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    public Organization() {
    }

    // Getters and setters

    public String getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getWorldRank() {
        return worldRank;
    }

    public void setWorldRank(Integer worldRank) {
        this.worldRank = worldRank;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public Integer getNumberStudent() {
        return numberStudent;
    }

    public void setNumberStudent(Integer numberStudent) {
        this.numberStudent = numberStudent;
    }

    public Integer getAvgCostLiving() {
        return avgCostLiving;
    }

    public void setAvgCostLiving(Integer avgCostLiving) {
        this.avgCostLiving = avgCostLiving;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public OrganizationType getOrganizationType() {
        return organizationType;
    }

    public void setOrganizationType(OrganizationType organizationType) {
        this.organizationType = organizationType;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified != null ? isVerified : false;
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