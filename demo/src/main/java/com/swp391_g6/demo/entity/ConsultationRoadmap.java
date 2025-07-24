package com.swp391_g6.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultation_roadmap")
public class ConsultationRoadmap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roadmapId;

    @Column(name = "seeker_id", nullable = false)
    private String seekerId;

    @Column(name = "step_number", nullable = false)
    private Integer stepNumber;

    @Column(name = "step_title", nullable = false, length = 255)
    private String stepTitle;

    @Column(name = "step_description", columnDefinition = "TEXT")
    private String stepDescription;

    @Column(name = "step_status", length = 50, nullable = false)
    private String stepStatus = "pending"; // pending, in_progress, completed

    @Column(name = "estimated_duration_days")
    private Integer estimatedDurationDays;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Constructors
    public ConsultationRoadmap() {
    }

    public ConsultationRoadmap(String seekerId, Integer stepNumber, String stepTitle,
            String stepDescription, Integer estimatedDurationDays) {
        this.seekerId = seekerId;
        this.stepNumber = stepNumber;
        this.stepTitle = stepTitle;
        this.stepDescription = stepDescription;
        this.estimatedDurationDays = estimatedDurationDays;
    }

    // Getters and Setters
    public Long getRoadmapId() {
        return roadmapId;
    }

    public void setRoadmapId(Long roadmapId) {
        this.roadmapId = roadmapId;
    }

    public String getSeekerId() {
        return seekerId;
    }

    public void setSeekerId(String seekerId) {
        this.seekerId = seekerId;
    }

    public Integer getStepNumber() {
        return stepNumber;
    }

    public void setStepNumber(Integer stepNumber) {
        this.stepNumber = stepNumber;
    }

    public String getStepTitle() {
        return stepTitle;
    }

    public void setStepTitle(String stepTitle) {
        this.stepTitle = stepTitle;
    }

    public String getStepDescription() {
        return stepDescription;
    }

    public void setStepDescription(String stepDescription) {
        this.stepDescription = stepDescription;
    }

    public String getStepStatus() {
        return stepStatus;
    }

    public void setStepStatus(String stepStatus) {
        this.stepStatus = stepStatus;
    }

    public Integer getEstimatedDurationDays() {
        return estimatedDurationDays;
    }

    public void setEstimatedDurationDays(Integer estimatedDurationDays) {
        this.estimatedDurationDays = estimatedDurationDays;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}