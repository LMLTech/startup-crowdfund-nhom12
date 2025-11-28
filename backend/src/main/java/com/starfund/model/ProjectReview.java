package com.starfund.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "project_reviews", indexes = {
    @Index(name = "idx_project_id", columnList = "project_id"),
    @Index(name = "idx_cva_id", columnList = "cva_id"),
    @Index(name = "idx_reviewed_at", columnList = "reviewed_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectReview {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @NotNull(message = "Project không được để trống")
    private Project project;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cva_id", nullable = false)
    @NotNull(message = "CVA reviewer không được để trống")
    private User cvaReviewer;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Action không được để trống")
    private ReviewAction action;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    @CreationTimestamp
    @Column(name = "reviewed_at", nullable = false, updatable = false)
    private LocalDateTime reviewedAt;
    
    public enum ReviewAction {
        APPROVED, REJECTED
    }
}
