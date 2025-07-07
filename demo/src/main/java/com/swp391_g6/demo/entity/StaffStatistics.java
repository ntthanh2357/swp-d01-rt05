package com.swp391_g6.demo.entity;

import jakarta.persistence.*;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Table(name = "staff_statistics")
public class StaffStatistics {

    @Id
    @Column(name = "statistic_id", length = 15)
    private String statisticId;

    @Column(name = "staff_id", length = 15, nullable = false)
    private String staffId;

    @Column(name = "statistic_date", nullable = false)
    private Date statisticDate;

    @Column(name = "cases_handled")
    private Integer casesHandled;

    @Column(name = "cases_resolved")
    private Integer casesResolved;

    @Column(name = "messages_sent")
    private Integer messagesSent;

    @Column(name = "average_response_time_minutes")
    private Integer averageResponseTimeMinutes;

    @Column(name = "appointments_completed")
    private Integer appointmentsCompleted;

    @Column(name = "tasks_completed")
    private Integer tasksCompleted;

    @Column(name = "recommendations_made")
    private Integer recommendationsMade;

    @Column(name = "user_satisfaction_score")
    private Double userSatisfactionScore;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    public StaffStatistics() {
    }

    public StaffStatistics(String statisticId, String staffId, Date statisticDate, Integer casesHandled,
                           Integer casesResolved, Integer messagesSent, Integer averageResponseTimeMinutes,
                           Integer appointmentsCompleted, Integer tasksCompleted, Integer recommendationsMade,
                           Double userSatisfactionScore, Timestamp createdAt, Timestamp updatedAt) {
        this.statisticId = statisticId;
        this.staffId = staffId;
        this.statisticDate = statisticDate;
        this.casesHandled = casesHandled;
        this.casesResolved = casesResolved;
        this.messagesSent = messagesSent;
        this.averageResponseTimeMinutes = averageResponseTimeMinutes;
        this.appointmentsCompleted = appointmentsCompleted;
        this.tasksCompleted = tasksCompleted;
        this.recommendationsMade = recommendationsMade;
        this.userSatisfactionScore = userSatisfactionScore;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getStatisticId() {
        return statisticId;
    }

    public void setStatisticId(String statisticId) {
        this.statisticId = statisticId;
    }

    public String getStaffId() {
        return staffId;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }

    public Date getStatisticDate() {
        return statisticDate;
    }

    public void setStatisticDate(Date statisticDate) {
        this.statisticDate = statisticDate;
    }

    public Integer getCasesHandled() {
        return casesHandled;
    }

    public void setCasesHandled(Integer casesHandled) {
        this.casesHandled = casesHandled;
    }

    public Integer getCasesResolved() {
        return casesResolved;
    }

    public void setCasesResolved(Integer casesResolved) {
        this.casesResolved = casesResolved;
    }

    public Integer getMessagesSent() {
        return messagesSent;
    }

    public void setMessagesSent(Integer messagesSent) {
        this.messagesSent = messagesSent;
    }

    public Integer getAverageResponseTimeMinutes() {
        return averageResponseTimeMinutes;
    }

    public void setAverageResponseTimeMinutes(Integer averageResponseTimeMinutes) {
        this.averageResponseTimeMinutes = averageResponseTimeMinutes;
    }

    public Integer getAppointmentsCompleted() {
        return appointmentsCompleted;
    }

    public void setAppointmentsCompleted(Integer appointmentsCompleted) {
        this.appointmentsCompleted = appointmentsCompleted;
    }

    public Integer getTasksCompleted() {
        return tasksCompleted;
    }

    public void setTasksCompleted(Integer tasksCompleted) {
        this.tasksCompleted = tasksCompleted;
    }

    public Integer getRecommendationsMade() {
        return recommendationsMade;
    }

    public void setRecommendationsMade(Integer recommendationsMade) {
        this.recommendationsMade = recommendationsMade;
    }

    public Double getUserSatisfactionScore() {
        return userSatisfactionScore;
    }

    public void setUserSatisfactionScore(Double userSatisfactionScore) {
        this.userSatisfactionScore = userSatisfactionScore;
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
