package com.starfund.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Thêm import này
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects", indexes = {
    @Index(name = "idx_founder_id", columnList = "founder_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER) // Đổi sang EAGER để lấy luôn info Founder
    @JoinColumn(name = "founder_id", nullable = false)
    @JsonIgnoreProperties({"projects", "investments", "transactions", "password"}) // Bỏ qua list projects của user để tránh loop
    private User founder;
    
    @NotBlank(message = "Tiêu đề không được để trống")
    @Column(length = 500, nullable = false)
    private String title;
    
    @NotBlank(message = "Mô tả không được để trống")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @NotBlank(message = "Mô tả chi tiết không được để trống")
    @Column(name = "full_description", columnDefinition = "TEXT", nullable = false)
    private String fullDescription;
    
    @NotBlank(message = "Danh mục không được để trống")
    @Column(nullable = false)
    private String category;
    
    @NotNull(message = "Mục tiêu gọi vốn không được để trống")
    @Min(value = 1000000, message = "Mục tiêu gọi vốn tối thiểu 1,000,000 VNĐ")
    @Column(name = "target_amount", nullable = false)
    private Long targetAmount;
    
    @Column(name = "current_amount")
    @Builder.Default
    private Long currentAmount = 0L;
    
    @Column(name = "investor_count")
    @Builder.Default
    private Integer investorCount = 0;
    
    @NotNull(message = "Thời gian gọi vốn không được để trống")
    @Min(value = 30, message = "Thời gian gọi vốn tối thiểu 30 ngày")
    @Column(name = "days_left", nullable = false)
    private Integer daysLeft;
    
    @NotBlank(message = "Hình ảnh không được để trống")
    @Column(name = "image_url", length = 512, nullable = false)
    private String imageUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(50)") // Ép kiểu VARCHAR để tương thích tốt hơn
    @Builder.Default
    private ProjectStatus status = ProjectStatus.PENDING;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
    
    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    // Relationships
    // Lưu ý: Đã dùng @JsonIgnore hoặc DTO để tránh loop
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    @JsonIgnoreProperties("project")
    private List<ProjectTag> tags = new ArrayList<>();
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    @JsonIgnoreProperties("project")
    private List<ProjectMilestone> milestones = new ArrayList<>();
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Investment> investments = new ArrayList<>();
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<ProjectReview> reviews = new ArrayList<>();
    
    public enum ProjectStatus {
        PENDING, APPROVED, REJECTED, ACTIVE, COMPLETED, CANCELLED
    }
    
    // Helper methods
    public void addTag(ProjectTag tag) {
        tags.add(tag);
        tag.setProject(this);
    }
    
    public void removeTag(ProjectTag tag) {
        tags.remove(tag);
        tag.setProject(null);
    }
    
    public void addMilestone(ProjectMilestone milestone) {
        milestones.add(milestone);
        milestone.setProject(this);
    }
    
    public void removeMilestone(ProjectMilestone milestone) {
        milestones.remove(milestone);
        milestone.setProject(null);
    }
}