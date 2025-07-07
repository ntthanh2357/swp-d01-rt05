package com.swp391_g6.demo.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Date;

@Entity
@Table(name = "counseling_cases")
public class CounselingCase {

    @Id
    @Column(name = "case_id", length = 15)
    private String caseId;

    @Column(name = "user_id", length = 15, nullable = false)
    private String userId;

    @Column(name = "staff_id", length = 15)
    private String staffId;

    @Column(name = "case_title", length = 255, nullable = false)
    private String caseTitle;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority priority;

    @Column(name = "category", length = 255)
    private String category;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "expected_resolution_date")
    @Temporal(TemporalType.DATE)
    private Date expectedResolutionDate;

    @Column(name = "resolution_summary", columnDefinition = "text")
    private String resolutionSummary;

    @Column(name = "time_spent_minutes")
    private Integer timeSpentMinutes;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "closed_at")
    private Timestamp closedAt;

    public enum Status {
        open, in_progress, pending, resolved, closed
    }

    public enum Priority {
        low, medium, high, urgent
    }

    public CounselingCase() {
    }

    public CounselingCase(String caseId, String userId, String staffId, String caseTitle, Status status, Priority priority,
                         String category, String description, Date expectedResolutionDate, String resolutionSummary,
                         Integer timeSpentMinutes, Timestamp createdAt, Timestamp updatedAt, Timestamp closedAt) {
        this.caseId = caseId;
        this.userId = userId;
        this.staffId = staffId;
        this.caseTitle = caseTitle;
        this.status = status;
        this.priority = priority;
        this.category = category;
        this.description = description;
        this.expectedResolutionDate = expectedResolutionDate;
        this.resolutionSummary = resolutionSummary;
        this.timeSpentMinutes = timeSpentMinutes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.closedAt = closedAt;
    }

    public String getCaseId() {
        return caseId;
    }

    public void setCaseId(String caseId) {
        this.caseId = caseId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getStaffId() {
        return staffId;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }

    public String getCaseTitle() {
        return caseTitle;
    }

    public void setCaseTitle(String caseTitle) {
        this.caseTitle = caseTitle;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getExpectedResolutionDate() {
        return expectedResolutionDate;
    }

    public void setExpectedResolutionDate(Date expectedResolutionDate) {
        this.expectedResolutionDate = expectedResolutionDate;
    }

    public String getResolutionSummary() {
        return resolutionSummary;
    }

    public void setResolutionSummary(String resolutionSummary) {
        this.resolutionSummary = resolutionSummary;
    }

    public Integer getTimeSpentMinutes() {
        return timeSpentMinutes;
    }

    public void setTimeSpentMinutes(Integer timeSpentMinutes) {
        this.timeSpentMinutes = timeSpentMinutes;
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

    public Timestamp getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(Timestamp closedAt) {
        this.closedAt = closedAt;
    }
}
