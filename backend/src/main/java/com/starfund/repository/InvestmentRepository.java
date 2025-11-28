package com.starfund.repository;

import com.starfund.model.Investment;
import com.starfund.model.Project;
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
public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    
    Optional<Investment> findByTransactionCode(String transactionCode);
    
    List<Investment> findByInvestor(User investor);
    
    Page<Investment> findByInvestor(User investor, Pageable pageable);
    
    List<Investment> findByProject(Project project);
    
    Page<Investment> findByProject(Project project, Pageable pageable);
    
    List<Investment> findByInvestorAndStatus(User investor, Investment.InvestmentStatus status);
    
    @Query("SELECT i FROM Investment i WHERE i.investor = :investor AND i.status = 'SUCCESS' ORDER BY i.completedAt DESC")
    Page<Investment> findSuccessfulInvestmentsByInvestor(@Param("investor") User investor, Pageable pageable);
    
    @Query("SELECT SUM(i.amount) FROM Investment i WHERE i.investor = :investor AND i.status = 'SUCCESS'")
    Long sumAmountByInvestor(@Param("investor") User investor);
    
    @Query("SELECT COUNT(DISTINCT i.project) FROM Investment i WHERE i.investor = :investor AND i.status = 'SUCCESS'")
    Long countDistinctProjectsByInvestor(@Param("investor") User investor);
    
    @Query("SELECT SUM(i.amount) FROM Investment i WHERE i.project = :project AND i.status = 'SUCCESS'")
    Long sumAmountByProject(@Param("project") Project project);
    
    @Query("SELECT COUNT(DISTINCT i.investor) FROM Investment i WHERE i.project = :project AND i.status = 'SUCCESS'")
    Long countDistinctInvestorsByProject(@Param("project") Project project);
    
    @Query("SELECT COUNT(i) FROM Investment i WHERE i.status = 'SUCCESS' AND i.completedAt >= :startDate")
    Long countSuccessfulInvestmentsSince(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT DATE_FORMAT(i.completedAt, '%Y-%m') as month, SUM(i.amount) as amount " +
           "FROM Investment i " +
           "WHERE i.investor = :investor AND i.status = 'SUCCESS' AND i.completedAt >= :startDate " +
           "GROUP BY DATE_FORMAT(i.completedAt, '%Y-%m') " +
           "ORDER BY month DESC")
    List<Object[]> getMonthlyInvestmentsByInvestor(@Param("investor") User investor, @Param("startDate") LocalDateTime startDate);
    
       @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Investment i WHERE i.status = 'SUCCESS'")
    Long sumAmount();  // ← ĐÃ SỬA: thêm COALESCE + đổi tên thành sumAmount()
}

