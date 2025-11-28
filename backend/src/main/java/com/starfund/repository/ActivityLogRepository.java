package com.starfund.repository;

import com.starfund.model.ActivityLog;
import com.starfund.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    
    List<ActivityLog> findByUserOrderByCreatedAtDesc(User user);
    
    Page<ActivityLog> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    List<ActivityLog> findByActionOrderByCreatedAtDesc(String action);
    
    @Query("SELECT al FROM ActivityLog al WHERE al.entityType = :entityType AND al.entityId = :entityId ORDER BY al.createdAt DESC")
    List<ActivityLog> findByEntity(@Param("entityType") String entityType, @Param("entityId") Long entityId);
    
    @Query("SELECT al FROM ActivityLog al WHERE al.createdAt >= :startDate ORDER BY al.createdAt DESC")
    List<ActivityLog> findRecentActivities(@Param("startDate") LocalDateTime startDate, Pageable pageable);
}
