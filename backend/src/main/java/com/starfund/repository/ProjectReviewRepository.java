package com.starfund.repository;

import com.starfund.model.Project;
import com.starfund.model.ProjectReview;
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
public interface ProjectReviewRepository extends JpaRepository<ProjectReview, Long> {
    
    List<ProjectReview> findByProject(Project project);
    
    Optional<ProjectReview> findTopByProjectOrderByReviewedAtDesc(Project project);
    
    List<ProjectReview> findByCvaReviewer(User cvaReviewer);
    
    Page<ProjectReview> findByCvaReviewer(User cvaReviewer, Pageable pageable);
    
    @Query("SELECT COUNT(pr) FROM ProjectReview pr WHERE pr.cvaReviewer = :cva AND pr.action = :action AND pr.reviewedAt >= :startDate")
    Long countByReviewerAndActionSince(@Param("cva") User cva, 
                                       @Param("action") ProjectReview.ReviewAction action, 
                                       @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(pr) FROM ProjectReview pr WHERE pr.action = 'APPROVED' AND pr.reviewedAt >= :startDate")
    Long countApprovedSince(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(pr) FROM ProjectReview pr WHERE pr.action = 'REJECTED' AND pr.reviewedAt >= :startDate")
    Long countRejectedSince(@Param("startDate") LocalDateTime startDate);
}
