package com.swp391_g6.demo.entity;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "favorite_scholarships", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "seeker_id", "scholarship_id" })
})
public class FavoriteScholarship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id")
    private Integer favoriteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seeker_id", referencedColumnName = "seeker_id", nullable = false)
    private Seeker seeker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scholarship_id", referencedColumnName = "scholarship_id", nullable = false)
    private Scholarship scholarship;

    @Column(name = "notes", columnDefinition = "text")
    private String notes;

    @Column(name = "created_at")
    private Timestamp createdAt;

    // Getters and setters
    public Integer getFavoriteId() {
        return favoriteId;
    }

    public void setFavoriteId(Integer favoriteId) {
        this.favoriteId = favoriteId;
    }

    public Seeker getSeeker() {
        return seeker;
    }

    public void setSeeker(Seeker seeker) {
        this.seeker = seeker;
    }

    public Scholarship getScholarship() {
        return scholarship;
    }

    public void setScholarship(Scholarship scholarship) {
        this.scholarship = scholarship;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}