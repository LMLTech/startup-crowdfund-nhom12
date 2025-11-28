package com.starfund.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_is_read", columnList = "is_read"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User không được để trống")
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Loại thông báo không được để trống")
    private NotificationType type;
    
    @NotBlank(message = "Tiêu đề không được để trống")
    @Column(length = 500, nullable = false)
    private String title;
    
    @NotBlank(message = "Nội dung không được để trống")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
    
    @Column(length = 512)
    private String link;
    
    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public enum NotificationType {
        INVESTMENT, PROJECT_APPROVED, PROJECT_REJECTED, PROJECT_COMPLETED, SYSTEM
    }
}
