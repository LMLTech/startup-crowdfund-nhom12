package com.starfund.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "investments", indexes = {
    @Index(name = "idx_investor_id", columnList = "investor_id"),
    @Index(name = "idx_project_id", columnList = "project_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "created_at"),
    @Index(name = "idx_investment_status_completed", columnList = "status,completed_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Investment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investor_id", nullable = false)
    @NotNull(message = "Investor không được để trống")
    private User investor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @NotNull(message = "Project không được để trống")
    private Project project;
    
    @NotNull(message = "Số tiền đầu tư không được để trống")
    @Min(value = 100000, message = "Số tiền đầu tư tối thiểu 100,000 VNĐ")
    @Column(nullable = false)
    private Long amount;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private InvestmentStatus status = InvestmentStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.VNPAY;
    
    @Column(name = "transaction_code", unique = true)
    private String transactionCode;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    // Relationship
    @OneToOne(mappedBy = "investment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Transaction transaction;

    public int getAmount() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public String getTransactionCode() {
        throw new UnsupportedOperationException("Not supported yet.");
    }
    
    public enum InvestmentStatus {
        PENDING, SUCCESS, FAILED, REFUNDED
    }
    
    public enum PaymentMethod {
        VNPAY, MOMO, BANK_TRANSFER
    }
}
