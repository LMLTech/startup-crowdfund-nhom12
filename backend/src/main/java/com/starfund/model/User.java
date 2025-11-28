package com.starfund.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
@Table(name = "users", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_role", columnList = "role"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Email không được để trống")
    @Column(unique = true, nullable = false)
    private String email;
    
    @JsonIgnore // Quan trọng: Không trả về mật khẩu khi gọi API lấy thông tin user
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    @Column(nullable = false)
    private String password;
    
    @NotBlank(message = "Tên không được để trống")
    @Column(nullable = false)
    private String name;
    
    @Column(length = 20)
    private String phone;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(50)")
    @Builder.Default
    private UserRole role = UserRole.INVESTOR;
    
    @Column(name = "company")
    private String company;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(50)")
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;
    
    @Column(name = "avatar_url", length = 512)
    private String avatarUrl;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    // --- Relationships (Có @JsonIgnore để chống vòng lặp vô hạn) ---
    
    @OneToMany(mappedBy = "founder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore 
    @Builder.Default
    private List<Project> projects = new ArrayList<>();
    
    @OneToMany(mappedBy = "investor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Investment> investments = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Transaction> transactions = new ArrayList<>();

    // --- ENUMS ---
    
    public enum UserRole {
        INVESTOR, STARTUP, CVA, ADMIN
    }
    
    public enum UserStatus {
        ACTIVE, INACTIVE, BLOCKED, BANNED
    }
}