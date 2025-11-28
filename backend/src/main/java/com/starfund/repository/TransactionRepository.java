package com.starfund.repository;

import com.starfund.model.Transaction;
import com.starfund.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByTransactionCode(String transactionCode);
    
    List<Transaction> findByUser(User user);
    
    Page<Transaction> findByUser(User user, Pageable pageable);
    
    Page<Transaction> findByType(Transaction.TransactionType type, Pageable pageable);
    
    Page<Transaction> findByStatus(Transaction.TransactionStatus status, Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE " +
           "(:userId IS NULL OR t.user.id = :userId) AND " +
           "(:type IS NULL OR t.type = :type) AND " +
           "(:status IS NULL OR t.status = :status)")
    Page<Transaction> findByFilters(@Param("userId") Long userId,
                                     @Param("type") Transaction.TransactionType type,
                                     @Param("status") Transaction.TransactionStatus status,
                                     Pageable pageable);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = 'SUCCESS' AND t.createdAt >= :startDate")
    Long countSuccessfulTransactionsSince(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = 'INVESTMENT' AND t.status = 'SUCCESS'")
    Long sumSuccessfulInvestmentAmount();

    
    
    @Query("SELECT DATE_FORMAT(t.createdAt, '%Y-%m') as month, COUNT(t) as count, SUM(t.amount) as amount " +
           "FROM Transaction t " +
           "WHERE t.status = 'SUCCESS' AND t.createdAt >= :startDate " +
           "GROUP BY DATE_FORMAT(t.createdAt, '%Y-%m') " +
           "ORDER BY month DESC")
    List<Object[]> getMonthlyTransactionStats(@Param("startDate") LocalDateTime startDate);
}
