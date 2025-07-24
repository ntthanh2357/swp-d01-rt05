package com.swp391_g6.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "roadmap_step_details")
public class RoadmapStepDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "seeker_id", nullable = false)
    private String seekerId;

    @Column(name = "stage_number", nullable = false)
    private Integer stageNumber;

    @Column(name = "step_index", nullable = false)
    private Integer stepIndex;

    @Column(name = "step_title", nullable = false)
    private String stepTitle;

    @Column(name = "step_description", columnDefinition = "TEXT")
    private String stepDescription;

    @Column(name = "status", length = 50, nullable = false)
    private String status = "pending";

    @Column(name = "estimated_duration_days")
    private Integer estimatedDurationDays;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Constructors
    public RoadmapStepDetail() {
    }

    public RoadmapStepDetail(String seekerId, Integer stageNumber, Integer stepIndex,
            String stepTitle, String stepDescription, Integer estimatedDurationDays) {
        this.seekerId = seekerId;
        this.stageNumber = stageNumber;
        this.stepIndex = stepIndex;
        this.stepTitle = stepTitle;
        this.stepDescription = stepDescription;
        this.estimatedDurationDays = estimatedDurationDays;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSeekerId() {
        return seekerId;
    }

    public void setSeekerId(String seekerId) {
        this.seekerId = seekerId;
    }

    public Integer getStageNumber() {
        return stageNumber;
    }

    public void setStageNumber(Integer stageNumber) {
        this.stageNumber = stageNumber;
    }

    public Integer getStepIndex() {
        return stepIndex;
    }

    public void setStepIndex(Integer stepIndex) {
        this.stepIndex = stepIndex;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getEstimatedDurationDays() {
        return estimatedDurationDays;
    }

    public void setEstimatedDurationDays(Integer estimatedDurationDays) {
        this.estimatedDurationDays = estimatedDurationDays;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}