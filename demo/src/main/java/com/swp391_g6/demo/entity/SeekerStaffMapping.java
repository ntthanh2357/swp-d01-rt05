package com.swp391_g6.demo.entity;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "seeker_staff_mapping")
public class SeekerStaffMapping {

    @Id
    @Column(name = "seeker_id", length = 15)
    private String seekerId;

    @Column(name = "staff_id", length = 15, nullable = false)
    private String staffId;

    @Column(name = "assigned_at")
    private Timestamp assignedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 10)
    private Status status;

    public enum Status {
        active, inactive
    }

    public SeekerStaffMapping() {}

    public SeekerStaffMapping(String seekerId, String staffId, Timestamp assignedAt) {
        this.seekerId = seekerId;
        this.staffId = staffId;
        this.assignedAt = assignedAt;
    }

    // Getters and setters
    public String getSeekerId() { return seekerId; }
    public void setSeekerId(String seekerId) { this.seekerId = seekerId; }

    public String getStaffId() { return staffId; }
    public void setStaffId(String staffId) { this.staffId = staffId; }

    public Timestamp getAssignedAt() { return assignedAt; }
    public void setAssignedAt(Timestamp assignedAt) { this.assignedAt = assignedAt; }
}